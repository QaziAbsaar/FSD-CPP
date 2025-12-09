# backend/routes.py
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Course, Enrollment, AuditLog
from jwt_auth import (
    token_required,
    admin_required,
    create_access_token,
    create_refresh_token,
    get_current_user,
    role_required,
)
from datetime import datetime

# Create blueprints
auth_bp = Blueprint("auth", __name__, url_prefix="/auth")
courses_bp = Blueprint("courses", __name__, url_prefix="/courses")
enrollments_bp = Blueprint("enrollments", __name__, url_prefix="/enrollments")
users_bp = Blueprint("users", __name__, url_prefix="/users")

# ============ AUTH ROUTES ============


@auth_bp.route("/register", methods=["POST"])
def register():
    """Register a new user."""
    data = request.get_json()

    if (
        not data
        or not data.get("username")
        or not data.get("email")
        or not data.get("password")
    ):
        return jsonify({"error": "Missing required fields"}), 400

    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"error": "Username already exists"}), 409

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email already exists"}), 409

    user = User(
        username=data["username"],
        email=data["email"],
        password_hash=generate_password_hash(data["password"]),
        role=data.get("role", "student"),
    )

    db.session.add(user)
    db.session.commit()

    # Log action
    log = AuditLog(user_id=user.id, action=f"User registered: {user.username}")
    db.session.add(log)
    db.session.commit()

    # Auto-login after registration by setting cookies
    access_token = create_access_token(user.id, user.username, user.role)
    refresh_token = create_refresh_token(user.id)

    response = jsonify({
        "message": "User registered and logged in successfully", 
        "user": user.to_dict()
    })
    
    # Set cookies
    response.set_cookie(
        "access_token", access_token, httponly=True, samesite="Lax", secure=False, max_age=24*60*60
    )
    response.set_cookie(
        "refresh_token", refresh_token, httponly=True, samesite="Lax", secure=False, max_age=30*24*60*60
    )

    return response, 201


@auth_bp.route("/login", methods=["POST"])
def login():
    """Login a user and return JWT tokens."""
    data = request.get_json()

    if not data or not data.get("username") or not data.get("password"):
        return jsonify({"error": "Missing username or password"}), 400

    user = User.query.filter_by(username=data["username"]).first()

    if not user or not check_password_hash(user.password_hash, data["password"]):
        return jsonify({"error": "Invalid username or password"}), 401

    # Create tokens
    access_token = create_access_token(user.id, user.username, user.role)
    refresh_token = create_refresh_token(user.id)

    # Log action
    log = AuditLog(user_id=user.id, action=f"User logged in: {user.username}")
    db.session.add(log)
    db.session.commit()

    response = jsonify(
        {
            "message": "Login successful",
            "user": user.to_dict(),
        }
    )
    
    # Set cookies
    # Note: Secure=False for localhost development. Set to True in production!
    response.set_cookie(
        "access_token", access_token, httponly=True, samesite="Lax", secure=False, max_age=24*60*60
    )
    response.set_cookie(
        "refresh_token", refresh_token, httponly=True, samesite="Lax", secure=False, max_age=30*24*60*60
    )

    return response, 200


@auth_bp.route("/logout", methods=["POST"])
@token_required
def logout():
    """Logout the current user."""
    user_id = request.user_id
    username = request.username

    # Log action
    log = AuditLog(user_id=user_id, action=f"User logged out: {username}")
    db.session.add(log)
    db.session.commit()

    response = jsonify({"message": "Logout successful"})
    
    # Clear cookies
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    
    return response, 200


@auth_bp.route("/me", methods=["GET"])
@token_required
def get_current_user_endpoint():
    """Get current authenticated user."""
    user = User.query.get(request.user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user.to_dict()), 200


# ============ COURSES ROUTES ============


@courses_bp.route("", methods=["GET"])
def list_courses():
    """Get all courses."""
    courses = Course.query.all()
    return jsonify([course.to_dict() for course in courses]), 200


@courses_bp.route("/<int:course_id>", methods=["GET"])
def get_course(course_id):
    """Get a specific course."""
    course = Course.query.get(course_id)
    if not course:
        return jsonify({"error": "Course not found"}), 404

    return jsonify(course.to_dict()), 200


