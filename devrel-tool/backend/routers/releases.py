from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime

from database import get_db
from models import Release, User
from auth import get_current_user

router = APIRouter()

class ReleaseCreate(BaseModel):
    version: str
    title: str
    description: str
    changelog: str
    release_date: datetime
    repository: str
    communication_plan: Optional[List[Dict[str, Any]]] = []

class ReleaseResponse(BaseModel):
    id: int
    version: str
    title: str
    description: str
    changelog: str
    status: str
    release_date: datetime
    repository: str
    communication_plan: Optional[List[Dict[str, Any]]]
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class ReleaseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    changelog: Optional[str] = None
    status: Optional[str] = None
    release_date: Optional[datetime] = None
    communication_plan: Optional[List[Dict[str, Any]]] = None

class CommunicationTemplate(BaseModel):
    type: str  # changelog, upgrade_guide, deprecation_notice, announcement
    template: str
    channels: List[str]

@router.get("/", response_model=List[ReleaseResponse])
async def get_releases(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    repository: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get releases with optional filtering"""
    query = db.query(Release)
    
    if status:
        query = query.filter(Release.status == status)
    if repository:
        query = query.filter(Release.repository == repository)
    
    releases = query.order_by(Release.release_date.desc()).offset(skip).limit(limit).all()
    return releases

@router.post("/", response_model=ReleaseResponse)
async def create_release(
    release: ReleaseCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create new release"""
    db_release = Release(**release.dict())
    db.add(db_release)
    db.commit()
    db.refresh(db_release)
    
    # Add background task to prepare release communications
    background_tasks.add_task(prepare_release_communications, db_release.id)
    
    return db_release

@router.get("/{release_id}", response_model=ReleaseResponse)
async def get_release(
    release_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get specific release"""
    release = db.query(Release).filter(Release.id == release_id).first()
    if not release:
        raise HTTPException(status_code=404, detail="Release not found")
    return release

@router.put("/{release_id}", response_model=ReleaseResponse)
async def update_release(
    release_id: int,
    release_update: ReleaseUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update release"""
    release = db.query(Release).filter(Release.id == release_id).first()
    if not release:
        raise HTTPException(status_code=404, detail="Release not found")
    
    update_data = release_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(release, field, value)
    
    db.commit()
    db.refresh(release)
    
    # Notify about release updates
    background_tasks.add_task(notify_release_updated, release.id, update_data)
    
    return release

@router.post("/{release_id}/publish")
async def publish_release(
    release_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Publish release and execute communication plan"""
    release = db.query(Release).filter(Release.id == release_id).first()
    if not release:
        raise HTTPException(status_code=404, detail="Release not found")
    
    release.status = "released"
    db.commit()
    
    # Execute communication plan
    background_tasks.add_task(execute_release_communications, release_id)
    
    return {"message": "Release published and communications initiated"}

@router.get("/{release_id}/changelog")
async def get_release_changelog(
    release_id: int,
    format: str = "markdown",  # markdown, html, json
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get formatted changelog for release"""
    release = db.query(Release).filter(Release.id == release_id).first()
    if not release:
        raise HTTPException(status_code=404, detail="Release not found")
    
    if format == "markdown":
        return {"changelog": release.changelog}
    elif format == "html":
        # Convert markdown to HTML
        return {"changelog": f"<div>{release.changelog}</div>"}
    elif format == "json":
        # Parse changelog into structured format
        return {
            "version": release.version,
            "date": release.release_date.isoformat(),
            "changes": parse_changelog(release.changelog)
        }
    else:
        raise HTTPException(status_code=400, detail="Unsupported format")

@router.post("/{release_id}/upgrade-guide")
async def generate_upgrade_guide(
    release_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generate upgrade guide for release"""
    release = db.query(Release).filter(Release.id == release_id).first()
    if not release:
        raise HTTPException(status_code=404, detail="Release not found")
    
    background_tasks.add_task(generate_upgrade_guide_content, release_id)
    return {"message": "Upgrade guide generation started"}

@router.get("/templates/communication")
async def get_communication_templates(
    current_user: User = Depends(get_current_user)
):
    """Get communication templates for releases"""
    return {
        "changelog": {
            "template": """# {version} - {date}

## 🚀 New Features
{new_features}

## 🐛 Bug Fixes
{bug_fixes}

## 💥 Breaking Changes
{breaking_changes}

## 📚 Documentation
{documentation_updates}
""",
            "channels": ["github", "blog", "newsletter"]
        },
        "announcement": {
            "template": """🎉 We're excited to announce the release of {title} v{version}!

{description}

Key highlights:
{highlights}

Get started: {documentation_link}
""",
            "channels": ["slack", "discord", "twitter", "linkedin"]
        },
        "upgrade_guide": {
            "template": """# Upgrading to {version}

## Overview
{overview}

## Breaking Changes
{breaking_changes}

## Migration Steps
{migration_steps}

## Need Help?
{support_info}
""",
            "channels": ["documentation", "blog"]
        },
        "deprecation_notice": {
            "template": """⚠️ Deprecation Notice: {feature_name}

We're deprecating {feature_name} in version {version}.

**Timeline:**
- Deprecated: {deprecation_date}
- Removal: {removal_date}

**Migration Path:**
{migration_instructions}
""",
            "channels": ["github", "documentation", "email"]
        }
    }

@router.post("/communication/send")
async def send_release_communication(
    release_id: int,
    communication_type: str,
    channels: List[str],
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Send release communication to specified channels"""
    release = db.query(Release).filter(Release.id == release_id).first()
    if not release:
        raise HTTPException(status_code=404, detail="Release not found")
    
    background_tasks.add_task(
        send_communication,
        release_id,
        communication_type,
        channels
    )
    
    return {"message": f"Sending {communication_type} to {len(channels)} channels"}

@router.get("/stats/overview")
async def get_release_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get release statistics overview"""
    total_releases = db.query(Release).count()
    planned_releases = db.query(Release).filter(Release.status == "planned").count()
    in_progress_releases = db.query(Release).filter(Release.status == "in_progress").count()
    published_releases = db.query(Release).filter(Release.status == "released").count()
    
    # Recent releases
    recent_releases = db.query(Release).filter(
        Release.status == "released"
    ).order_by(Release.release_date.desc()).limit(5).all()
    
    return {
        "total_releases": total_releases,
        "planned_releases": planned_releases,
        "in_progress_releases": in_progress_releases,
        "published_releases": published_releases,
        "recent_releases": [
            {
                "version": r.version,
                "title": r.title,
                "release_date": r.release_date.isoformat()
            }
            for r in recent_releases
        ]
    }

def parse_changelog(changelog: str) -> Dict[str, List[str]]:
    """Parse changelog text into structured format"""
    # Simple parser - in production, this would be more sophisticated
    sections = {
        "new_features": [],
        "bug_fixes": [],
        "breaking_changes": [],
        "improvements": []
    }
    
    lines = changelog.split('\n')
    current_section = None
    
    for line in lines:
        line = line.strip()
        if line.startswith('## '):
            section_name = line[3:].lower().replace(' ', '_')
            if section_name in sections:
                current_section = section_name
        elif line.startswith('- ') and current_section:
            sections[current_section].append(line[2:])
    
    return sections

async def prepare_release_communications(release_id: int):
    """Background task to prepare release communications"""
    # This would:
    # 1. Generate changelog from commits
    # 2. Create communication templates
    # 3. Schedule communications
    pass

async def execute_release_communications(release_id: int):
    """Background task to execute release communication plan"""
    # This would:
    # 1. Post to GitHub releases
    # 2. Send notifications to Slack/Discord
    # 3. Update documentation
    # 4. Send newsletters
    # 5. Post to social media
    pass

async def notify_release_updated(release_id: int, updates: Dict[str, Any]):
    """Background task to notify about release updates"""
    # This would send notifications to stakeholders
    pass

async def generate_upgrade_guide_content(release_id: int):
    """Background task to generate upgrade guide"""
    # This would:
    # 1. Analyze breaking changes
    # 2. Generate migration steps
    # 3. Create code examples
    # 4. Save as content item
    pass

async def send_communication(release_id: int, communication_type: str, channels: List[str]):
    """Background task to send communications"""
    # This would send communications to specified channels
    pass