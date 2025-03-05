from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.core.security import create_access_token, verify_password
from app.core.rate_limit import rate_limit
from app.schemas.user import UserCreate, User, Token
from app.models.user import User as UserModel
from app.core.deps import get_current_user
from app.core.logging import get_logger

logger = get_logger(__name__)
router = APIRouter()

@router.post("/register", response_model=User)
@rate_limit(limit=5, period=60)  # 5 requests per minute
async def register(user: UserCreate):
    """Register a new user."""
    try:
        # Check if user exists
        if await UserModel.get_by_email(user.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create new user
        db_user = await UserModel.create(**user.dict())
        return db_user
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating user"
        )

@router.post("/login", response_model=Token)
@rate_limit(limit=5, period=60)  # 5 requests per minute
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login user and return access token."""
    try:
        user = await UserModel.get_by_email(form_data.username)
        if not user or not verify_password(form_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Inactive user"
            )
        
        access_token = create_access_token(data={"sub": user.email})
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error during login"
        )

@router.get("/me", response_model=User)
@rate_limit(limit=100, period=60)  # 100 requests per minute
async def read_users_me(current_user: UserModel = Depends(get_current_user)):
    """Get current user."""
    return current_user 