@courses_bp.route("", methods=["POST"])
@token_required
def create_course():
    """Create a new course (teacher or admin)."""
    # Check if user is teacher or admin
    if request.role not in ["teacher", "admin"]:
        return jsonify({"error": "Only teachers and admins can create courses"}), 403

    data = request.get_json()

    if not data or not data.get("title"):
        return jsonify({"error": "Missing required fields"}), 400

    # If admin creates course, use their ID as instructor
    # If teacher creates course, use their ID
    instructor_id = data.get("instructor_id", request.user_id)

    course = Course(
        title=data["title"],
        description=data.get("description"),
        instructor_id=instructor_id,
        credits=data.get("credits", 3),
        capacity=data.get("capacity", 30),
    )

    db.session.add(course)
    db.session.commit()

    # Log action
    log = AuditLog(user_id=request.user_id, action=f"Course created: {course.title}")
    db.session.add(log)
    db.session.commit()

    return jsonify({"message": "Course created", "course": course.to_dict()}), 201


@courses_bp.route("/<int:course_id>", methods=["PUT"])
@token_required
def update_course(course_id):
    """Update a course (teacher only)."""
    # Check if user is teacher
    if request.role != "teacher":
        return jsonify({"error": "Only teachers can update courses"}), 403

    course = Course.query.get(course_id)

    if not course:
        return jsonify({"error": "Course not found"}), 404

    if course.instructor_id != request.user_id:
        return jsonify({"error": "Not authorized to update this course"}), 403

    data = request.get_json()

    course.title = data.get("title", course.title)
    course.description = data.get("description", course.description)
    course.credits = data.get("credits", course.credits)
    course.capacity = data.get("capacity", course.capacity)

    db.session.commit()

    # Log action
    log = AuditLog(user_id=request.user_id, action=f"Course updated: {course.title}")
    db.session.add(log)
    db.session.commit()

    return jsonify({"message": "Course updated", "course": course.to_dict()}), 200


@courses_bp.route("/<int:course_id>", methods=["DELETE"])
@token_required
def delete_course(course_id):
    """Delete a course (teacher only)."""
    # Check if user is teacher
    if request.role != "teacher":
        return jsonify({"error": "Only teachers can delete courses"}), 403

    course = Course.query.get(course_id)

    if not course:
        return jsonify({"error": "Course not found"}), 404

    if course.instructor_id != request.user_id:
        return jsonify({"error": "Not authorized to delete this course"}), 403

    course_title = course.title
    db.session.delete(course)
    db.session.commit()

    # Log action
    log = AuditLog(user_id=request.user_id, action=f"Course deleted: {course_title}")
    db.session.add(log)
    db.session.commit()

    return jsonify({"message": "Course deleted"}), 200


# ============ ENROLLMENTS ROUTES ============


@enrollments_bp.route("", methods=["POST"])
@token_required
def enroll_in_course():
    """Enroll student in a course."""
    data = request.get_json()

    if not data or not data.get("course_id"):
        return jsonify({"error": "Missing course_id"}), 400

    course = Course.query.get(data["course_id"])
    if not course:
        return jsonify({"error": "Course not found"}), 404

    # Check if already enrolled
    existing = Enrollment.query.filter_by(
        student_id=request.user_id, course_id=data["course_id"]
    ).first()

    if existing:
        return jsonify({"error": "Already enrolled in this course"}), 409

    # Check capacity
    enrolled_count = Enrollment.query.filter_by(
        course_id=data["course_id"], status="enrolled"
    ).count()

    if enrolled_count >= course.capacity:
        return jsonify({"error": "Course is at capacity"}), 400

    enrollment = Enrollment(
        student_id=request.user_id, course_id=data["course_id"], status="enrolled"
    )

    db.session.add(enrollment)
    db.session.commit()

    # Log action
    log = AuditLog(
        user_id=request.user_id, action=f"Enrolled in course: {course.title}"
    )
    db.session.add(log)
    db.session.commit()

    return (
        jsonify(
            {"message": "Enrolled successfully", "enrollment": enrollment.to_dict()}
        ),
        201,
    )


