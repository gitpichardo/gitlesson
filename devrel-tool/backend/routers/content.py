from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from database import get_db
from models import Content, User
from auth import get_current_user

router = APIRouter()

class ContentCreate(BaseModel):
    title: str
    type: str  # blog_post, tutorial, documentation, webinar, talk, template
    content: str
    author: str
    tags: Optional[List[str]] = []
    target_audience: str = "all"
    estimated_reading_time: Optional[int] = None
    repository_url: Optional[str] = None

class ContentResponse(BaseModel):
    id: int
    title: str
    type: str
    status: str
    content: str
    author: str
    reviewer: Optional[str]
    tags: Optional[List[str]]
    target_audience: str
    estimated_reading_time: Optional[int]
    url: Optional[str]
    repository_url: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]
    published_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class ContentUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    status: Optional[str] = None
    reviewer: Optional[str] = None
    tags: Optional[List[str]] = None
    url: Optional[str] = None

@router.get("/", response_model=List[ContentResponse])
async def get_content(
    skip: int = 0,
    limit: int = 100,
    type: Optional[str] = None,
    status: Optional[str] = None,
    author: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get content with optional filtering"""
    query = db.query(Content)
    
    if type:
        query = query.filter(Content.type == type)
    if status:
        query = query.filter(Content.status == status)
    if author:
        query = query.filter(Content.author == author)
    
    content = query.order_by(Content.created_at.desc()).offset(skip).limit(limit).all()
    return content

@router.post("/", response_model=ContentResponse)
async def create_content(
    content: ContentCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create new content"""
    db_content = Content(**content.dict())
    
    # Calculate estimated reading time if not provided
    if not db_content.estimated_reading_time and db_content.content:
        word_count = len(db_content.content.split())
        db_content.estimated_reading_time = max(1, word_count // 200)  # ~200 words per minute
    
    db.add(db_content)
    db.commit()
    db.refresh(db_content)
    
    # Add background task for content analysis
    background_tasks.add_task(analyze_content, db_content.id)
    
    return db_content

@router.get("/{content_id}", response_model=ContentResponse)
async def get_content_item(
    content_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get specific content item"""
    content = db.query(Content).filter(Content.id == content_id).first()
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    return content

@router.put("/{content_id}", response_model=ContentResponse)
async def update_content(
    content_id: int,
    content_update: ContentUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update content"""
    content = db.query(Content).filter(Content.id == content_id).first()
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    
    update_data = content_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(content, field, value)
    
    # Set published date when status changes to published
    if content_update.status == "published" and not content.published_at:
        content.published_at = datetime.utcnow()
    
    db.commit()
    db.refresh(content)
    
    # Notify about content updates
    background_tasks.add_task(notify_content_updated, content.id, update_data)
    
    return content

@router.get("/stats/overview")
async def get_content_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get content statistics overview"""
    total_content = db.query(Content).count()
    published_content = db.query(Content).filter(Content.status == "published").count()
    draft_content = db.query(Content).filter(Content.status == "draft").count()
    in_review = db.query(Content).filter(Content.status == "review").count()
    
    # Content by type
    content_by_type = {}
    for content_type in ["blog_post", "tutorial", "documentation", "webinar", "talk", "template"]:
        count = db.query(Content).filter(Content.type == content_type).count()
        content_by_type[content_type] = count
    
    return {
        "total_content": total_content,
        "published_content": published_content,
        "draft_content": draft_content,
        "in_review": in_review,
        "content_by_type": content_by_type,
        "publication_rate": round(published_content / total_content * 100, 2) if total_content > 0 else 0
    }

@router.get("/templates/", response_model=List[ContentResponse])
async def get_templates(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all content templates"""
    templates = db.query(Content).filter(Content.type == "template").all()
    return templates

@router.post("/{content_id}/publish")
async def publish_content(
    content_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Publish content"""
    content = db.query(Content).filter(Content.id == content_id).first()
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    
    content.status = "published"
    content.published_at = datetime.utcnow()
    db.commit()
    
    # Add background task to announce publication
    background_tasks.add_task(announce_content_publication, content_id)
    
    return {"message": "Content published successfully"}

async def analyze_content(content_id: int):
    """Background task to analyze content"""
    # This would:
    # 1. Check for SEO optimization
    # 2. Suggest improvements
    # 3. Validate links and code samples
    # 4. Check for accessibility
    pass

async def notify_content_updated(content_id: int, updates: dict):
    """Background task to notify about content updates"""
    # This would send notifications to reviewers, authors, etc.
    pass

async def announce_content_publication(content_id: int):
    """Background task to announce published content"""
    # This would:
    # 1. Post to social media
    # 2. Send to newsletter
    # 3. Notify community channels
    # 4. Update documentation indexes
    pass