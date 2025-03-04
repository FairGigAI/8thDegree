# API Reference

## Overview
The 8thDegree API is built using FastAPI and provides endpoints for managing user authentication, profile management, and job-related functionalities.

## Base URL
```
http://localhost:8000/api/v1
```

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Rate Limiting
- 100 requests per minute per IP address
- 1000 requests per hour per user

## Endpoints

### Authentication

#### POST /auth/login
Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer"
}
```

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "full_name": "John Doe"
}
```

**Response:**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "full_name": "John Doe",
  "created_at": "2024-03-04T12:00:00Z"
}
```

### User Profile

#### GET /users/me
Get the current user's profile information.

**Response:**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "full_name": "John Doe",
  "created_at": "2024-03-04T12:00:00Z",
  "updated_at": "2024-03-04T12:00:00Z"
}
```

#### PUT /users/me
Update the current user's profile information.

**Request Body:**
```json
{
  "full_name": "John Updated Doe",
  "email": "updated@example.com"
}
```

**Response:**
```json
{
  "id": "user_id",
  "email": "updated@example.com",
  "full_name": "John Updated Doe",
  "updated_at": "2024-03-04T12:30:00Z"
}
```

### Jobs

#### POST /jobs
Create a new job posting.

**Request Body:**
```json
{
  "title": "Senior Frontend Developer",
  "description": "Looking for an experienced frontend developer...",
  "budget": 5000,
  "skills": ["React", "TypeScript", "Next.js"],
  "category": "Web Development"
}
```

**Response:**
```json
{
  "id": "job_id",
  "title": "Senior Frontend Developer",
  "description": "Looking for an experienced frontend developer...",
  "budget": 5000,
  "skills": ["React", "TypeScript", "Next.js"],
  "category": "Web Development",
  "employer_id": "user_id",
  "created_at": "2024-03-04T12:00:00Z",
  "status": "open"
}
```

#### GET /jobs
List all job postings with optional filtering.

**Query Parameters:**
- `skip`: Number of records to skip (default: 0)
- `limit`: Maximum number of records to return (default: 100)
- `category`: Filter by job category
- `min_budget`: Minimum budget filter
- `max_budget`: Maximum budget filter
- `skills`: Comma-separated list of required skills

**Response:**
```json
{
  "jobs": [
    {
      "id": "job_id",
      "title": "Senior Frontend Developer",
      "description": "Looking for an experienced frontend developer...",
      "budget": 5000,
      "skills": ["React", "TypeScript", "Next.js"],
      "category": "Web Development",
      "employer_id": "user_id",
      "created_at": "2024-03-04T12:00:00Z",
      "status": "open"
    }
  ],
  "total": 1,
  "skip": 0,
  "limit": 100
}
```

#### POST /jobs/{job_id}/apply
Apply to a job posting.

**Response:**
```json
{
  "message": "Successfully applied to job"
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "detail": "Invalid input data",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "detail": "Invalid authentication credentials"
}
```

### 403 Forbidden
```json
{
  "detail": "Not enough permissions"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "detail": "Too many requests"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

## Security Considerations

1. All endpoints except `/auth/login` and `/auth/register` require authentication
2. Passwords are hashed using bcrypt before storage
3. JWT tokens expire after 24 hours
4. HTTPS is required for all API calls in production
5. API keys and secrets are stored securely in environment variables
6. Rate limiting is implemented to prevent abuse
7. CORS is configured to allow only trusted origins
