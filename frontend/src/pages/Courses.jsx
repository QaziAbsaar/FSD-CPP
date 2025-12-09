// frontend/src/pages/Courses.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, User, Star, Users, Loader, Plus, Check } from 'lucide-react';

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
        const response = await axios.get(`${API_BASE_URL}/courses`);
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
      await axios.post(
        `${API_BASE_URL}/enrollments`,
        { course_id: courseId }
      );
      // Wait a bit to show success state
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to enroll';
      alert(errorMsg);
      setEnrollingCourse(null);
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <Loader className="w-10 h-10 text-neon-blue animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
           <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
           >
              <h1 className="text-4xl font-bold text-white mb-2">Explore Courses</h1>
              <p className="text-gray-400 text-lg">Discover new skills and passions</p>
           </motion.div>

           {/* Search */}
           <motion.div
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="relative w-full md:w-96"
           >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue text-white placeholder-gray-500 outline-none transition-all"
              />
           </motion.div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {filteredCourses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-gray-500" size={32} />
              </div>
              <p className="text-gray-500 text-lg">No courses found matching "{searchTerm}"</p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredCourses.map((course) => (
                <motion.div
                  key={course.id}
                  variants={itemVariants}
                  layoutId={`course-${course.id}`}
                  className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden group flex flex-col h-full hover:border-white/20 transition-all"
                >
                  <div className="h-48 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 relative overflow-hidden p-6 flex items-center justify-center">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-4xl shadow-lg border border-white/20"
                    >
                      📖
                    </motion.div>
                    
                    <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm border border-white/10">
                       {course.credits} Credits
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-neon-blue transition-colors line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-6 line-clamp-2 flex-1">
                      {course.description || 'No description available'}
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <User size={16} className="text-neon-blue" />
                        <span className="font-medium">{course.instructor}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <Users size={16} className="text-neon-purple" />
                        <span>{course.enrolled_count} / {course.capacity} Students</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleEnroll(course.id)}
                      disabled={enrollingCourse === course.id}
                      className="w-full bg-neon-blue hover:bg-neon-purple text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                    >
                      {enrollingCourse === course.id ? (
                        <>
                          <Loader className="animate-spin" size={18} />
                          Enrolling...
                        </>
                      ) : (
                        <>
                          <Plus size={18} />
                          Enroll Now
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
