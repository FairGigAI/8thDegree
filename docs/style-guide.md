# Style Guide

## Overview

This style guide outlines the coding standards and best practices for the 8thDegree project. Following these guidelines ensures consistency and maintainability across the codebase.

## General Principles

- Write clear, self-documenting code
- Follow DRY (Don't Repeat Yourself) principle
- Keep functions and components focused and small
- Use meaningful names for variables, functions, and components
- Comment complex logic, not obvious code

## Frontend (Next.js/TypeScript)

### File Structure
```
src/
├── app/                    # Next.js 13+ app directory
│   ├── (auth)/            # Authentication routes
│   ├── api/               # API routes
│   └── dashboard/         # Protected dashboard routes
├── components/            # Reusable components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
└── types/                 # TypeScript type definitions
```

### Naming Conventions

#### Files
- React components: PascalCase (e.g., `UserProfile.tsx`)
- Hooks: camelCase with 'use' prefix (e.g., `useAuth.ts`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Types: PascalCase (e.g., `UserTypes.ts`)

#### Components
```typescript
// Component naming
const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  return <div>{user.name}</div>;
};

// Props interface
interface UserProfileProps {
  user: User;
  onUpdate?: (user: User) => void;
}
```

### Component Structure

```typescript
// 1. Imports
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

// 2. Types/Interfaces
interface Props {
  // ...
}

// 3. Component
export const Component: React.FC<Props> = ({ prop1, prop2 }) => {
  // 4. Hooks
  const [state, setState] = useState<Type>(initialValue);
  
  // 5. Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // 6. Handlers
  const handleEvent = () => {
    // Handler logic
  };
  
  // 7. Render
  return (
    // JSX
  );
};
```

### Styling

#### TailwindCSS
- Use utility classes
- Follow mobile-first approach
- Group related classes
- Use custom components for repeated patterns

```tsx
// Good
<div className="flex flex-col space-y-4 p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-semibold text-gray-900">Title</h2>
  <p className="text-gray-600">Content</p>
</div>

// Bad
<div className="p-4 bg-white rounded-lg shadow-md flex flex-col space-y-4">
  <h2 className="font-semibold text-xl text-gray-900">Title</h2>
  <p className="text-gray-600">Content</p>
</div>
```

## Backend (Python/FastAPI)

### File Structure
```
fairgig/
├── main.py               # Application entry point
├── database.py           # Database configuration
├── models/              # SQLAlchemy models
├── schemas/             # Pydantic schemas
├── routers/             # API routers
└── core/                # Core functionality
```

### Naming Conventions

#### Files
- Python modules: lowercase with underscores (e.g., `user_service.py`)
- Test files: test_*.py (e.g., `test_user_service.py`)
- Configuration files: lowercase (e.g., `config.py`)

#### Functions and Variables
```python
# Functions
def get_user_by_id(user_id: int) -> User:
    return db.query(User).filter(User.id == user_id).first()

# Variables
user_email: str = "user@example.com"
is_active: bool = True
```

### Code Structure

```python
# 1. Imports
from typing import List, Optional
from fastapi import APIRouter, Depends

# 2. Type hints
class UserResponse(BaseModel):
    id: int
    email: str
    name: str

# 3. Dependencies
async def get_current_user() -> User:
    # Dependency logic
    pass

# 4. Route handlers
@router.get("/users", response_model=List[UserResponse])
async def list_users(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user)
) -> List[UserResponse]:
    # Handler logic
    pass
```

### Database Models

```python
# SQLAlchemy models
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

## Testing

### Frontend Tests
```typescript
// Component test
describe('UserProfile', () => {
  it('renders user information correctly', () => {
    const user = { name: 'John Doe', email: 'john@example.com' };
    render(<UserProfile user={user} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});

// Hook test
describe('useAuth', () => {
  it('returns user when authenticated', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeDefined();
  });
});
```

### Backend Tests
```python
# Route test
def test_get_user():
    response = client.get("/users/1")
    assert response.status_code == 200
    assert response.json()["email"] == "user@example.com"

# Service test
def test_create_user():
    user = create_user(email="test@example.com", password="password123")
    assert user.email == "test@example.com"
    assert user.hashed_password != "password123"
```

## Git Workflow

### Commit Messages
```
feat: add user authentication
fix: resolve login redirect issue
docs: update API documentation
style: format code according to style guide
refactor: improve error handling
test: add authentication tests
chore: update dependencies
```

### Branch Naming
- Feature branches: `feature/description`
- Bug fixes: `fix/description`
- Documentation: `docs/description`
- Releases: `release/version`

## Code Review Guidelines

### Pull Request Template
```markdown
## Description
[Description of changes]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guide
- [ ] Documentation updated
- [ ] Tests pass
- [ ] No new warnings
```

## Tools and Configuration

### ESLint Configuration
```json
{
  "extends": [
    "next/core-web-vitals",
    "prettier"
  ],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### Prettier Configuration
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

### Python Tools
- Black for code formatting
- isort for import sorting
- flake8 for linting
- mypy for type checking

## Documentation

### Code Comments
```python
def process_user_data(user_data: dict) -> User:
    """
    Process raw user data and create a User object.
    
    Args:
        user_data (dict): Raw user data from request
        
    Returns:
        User: Processed user object
        
    Raises:
        ValidationError: If user data is invalid
    """
    # Implementation
```

### API Documentation
```python
@router.post("/users", response_model=UserResponse)
async def create_user(
    user: UserCreate,
    db: Session = Depends(get_db)
) -> UserResponse:
    """
    Create a new user.
    
    - **email**: User's email address
    - **password**: User's password (will be hashed)
    - **full_name**: User's full name
    
    Returns the created user.
    """
    # Implementation
```
