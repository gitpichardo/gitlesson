from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
from typing import List, Optional, Dict, Any
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 DevRel Command Center starting up...")
    yield
    # Shutdown
    print("👋 DevRel Command Center shutting down...")

app = FastAPI(
    title="DevRel Command Center",
    description="Comprehensive Developer Relations management platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock data for demonstration
mock_feedback = [
    {
        "id": 1,
        "source": "github",
        "title": "API documentation needs more examples",
        "content": "The current API docs are good but could use more practical examples...",
        "author": "developer123",
        "category": "documentation",
        "priority": "medium",
        "status": "new",
        "sentiment": "neutral",
        "confidence_score": 0.85,
        "created_at": "2024-01-15T10:30:00Z",
        "tags": ["documentation", "api", "examples"],
    },
    {
        "id": 2,
        "source": "slack",
        "title": "Feature request: Better error messages",
        "content": "It would be great if error messages were more descriptive...",
        "author": "jane_dev",
        "category": "feature_request",
        "priority": "high",
        "status": "reviewed",
        "sentiment": "positive",
        "confidence_score": 0.92,
        "created_at": "2024-01-14T15:20:00Z",
        "tags": ["error-handling", "ux"],
    },
]

mock_issues = [
    {
        "id": 1,
        "source": "github",
        "source_id": "openhands/core#123",
        "title": "Memory leak in background processing",
        "status": "open",
        "priority": "high",
        "labels": ["bug", "performance"],
        "assignee": "john_dev",
        "repository": "openhands/core",
        "created_at": "2024-01-15T10:30:00Z",
        "url": "https://github.com/openhands/core/issues/123",
    },
]

mock_content = [
    {
        "id": 1,
        "title": "Getting Started with OpenHands",
        "type": "blog_post",
        "status": "published",
        "author": "jane_writer",
        "target_audience": "beginner",
        "estimated_reading_time": 8,
        "created_at": "2024-01-15T10:30:00Z",
        "published_at": "2024-01-16T09:00:00Z",
        "tags": ["getting-started", "tutorial"],
    },
]

@app.get("/")
async def root():
    return {
        "message": "DevRel Command Center API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@app.get("/api/v1/dashboard")
async def get_dashboard_data():
    """Get dashboard overview data"""
    return {
        "stats": {
            "open_issues": len([i for i in mock_issues if i["status"] == "open"]),
            "pending_feedback": len([f for f in mock_feedback if f["status"] == "new"]),
            "content_in_progress": len([c for c in mock_content if c["status"] != "published"]),
            "community_health_score": 85
        },
        "recent_activity": [
            {"type": "feedback", "message": "New feedback from GitHub issue #123", "timestamp": "2024-01-15T10:30:00Z"},
            {"type": "issue", "message": "High priority issue assigned to team", "timestamp": "2024-01-15T09:15:00Z"},
            {"type": "content", "message": "Blog post published: 'Getting Started with OpenHands'", "timestamp": "2024-01-15T08:00:00Z"}
        ]
    }

@app.get("/api/v1/feedback/")
async def get_feedback(
    skip: int = 0,
    limit: int = 100,
    source: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None
):
    """Get feedback with optional filtering"""
    filtered_feedback = mock_feedback
    
    if source:
        filtered_feedback = [f for f in filtered_feedback if f["source"] == source]
    if category:
        filtered_feedback = [f for f in filtered_feedback if f["category"] == category]
    if status:
        filtered_feedback = [f for f in filtered_feedback if f["status"] == status]
    
    return filtered_feedback[skip:skip+limit]

@app.get("/api/v1/issues/")
async def get_issues(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    priority: Optional[str] = None
):
    """Get issues with optional filtering"""
    filtered_issues = mock_issues
    
    if status:
        filtered_issues = [i for i in filtered_issues if i["status"] == status]
    if priority:
        filtered_issues = [i for i in filtered_issues if i["priority"] == priority]
    
    return filtered_issues[skip:skip+limit]

@app.get("/api/v1/content/")
async def get_content(
    skip: int = 0,
    limit: int = 100,
    type: Optional[str] = None,
    status: Optional[str] = None
):
    """Get content with optional filtering"""
    filtered_content = mock_content
    
    if type:
        filtered_content = [c for c in filtered_content if c["type"] == type]
    if status:
        filtered_content = [c for c in filtered_content if c["status"] == status]
    
    return filtered_content[skip:skip+limit]

@app.get("/api/v1/analytics/dashboard")
async def get_analytics_dashboard():
    """Get analytics dashboard data"""
    return {
        "overview": {
            "total_feedback": len(mock_feedback),
            "total_issues": len(mock_issues),
            "total_content": len(mock_content),
            "total_members": 150
        },
        "recent_activity": {
            "feedback_last_30_days": len(mock_feedback),
            "issues_resolved_this_month": 5,
            "content_created_this_month": 3,
            "new_members_this_month": 25
        },
        "health_indicators": {
            "open_issues": len([i for i in mock_issues if i["status"] == "open"]),
            "published_content": len([c for c in mock_content if c["status"] == "published"]),
            "active_members": 120,
            "feedback_sentiment": {"positive": 60, "neutral": 25, "negative": 15}
        }
    }

@app.get("/api/v1/integrations/")
async def get_integrations():
    """Get available integrations and their status"""
    return {
        "github": {
            "enabled": bool(os.getenv("GITHUB_TOKEN")),
            "features": ["issues", "pull_requests", "discussions", "releases"],
            "status": "connected" if os.getenv("GITHUB_TOKEN") else "not_configured"
        },
        "slack": {
            "enabled": bool(os.getenv("SLACK_BOT_TOKEN")),
            "features": ["channels", "direct_messages", "notifications"],
            "status": "connected" if os.getenv("SLACK_BOT_TOKEN") else "not_configured"
        },
        "discord": {
            "enabled": bool(os.getenv("DISCORD_BOT_TOKEN")),
            "features": ["servers", "channels", "moderation"],
            "status": "connected" if os.getenv("DISCORD_BOT_TOKEN") else "not_configured"
        },
        "openai": {
            "enabled": bool(os.getenv("OPENAI_API_KEY")),
            "features": ["feedback_analysis", "content_generation", "sentiment_analysis"],
            "status": "connected" if os.getenv("OPENAI_API_KEY") else "not_configured"
        }
    }

if __name__ == "__main__":
    uvicorn.run(
        "simple_main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 12000)),
        reload=True
    )