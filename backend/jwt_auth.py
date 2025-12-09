"""JWT-based authentication module for Campus Hub"""

from functools import wraps
from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import os
from datetime import datetime, timedelta, timezone
from models import User

# JWT Configuration
SECRET_KEY = os.getenv(
    "JWT_SECRET_KEY", "your-super-secret-jwt-key-change-in-production-12345"
)
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours
REFRESH_TOKEN_EXPIRE_DAYS = 30


def create_access_token(user_id: int, username: str, role: str):
    """Create JWT access token"""
    now = datetime.now(timezone.utc)
    payload = {
        "user_id": user_id,
        "username": username,
        "role": role,
        "iat": now,
        "exp": now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        "type": "access",
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token


def create_refresh_token(user_id: int):
    """Create JWT refresh token (longer expiry for token refresh)"""
    now = datetime.now(timezone.utc)
    payload = {
        "user_id": user_id,
        "iat": now,
        "exp": now + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
        "type": "refresh",
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token


def verify_token(token: str):
    """Verify JWT token and return payload"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None  # Token expired
    except jwt.InvalidTokenError:
        return None  # Invalid token


def token_required(f):
    """Decorator to protect routes requiring valid JWT token"""

    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # 1. Check cookies (Priority)
        if "access_token" in request.cookies:
            token = request.cookies.get("access_token")
        
        # 2. Fallback to Authorization header
        if not token:
            auth_header = request.headers.get("Authorization")
            if auth_header:
                try:
                    scheme, token_part = auth_header.split()
                    if scheme.lower() == "bearer":
                        token = token_part
                except ValueError:
                    pass

        if not token:
            return jsonify({"error": "Missing authentication token"}), 401

        # Verify token
        payload = verify_token(token)
        if not payload:
            return jsonify({"error": "Invalid or expired token"}), 401

        # Check token type
        if payload.get("type") != "access":
            return jsonify({"error": "Invalid token type"}), 401

        # Store user info in request context
        request.user_id = payload["user_id"]
        request.username = payload["username"]
        request.role = payload["role"]

        return f(*args, **kwargs)

    return decorated


def get_current_user():
    """Get current authenticated user from token payload"""
    user_id = getattr(request, "user_id", None)
    if not user_id:
        return None
    return User.query.get(user_id)


def role_required(required_role):
    """Decorator to check if user has specific role"""

    def decorator(f):
        @wraps(f)
        @wraps(f)
        def decorated(*args, **kwargs):
            token = None
            
            # 1. Check cookies (Priority)
            if "access_token" in request.cookies:
                token = request.cookies.get("access_token")
            
            # 2. Fallback to Authorization header
            if not token:
                auth_header = request.headers.get("Authorization")
                if auth_header:
                    try:
                        scheme, token_part = auth_header.split()
                        if scheme.lower() == "bearer":
                            token = token_part
                    except ValueError:
                        pass

            if not token:
                return jsonify({"error": "Missing authentication token"}), 401

            # Verify token
            payload = verify_token(token)
            if not payload or payload.get("type") != "access":
                return jsonify({"error": "Invalid or expired token"}), 401

            # Check role
            if payload.get("role") != required_role:
                return jsonify({"error": "Insufficient permissions"}), 403

            # Store user info in request context
            request.user_id = payload["user_id"]
            request.username = payload["username"]
            request.role = payload["role"]

            return f(*args, **kwargs)

        return decorated

    return decorator


def admin_required(f):
    """Decorator to check if user is admin"""
    return role_required("admin")(f)
