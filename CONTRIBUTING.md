# Contributing to E-Commerce API

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Development Setup

1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm install`
4. Copy `.env.example` to `.env` and configure
5. Run tests: `npm test`

## Code Style

- Use ES6+ features
- Follow existing code formatting
- Add JSDoc comments for functions
- Write meaningful variable names

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat: add new feature`
- `fix: resolve bug`
- `docs: update documentation`
- `test: add tests`
- `refactor: code improvement`
- `chore: maintenance tasks`

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Add tests for new functionality
3. Ensure all tests pass
4. Update version numbers following [SemVer](https://semver.org/)
5. Request review from maintainers

## Testing

- Write unit tests for new features
- Maintain or improve code coverage
- Test edge cases and error handling

## Security

- Never commit sensitive data
- Use environment variables for secrets
- Follow security best practices
