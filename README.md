# 8thDegree - AI-Powered Freelancing Platform

A modern freelancing platform that leverages artificial intelligence for fair, real-time matching between clients and freelancers. Built with Next.js, FastAPI, and advanced AI capabilities.

## Core Features

### AI-Powered Matching
- Real-time job and freelancer matching using OpenAI embeddings
- Bias detection and prevention system
- Continuous learning and optimization
- Fair opportunity distribution

### Smart Search & Discovery
- AI-enhanced search with semantic understanding
- Real-time recommendations
- Regional relevance optimization
- Personalized results

### Fair Platform
- Bias detection in job posts and reviews
- Fair matching algorithms
- Success rate tracking
- Engagement optimization

### Global Scale
- Region-aware matching
- Cross-region opportunities
- Real-time updates
- Distributed AI processing

## Architecture

### AI Layer
- OpenAI embeddings for semantic matching
- Real-time matching engine
- Bias detection system
- Learning and optimization engine

### Backend
- FastAPI for high-performance API
- PostgreSQL with AI-aware sharding
- Redis for real-time processing
- Elasticsearch for search

### Frontend
- Next.js 14 with React
- Real-time WebSocket updates
- Responsive UI with Tailwind
- Client-side AI processing

## Tech Stack

### AI & ML
- OpenAI API
- Custom matching algorithms
- Bias detection models
- Learning systems

### Backend
- FastAPI
- PostgreSQL
- Redis
- Elasticsearch

### Frontend
- Next.js 14
- TypeScript
- TailwindCSS
- WebSocket

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL 15+
- Redis 7+
- OpenAI API Key
- Docker and Docker Compose (optional)

### Installation

1. Clone the repository with submodules:
```bash
# Clone with submodules
git clone --recurse-submodules https://github.com/FairGigAI/8thDegree.git

# Or if you've already cloned the repository:
git submodule update --init --recursive
```

2. Set up environment variables:
```bash
# Backend environment
cp backend/.env.example backend/.env

# Frontend environment
cp frontend/.env.example frontend/.env

# AI service environment
cp ai/.env.example ai/.env
```

3. Install dependencies:
```bash
# Backend dependencies
cd backend
poetry install

# Frontend dependencies
cd ../frontend
npm install

# AI service dependencies
cd ../ai
poetry install
```

4. Start the services:

Using Docker:
```bash
docker-compose up -d
```

Or manually:
```bash
# Terminal 1 - Backend
cd backend
poetry run uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd frontend
npm run dev

# Terminal 3 - AI Service
cd ai
poetry run uvicorn app.main:app --reload --port 8001
```

5. Initialize the database:
```bash
cd backend
poetry run alembic upgrade head
```

6. Seed the database (optional):
```bash
cd backend
poetry run python -m scripts.seed
```

### Development Workflow

1. **Pulling Updates**:
```bash
# Update main repository and submodules
git pull
git submodule update --remote

# Switch to development branch
git checkout dev
git submodule foreach 'git checkout dev'
```

2. **Making Changes**:
```bash
# Create feature branch
git checkout -b feature/your-feature

# If working on AI service
cd ai
git checkout -b feature/ai-feature

# After changes
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature
```

3. **Running Tests**:
```bash
# Backend tests
cd backend
poetry run pytest

# Frontend tests
cd frontend
npm test

# AI service tests
cd ai
poetry run pytest
```

## Project Structure
```
8thDegree/
├── backend/
│   ├── app/
│   │   ├── ai/              # AI services
│   │   ├── api/             # API endpoints
│   │   ├── core/            # Core config
│   │   └── models/          # Data models
│   └── docs/                # Documentation
├── frontend/
│   ├── src/
│   │   ├── ai/             # Client AI
│   │   ├── app/            # Pages
│   │   └── components/     # UI
└── ai-service/             # Dedicated AI
    ├── matching/           # Matching engine
    ├── bias/              # Bias detection
    └── learning/          # Learning system
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/8thdegree
REDIS_URL=redis://localhost:6379/0
JWT_SECRET_KEY=your_jwt_secret
AI_SERVICE_URL=http://localhost:8001
AI_SERVICE_API_KEY=your_ai_service_key
```

### AI Service (.env)
```env
OPENAI_API_KEY=your_openai_api_key
REDIS_URL=redis://localhost:6379/1
MODEL_CACHE_TTL=3600
LOG_LEVEL=DEBUG
```

### Frontend (.env)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:8001
```

## License

This project is licensed under the GPL 3 License - see the [LICENSE](LICENSE) file for details.

## Support

- Documentation: [docs/](docs/)
- Issues: [GitHub Issues](https://github.com/your-username/8thDegree/issues)
- Community: [Discord](https://discord.gg/your-server) (WIP)

## Acknowledgments

- FastAPI team for the amazing framework
- Next.js team for the React framework
- All contributors and maintainers

