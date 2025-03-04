# Contributing to 8thDegree

Thank you for your interest in contributing to 8thDegree! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/8thDegree.git
   cd 8thDegree
   ```
3. Set up the development environment:
   ```bash
   # Copy environment files
   cp frontend/.env.local.example frontend/.env.local
   cp backend/.env.example backend/.env

   # Start the development environment
   docker-compose up --build
   ```

## Development Workflow

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our [Style Guide](style-guide.md)

3. Run tests:
   ```bash
   # Backend tests
   docker-compose exec backend pytest

   # Frontend tests
   docker-compose exec frontend npm test
   ```

4. Commit your changes:
   ```bash
   git commit -m "feat: your feature description"
   ```

5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

6. Create a Pull Request

## Pull Request Guidelines

- Use clear, descriptive commit messages
- Include tests for new features
- Update documentation as needed
- Follow the existing code style
- Keep PRs focused and manageable

## Project Structure

```
8thDegree/
├── backend/           # FastAPI backend
│   ├── fairgig/      # Main application package
│   ├── tests/        # Backend tests
│   └── Dockerfile    # Backend container
├── frontend/         # Next.js frontend
│   ├── src/         # Source code
│   ├── public/      # Static files
│   └── Dockerfile   # Frontend container
├── docs/            # Documentation
└── docker-compose.yml
```

## Testing

- Write unit tests for new features
- Ensure all tests pass before submitting PR
- Include integration tests for API endpoints
- Test across different browsers and devices

## Documentation

- Update relevant documentation files
- Add comments for complex logic
- Include examples for new features
- Update API documentation

## Getting Help

- Check existing documentation
- Open an issue for bugs
- Join our community discussions
- Contact maintainers

## Release Process

1. Update version in `pyproject.toml` and `package.json`
2. Update CHANGELOG.md
3. Create a release tag
4. Deploy to staging/production

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License. 