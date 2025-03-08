# Preview Service

## Overview
The preview service provides real-time job and profile previews for the 8thDegree platform, enabling users to see how their content will appear before publishing.

## Features

### Job Preview
- Real-time markdown rendering
- Image optimization
- Mobile responsive preview
- SEO preview

### Profile Preview
- Portfolio layout preview
- Review display preview
- Stats visualization
- Contact information display

### Review Preview
- Rating visualization
- Comment formatting
- Response preview
- Bias detection preview

## Implementation

### Technology Stack
- Next.js for rendering
- React for components
- Tailwind CSS for styling
- Markdown processing
- Image optimization

### Key Components
- Preview renderer
- Image processor
- Layout manager
- Content validator

### API Endpoints
- `/api/preview/job`
- `/api/preview/profile`
- `/api/preview/review`
- `/api/preview/portfolio`

## Usage

### Job Preview
```typescript
const preview = await fetch('/api/preview/job', {
  method: 'POST',
  body: JSON.stringify(jobData)
});
```

### Profile Preview
```typescript
const preview = await fetch('/api/preview/profile', {
  method: 'POST',
  body: JSON.stringify(profileData)
});
```

## Configuration

### Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_PREVIEW_TOKEN=your_token
```

### Preview Settings
```typescript
export const previewConfig = {
  maxImageSize: 5 * 1024 * 1024, // 5MB
  supportedFormats: ['jpg', 'png', 'gif'],
  maxTitleLength: 100,
  maxDescriptionLength: 5000
};
```

## Development

### Setup
1. Clone the repository
2. Install dependencies
3. Set up environment variables
4. Start development server

### Commands
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deployment

### Production Build
```bash
npm run build
```

### Environment Setup
1. Configure environment variables
2. Set up CDN
3. Configure caching
4. Set up monitoring

### Monitoring
- Performance metrics
- Error tracking
- Usage analytics
- Health checks

## Security

### Access Control
- API key authentication
- Rate limiting
- Input validation
- Output sanitization

### Data Protection
- Content validation
- XSS prevention
- CSRF protection
- Secure headers

## Testing

### Unit Tests
```bash
npm run test:unit
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

## Contributing

### Guidelines
1. Follow code style
2. Write tests
3. Update documentation
4. Submit pull request

### Development Process
1. Create feature branch
2. Implement changes
3. Write tests
4. Update documentation
5. Submit PR

## License
MIT License - see LICENSE file for details 