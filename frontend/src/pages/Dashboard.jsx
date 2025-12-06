// frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchEnrollments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/enrollments/my-enrollments`, {
          withCredentials: true,
        });
        setEnrollments(response.data);
      } catch (err) {
        setError('Failed to load enrollments');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [isAuthenticated, navigate]);

  const handleUnenroll = async (enrollmentId) => {
    if (!window.confirm('Are you sure you want to unenroll from this course?')) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/enrollments/${enrollmentId}`, {
        withCredentials: true,
      });
      setEnrollments(enrollments.filter((e) => e.id !== enrollmentId));
    } catch (err) {
      setError('Failed to unenroll from course');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-text-gray">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-text-dark mb-2">
            Welcome, {user?.username}!
          </h1>
          <p className="text-text-gray text-lg">
            Here's an overview of your learning progress
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-xl">
                📚
              </div>
              <div>
                <p className="text-text-gray text-sm">Enrolled Courses</p>
                <p className="text-3xl font-bold text-text-dark">
                  {enrollments.filter((e) => e.status === 'enrolled').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-white text-xl">
                ⏳
              </div>
              <div>
                <p className="text-text-gray text-sm">Pending</p>
                <p className="text-3xl font-bold text-text-dark">
                  {enrollments.filter((e) => e.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-xl">
                ✅
              </div>
              <div>
                <p className="text-text-gray text-sm">Account Type</p>
                <p className="text-3xl font-bold text-text-dark capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Courses */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="px-6 md:px-8 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-text-dark">My Courses</h2>
          </div>

          {enrollments.length === 0 ? (
            <div className="px-6 md:px-8 py-12 text-center">
              <p className="text-text-gray mb-4">You haven't enrolled in any courses yet.</p>
              <a
                href="/courses"
                className="inline-block px-6 py-2 rounded-full bg-gradient-mint text-white font-semibold hover:shadow-lg transition"
              >
                Browse Courses
              </a>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {enrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="px-6 md:px-8 py-6 hover:bg-gray-50 transition flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex-1 mb-4 md:mb-0">
                    <h3 className="text-lg font-semibold text-text-dark">
                      {enrollment.course?.title}
                    </h3>
                    <p className="text-text-gray text-sm mt-1">
                      {enrollment.course?.description}
                    </p>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-text-gray">
                      <span>👨‍🏫 {enrollment.course?.instructor}</span>
                      <span>⭐ {enrollment.course?.credits} credits</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          enrollment.status === 'enrolled'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {enrollment.status}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleUnenroll(enrollment.id)}
                    className="px-4 py-2 rounded-full border border-gray-300 text-text-dark hover:bg-red-50 hover:border-red-300 transition font-medium text-sm"
                  >
                    Unenroll
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
