from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from database import get_db
from models import Issue, User
from auth import get_current_user

router = APIRouter()

class IssueCreate(BaseModel):
    source: str
    source_id: str
    title: str
    description: str
    priority: str = "medium"
    labels: Optional[List[str]] = []
    assignee: Optional[str] = None
    repository: Optional[str] = None
    url: Optional[str] = None

class IssueResponse(BaseModel):
    id: int
    source: str
    source_id: str
    title: str
    description: str
    status: str
    priority: str
    labels: Optional[List[str]]
    assignee: Optional[str]
    reporter: Optional[str]
    repository: Optional[str]
    url: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class IssueUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None
    assignee: Optional[str] = None
    labels: Optional[List[str]] = None

@router.get("/", response_model=List[IssueResponse])
async def get_issues(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    assignee: Optional[str] = None,
    repository: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get issues with optional filtering"""
    query = db.query(Issue)
    
    if status:
        query = query.filter(Issue.status == status)
    if priority:
        query = query.filter(Issue.priority == priority)
    if assignee:
        query = query.filter(Issue.assignee == assignee)
    if repository:
        query = query.filter(Issue.repository == repository)
    
    issues = query.order_by(Issue.created_at.desc()).offset(skip).limit(limit).all()
    return issues

@router.post("/", response_model=IssueResponse)
async def create_issue(
    issue: IssueCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create new issue"""
    db_issue = Issue(**issue.dict())
    db.add(db_issue)
    db.commit()
    db.refresh(db_issue)
    
    # Add background task to notify relevant team members
    background_tasks.add_task(notify_issue_created, db_issue.id)
    
    return db_issue

@router.get("/{issue_id}", response_model=IssueResponse)
async def get_issue(
    issue_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get specific issue"""
    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    return issue

@router.put("/{issue_id}", response_model=IssueResponse)
async def update_issue(
    issue_id: int,
    issue_update: IssueUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update issue"""
    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    
    update_data = issue_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(issue, field, value)
    
    if issue_update.status == "resolved":
        issue.resolved_at = datetime.utcnow()
    
    db.commit()
    db.refresh(issue)
    
    # Notify about status changes
    background_tasks.add_task(notify_issue_updated, issue.id, update_data)
    
    return issue

@router.get("/stats/overview")
async def get_issue_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get issue statistics overview"""
    total_issues = db.query(Issue).count()
    open_issues = db.query(Issue).filter(Issue.status == "open").count()
    high_priority = db.query(Issue).filter(Issue.priority == "high").count()
    critical_priority = db.query(Issue).filter(Issue.priority == "critical").count()
    
    return {
        "total_issues": total_issues,
        "open_issues": open_issues,
        "high_priority": high_priority,
        "critical_priority": critical_priority,
        "resolution_rate": round((total_issues - open_issues) / total_issues * 100, 2) if total_issues > 0 else 0
    }

@router.post("/sync/{source}")
async def sync_issues_from_source(
    source: str,
    background_tasks: BackgroundTasks,
    repository: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    """Sync issues from external source (GitHub, GitLab, etc.)"""
    if source not in ["github", "gitlab", "jira"]:
        raise HTTPException(status_code=400, detail="Unsupported source")
    
    background_tasks.add_task(sync_issues, source, repository)
    return {"message": f"Started syncing issues from {source}"}

async def notify_issue_created(issue_id: int):
    """Background task to notify team about new issue"""
    # This would send notifications via Slack, email, etc.
    pass

async def notify_issue_updated(issue_id: int, updates: dict):
    """Background task to notify about issue updates"""
    # This would send notifications about status changes, assignments, etc.
    pass

async def sync_issues(source: str, repository: Optional[str] = None):
    """Background task to sync issues from external sources"""
    # This would integrate with GitHub API, GitLab API, etc.
    # to fetch and sync issues
    pass