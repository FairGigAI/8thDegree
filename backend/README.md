# 8thDegree Backend

FastAPI backend service for the 8thDegree AI-powered freelancing platform.

## Features

- AI-aware sharding for global scale
- Real-time job matching engine
- Advanced bias detection system
- OAuth2 authentication
- Rate limiting and circuit breakers
- Prometheus metrics and monitoring

## Tech Stack

- FastAPI
- PostgreSQL with AI-aware sharding
- Redis for caching
- SQLAlchemy + Alembic
- Poetry for dependency management
- Prometheus + Grafana

## Quick Start

1. Install dependencies:
```bash
poetry install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Run migrations:
```bash
poetry run alembic upgrade head
```

4. Start the server:
```bash
poetry run uvicorn app.main:app --reload
```

## Project Structure

```
app/
├── api/                # API endpoints
├── core/              # Core configuration
├── models/            # Database models
├── schemas/           # Pydantic schemas
├── services/          # Business logic
└── utils/             # Utility functions
```

## Development

- Follow Python type hints
- Write tests for new features
- Update migrations for model changes
- Follow the commit message convention

For detailed documentation, see the [main project README](../README.md). 