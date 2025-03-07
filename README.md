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
- PostgreSQL
- OpenAI API Key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/8thDegree.git
cd 8thDegree
```

2. Install dependencies:
```bash
cd frontend
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Edit `.env.local` with your configuration:
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: Your OpenAI API key
- `GITHUB_ID` and `GITHUB_SECRET`: GitHub OAuth credentials
- Other necessary environment variables

4. Initialize the database:
```bash
npx prisma migrate dev
npx prisma db seed
```

5. Start the development server:
```bash
npm run dev
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

Required environment variables:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/8thdegree
OPENAI_API_KEY=your_openai_api_key
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- Documentation: [docs/](docs/)
- Issues: [GitHub Issues](https://github.com/your-username/8thDegree/issues)
- Community: [Discord](https://discord.gg/your-server) (WIP)

## Acknowledgments

- FastAPI team for the amazing framework
- Next.js team for the React framework
- All contributors and maintainers

