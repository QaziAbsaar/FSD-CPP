# Campus Hub - Production-Ready Web Application

## Overview

Campus Hub is a comprehensive, scalable web platform for academic services that connects students with expert instructors and curated courses. Built following industry best practices with security, performance, and user experience in mind.

**Status:** Production-Ready CCP Project  
**Tech Stack:** React + Flask + MySQL + Tailwind CSS

---

## 🏗️ Architecture

### Frontend (React + Vite)
- **Framework:** React 18 with Functional Components & Hooks
- **Routing:** React Router v6
- **State Management:** Context API (Authentication)
- **HTTP Client:** Axios with credentials support
- **Styling:** Tailwind CSS with custom Edusion Vibe design system
- **Development Server:** Vite (Fast HMR, optimized builds)

### Backend (Flask)
- **Framework:** Python Flask with Factory Pattern
- **Database:** MySQL with SQLAlchemy ORM
- **Authentication:** Session-based with HttpOnly Cookies
- **Security:** CORS (credentials enabled), CSRF tokens, password hashing
- **Session Storage:** FileSystemSessionInterface

### Database (MySQL)
- **Tables:** users, courses, enrollments, audit_log
- **Relationships:** Foreign keys with cascade constraints
- **Indexes:** Performance optimization on frequently queried columns

---

## 📦 Project Structure

```
FSD/
├── schema.sql                 # MySQL database schema
├── backend/
│   ├── app.py               # Flask app factory & entry point
│   ├── models.py            # SQLAlchemy models
│   ├── routes.py            # API endpoints
│   ├── auth.py              # Authentication decorators
│   ├── requirements.txt      # Python dependencies
│   └── .env.example         # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main App component
│   │   ├── main.jsx         # React entry point
│   │   ├── index.css        # Tailwind imports
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── Hero.jsx
│   │   └── pages/
│   │       ├── Home.jsx
│   │       ├── Login.jsx
│   │       ├── Signup.jsx
│   │       ├── Dashboard.jsx
│   │       └── Courses.jsx
│   ├── index.html           # HTML entry point
│   ├── package.json         # Node dependencies
│   ├── vite.config.js       # Vite configuration
│   ├── tailwind.config.js   # Tailwind customization
│   └── .env.example         # Environment template
└── README.md               # This file
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 16+ (for frontend)
- Python 3.8+ (for backend)
- MySQL 5.7+ (database)

### 1. Database Setup

```bash
# Create database
mysql -u root -p < schema.sql

# Verify
mysql -u root -p
> USE campus_hub;
> SHOW TABLES;
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL=mysql+pymysql://root:your_password@localhost/campus_hub

# Run Flask app
python app.py
```

**Backend runs on:** `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

**Frontend runs on:** `http://localhost:3000`

---

## 🔐 Security Features

### Authentication
- **Session-based:** HttpOnly cookies prevent XSS attacks
- **Password Hashing:** Werkzeug's security module (PBKDF2)
- **Protected Routes:** Role-based access control (student/teacher/admin)

### CORS Configuration
```python
CORS(app, supports_credentials=True)
```
- Credentials enabled for session cookies
- Origin validation for production

### Database Security
- **Foreign Keys:** Referential integrity with cascade constraints
- **Input Validation:** Request data validation
- **SQL Injection Prevention:** SQLAlchemy parameterized queries

### Session Security
- **Secure Cookies:** HTTPS ready (SESSION_COOKIE_SECURE for production)
- **HttpOnly:** JavaScript cannot access cookies
- **SameSite:** Prevents CSRF attacks

---

## 📚 API Reference

### Authentication Endpoints

**Register**
```http
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@campus.edu",
  "password": "securepass123",
  "role": "student"  // or "teacher"
}
```

**Login**
```http
POST /auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securepass123"
}
```

**Get Current User**
```http
GET /auth/me
```

**Logout**
```http
POST /auth/logout
```

### Courses Endpoints

**List All Courses**
```http
GET /courses
```

**Get Course Details**
```http
GET /courses/{course_id}
```

**Create Course** (Teacher only)
```http
POST /courses
{
  "title": "Python Basics",
  "description": "Learn Python fundamentals",
  "credits": 3,
  "capacity": 30
}
```

**Update Course** (Teacher only)
```http
PUT /courses/{course_id}
```

**Delete Course** (Teacher only)
```http
DELETE /courses/{course_id}
```

### Enrollment Endpoints

**Enroll in Course**
```http
POST /enrollments
{
  "course_id": 1
}
```

**Get My Enrollments**
```http
GET /enrollments/my-enrollments
```

**Unenroll from Course**
```http
DELETE /enrollments/{enrollment_id}
```

---

