# 8thDegree API Documentation

## Overview

This document provides comprehensive documentation for the 8thDegree platform APIs, including both the main backend API and the AI service API.

## Base URLs

- Backend API: `https://api.8thdegree.ai/v1`
- AI Service: `https://ai.8thdegree.ai/v1`

## Authentication

All API requests require authentication using either:
- JWT Bearer token (for user requests)
- API key (for service-to-service communication)

### JWT Authentication
```http
Authorization: Bearer <token>
```

### API Key Authentication
```http
X-API-Key: <api_key>
```

## Rate Limiting

- 100 requests per minute per API key
- Rate limit headers included in responses:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## Backend API Endpoints

### Authentication

#### Login
```http
POST /auth/login
Content-Type: application/json

{
    "email": "string",
    "password": "string"
}
```

#### Register
```http
POST /auth/register
Content-Type: application/json

{
    "email": "string",
    "password": "string",
    "full_name": "string",
    "user_type": "client|freelancer"
}
```

### Jobs

#### Create Job
```http
POST /jobs
Content-Type: application/json

{
    "title": "string",
    "description": "string",
    "budget": number,
    "skills": ["string"],
    "category": "string"
}
```

#### List Jobs
```http
GET /jobs
Query Parameters:
- skip: number
- limit: number
- category: string
- skills: string[]
```

## AI Service Endpoints

### Embeddings

#### Generate Embedding
```http
POST /embeddings
Content-Type: application/json

{
    "text": "string",
    "entity_type": "job|user|review",
    "entity_id": "uuid"
}
```

### Bias Detection

#### Detect Bias
```http
POST /bias/detect
Content-Type: application/json

{
    "text": "string",
    "entity_type": "job|review",
    "entity_id": "uuid"
}
```

### Matching

#### Find Matches
```http
POST /matching/job/{job_id}
Content-Type: application/json

{
    "limit": number,
    "min_score": number
}
```

## Error Handling

All endpoints follow standard HTTP status codes:

- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error

Error responses include:
```json
{
    "detail": "Error message",
    "code": "ERROR_CODE",
    "params": {}
}
```

## WebSocket API

### Real-time Updates
```
ws://api.8thdegree.ai/v1/ws
```

Events:
- `job.new`: New job posted
- `job.update`: Job updated
- `match.new`: New match found
- `message.new`: New message received

## SDKs

Official SDKs:
- [Python](https://github.com/FairGigAI/8thdegree-python)
- [JavaScript](https://github.com/FairGigAI/8thdegree-js)
- [TypeScript](https://github.com/FairGigAI/8thdegree-ts)

## Support

- Documentation: [docs.8thdegree.ai](https://docs.8thdegree.ai)
- Support Email: api-support@8thdegree.ai
- Status Page: [status.8thdegree.ai](https://status.8thdegree.ai) 