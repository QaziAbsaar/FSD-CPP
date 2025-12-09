# backend/models.py
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(
        db.String(20), default="student", nullable=False
    )  # 'student', 'teacher', 'admin'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Profile Fields
    full_name = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    bio = db.Column(db.Text)
    profile_picture_url = db.Column(db.String(500))
    address = db.Column(db.String(255))
    city = db.Column(db.String(100))
    state = db.Column(db.String(100))
    country = db.Column(db.String(100))

    # Relationships
    courses_taught = db.relationship(
        "Course", backref="instructor", lazy=True, foreign_keys="Course.instructor_id"
    )
    enrollments = db.relationship(
        "Enrollment", backref="student", lazy=True, foreign_keys="Enrollment.student_id"
    )
    audit_logs = db.relationship("AuditLog", backref="user", lazy=True)

    def to_dict(self, include_profile=False):
        data = {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "role": self.role,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }

        if include_profile:
            data.update(
                {
                    "full_name": self.full_name,
                    "phone": self.phone,
                    "bio": self.bio,
                    "profile_picture_url": self.profile_picture_url,
                    "address": self.address,
                    "city": self.city,
                    "state": self.state,
                    "country": self.country,
                }
            )

        return data


class Course(db.Model):
    __tablename__ = "courses"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text)
    instructor_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    credits = db.Column(db.Integer, default=3)
    capacity = db.Column(db.Integer, default=30)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    enrollments = db.relationship(
        "Enrollment", backref="course", lazy=True, cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "instructor_id": self.instructor_id,
            "instructor": self.instructor.username if self.instructor else None,
            "credits": self.credits,
            "capacity": self.capacity,
            "enrolled_count": len(
                [e for e in self.enrollments if e.status == "enrolled"]
            ),
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }


class Enrollment(db.Model):
    __tablename__ = "enrollments"

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    course_id = db.Column(
        db.Integer, db.ForeignKey("courses.id", ondelete="CASCADE"), nullable=False
    )
    status = db.Column(
        db.String(20), default="pending", nullable=False
    )  # 'pending', 'enrolled'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    __table_args__ = (
        db.UniqueConstraint("student_id", "course_id", name="unique_enrollment"),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "course_id": self.course_id,
            "course": self.course.to_dict() if self.course else None,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }


class AuditLog(db.Model):
    __tablename__ = "audit_log"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="SET NULL"))
    action = db.Column(db.String(255), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "action": self.action,
            "timestamp": self.timestamp.isoformat(),
        }
