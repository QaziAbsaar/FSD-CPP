# backend/app.py
import os
from flask import Flask
from flask_cors import CORS
from models import db
from routes import auth_bp, courses_bp, enrollments_bp, users_bp


def create_app(config_name="development"):
    """Application factory pattern."""
    app = Flask(__name__)

    # Configuration
    if config_name == "production":
        app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
            "DATABASE_URL", "sqlite:///campus_hub.db"
        )
    else:  # development
        app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
            "DATABASE_URL", "sqlite:///campus_hub.db"
        )

    # JWT Configuration
    app.config["JWT_SECRET_KEY"] = os.getenv(
        "JWT_SECRET_KEY", "your-super-secret-jwt-key-change-in-production-12345"
    )
    app.secret_key = app.config["JWT_SECRET_KEY"]

    # Initialize extensions
    db.init_app(app)
    CORS(
        app,
        supports_credentials=True,
        resources={
            r"/*": {
                "origins": ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173"],
                "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            },
        },
    )

    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(courses_bp)
    app.register_blueprint(enrollments_bp)
    app.register_blueprint(users_bp)

    # Create tables and seed data
    with app.app_context():
        db.create_all()

        # Seed demo data if tables are empty
        if User.query.count() == 0:
            seed_database()

    return app


def seed_database():
    """Seed database with demo data."""
    from werkzeug.security import generate_password_hash
    from models import User, Course, Enrollment, AuditLog

    # Create users
    teacher = User(
        username="dr_smith",
        email="dr.smith@campus.edu",
        password_hash=generate_password_hash("teacher123"),
        role="teacher",
    )

    student1 = User(
        username="john_doe",
        email="john@campus.edu",
        password_hash=generate_password_hash("student123"),
        role="student",
    )

    student2 = User(
        username="jane_smith",
        email="jane@campus.edu",
        password_hash=generate_password_hash("student123"),
        role="student",
    )

    admin = User(
        username="admin",
        email="admin@campus.edu",
        password_hash=generate_password_hash("admin123"),
        role="admin",
    )

    db.session.add_all([teacher, student1, student2, admin])
    db.session.commit()

    # Create courses
    course1 = Course(
        title="Introduction to Python",
        description="Learn Python basics and fundamental concepts.",
        instructor_id=teacher.id,
        credits=3,
        capacity=30,
    )

    course2 = Course(
        title="Web Development with Flask",
        description="Build modern web applications using Flask framework.",
        instructor_id=teacher.id,
        credits=4,
        capacity=25,
    )

    course3 = Course(
        title="Database Design",
        description="Learn SQL, database normalization, and data modeling.",
        instructor_id=teacher.id,
        credits=3,
        capacity=20,
    )

    db.session.add_all([course1, course2, course3])
    db.session.commit()

    # Create enrollments
    enrollment1 = Enrollment(
        student_id=student1.id, course_id=course1.id, status="enrolled"
    )

    enrollment2 = Enrollment(
        student_id=student1.id, course_id=course2.id, status="enrolled"
    )

    enrollment3 = Enrollment(
        student_id=student2.id, course_id=course1.id, status="enrolled"
    )

    db.session.add_all([enrollment1, enrollment2, enrollment3])
    db.session.commit()

    # Create audit log entries
    log1 = AuditLog(user_id=teacher.id, action="Teacher user created")
    log2 = AuditLog(user_id=student1.id, action="Student user created")

    db.session.add_all([log1, log2])
    db.session.commit()


# Import models for seed_database
from models import User

if __name__ == "__main__":
    app = create_app("development")
    app.run(debug=True, host="0.0.0.0", port=5000)
