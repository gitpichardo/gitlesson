from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from contextlib import asynccontextmanager
import uvicorn
from typing import List, Optional
import os
from dotenv import load_dotenv

from routers import (
    feedback,
    issues,
    content,
    community,
    analytics,
    integrations,
    releases
)
from database import engine, Base
from models import User
from auth import get_current_user

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    Base.metadata.create_all(bind=engine)
    yield
    # Shutdown
    pass

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

# Include routers
app.include_router(feedback.router, prefix="/api/v1/feedback", tags=["feedback"])
app.include_router(issues.router, prefix="/api/v1/issues", tags=["issues"])
app.include_router(content.router, prefix="/api/v1/content", tags=["content"])
app.include_router(community.router, prefix="/api/v1/community", tags=["community"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["analytics"])
app.include_router(integrations.router, prefix="/api/v1/integrations", tags=["integrations"])
app.include_router(releases.router, prefix="/api/v1/releases", tags=["releases"])

@app.get("/")
async def root():
    return {
        "message": "DevRel Command Center API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/v1/dashboard")
async def get_dashboard_data(current_user: User = Depends(get_current_user)):
    """Get dashboard overview data"""
    return {
        "user": current_user.username,
        "stats": {
            "open_issues": 42,
            "pending_feedback": 15,
            "content_in_progress": 8,
            "community_health_score": 85
        },
        "recent_activity": [
            {"type": "feedback", "message": "New feedback from GitHub issue #123", "timestamp": "2024-01-15T10:30:00Z"},
            {"type": "issue", "message": "High priority issue assigned to team", "timestamp": "2024-01-15T09:15:00Z"},
            {"type": "content", "message": "Blog post published: 'Getting Started with OpenHands'", "timestamp": "2024-01-15T08:00:00Z"}
        ]
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=True
    )