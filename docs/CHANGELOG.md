# Changelog

All notable changes to the 8thDegree project will be documented in this file.

## [0.2.0] - 2024-03-04

### Added
- Email verification system
  - Email verification endpoint
  - Resend verification functionality
  - Verification status tracking
- Password reset functionality
  - Password reset request endpoint
  - Password reset confirmation endpoint
  - Secure token generation
- SendGrid integration for email services
- Enhanced security features
  - Email verification requirement
  - Secure password reset flow
  - Reduced JWT token expiration (30 minutes)

### Changed
- Updated Next.js to version 14
- Improved frontend build process
- Enhanced Docker configuration
- Updated environment variable structure
- Improved error handling in API endpoints

### Fixed
- TypeScript errors in verify-email page
- Build issues with Next.js configuration
- Docker build process optimization
- Environment variable handling

### Removed
- Removed test_smtp.py as email functionality is now properly integrated

### Security
- Added email verification requirement
- Implemented secure password reset flow
- Enhanced JWT security with shorter expiration
- Improved error handling for security endpoints

## [0.1.0] - 2024-03-04

### Added
- Initial project setup with FastAPI backend and Next.js frontend
- Authentication system with JWT and OAuth support
  - Email/password authentication
  - Google OAuth integration
  - GitHub OAuth integration
- User management system
  - Registration
  - Login
  - Profile management
- Job posting and application system
  - Job creation
  - Job listing
  - Job application functionality
- Security features
  - Rate limiting (100 requests/min, 1000/hour)
  - CORS configuration
  - JWT token authentication
  - Password hashing with bcrypt
- Docker setup
  - Multi-container configuration
  - PostgreSQL database
  - Frontend and backend services
- Documentation
  - API reference
  - Architecture documentation
  - Security rules
  - Style guide
  - Contributing guidelines

### Changed
- None (initial release)

### Deprecated
- None (initial release)

### Removed
- None (initial release)

### Fixed
- None (initial release)

### Security
- Implemented JWT-based authentication
- Added rate limiting to prevent API abuse
- Configured secure CORS policies
- Added password hashing
- Implemented OAuth2 security measures 