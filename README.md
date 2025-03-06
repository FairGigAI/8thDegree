# 8thDegree - AI-Powered Freelancing Platform

A modern freelancing platform that leverages artificial intelligence to connect clients with the perfect freelancers. Built with Next.js, TypeScript, and PostgreSQL.

## Features

- **AI-Powered Matching**: Real-time job and freelancer suggestions using OpenAI embeddings
- **Smart Search**: Dynamic search with instant results and AI analysis
- **Review System**: Comprehensive rating system with bias detection
- **Authentication**: Secure authentication with GitHub OAuth
- **Real-time Updates**: Instant notifications and live updates
- **Responsive Design**: Modern, mobile-first interface

## Tech Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion
- Prisma (ORM)
- OpenAI API

### Backend
- PostgreSQL
- Prisma
- Next.js API Routes
- OpenAI Embeddings

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
frontend/
├── src/
│   ├── app/              # Next.js app router
│   ├── components/       # React components
│   ├── lib/             # Utility functions
│   └── styles/          # Global styles
├── prisma/              # Database schema and migrations
└── public/             # Static assets
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

