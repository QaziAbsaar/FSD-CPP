# backend/auth.py
from functools import wraps
from flask import session, jsonify
from models import User

def login_required(f):
    """Decorator to protect routes requiring authentication."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return decorated_function

def get_current_user():
    """Get the current authenticated user from session."""
    if 'user_id' not in session:
        return None
    return User.query.get(session['user_id'])

def role_required(role):
    """Decorator to check if user has specific role."""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if 'user_id' not in session:
                return jsonify({'error': 'Unauthorized'}), 401
            
            user = User.query.get(session['user_id'])
            if not user or user.role != role:
                return jsonify({'error': 'Forbidden'}), 403
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator
