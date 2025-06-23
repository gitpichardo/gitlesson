from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from database import get_db
from models import CommunityMember, SupportSession, User
from auth import get_current_user

router = APIRouter()

class CommunityMemberCreate(BaseModel):
    username: str
    email: Optional[str] = None
    platforms: Optional[dict] = {}
    engagement_level: str = "newcomer"

class CommunityMemberResponse(BaseModel):
    id: int
    username: str
    email: Optional[str]
    platforms: Optional[dict]
    engagement_level: str
    contributions: Optional[List[dict]]
    last_activity: Optional[datetime]
    joined_at: datetime
    
    class Config:
        from_attributes = True

class SupportSessionCreate(BaseModel):
    member_id: int
    type: str  # pair_programming, debugging, consultation
    description: str
    scheduled_at: datetime

class SupportSessionResponse(BaseModel):
    id: int
    member_id: int
    type: str
    status: str
    description: str
    notes: Optional[str]
    scheduled_at: datetime
    completed_at: Optional[datetime]
    created_at: datetime
    
    class Config:
        from_attributes = True

@router.get("/members", response_model=List[CommunityMemberResponse])
async def get_community_members(
    skip: int = 0,
    limit: int = 100,
    engagement_level: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get community members with optional filtering"""
    query = db.query(CommunityMember)
    
    if engagement_level:
        query = query.filter(CommunityMember.engagement_level == engagement_level)
    
    members = query.order_by(CommunityMember.joined_at.desc()).offset(skip).limit(limit).all()
    return members

@router.post("/members", response_model=CommunityMemberResponse)
async def create_community_member(
    member: CommunityMemberCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add new community member"""
    db_member = CommunityMember(**member.dict())
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    
    # Add background task for onboarding
    background_tasks.add_task(onboard_new_member, db_member.id)
    
    return db_member

@router.get("/members/{member_id}", response_model=CommunityMemberResponse)
async def get_community_member(
    member_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get specific community member"""
    member = db.query(CommunityMember).filter(CommunityMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    return member

@router.put("/members/{member_id}/engagement")
async def update_member_engagement(
    member_id: int,
    engagement_level: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update member engagement level"""
    member = db.query(CommunityMember).filter(CommunityMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    member.engagement_level = engagement_level
    db.commit()
    
    return {"message": "Engagement level updated successfully"}

@router.get("/sessions", response_model=List[SupportSessionResponse])
async def get_support_sessions(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    type: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get support sessions with optional filtering"""
    query = db.query(SupportSession)
    
    if status:
        query = query.filter(SupportSession.status == status)
    if type:
        query = query.filter(SupportSession.type == type)
    
    sessions = query.order_by(SupportSession.scheduled_at.desc()).offset(skip).limit(limit).all()
    return sessions

@router.post("/sessions", response_model=SupportSessionResponse)
async def create_support_session(
    session: SupportSessionCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Schedule new support session"""
    # Verify member exists
    member = db.query(CommunityMember).filter(CommunityMember.id == session.member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    db_session = SupportSession(**session.dict())
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    
    # Add background task to send calendar invite
    background_tasks.add_task(send_session_invite, db_session.id)
    
    return db_session

@router.put("/sessions/{session_id}/complete")
async def complete_support_session(
    session_id: int,
    notes: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark support session as completed"""
    session = db.query(SupportSession).filter(SupportSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session.status = "completed"
    session.notes = notes
    session.completed_at = datetime.utcnow()
    db.commit()
    
    return {"message": "Session marked as completed"}

@router.get("/health/overview")
async def get_community_health(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get community health metrics"""
    total_members = db.query(CommunityMember).count()
    newcomers = db.query(CommunityMember).filter(CommunityMember.engagement_level == "newcomer").count()
    regular_users = db.query(CommunityMember).filter(CommunityMember.engagement_level == "regular").count()
    power_users = db.query(CommunityMember).filter(CommunityMember.engagement_level == "power_user").count()
    contributors = db.query(CommunityMember).filter(CommunityMember.engagement_level == "contributor").count()
    
    # Support session stats
    total_sessions = db.query(SupportSession).count()
    completed_sessions = db.query(SupportSession).filter(SupportSession.status == "completed").count()
    scheduled_sessions = db.query(SupportSession).filter(SupportSession.status == "scheduled").count()
    
    return {
        "total_members": total_members,
        "member_distribution": {
            "newcomers": newcomers,
            "regular_users": regular_users,
            "power_users": power_users,
            "contributors": contributors
        },
        "support_sessions": {
            "total": total_sessions,
            "completed": completed_sessions,
            "scheduled": scheduled_sessions,
            "completion_rate": round(completed_sessions / total_sessions * 100, 2) if total_sessions > 0 else 0
        },
        "health_score": calculate_health_score(total_members, power_users, contributors, completed_sessions)
    }

@router.post("/moderate")
async def moderate_content(
    platform: str,
    content_id: str,
    action: str,  # warn, remove, ban
    reason: str,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user)
):
    """Moderate community content"""
    background_tasks.add_task(execute_moderation_action, platform, content_id, action, reason)
    return {"message": f"Moderation action '{action}' initiated"}

def calculate_health_score(total_members: int, power_users: int, contributors: int, completed_sessions: int) -> int:
    """Calculate community health score (0-100)"""
    if total_members == 0:
        return 0
    
    # Factors contributing to health score
    engagement_ratio = (power_users + contributors) / total_members
    support_activity = min(completed_sessions / 10, 1)  # Cap at 10 sessions for full score
    
    # Weighted calculation
    score = (engagement_ratio * 60) + (support_activity * 40)
    return min(int(score * 100), 100)

async def onboard_new_member(member_id: int):
    """Background task for member onboarding"""
    # This would:
    # 1. Send welcome message
    # 2. Provide getting started resources
    # 3. Introduce to community channels
    # 4. Schedule optional onboarding call
    pass

async def send_session_invite(session_id: int):
    """Background task to send calendar invite for support session"""
    # This would send calendar invites and reminders
    pass

async def execute_moderation_action(platform: str, content_id: str, action: str, reason: str):
    """Background task to execute moderation actions"""
    # This would integrate with platform APIs to moderate content
    pass