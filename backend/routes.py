# backend/routes.py
from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Course, Enrollment, AuditLog
from auth import login_required, get_current_user, role_required
from datetime import datetime

# Create blueprints
auth_bp = Blueprint('auth', __name__, url_prefix='/auth')
courses_bp = Blueprint('courses', __name__, url_prefix='/courses')
enrollments_bp = Blueprint('enrollments', __name__, url_prefix='/enrollments')
users_bp = Blueprint('users', __name__, url_prefix='/users')

# ============ AUTH ROUTES ============

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user."""
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 409
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 409
    
    user = User(
        username=data['username'],
        email=data['email'],
        password_hash=generate_password_hash(data['password']),
        role=data.get('role', 'student')
    )
    
    db.session.add(user)
    db.session.commit()
    
    # Log action
    log = AuditLog(user_id=user.id, action=f'User registered: {user.username}')
    db.session.add(log)
    db.session.commit()
    
    return jsonify({'message': 'User registered successfully', 'user': user.to_dict()}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    """Login a user."""
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'error': 'Missing username or password'}), 400
    
    user = User.query.filter_by(username=data['username']).first()
    
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({'error': 'Invalid username or password'}), 401
    
    # Create session
    session['user_id'] = user.id
    session['username'] = user.username
    session['role'] = user.role
    
    # Log action
    log = AuditLog(user_id=user.id, action=f'User logged in: {user.username}')
    db.session.add(log)
    db.session.commit()
    
    return jsonify({'message': 'Login successful', 'user': user.to_dict()}), 200


@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    """Logout the current user."""
    user_id = session.get('user_id')
    username = session.get('username')
    
    # Log action
    if user_id:
        log = AuditLog(user_id=user_id, action=f'User logged out: {username}')
        db.session.add(log)
        db.session.commit()
    
    session.clear()
    return jsonify({'message': 'Logout successful'}), 200


@auth_bp.route('/me', methods=['GET'])
@login_required
def get_current_user_endpoint():
    """Get current authenticated user."""
    user = User.query.get(session['user_id'])
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify(user.to_dict()), 200


# ============ COURSES ROUTES ============

@courses_bp.route('', methods=['GET'])
def list_courses():
    """Get all courses."""
    courses = Course.query.all()
    return jsonify([course.to_dict() for course in courses]), 200


@courses_bp.route('/<int:course_id>', methods=['GET'])
def get_course(course_id):
    """Get a specific course."""
    course = Course.query.get(course_id)
    if not course:
        return jsonify({'error': 'Course not found'}), 404
    
    return jsonify(course.to_dict()), 200


@courses_bp.route('', methods=['POST'])
@login_required
def create_course():
    """Create a new course (teacher or admin)."""
    # Check if user is teacher or admin
    if session.get('role') not in ['teacher', 'admin']:
        return jsonify({'error': 'Only teachers and admins can create courses'}), 403
    
    data = request.get_json()
    
    if not data or not data.get('title'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # If admin creates course, use their ID as instructor
    # If teacher creates course, use their ID
    instructor_id = data.get('instructor_id', session['user_id'])
    
    course = Course(
        title=data['title'],
        description=data.get('description'),
        instructor_id=instructor_id,
        credits=data.get('credits', 3),
        capacity=data.get('capacity', 30)
    )
    
    db.session.add(course)
    db.session.commit()
    
    # Log action
    log = AuditLog(user_id=session['user_id'], action=f'Course created: {course.title}')
    db.session.add(log)
    db.session.commit()
    
    return jsonify({'message': 'Course created', 'course': course.to_dict()}), 201


@courses_bp.route('/<int:course_id>', methods=['PUT'])
@login_required
@role_required('teacher')
def update_course(course_id):
    """Update a course (teacher only)."""
    course = Course.query.get(course_id)
    
    if not course:
        return jsonify({'error': 'Course not found'}), 404
    
    if course.instructor_id != session['user_id']:
        return jsonify({'error': 'Not authorized to update this course'}), 403
    
    data = request.get_json()
    
    course.title = data.get('title', course.title)
    course.description = data.get('description', course.description)
    course.credits = data.get('credits', course.credits)
    course.capacity = data.get('capacity', course.capacity)
    
    db.session.commit()
    
    # Log action
    log = AuditLog(user_id=session['user_id'], action=f'Course updated: {course.title}')
    db.session.add(log)
    db.session.commit()
    
    return jsonify({'message': 'Course updated', 'course': course.to_dict()}), 200


@courses_bp.route('/<int:course_id>', methods=['DELETE'])
@login_required
@role_required('teacher')
def delete_course(course_id):
    """Delete a course (teacher only)."""
    course = Course.query.get(course_id)
    
    if not course:
        return jsonify({'error': 'Course not found'}), 404
    
    if course.instructor_id != session['user_id']:
        return jsonify({'error': 'Not authorized to delete this course'}), 403
    
    course_title = course.title
    db.session.delete(course)
    db.session.commit()
    
    # Log action
    log = AuditLog(user_id=session['user_id'], action=f'Course deleted: {course_title}')
    db.session.add(log)
    db.session.commit()
    
    return jsonify({'message': 'Course deleted'}), 200


# ============ ENROLLMENTS ROUTES ============

@enrollments_bp.route('', methods=['POST'])
@login_required
def enroll_in_course():
    """Enroll student in a course."""
    data = request.get_json()
    
    if not data or not data.get('course_id'):
        return jsonify({'error': 'Missing course_id'}), 400
    
    course = Course.query.get(data['course_id'])
    if not course:
        return jsonify({'error': 'Course not found'}), 404
    
    # Check if already enrolled
    existing = Enrollment.query.filter_by(
        student_id=session['user_id'],
        course_id=data['course_id']
    ).first()
    
    if existing:
        return jsonify({'error': 'Already enrolled in this course'}), 409
    
    # Check capacity
    enrolled_count = Enrollment.query.filter_by(
        course_id=data['course_id'],
        status='enrolled'
    ).count()
    
    if enrolled_count >= course.capacity:
        return jsonify({'error': 'Course is at capacity'}), 400
    
    enrollment = Enrollment(
        student_id=session['user_id'],
        course_id=data['course_id'],
        status='enrolled'
    )
    
    db.session.add(enrollment)
    db.session.commit()
    
    # Log action
    log = AuditLog(user_id=session['user_id'], action=f'Enrolled in course: {course.title}')
    db.session.add(log)
    db.session.commit()
    
    return jsonify({'message': 'Enrolled successfully', 'enrollment': enrollment.to_dict()}), 201


@enrollments_bp.route('/my-enrollments', methods=['GET'])
@login_required
def get_my_enrollments():
    """Get current user's enrollments."""
    enrollments = Enrollment.query.filter_by(student_id=session['user_id']).all()
    return jsonify([enrollment.to_dict() for enrollment in enrollments]), 200


@enrollments_bp.route('/<int:enrollment_id>', methods=['DELETE'])
@login_required
def unenroll(enrollment_id):
    """Unenroll from a course."""
    enrollment = Enrollment.query.get(enrollment_id)
    
    if not enrollment:
        return jsonify({'error': 'Enrollment not found'}), 404
    
    if enrollment.student_id != session['user_id']:
        return jsonify({'error': 'Not authorized'}), 403
    
    course_title = enrollment.course.title
    db.session.delete(enrollment)
    db.session.commit()
    
    # Log action
    log = AuditLog(user_id=session['user_id'], action=f'Unenrolled from course: {course_title}')
    db.session.add(log)
    db.session.commit()
    
    return jsonify({'message': 'Unenrolled successfully'}), 200


# ============ USERS ROUTES ============

@users_bp.route('', methods=['GET'])
@login_required
@role_required('admin')
def list_users():
    """Get all users (admin only)."""
    users = User.query.all()
    return jsonify({'users': [user.to_dict() for user in users]}), 200


@users_bp.route('/<int:user_id>', methods=['GET'])
@login_required
def get_user(user_id):
    """Get a specific user."""
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify(user.to_dict()), 200
