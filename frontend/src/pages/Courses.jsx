// frontend/src/pages/Courses.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export const Courses = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [enrollingCourse, setEnrollingCourse] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/courses`, {
          withCredentials: true,
        });
        setCourses(response.data);
      } catch (err) {
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [isAuthenticated, navigate]);

  const handleEnroll = async (courseId) => {
    try {
      setEnrollingCourse(courseId);
      const response = await axios.post(
        `${API_BASE_URL}/enrollments`,
        { course_id: courseId },
        { withCredentials: true }
      );
      alert('Enrolled successfully!');
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to enroll';
      alert(errorMsg);
    } finally {
      setEnrollingCourse(null);
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-text-gray">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-text-dark mb-2">
            Explore Courses
          </h1>
          <p className="text-text-gray text-lg">
            Discover courses from expert instructors
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
          />
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-lg transition flex flex-col"
            >
              <div className="h-40 bg-gradient-mint flex items-center justify-center">
                <div className="text-5xl">📖</div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-text-dark mb-2">
                  {course.title}
                </h3>

                <p className="text-text-gray text-sm mb-4 flex-1">
                  {course.description || 'No description available'}
                </p>

                <div className="space-y-3 text-sm text-text-gray mb-6">
                  <div className="flex items-center space-x-2">
                    <span>👨‍🏫</span>
                    <span>{course.instructor}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>⭐</span>
                    <span>{course.credits} Credits</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>👥</span>
                    <span>
                      {course.enrolled_count}/{course.capacity} Enrolled
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleEnroll(course.id)}
                  disabled={enrollingCourse === course.id}
                  className="w-full py-3 rounded-full bg-gradient-mint text-white font-semibold hover:shadow-lg transition disabled:opacity-50"
                >
                  {enrollingCourse === course.id ? 'Enrolling...' : 'Enroll Now'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-gray text-lg">
              No courses found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
