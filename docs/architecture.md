# Architecture Documentation

## System Overview

8thDegree is a modern web application built with a microservices architecture, consisting of a FastAPI backend and a Next.js frontend. The system is containerized using Docker and uses PostgreSQL as the primary database.

## Architecture Diagram

```
+------------------+     +------------------+     +------------------+
|                  |     |                  |     |                  |
|   Next.js Frontend|     |   FastAPI Backend|     |   PostgreSQL DB  |
|   (Next.js 13+)  |<--->|   (FastAPI)     |<--->|   (PostgreSQL)  |
|                  |     |                  |     |                  |
+------------------+     +------------------+     +------------------+
```

## Component Details

### Frontend (Next.js)

#### Structure
```
frontend/
├── src/
│   ├── app/                    # Next.js 13+ app directory
│   │   ├── (auth)/            # Authentication routes
│   │   ├── api/               # API routes
│   │   └── dashboard/         # Protected dashboard routes
│   ├── components/            # Reusable components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions
│   └── types/                 # TypeScript type definitions
├── public/                    # Static assets
└── package.json              # Dependencies and scripts
```

#### Key Technologies
- Next.js 13+ with App Router
- TypeScript
- TailwindCSS for styling
- NextAuth.js for authentication
- React Query for data fetching

### Backend (FastAPI)

#### Structure
```
backend/
├── fairgig/
│   ├── main.py               # Application entry point
│   ├── database.py           # Database configuration
│   ├── models/               # SQLAlchemy models
│   ├── schemas/              # Pydantic schemas
│   ├── routers/              # API routers
│   └── core/                 # Core functionality
├── tests/                    # Test suite
└── pyproject.toml           # Dependencies and scripts
```

#### Key Technologies
- FastAPI
- SQLAlchemy ORM
- Alembic for migrations
- JWT authentication
- Poetry for dependency management

### Database (PostgreSQL)

#### Schema Overview
```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Jobs table
CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    budget DECIMAL(10,2) NOT NULL,
    skills TEXT[] NOT NULL,
    category VARCHAR(100) NOT NULL,
    employer_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'open'
);

-- Job Applications table
CREATE TABLE job_applications (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES jobs(id),
    freelancer_id INTEGER REFERENCES users(id),
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending'
);
```

## Authentication Flow

1. User submits login credentials
2. Backend validates credentials and returns JWT
3. Frontend stores JWT in secure HTTP-only cookie
4. All subsequent requests include JWT in Authorization header
5. Backend validates JWT and authorizes requests

## Security Measures

### Rate Limiting
- 100 requests per minute per IP
- 1000 requests per hour per user
- Implemented using in-memory storage

### Authentication
- JWT-based authentication
- Token expiration after 24 hours
- Password hashing with bcrypt
- OAuth2 support for Google and GitHub

### CORS
- Configured for specific origins
- Secure cookie handling
- Preflight request handling

## Deployment Architecture

### Docker Setup
```yaml
services:
  frontend:
    build: ./frontend
    ports: [3000:3000]
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000/api/v1
      - NEXTAUTH_URL=http://localhost:3000

  backend:
    build: ./backend
    ports: [8000:8000]
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/8thdegree

  db:
    image: postgres:15-alpine
    ports: [5432:5432]
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

### Environment Variables
- Frontend: `.env.local`
- Backend: `.env`
- Docker: `docker-compose.yml`

## Monitoring and Logging

### Application Logging
- Backend: Python logging module
- Frontend: Console logging
- Docker: Container logs

### Health Checks
- Backend: `/health` endpoint
- Database: Connection checks
- Frontend: Build status

## Future Considerations

### Scalability
- Horizontal scaling of backend services
- Database read replicas
- Caching layer implementation
- CDN integration

### Performance
- Query optimization
- Frontend code splitting
- Image optimization
- API response caching

### Security
- Regular security audits
- Dependency updates
- Penetration testing
- Compliance monitoring
