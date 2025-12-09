// frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Shield, AlertCircle, Trash2, ArrowRight, Loader } from 'lucide-react';

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
        const response = await axios.get(`${API_BASE_URL}/enrollments/my-enrollments`);
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
      await axios.delete(`${API_BASE_URL}/enrollments/${enrollmentId}`);
      setEnrollments(enrollments.filter((e) => e.id !== enrollmentId));
    } catch (err) {
      setError('Failed to unenroll from course');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <Loader className="w-10 h-10 text-neon-blue animate-spin" />
      </div>
    );
  }

  const enrolledCount = enrollments.filter((e) => e.status === 'enrolled').length;
  const pendingCount = enrollments.filter((e) => e.status === 'pending').length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-gray-400 text-lg">
            Track your progress and manage your courses
          </p>
        </motion.div>

        {error && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center gap-2"
          >
            <AlertCircle size={20} />
            {error}
          </motion.div>
        )}

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-neon-blue/20 rounded-xl text-neon-blue">
                  <BookOpen size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-medium">Active Courses</p>
                  <p className="text-3xl font-bold text-white">{enrolledCount}</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500/20 rounded-xl text-orange-400">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-medium">Pending Enrollments</p>
                  <p className="text-3xl font-bold text-white">{pendingCount}</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-neon-purple/20 rounded-xl text-neon-purple">
                  <Shield size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-medium">Account Status</p>
                  <p className="text-3xl font-bold text-white capitalize">{user?.role}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Courses List */}
          <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
            <div className="px-6 py-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Current Enrollments</h2>
              <Link to="/courses" className="text-sm font-medium text-neon-blue hover:text-neon-purple transition-colors">
                Browse More
              </Link>
            </div>

            {enrollments.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                  <BookOpen size={24} />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">No courses yet</h3>
                <p className="text-gray-400 mb-6">Start your learning journey today</p>
                <Link
                  to="/courses"
                  className="bg-neon-blue hover:bg-neon-purple text-white px-6 py-2 rounded-xl transition-all inline-flex items-center gap-2 font-medium"
                >
                  Explore Courses <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                {enrollments.map((enrollment) => (
                  <motion.div
                    key={enrollment.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-6 hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between md:justify-start gap-4 mb-2">
                          <h3 className="text-lg font-bold text-white group-hover:text-neon-blue transition-colors">
                            {enrollment.course?.title}
                          </h3>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                              enrollment.status === 'enrolled'
                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                            }`}
                          >
                            {enrollment.status}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{enrollment.course?.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                          <span>By {enrollment.course?.instructor}</span>
                          <span className="w-1 h-1 bg-gray-600 rounded-full" />
                          <span>{enrollment.course?.credits} Credits</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleUnenroll(enrollment.id)}
                        className="px-4 py-2 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all text-sm font-medium flex items-center justify-center gap-2 border border-white/10 hover:border-red-500/20"
                      >
                        <Trash2 size={16} />
                        Unenroll
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
