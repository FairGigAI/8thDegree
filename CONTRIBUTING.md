# Contributing to 8thDegree

First off, thank you for considering contributing to 8thDegree! We're excited to have you join our community of developers working to create a fair, AI-powered freelancing platform.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](ai/CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* Use a clear and descriptive title
* Describe the exact steps to reproduce the problem
* Provide specific examples to demonstrate the steps
* Describe the behavior you observed and what behavior you expected to see
* Include screenshots and animated GIFs if possible
* Include your environment details

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* Use a clear and descriptive title
* Provide a step-by-step description of the suggested enhancement
* Provide specific examples to demonstrate the steps
* Describe the current behavior and explain the behavior you expected to see
* Explain why this enhancement would be useful

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Include screenshots and animated GIFs in your pull request whenever possible
* Follow our [coding standards](#coding-standards)
* Document new code
* End all files with a newline

## Development Process

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Coding Standards

### Python
* Follow PEP 8
* Use type hints
* Write docstrings for all public methods
* Maintain test coverage above 80%

### JavaScript/TypeScript
* Follow ESLint configuration
* Use TypeScript for new code
* Write JSDoc comments for public methods
* Include unit tests for new features

### AI/ML Code
* Document model parameters and assumptions
* Include bias testing
* Maintain reproducibility
* Document data processing steps

## Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

* feat: A new feature
* fix: A bug fix
* docs: Documentation only changes
* style: Changes that do not affect the meaning of the code
* refactor: A code change that neither fixes a bug nor adds a feature
* perf: A code change that improves performance
* test: Adding missing tests or correcting existing tests
* chore: Changes to the build process or auxiliary tools

## Security

If you discover a security vulnerability, please follow our [Security Policy](ai/SECURITY.md).

## Setting Up Development Environment

1. Install dependencies:
```bash
# Backend
cd backend
poetry install

# Frontend
cd frontend
npm install

# AI Service
cd ai
poetry install
```

2. Set up environment variables:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp ai/.env.example ai/.env
```

3. Run tests:
```bash
# Backend
cd backend
poetry run pytest

# Frontend
cd frontend
npm test

# AI Service
cd ai
poetry run pytest
```

## Questions?

Feel free to contact us at dev@8thdegree.ai

## License

By contributing, you agree that your contributions will be licensed under the GPL-3.0 License. 