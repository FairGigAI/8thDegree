# 8thDegree AI Service API Documentation

## Overview

This document describes the API endpoints provided by the 8thDegree AI service. The service provides AI-powered matching, bias detection, and embedding generation capabilities.

## Authentication

All API requests require authentication using an API key. Include the API key in the request header:

```http
X-API-Key: your_api_key_here
```

Rate limiting is enforced at 100 requests per minute per API key.

## Base URL

```
https://ai.8thdegree.ai/api/v1
```

## Endpoints

### Embeddings

#### Generate Embedding
```http
POST /embeddings
Content-Type: application/json
X-API-Key: your_api_key_here

{
    "text": "string",
    "entity_type": "job|user|review",
    "entity_id": "uuid",
    "metadata": {
        "optional_field": "value"
    }
}
```

**Response**
```json
{
    "vector": [float],
    "model": "text-embedding-3-small",
    "dimension": 1536,
    "metadata": {
        "optional_field": "value"
    },
    "cache_hit": false
}
```

#### Generate Batch Embeddings
```http
POST /embeddings/batch
Content-Type: application/json
X-API-Key: your_api_key_here

{
    "texts": [
        {
            "text": "string",
            "entity_type": "job|user|review",
            "entity_id": "uuid",
            "metadata": {}
        }
    ]
}
```

### Bias Detection

#### Detect Bias
```http
POST /bias/detect
Content-Type: application/json
X-API-Key: your_api_key_here

{
    "text": "string",
    "entity_type": "job|user|review",
    "entity_id": "uuid",
    "metadata": {}
}
```

**Response**
```json
{
    "bias_score": 0.0,
    "confidence": 0.95,
    "categories": ["string"],
    "findings": {
        "category": "description"
    },
    "recommendations": {
        "category": "suggestion"
    },
    "requires_review": false,
    "review_reason": null,
    "cache_hit": false
}
```

### Matching

#### Find Matches for Job
```http
POST /matching/job/{job_id}
Content-Type: application/json
X-API-Key: your_api_key_here

{
    "entity_type": "job",
    "entity_details": {},
    "candidate_pool": [],
    "limit": 10,
    "min_score": 0.7
}
```

**Response**
```json
{
    "matches": [
        {
            "freelancer_id": "uuid",
            "score": 0.95,
            "confidence": 0.9,
            "components": {
                "skills": 0.9,
                "experience": 0.8,
                "requirements": 0.85,
                "geography": 0.7,
                "success_probability": 0.85
            },
            "analysis": {
                "strengths": ["string"],
                "gaps": ["string"],
                "recommendations": ["string"]
            },
            "similarity": 0.92
        }
    ],
    "total": 1,
    "cache_hit": false
}
```

## Error Handling

The API uses standard HTTP response codes:

- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 429: Too Many Requests
- 500: Internal Server Error

Error responses include:
```json
{
    "detail": "Error message"
}
```

## Rate Limiting

- 100 requests per minute per API key
- Rate limit headers included in responses:
  - X-RateLimit-Limit
  - X-RateLimit-Remaining
  - X-RateLimit-Reset

## Best Practices

1. **Caching**
   - Results are cached for 1 hour
   - Use `cache_hit` in responses to track cache usage
   - Consider implementing client-side caching

2. **Batch Processing**
   - Use batch endpoints for multiple items
   - Maximum batch size: 32 items
   - Helps reduce API calls and latency

3. **Error Handling**
   - Implement exponential backoff
   - Handle rate limiting gracefully
   - Monitor error responses

4. **Security**
   - Keep API keys secure
   - Use HTTPS only
   - Monitor usage patterns

## SDK Support

Official SDKs:
- Python: `pip install 8thdegree-ai`
- JavaScript: `npm install @8thdegree/ai-client`
- Ruby: `gem install 8thdegree-ai`

## Support

- Documentation: https://docs.8thdegree.ai
- Support Email: ai-support@8thdegree.ai
- Status Page: https://status.8thdegree.ai

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history. 