from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, JSON, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
from typing import Optional, List, Dict, Any

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Feedback(Base):
    __tablename__ = "feedback"
    
    id = Column(Integer, primary_key=True, index=True)
    source = Column(String, index=True)  # github, slack, discord, forum, live_session
    source_id = Column(String, index=True)  # original ID from source platform
    title = Column(String)
    content = Column(Text)
    author = Column(String)
    author_email = Column(String)
    category = Column(String, index=True)  # bug, feature_request, improvement, question
    priority = Column(String, default="medium")  # low, medium, high, critical
    status = Column(String, default="new")  # new, reviewed, in_progress, resolved, closed
    tags = Column(JSON)  # List of tags
    sentiment = Column(String)  # positive, neutral, negative
    confidence_score = Column(Float)  # AI confidence in categorization
    assigned_to = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    themes = relationship("FeedbackTheme", back_populates="feedback_items")

class FeedbackTheme(Base):
    __tablename__ = "feedback_themes"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text)
    category = Column(String)
    frequency = Column(Integer, default=1)
    impact_score = Column(Float)
    status = Column(String, default="identified")  # identified, analyzing, roadmap, implemented
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    feedback_items = relationship("Feedback", back_populates="themes")

class Issue(Base):
    __tablename__ = "issues"
    
    id = Column(Integer, primary_key=True, index=True)
    source = Column(String, index=True)  # github, gitlab, jira
    source_id = Column(String, index=True)
    title = Column(String)
    description = Column(Text)
    status = Column(String, index=True)  # open, in_progress, resolved, closed
    priority = Column(String, index=True)  # low, medium, high, critical
    labels = Column(JSON)
    assignee = Column(String)
    reporter = Column(String)
    repository = Column(String)
    url = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    resolved_at = Column(DateTime(timezone=True))

class Content(Base):
    __tablename__ = "content"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    type = Column(String, index=True)  # blog_post, tutorial, documentation, webinar, talk, template
    status = Column(String, default="draft")  # draft, review, published, archived
    content = Column(Text)
    author = Column(String)
    reviewer = Column(String)
    tags = Column(JSON)
    target_audience = Column(String)  # beginner, intermediate, advanced, all
    estimated_reading_time = Column(Integer)  # in minutes
    url = Column(String)
    repository_url = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    published_at = Column(DateTime(timezone=True))

class CommunityMember(Base):
    __tablename__ = "community_members"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)
    email = Column(String)
    platforms = Column(JSON)  # Dict of platform -> username
    engagement_level = Column(String, default="newcomer")  # newcomer, regular, power_user, contributor
    contributions = Column(JSON)  # List of contributions
    last_activity = Column(DateTime(timezone=True))
    joined_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    sessions = relationship("SupportSession", back_populates="member")

class SupportSession(Base):
    __tablename__ = "support_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    member_id = Column(Integer, ForeignKey("community_members.id"))
    type = Column(String)  # pair_programming, debugging, consultation
    status = Column(String, default="scheduled")  # scheduled, in_progress, completed, cancelled
    description = Column(Text)
    notes = Column(Text)
    scheduled_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    member = relationship("CommunityMember", back_populates="sessions")

class Release(Base):
    __tablename__ = "releases"
    
    id = Column(Integer, primary_key=True, index=True)
    version = Column(String, index=True)
    title = Column(String)
    description = Column(Text)
    changelog = Column(Text)
    status = Column(String, default="planned")  # planned, in_progress, released
    release_date = Column(DateTime(timezone=True))
    repository = Column(String)
    communication_plan = Column(JSON)  # List of communication channels and messages
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Partner(Base):
    __tablename__ = "partners"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    type = Column(String)  # integration, joint_demo, cross_promotion
    contact_person = Column(String)
    contact_email = Column(String)
    status = Column(String, default="prospect")  # prospect, active, inactive
    collaboration_areas = Column(JSON)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class KPI(Base):
    __tablename__ = "kpis"
    
    id = Column(Integer, primary_key=True, index=True)
    metric_name = Column(String, index=True)
    value = Column(Float)
    target_value = Column(Float)
    period = Column(String)  # daily, weekly, monthly, quarterly
    date = Column(DateTime(timezone=True), index=True)
    meta_data = Column(JSON)  # Additional context
    created_at = Column(DateTime(timezone=True), server_default=func.now())