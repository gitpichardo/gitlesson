from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime, timedelta
from sqlalchemy import func

from database import get_db
from models import KPI, Feedback, Issue, Content, CommunityMember, User
from auth import get_current_user

router = APIRouter()

class KPICreate(BaseModel):
    metric_name: str
    value: float
    target_value: Optional[float] = None
    period: str  # daily, weekly, monthly, quarterly
    date: datetime
    metadata: Optional[Dict[str, Any]] = {}

class KPIResponse(BaseModel):
    id: int
    metric_name: str
    value: float
    target_value: Optional[float]
    period: str
    date: datetime
    metadata: Optional[Dict[str, Any]]
    created_at: datetime
    
    class Config:
        from_attributes = True

@router.get("/kpis", response_model=List[KPIResponse])
async def get_kpis(
    metric_name: Optional[str] = None,
    period: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get KPIs with optional filtering"""
    query = db.query(KPI)
    
    if metric_name:
        query = query.filter(KPI.metric_name == metric_name)
    if period:
        query = query.filter(KPI.period == period)
    if start_date:
        query = query.filter(KPI.date >= start_date)
    if end_date:
        query = query.filter(KPI.date <= end_date)
    
    kpis = query.order_by(KPI.date.desc()).all()
    return kpis

@router.post("/kpis", response_model=KPIResponse)
async def create_kpi(
    kpi: KPICreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create new KPI entry"""
    db_kpi = KPI(**kpi.dict())
    db.add(db_kpi)
    db.commit()
    db.refresh(db_kpi)
    return db_kpi

@router.get("/dashboard")
async def get_analytics_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get comprehensive analytics dashboard data"""
    
    # Time periods
    now = datetime.utcnow()
    last_30_days = now - timedelta(days=30)
    last_7_days = now - timedelta(days=7)
    
    # Feedback metrics
    total_feedback = db.query(Feedback).count()
    recent_feedback = db.query(Feedback).filter(Feedback.created_at >= last_30_days).count()
    feedback_by_sentiment = db.query(
        Feedback.sentiment, func.count(Feedback.id)
    ).group_by(Feedback.sentiment).all()
    
    # Issue metrics
    total_issues = db.query(Issue).count()
    open_issues = db.query(Issue).filter(Issue.status == "open").count()
    resolved_this_month = db.query(Issue).filter(
        Issue.status == "resolved",
        Issue.resolved_at >= last_30_days
    ).count()
    
    # Content metrics
    total_content = db.query(Content).count()
    published_content = db.query(Content).filter(Content.status == "published").count()
    content_this_month = db.query(Content).filter(
        Content.created_at >= last_30_days
    ).count()
    
    # Community metrics
    total_members = db.query(CommunityMember).count()
    new_members_this_month = db.query(CommunityMember).filter(
        CommunityMember.joined_at >= last_30_days
    ).count()
    active_members = db.query(CommunityMember).filter(
        CommunityMember.last_activity >= last_7_days
    ).count()
    
    return {
        "overview": {
            "total_feedback": total_feedback,
            "total_issues": total_issues,
            "total_content": total_content,
            "total_members": total_members
        },
        "recent_activity": {
            "feedback_last_30_days": recent_feedback,
            "issues_resolved_this_month": resolved_this_month,
            "content_created_this_month": content_this_month,
            "new_members_this_month": new_members_this_month
        },
        "health_indicators": {
            "open_issues": open_issues,
            "published_content": published_content,
            "active_members": active_members,
            "feedback_sentiment": dict(feedback_by_sentiment)
        },
        "calculated_kpis": {
            "issue_resolution_rate": calculate_resolution_rate(db),
            "content_publication_rate": calculate_publication_rate(db),
            "community_growth_rate": calculate_growth_rate(db, last_30_days),
            "developer_satisfaction": calculate_satisfaction_score(db)
        }
    }

@router.get("/metrics/activation-time")
async def get_activation_time_metrics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get developer activation time metrics"""
    # This would calculate time from first interaction to first contribution
    # For now, returning mock data structure
    return {
        "average_activation_time_days": 14.5,
        "median_activation_time_days": 12.0,
        "activation_funnel": {
            "signed_up": 1000,
            "first_interaction": 800,
            "documentation_read": 600,
            "first_api_call": 400,
            "first_contribution": 150
        },
        "trends": [
            {"date": "2024-01-01", "avg_days": 16.2},
            {"date": "2024-01-08", "avg_days": 15.8},
            {"date": "2024-01-15", "avg_days": 14.5},
            {"date": "2024-01-22", "avg_days": 13.9}
        ]
    }

@router.get("/metrics/pr-velocity")
async def get_pr_velocity_metrics(
    repository: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get PR velocity metrics"""
    # This would integrate with GitHub API to get actual PR data
    return {
        "average_pr_review_time_hours": 18.5,
        "average_pr_merge_time_hours": 42.3,
        "pr_throughput_per_week": 25,
        "review_participation_rate": 0.85,
        "trends": [
            {"week": "2024-W01", "review_time": 20.1, "merge_time": 45.2, "throughput": 22},
            {"week": "2024-W02", "review_time": 19.3, "merge_time": 43.8, "throughput": 24},
            {"week": "2024-W03", "review_time": 18.5, "merge_time": 42.3, "throughput": 25}
        ]
    }

@router.get("/metrics/docs-satisfaction")
async def get_docs_satisfaction_metrics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get documentation satisfaction metrics"""
    # This would analyze feedback specifically about documentation
    docs_feedback = db.query(Feedback).filter(
        Feedback.tags.contains(["documentation"])
    ).all()
    
    total_docs_feedback = len(docs_feedback)
    positive_feedback = len([f for f in docs_feedback if f.sentiment == "positive"])
    
    satisfaction_score = (positive_feedback / total_docs_feedback * 100) if total_docs_feedback > 0 else 0
    
    return {
        "overall_satisfaction_score": round(satisfaction_score, 1),
        "total_feedback_items": total_docs_feedback,
        "positive_feedback": positive_feedback,
        "common_issues": [
            {"issue": "Missing examples", "frequency": 15},
            {"issue": "Outdated information", "frequency": 12},
            {"issue": "Complex explanations", "frequency": 8}
        ],
        "improvement_suggestions": [
            "Add more code examples",
            "Update API documentation",
            "Improve search functionality"
        ]
    }

@router.get("/reports/monthly")
async def generate_monthly_report(
    year: int,
    month: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generate comprehensive monthly DevRel report"""
    start_date = datetime(year, month, 1)
    if month == 12:
        end_date = datetime(year + 1, 1, 1)
    else:
        end_date = datetime(year, month + 1, 1)
    
    # Gather metrics for the month
    feedback_count = db.query(Feedback).filter(
        Feedback.created_at >= start_date,
        Feedback.created_at < end_date
    ).count()
    
    issues_resolved = db.query(Issue).filter(
        Issue.resolved_at >= start_date,
        Issue.resolved_at < end_date
    ).count()
    
    content_published = db.query(Content).filter(
        Content.published_at >= start_date,
        Content.published_at < end_date
    ).count()
    
    new_members = db.query(CommunityMember).filter(
        CommunityMember.joined_at >= start_date,
        CommunityMember.joined_at < end_date
    ).count()
    
    return {
        "period": f"{year}-{month:02d}",
        "summary": {
            "feedback_collected": feedback_count,
            "issues_resolved": issues_resolved,
            "content_published": content_published,
            "new_community_members": new_members
        },
        "highlights": [
            "Launched new tutorial series",
            "Improved issue resolution time by 15%",
            "Community grew by 25%"
        ],
        "challenges": [
            "High volume of documentation feedback",
            "Need more technical content reviewers"
        ],
        "next_month_goals": [
            "Reduce average issue resolution time",
            "Publish 5 new tutorials",
            "Increase community engagement"
        ]
    }

def calculate_resolution_rate(db: Session) -> float:
    """Calculate issue resolution rate"""
    total_issues = db.query(Issue).count()
    resolved_issues = db.query(Issue).filter(Issue.status == "resolved").count()
    return round((resolved_issues / total_issues * 100), 2) if total_issues > 0 else 0

def calculate_publication_rate(db: Session) -> float:
    """Calculate content publication rate"""
    total_content = db.query(Content).count()
    published_content = db.query(Content).filter(Content.status == "published").count()
    return round((published_content / total_content * 100), 2) if total_content > 0 else 0

def calculate_growth_rate(db: Session, since_date: datetime) -> float:
    """Calculate community growth rate"""
    total_members = db.query(CommunityMember).count()
    new_members = db.query(CommunityMember).filter(
        CommunityMember.joined_at >= since_date
    ).count()
    return round((new_members / total_members * 100), 2) if total_members > 0 else 0

def calculate_satisfaction_score(db: Session) -> float:
    """Calculate overall developer satisfaction score"""
    feedback_items = db.query(Feedback).filter(Feedback.sentiment.isnot(None)).all()
    if not feedback_items:
        return 0
    
    positive_count = len([f for f in feedback_items if f.sentiment == "positive"])
    return round((positive_count / len(feedback_items) * 100), 2)