## 🎨 Design System - "Edusion Vibe"

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| **Mint Green** | `#10B981` | Primary actions, buttons, icons |
| **Mint Light** | `#34D399` | Gradients, hover states |
| **Soft Coral** | `#FB7185` | Secondary accents, decorative |
| **Dark Navy** | `#0F172A` | Headings, text |
| **Gray-600** | `#4B5563` | Body text |
| **White** | `#FFFFFF` | Backgrounds, cards |

### Key Components

- **Buttons:** Pill-shaped (`rounded-full`), gradient mint background
- **Cards:** Rounded-2xl, shadow-card, hover transitions
- **Hero Section:** Grid layout with floating animated cards
- **Navbar:** Minimalist white, centered links, green pill CTA

### Typography

- **Headings:** Bold, Dark Navy color
- **Body Text:** Gray-600, readable line height
- **Accents:** Mint green for highlights

---

## 📊 Database Schema

### Users Table
- `id` (PK): Auto-increment
- `username` (UNIQUE): 50 chars
- `email` (UNIQUE): 100 chars
- `password_hash`: Hashed password
- `role`: ENUM(student, teacher, admin)
- `created_at`: Timestamp

### Courses Table
- `id` (PK): Auto-increment
- `title`: 150 chars
- `description`: Text field
- `instructor_id` (FK): References users
- `credits`: Integer (default: 3)
- `capacity`: Integer (default: 30)
- `created_at`, `updated_at`: Timestamps

### Enrollments Table
- `id` (PK): Auto-increment
- `student_id` (FK): References users
- `course_id` (FK): References courses
- `status`: ENUM(pending, enrolled)
- `created_at`, `updated_at`: Timestamps
- **Unique Constraint:** (student_id, course_id)

### Audit Log Table
- `id` (PK): Auto-increment
- `user_id` (FK): References users
- `action`: Varchar(255) - Action description
- `timestamp`: DateTime

---

## 🧪 Demo Credentials

Pre-seeded users for testing:

| Role | Username | Password |
|------|----------|----------|
| Student | john_doe | student123 |
| Student | jane_smith | student123 |
| Teacher | dr_smith | teacher123 |
| Admin | admin | admin123 |

---

## 🔧 Environment Configuration

### Backend (.env)
```env
DATABASE_URL=mysql+pymysql://root:password@localhost/campus_hub
SECRET_KEY=your-secret-key-here
FLASK_ENV=development
CORS_ORIGINS=http://localhost:3000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

---

## 📝 Development Guide

### Running Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # macOS/Linux
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Both servers support hot reload:
- Backend: Flask auto-reloads on file changes
- Frontend: Vite provides instant HMR

### Building for Production

**Frontend Build:**
```bash
npm run build  # Creates dist/ folder
npm run preview  # Preview production build
```

**Backend Deployment:**
```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

---

## 🚨 Compliance & Security Checklist

- ✅ **MySQL Database:** Foreign keys with cascade constraints
- ✅ **Session-based Auth:** HttpOnly cookies, NOT JWT
- ✅ **CORS:** Configured with credentials support
- ✅ **Audit Log:** All user actions tracked
- ✅ **Password Security:** Werkzeug hashing
- ✅ **Role-based Access:** Teacher/Student/Admin enforcement
- ✅ **Input Validation:** Request body validation
- ✅ **Error Handling:** Proper HTTP status codes
- ✅ **Responsive Design:** Mobile-first CSS
- ✅ **Accessibility:** Semantic HTML, focus states

---

## 🐛 Troubleshooting

### Database Connection Error
```
Error: (pymysql.err.OperationalError) (1045, "Access denied...")
```
**Solution:** Verify MySQL credentials in `.env` and ensure MySQL service is running.

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Ensure backend CORS is configured with `supports_credentials=True` and frontend API URL matches.

### Session Not Persisting
```
User logs in but redirects back to login
```
**Solution:** Ensure `flask_session` folder exists and Axios has `withCredentials: true`.

### Port Already in Use
```
Address already in use
```
**Solution:** Change port in vite.config.js (frontend) or app.py (backend).

---

## 📚 Additional Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/)
- [MySQL Best Practices](https://dev.mysql.com/)

---

## 🎯 Project Features

### Core Functionality
- ✅ User registration & authentication
- ✅ Course management (CRUD)
- ✅ Student enrollment system
- ✅ Course capacity management
- ✅ Audit logging for compliance
- ✅ Responsive design
- ✅ Protected routes

### User Roles
- **Student:** Browse, enroll, view dashboard
- **Teacher:** Create/manage courses
- **Admin:** View all users and activities

### Quality Assurance
- Production-ready code structure
- Error handling & validation
- Security best practices
- Performance optimization
- Mobile responsive

---

## 📄 License & Credits

**Campus Hub** - Complex Computing Problem (CCP) Project  
Built with ❤️ for academic excellence

---

## 🤝 Support

For issues, questions, or improvements, refer to the code documentation and inline comments for implementation details.

**Last Updated:** December 2025  
**Version:** 1.0.0
