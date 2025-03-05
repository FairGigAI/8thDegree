# 8thDegree

8thDegree is an open-source, fair freelance marketplace platform built with FastAPI and Next.js. It connects freelancers with clients while ensuring fair practices and transparent pricing.

## Features

- Secure authentication with JWT and OAuth
- User profiles and management
- Job posting and application system
- Advanced search and filtering
- Transparent pricing system
- Social login (Google, GitHub)
- Rate limiting and security measures
- Responsive design
- Email verification system
- Password reset functionality

## Tech Stack

### Backend
- FastAPI
- PostgreSQL
- SQLAlchemy
- Alembic
- JWT Authentication
- Poetry for dependency management
- SendGrid for email services

### Frontend
- Next.js 14
- TypeScript
- TailwindCSS
- NextAuth.js
- React Query
- Framer Motion

### DevOps
- Docker
- Docker Compose
- GitHub Actions
- PostgreSQL

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/8thDegree.git
   cd 8thDegree
   ```

2. Copy environment files:
   ```bash
   cp frontend/.env.local.example frontend/.env.local
   cp backend/.env.example backend/.env
   ```

3. Configure environment variables:
   - Set up database credentials in `backend/.env`
   - Configure OAuth credentials in both `.env` files
   - Set up SendGrid API key in `backend/.env`

4. Start the development environment:
   ```bash
   docker-compose up --build
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### OAuth Configuration

1. Set up Google OAuth:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs
   - Copy client ID and secret to `.env` files

2. Set up GitHub OAuth:
   - Go to [GitHub Developer Settings](https://github.com/settings/developers)
   - Create a new OAuth App
   - Add callback URL
   - Copy client ID and secret to `.env` files

## Development

### Running Tests

```bash
# Backend tests
docker-compose exec backend pytest

# Frontend tests
docker-compose exec frontend npm test
```

### Code Style

We use:
- ESLint and Prettier for frontend
- Black and isort for backend
- Pre-commit hooks for automated formatting

### Database Migrations

```bash
# Create a new migration
docker-compose exec backend alembic revision --autogenerate -m "description"

# Apply migrations
docker-compose exec backend alembic upgrade head
```

## API Documentation

Detailed API documentation is available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Contributing

Please read our [Contributing Guidelines](docs/CONTRIBUTING.md) before submitting pull requests.

## Security

- All endpoints are rate-limited
- JWT tokens expire after 30 minutes
- Passwords are hashed with bcrypt
- CORS is configured for security
- OAuth2 for social login
- Email verification required for new accounts
- Secure password reset flow

## License

This project is licensed under GNU General Public License v3.0 (GPL-3.0) - see the [LICENSE](LICENSE) file for details.

## Support

- Documentation: [docs/](docs/)
- Issues: [GitHub Issues](https://github.com/your-username/8thDegree/issues)
- Community: [Discord](https://discord.gg/your-server) (WIP)

## Acknowledgments

- FastAPI team for the amazing framework
- Next.js team for the React framework
- All contributors and maintainers