@enrollments_bp.route("/my-enrollments", methods=["GET"])
@token_required
def get_my_enrollments():
    """Get current user's enrollments."""
    enrollments = Enrollment.query.filter_by(student_id=request.user_id).all()
    return jsonify([enrollment.to_dict() for enrollment in enrollments]), 200


@enrollments_bp.route("/<int:enrollment_id>", methods=["DELETE"])
@token_required
def unenroll(enrollment_id):
    """Unenroll from a course."""
    enrollment = Enrollment.query.get(enrollment_id)

    if not enrollment:
        return jsonify({"error": "Enrollment not found"}), 404

    if enrollment.student_id != request.user_id:
        return jsonify({"error": "Not authorized"}), 403

    course_title = enrollment.course.title
    db.session.delete(enrollment)
    db.session.commit()

    # Log action
    log = AuditLog(
        user_id=request.user_id, action=f"Unenrolled from course: {course_title}"
    )
    db.session.add(log)
    db.session.commit()

    return jsonify({"message": "Unenrolled successfully"}), 200


# ============ USERS ROUTES ============


@users_bp.route("", methods=["GET"])
@admin_required
def list_users():
    """Get all users (admin only)."""
    users = User.query.all()
    return jsonify({"users": [user.to_dict() for user in users]}), 200


@users_bp.route("/<int:user_id>", methods=["GET"])
@token_required
def get_user(user_id):
    """Get a specific user."""
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user.to_dict()), 200


# ============ PROFILE ROUTES ============


@users_bp.route("/profile/<int:user_id>", methods=["GET"])
@token_required
def get_profile(user_id):
    """Get user profile with all details."""
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Users can view their own profile and admins can view any
    if request.user_id != user_id and request.role != "admin":
        return jsonify({"error": "Forbidden"}), 403

    return jsonify(user.to_dict(include_profile=True)), 200


@users_bp.route("/profile/<int:user_id>", methods=["PUT"])
@token_required
def update_profile(user_id):
    """Update user profile."""
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Users can update their own profile, admins can update any
    if request.user_id != user_id and request.role != "admin":
        return jsonify({"error": "Forbidden"}), 403

    data = request.get_json()

    try:
        # Update profile fields
        if "full_name" in data:
            user.full_name = data["full_name"]
        if "phone" in data:
            user.phone = data["phone"]
        if "bio" in data:
            user.bio = data["bio"]
        if "profile_picture_url" in data:
            user.profile_picture_url = data["profile_picture_url"]
        if "address" in data:
            user.address = data["address"]
        if "city" in data:
            user.city = data["city"]
        if "state" in data:
            user.state = data["state"]
        if "country" in data:
            user.country = data["country"]

        user.updated_at = datetime.utcnow()
        db.session.commit()

        # Log action
        log = AuditLog(
            user_id=request.user_id,
            action=f"Updated profile for user: {user.username}",
        )
        db.session.add(log)
        db.session.commit()

        return (
            jsonify(
                {
                    "message": "Profile updated successfully",
                    "user": user.to_dict(include_profile=True),
                }
            ),
            200,
        )
    except Exception as e:
        db.session.rollback()
        import traceback

        print(f"Error updating profile: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": f"Failed to update profile: {str(e)}"}), 500


@users_bp.route("/profile/<int:user_id>/picture", methods=["POST"])
@token_required
def upload_profile_picture(user_id):
    """Upload profile picture as base64 or file."""
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Users can upload their own picture, admins can upload for any
    if request.user_id != user_id and request.role != "admin":
        return jsonify({"error": "Forbidden"}), 403

    data = request.get_json()

    if "picture_base64" in data:
        # Store base64 string directly (for client-side uploads)
        user.profile_picture_url = data["picture_base64"]
    elif "picture_url" in data:
        # Store URL reference
        user.profile_picture_url = data["picture_url"]
    else:
        return jsonify({"error": "No picture provided"}), 400

    user.updated_at = datetime.utcnow()
    db.session.commit()

    # Log action
    log = AuditLog(
        user_id=request.user_id,
        action=f"Updated profile picture for user: {user.username}",
    )
    db.session.add(log)
    db.session.commit()

    return (
        jsonify(
            {
                "message": "Profile picture updated successfully",
                "picture_url": user.profile_picture_url,
            }
        ),
        200,
    )
