from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from database import get_db
from models import Feedback, FeedbackTheme, User
from auth import get_current_user

router = APIRouter()

class FeedbackCreate(BaseModel):
    source: str
    source_id: str
    title: str
    content: str
    author: str
    author_email: Optional[str] = None
    category: Optional[str] = None
    priority: str = "medium"
    tags: Optional[List[str]] = []

class FeedbackResponse(BaseModel):
    id: int
    source: str
    title: str
    content: str
    author: str
    category: Optional[str]
    priority: str
    status: str
    tags: Optional[List[str]]
    sentiment: Optional[str]
    confidence_score: Optional[float]
    created_at: datetime
    
    class Config:
        from_attributes = True

class ThemeResponse(BaseModel):
    id: int
    title: str
    description: str
    category: str
    frequency: int
    impact_score: float
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

@router.get("/", response_model=List[FeedbackResponse])
async def get_feedback(
    skip: int = 0,
    limit: int = 100,
    source: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get feedback with optional filtering"""
    query = db.query(Feedback)
    
    if source:
        query = query.filter(Feedback.source == source)
    if category:
        query = query.filter(Feedback.category == category)
    if status:
        query = query.filter(Feedback.status == status)
    
    feedback = query.offset(skip).limit(limit).all()
    return feedback

@router.post("/", response_model=FeedbackResponse)
async def create_feedback(
    feedback: FeedbackCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create new feedback entry"""
    db_feedback = Feedback(**feedback.dict())
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    
    # Add background task to analyze feedback
    background_tasks.add_task(analyze_feedback, db_feedback.id)
    
    return db_feedback

@router.get("/{feedback_id}", response_model=FeedbackResponse)
async def get_feedback_item(
    feedback_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get specific feedback item"""
    feedback = db.query(Feedback).filter(Feedback.id == feedback_id).first()
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")
    return feedback

@router.put("/{feedback_id}/status")
async def update_feedback_status(
    feedback_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update feedback status"""
    feedback = db.query(Feedback).filter(Feedback.id == feedback_id).first()
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")
    
    feedback.status = status
    db.commit()
    return {"message": "Status updated successfully"}

@router.get("/themes/", response_model=List[ThemeResponse])
async def get_feedback_themes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get identified feedback themes"""
    themes = db.query(FeedbackTheme).order_by(FeedbackTheme.impact_score.desc()).all()
    return themes

@router.post("/analyze")
async def trigger_feedback_analysis(
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user)
):
    """Trigger comprehensive feedback analysis"""
    background_tasks.add_task(analyze_all_feedback)
    return {"message": "Analysis started"}

async def analyze_feedback(feedback_id: int):
    """Background task to analyze individual feedback"""
    # This would integrate with AI services to:
    # 1. Categorize feedback
    # 2. Determine sentiment
    # 3. Extract key themes
    # 4. Assign priority based on content
    pass

async def analyze_all_feedback():
    """Background task to analyze all feedback and identify themes"""
    # This would:
    # 1. Group similar feedback
    # 2. Identify recurring themes
    # 3. Calculate impact scores
    # 4. Generate product improvement proposals
    pass