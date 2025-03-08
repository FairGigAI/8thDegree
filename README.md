# 8thDegree - AI-Powered Freelancing Platform

## Overview
8thDegree is a next-generation freelancing platform that uses AI to provide fair, real-time matching between clients and freelancers. Our platform focuses on creating equal opportunities while maintaining high-quality service delivery.

## Documentation Structure

### Architecture
- [Backend Architecture](docs/architecture/backend.md)
- [Frontend Architecture](docs/architecture/frontend.md)
- [AI Architecture](docs/architecture/ai.md)
- [System Overview](docs/architecture/overview.md)

### API Documentation
- [Backend API](docs/api/backend.md)
- [Frontend API](docs/api/frontend.md)
- [AI Service API](docs/api/ai.md)

### Development
- [Getting Started](docs/development/getting-started.md)
- [Style Guide](docs/development/style-guide.md)
- [Workflow](docs/development/workflow.md)
- [AI Implementation](docs/development/ai-implementation.md)

### Security
- [Best Practices](docs/security/best-practices.md)
- [Privacy Policy](docs/security/privacy.md)
- [Guidelines](docs/security/guidelines.md)

### Project Guidelines
- [Code of Conduct](docs/CODE_OF_CONDUCT.md)
- [Contributing](docs/CONTRIBUTING.md)
- [License](docs/LICENSE.md)
- [CLA](docs/CLA.md)

## Core Features

### AI-Powered Matching
- Real-time job and freelancer matching
- Bias detection and prevention
- Continuous learning system
- Fair opportunity distribution

### Smart Search & Discovery
- AI-enhanced search capabilities
- Real-time recommendations
- Personalized results
- Skill-based matching

### Fair Platform
- Bias detection in job posts and reviews
- Fair matching algorithms
- Engagement optimization
- Equal opportunity system

### Global Scale
- Region-aware matching
- Distributed AI processing
- Cross-region optimization
- Global talent pool

## Architecture

### AI Layer
- OpenAI embeddings
- Real-time matching
- Bias detection
- Learning system

### Backend
- FastAPI
- PostgreSQL
- Redis
- Elasticsearch

### Frontend
- Next.js 14
- React
- Tailwind CSS
- Shadcn/ui

## Tech Stack

### AI & ML
- OpenAI API
- TensorFlow
- PyTorch
- scikit-learn

### Backend
- Python 3.11
- FastAPI
- SQLAlchemy
- Alembic

### Frontend
- TypeScript
- Next.js 14
- Prisma
- TailwindCSS

## Project Structure
```
8thDegree/
├── backend/           # FastAPI backend
│   ├── app/          # Main application
│   └── tests/        # Backend tests
├── frontend/         # Next.js frontend
│   ├── src/         # Source code
│   └── tests/       # Frontend tests
├── ai/              # AI service
│   ├── app/         # AI application
│   └── tests/       # AI tests
├── docs/            # Documentation
└── preview/         # Preview service
```
```
docs/
├── api/                    # API Documentation
├── architecture/          # Architecture Documentation
├── development/          # Development Documentation
├── security/             # Security Documentation
└── preview/             # Preview Service Documentation
```

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Redis 7+

### Installation
1. Clone the repository
```bash
git clone https://github.com/yourusername/8thDegree.git
cd 8thDegree
```

2. Install backend dependencies
```bash
cd backend
poetry install
```

3. Install frontend dependencies
```bash
cd frontend
npm install
```

4. Set up environment variables
```bash
cp .env.example .env
```

5. Start development servers
```bash
# Backend
poetry run uvicorn app.main:app --reload

# Frontend
npm run dev
```

## Contributing
Please read our [Contributing Guidelines](docs/CONTRIBUTING.md) and [Code of Conduct](docs/CODE_OF_CONDUCT.md) before submitting contributions.

## License
This project is licensed under the terms of the [MIT License](docs/LICENSE.md).

## Support
For support, please open an issue or contact our team at support@8thdegree.ai.

