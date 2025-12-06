// frontend/src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg">
              CH
            </div>
            <span className="text-xl font-bold text-slate-900 hidden sm:inline">
              Campus Hub
            </span>
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-slate-600 hover:text-slate-900 transition">
              Home
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="text-slate-600 hover:text-slate-900 transition">
                  Dashboard
                </Link>
                <Link to="/courses" className="text-slate-600 hover:text-slate-900 transition">
                  Courses
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-slate-600 hover:text-slate-900 transition font-semibold text-orange-600">
                    Admin Panel
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="hidden sm:block text-sm text-slate-600">
                  {user?.username}
                </div>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 rounded-full bg-slate-200 text-slate-900 hover:bg-slate-300 transition font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-slate-600 hover:text-slate-900 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition font-semibold shadow-soft"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
