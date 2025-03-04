from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2AuthorizationCodeBearer
from sqlalchemy.orm import Session
from typing import Optional
import httpx
from urllib.parse import urlencode

from fairgig.database import get_db
from fairgig.models import User, OAuthProvider
from fairgig.routers.auth import oauth_callback
from fairgig.core.config import settings

router = APIRouter(prefix="/oauth", tags=["OAuth"])

# OAuth2 configuration
oauth2_scheme = OAuth2AuthorizationCodeBearer(
    authorizationUrl="oauth/authorize",
    tokenUrl="oauth/token",
    scopes={
        "openid": "OpenID Connect scope",
        "email": "Access to email",
        "profile": "Access to profile information"
    }
)

# Google OAuth endpoints
GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"

# GitHub OAuth endpoints
GITHUB_AUTH_URL = "https://github.com/login/oauth/authorize"
GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token"
GITHUB_USERINFO_URL = "https://api.github.com/user"

@router.get("/authorize/{provider}")
async def authorize(provider: OAuthProvider):
    if provider == OAuthProvider.GOOGLE:
        if not settings.GOOGLE_CLIENT_ID:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Google OAuth not configured"
            )
        
        params = {
            "client_id": settings.GOOGLE_CLIENT_ID,
            "redirect_uri": "http://localhost:3000/api/auth/callback/google",
            "response_type": "code",
            "scope": "openid email profile",
            "access_type": "offline",
            "prompt": "consent"
        }
        auth_url = f"{GOOGLE_AUTH_URL}?{urlencode(params)}"
        return {"authorization_url": auth_url}
    
    elif provider == OAuthProvider.GITHUB:
        if not settings.GITHUB_CLIENT_ID:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="GitHub OAuth not configured"
            )
        
        params = {
            "client_id": settings.GITHUB_CLIENT_ID,
            "redirect_uri": "http://localhost:3000/api/auth/callback/github",
            "scope": "user:email"
        }
        auth_url = f"{GITHUB_AUTH_URL}?{urlencode(params)}"
        return {"authorization_url": auth_url}
    
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Unsupported OAuth provider"
    )

@router.post("/token/{provider}")
async def get_token(
    provider: OAuthProvider,
    code: str,
    db: Session = Depends(get_db)
):
    async with httpx.AsyncClient() as client:
        if provider == OAuthProvider.GOOGLE:
            # Exchange code for token
            token_response = await client.post(
                GOOGLE_TOKEN_URL,
                data={
                    "client_id": settings.GOOGLE_CLIENT_ID,
                    "client_secret": settings.GOOGLE_CLIENT_SECRET,
                    "code": code,
                    "grant_type": "authorization_code",
                    "redirect_uri": "http://localhost:3000/api/auth/callback/google"
                }
            )
            token_data = token_response.json()
            
            # Get user info
            user_response = await client.get(
                GOOGLE_USERINFO_URL,
                headers={"Authorization": f"Bearer {token_data['access_token']}"}
            )
            user_data = user_response.json()
            
            # Process OAuth callback
            return await oauth_callback(
                provider=provider,
                user_data={
                    "id": user_data["sub"],
                    "email": user_data["email"],
                    "name": user_data.get("name"),
                    "picture": user_data.get("picture")
                },
                db=db
            )
        
        elif provider == OAuthProvider.GITHUB:
            # Exchange code for token
            token_response = await client.post(
                GITHUB_TOKEN_URL,
                data={
                    "client_id": settings.GITHUB_CLIENT_ID,
                    "client_secret": settings.GITHUB_CLIENT_SECRET,
                    "code": code,
                    "redirect_uri": "http://localhost:3000/api/auth/callback/github"
                }
            )
            token_data = token_response.json()
            
            # Get user info
            user_response = await client.get(
                GITHUB_USERINFO_URL,
                headers={"Authorization": f"Bearer {token_data['access_token']}"}
            )
            user_data = user_response.json()
            
            # Get user email
            email_response = await client.get(
                "https://api.github.com/user/emails",
                headers={"Authorization": f"Bearer {token_data['access_token']}"}
            )
            email_data = email_response.json()
            primary_email = next(email["email"] for email in email_data if email["primary"])
            
            # Process OAuth callback
            return await oauth_callback(
                provider=provider,
                user_data={
                    "id": str(user_data["id"]),
                    "email": primary_email,
                    "name": user_data.get("name") or user_data["login"],
                    "picture": user_data.get("avatar_url")
                },
                db=db
            )
    
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Unsupported OAuth provider"
    ) 