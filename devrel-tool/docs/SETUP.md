# DevRel Command Center - Setup Guide

## Overview

The DevRel Command Center is a comprehensive platform designed to streamline Developer Relations workflows. It provides tools for feedback collection, issue management, content production, community engagement, analytics, and release management.

## Architecture

```
devrel-tool/
├── backend/           # FastAPI backend with SQLAlchemy
├── frontend/          # React frontend with Material-UI
├── integrations/      # Platform integration modules
├── analytics/         # Data analysis and reporting
├── content/          # Content management system
├── community/        # Community management tools
└── docs/             # Documentation
```

## Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn
- Git

## Quick Start

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd devrel-tool
   chmod +x start.sh
   ./start.sh
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

3. **Start Backend**
   ```bash
   cd backend
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

4. **Start Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm start
   ```

5. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=sqlite:///./devrel.db

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# GitHub Integration
GITHUB_TOKEN=your-github-token

# Slack Integration
SLACK_BOT_TOKEN=xoxb-your-token
SLACK_SIGNING_SECRET=your-secret

# Discord Integration
DISCORD_BOT_TOKEN=your-token

# OpenAI Integration
OPENAI_API_KEY=your-api-key

# Redis (for background tasks)
REDIS_URL=redis://localhost:6379
```

### Database Setup

The application uses SQLite by default for development. For production, configure PostgreSQL:

```env
DATABASE_URL=postgresql://user:password@localhost/devrel
```

Run database migrations:
```bash
cd backend
alembic upgrade head
```

## Features

### 1. Feedback Collection & Analysis
- **Multi-platform Integration**: GitHub, Slack, Discord, forums
- **AI-powered Categorization**: Automatic sentiment analysis and tagging
- **Theme Synthesis**: Identify recurring patterns and improvement opportunities

### 2. Issue Management
- **Cross-platform Tracking**: Sync issues from GitHub, GitLab, Jira
- **Priority Management**: Automated triage and assignment
- **Resolution Tracking**: Monitor progress and ownership

### 3. Content Production
- **Content Pipeline**: Manage blogs, tutorials, documentation, webinars
- **Template Library**: Reusable templates and code samples
- **Publication Workflow**: Draft → Review → Publish

### 4. Community Engagement
- **Member Management**: Track engagement levels and contributions
- **Support Sessions**: Schedule pair-programming and debugging sessions
- **Health Monitoring**: Community health scores and metrics

### 5. Analytics & KPIs
- **DevRel Metrics**: Activation time, PR velocity, docs satisfaction
- **Custom Dashboards**: Visualize key performance indicators
- **Automated Reporting**: Generate stakeholder reports

### 6. Release Management
- **Communication Orchestration**: Changelogs, upgrade guides, announcements
- **Multi-channel Distribution**: GitHub, blog, social media, newsletters
- **Timeline Management**: Plan and track release schedules

### 7. Ecosystem Partnerships
- **Partner Tracking**: Manage strategic relationships
- **Collaboration Opportunities**: Joint demos, integrations, cross-promotion
- **Engagement History**: Track interactions and outcomes

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/me` - Get current user

### Feedback
- `GET /api/v1/feedback/` - List feedback
- `POST /api/v1/feedback/` - Create feedback
- `GET /api/v1/feedback/{id}` - Get feedback details
- `PUT /api/v1/feedback/{id}/status` - Update status

### Issues
- `GET /api/v1/issues/` - List issues
- `POST /api/v1/issues/` - Create issue
- `PUT /api/v1/issues/{id}` - Update issue
- `POST /api/v1/issues/sync/{source}` - Sync from external source

### Content
- `GET /api/v1/content/` - List content
- `POST /api/v1/content/` - Create content
- `PUT /api/v1/content/{id}` - Update content
- `POST /api/v1/content/{id}/publish` - Publish content

### Community
- `GET /api/v1/community/members` - List members
- `POST /api/v1/community/members` - Add member
- `GET /api/v1/community/sessions` - List support sessions
- `POST /api/v1/community/sessions` - Schedule session

### Analytics
- `GET /api/v1/analytics/dashboard` - Dashboard data
- `GET /api/v1/analytics/kpis` - KPI metrics
- `GET /api/v1/analytics/reports/monthly` - Monthly report

### Integrations
- `GET /api/v1/integrations/` - List integrations
- `POST /api/v1/integrations/github/sync` - Sync GitHub data
- `POST /api/v1/integrations/slack/sync` - Sync Slack data

## Development

### Backend Development

1. **Setup Development Environment**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Run Development Server**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

3. **Database Migrations**
   ```bash
   alembic revision --autogenerate -m "Description"
   alembic upgrade head
   ```

4. **Testing**
   ```bash
   pytest
   ```

### Frontend Development

1. **Setup Development Environment**
   ```bash
   cd frontend
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm start
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Testing**
   ```bash
   npm test
   ```

## Deployment

### Docker Deployment

1. **Build Images**
   ```bash
   docker-compose build
   ```

2. **Start Services**
   ```bash
   docker-compose up -d
   ```

### Manual Deployment

1. **Backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
   ```

2. **Frontend**
   ```bash
   cd frontend
   npm run build
   # Serve build/ directory with nginx or similar
   ```

## Integrations Setup

### GitHub Integration

1. Create a GitHub Personal Access Token with these scopes:
   - `repo` (for private repositories)
   - `public_repo` (for public repositories)
   - `read:org` (for organization access)
   - `admin:repo_hook` (for webhooks)

2. Add token to `.env`:
   ```env
   GITHUB_TOKEN=ghp_your_token_here
   ```

3. Configure webhooks in your repositories:
   - Payload URL: `https://your-domain.com/api/v1/integrations/webhooks/github`
   - Content type: `application/json`
   - Events: Issues, Pull requests, Discussions

### Slack Integration

1. Create a Slack App:
   - Go to https://api.slack.com/apps
   - Create new app
   - Add bot token scopes: `channels:read`, `chat:write`, `users:read`

2. Install app to workspace and get bot token

3. Add to `.env`:
   ```env
   SLACK_BOT_TOKEN=xoxb-your-token
   SLACK_SIGNING_SECRET=your-signing-secret
   ```

### Discord Integration

1. Create Discord Application:
   - Go to https://discord.com/developers/applications
   - Create new application
   - Go to Bot section and create bot
   - Copy bot token

2. Add to `.env`:
   ```env
   DISCORD_BOT_TOKEN=your-bot-token
   ```

### OpenAI Integration

1. Get OpenAI API key from https://platform.openai.com/

2. Add to `.env`:
   ```env
   OPENAI_API_KEY=sk-your-api-key
   ```

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check DATABASE_URL in .env
   - Ensure database server is running
   - Run migrations: `alembic upgrade head`

2. **Frontend Build Errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility

3. **Integration Failures**
   - Verify API keys and tokens
   - Check network connectivity
   - Review webhook configurations

### Logs

- Backend logs: Check console output or configure logging
- Frontend logs: Check browser developer console
- Integration logs: Check background task logs

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review API documentation at `/docs`
3. Create an issue in the repository
4. Contact the development team

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.