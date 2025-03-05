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

   # Install dependencies
   cd frontend && npm install
   cd ../backend && pip install -r requirements.txt

   # Start the development environment
   docker-compose up --build
   ```

## Development Process

We use GitHub to host code, track issues and feature requests, and accept pull requests.

1. Create a new branch from `main` following our naming convention
2. Make your changes following our style guide
3. Add or update tests as needed
4. Ensure all tests pass
5. Update documentation
6. Submit a pull request

## Branch Naming Convention

- Feature branches: `feature/description`
- Bug fix branches: `fix/description`
- Documentation branches: `docs/description`
- Release branches: `release/version`
- Hotfix branches: `hotfix/description`

## Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- feat: A new feature
- fix: A bug fix
- docs: Documentation only changes
- style: Changes that do not affect the meaning of the code
- refactor: A code change that neither fixes a bug nor adds a feature
- perf: A code change that improves performance
- test: Adding missing tests
- chore: Changes to the build process or auxiliary tools

## Pull Request Guidelines

- Use clear, descriptive commit messages
- Include tests for new features
- Update documentation as needed
- Follow the existing code style
- Keep PRs focused and manageable
- Ensure all automated checks pass
- Include relevant test cases
- Update the CHANGELOG.md

## Project Structure

```
8thDegree/
├── backend/           # FastAPI backend
│   ├── fairgig/      # Main application package
│   ├── tests/        # Backend tests
│   └── Dockerfile    # Backend container
├── frontend/         # Next.js frontend
│   ├── src/         # Source code
│   │   ├── app/     # Next.js app router
│   │   ├── components/ # React components
│   │   ├── lib/     # Utility functions
│   │   └── styles/  # Global styles
│   ├── public/      # Static files
│   └── Dockerfile   # Frontend container
├── docs/            # Documentation
└── docker-compose.yml
```

## Code Style

- TypeScript: Follow ESLint and existing code style
- Python: Follow PEP 8 guidelines
- Use Prettier for frontend code formatting
- Follow React best practices and hooks rules
- Use meaningful variable and function names
- Add comments for complex logic
- Maintain consistent component structure
- Follow accessibility best practices
- Optimize imports and remove unused code

## Testing

- Write unit tests for new features
- Update existing tests when modifying features
- Include integration tests for API endpoints
- Test across different browsers and devices
- Include mobile responsive testing
- Test for accessibility compliance
- Include edge cases in test coverage
- Ensure all tests pass before submitting PR

## Documentation

- Update relevant documentation files
- Document new environment variables
- Keep API documentation up to date
- Add JSDoc comments for TypeScript functions
- Include usage examples for new features
- Document any breaking changes
- Update component props documentation
- Maintain architecture documentation

## Issue Reporting

### Bug Reports

Include the following information:

1. Node.js and Python versions
2. Operating system
3. Steps to reproduce
4. Expected behavior
5. Actual behavior
6. Error messages or screenshots
7. Relevant configuration files

### Feature Requests

Provide the following details:

1. Clear description of the feature
2. Use cases and benefits
3. Potential implementation approach
4. Relevant examples
5. Impact on existing functionality
6. Estimated complexity and scope

## Security

- Never commit sensitive information
- Report security vulnerabilities privately
- Follow OWASP security guidelines
- Keep dependencies up to date
- Use environment variables for secrets
- Follow secure coding practices
- Implement proper input validation
- Use secure authentication methods

## Release Process

1. Update version in `pyproject.toml` and `package.json`
2. Update CHANGELOG.md
3. Create a release tag
4. Deploy to staging for testing
5. Deploy to production after approval

## Getting Help

- Check existing documentation
- Open an issue for bugs
- Join our community discussions
- Contact maintainers
- Review closed issues and PRs

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License. 