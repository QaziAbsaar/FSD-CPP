// frontend/src/pages/Admin.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, BookOpen, Shield, Search, Plus, Trash2, Edit2, 
  Check, AlertCircle, Loader, Filter, X 
} from 'lucide-react';

export function Admin() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'courses'
  const [showCourseForm, setShowCourseForm] = useState(false);
  
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    credits: 3,
    capacity: 30,
    instructor_id: ''
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      setError('Access Denied: Admin privileges required');
      setLoading(false);
      return;
    }
    fetchUsers();
    fetchCourses();
  }, [user]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      setUsers(response.data.users || []);
      setError('');
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.error || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/courses`);
      setCourses(response.data.courses || []);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/courses`, courseForm);
      setSuccess('Course added successfully!');
      setCourses([...courses, response.data.course || response.data]);
      setCourseForm({ title: '', description: '', credits: 3, capacity: 30, instructor_id: '' });
      setShowCourseForm(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add course');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    // Implementation for delete would go here (API endpoint needed)
    alert('Delete functionality would be implemented here connecting to a DELETE endpoint.');
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-card max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
            <Shield size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-500">
            You do not have permission to access the admin panel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Manage users, courses, and system settings</p>
          </motion.div>
          
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'users' ? 'bg-neon-blue text-white shadow-sm' : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'courses' ? 'bg-neon-blue text-white shadow-sm' : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              Courses
            </button>
          </div>
        </div>

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-2"
            >
              <Check size={20} />
              {success}
            </motion.div>
          )}
           {error && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2"
            >
              <AlertCircle size={20} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {activeTab === 'users' ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
                    <Users size={24} />
                  </div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total</span>
                </div>
                <div className="text-3xl font-bold text-white">{users.length}</div>
                <div className="text-sm text-gray-400 mt-1">Active Accounts</div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-500/20 text-green-400 rounded-xl">
                    <BookOpen size={24} />
                  </div>
                   <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Students</span>
                </div>
                <div className="text-3xl font-bold text-white">{users.filter(u => u.role === 'student').length}</div>
                 <div className="text-sm text-gray-400 mt-1">Enrolled Learners</div>
              </div>

               <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl">
                    <Shield size={24} />
                  </div>
                   <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Teachers</span>
                </div>
                <div className="text-3xl font-bold text-white">{users.filter(u => u.role === 'teacher').length}</div>
                 <div className="text-sm text-gray-400 mt-1">Instructors</div>
              </div>
            </div>

            {/* Users Table Card */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
               <div className="p-6 border-b border-white/10 flex flex-col md:flex-row gap-4 justify-between items-center">
                 <h2 className="text-lg font-bold text-white">All Users</h2>
                 
                 <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text" 
                        placeholder="Search users..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none text-sm text-white placeholder-gray-500"
                      />
                    </div>
                    
                    <div className="relative">
                       <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                       <select 
                         value={filterRole}
                         onChange={(e) => setFilterRole(e.target.value)}
                         className="pl-10 pr-8 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none text-sm appearance-none text-white cursor-pointer"
                       >
                         <option value="all" className="bg-gray-900">All Roles</option>
                         <option value="student" className="bg-gray-900">Student</option>
                         <option value="teacher" className="bg-gray-900">Teacher</option>
                         <option value="admin" className="bg-gray-900">Admin</option>
                       </select>
                    </div>
                 </div>
               </div>

               <div className="overflow-x-auto">
                 <table className="w-full">
                   <thead className="bg-white/5 border-b border-white/10">
                     <tr>
                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</th>
                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Created</th>
                       <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-white/10">
                     {loading ? (
                       <tr>
                         <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                           <Loader className="w-6 h-6 animate-spin mx-auto mb-2 text-neon-blue" />
                           Loading users...
                         </td>
                       </tr>
                     ) : filteredUsers.length === 0 ? (
                       <tr>
                         <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                           No users found matching your search.
                         </td>
                       </tr>
                     ) : (
                       filteredUsers.map((u) => (
                         <tr key={u.id} className="hover:bg-white/5 transition-colors">
                           <td className="px-6 py-4">
                             <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-white font-bold shadow-sm">
                                 {u.username.charAt(0).toUpperCase()}
                               </div>
                               <div>
                                 <div className="font-medium text-white">{u.username}</div>
                                 <div className="text-xs text-gray-500">ID: {u.id}</div>
                               </div>
                             </div>
                           </td>
                           <td className="px-6 py-4">
                             <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                               u.role === 'admin' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                               u.role === 'teacher' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                               'bg-green-500/10 text-green-400 border-green-500/20'
                             }`}>
                               {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                             </span>
                           </td>
                           <td className="px-6 py-4 text-sm text-gray-400">{u.email}</td>
                           <td className="px-6 py-4 text-sm text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                           <td className="px-6 py-4 text-right">
                             <div className="flex items-center justify-end gap-2">
                               <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-neon-blue transition-colors" title="Edit">
                                 <Edit2 size={16} />
                               </button>
                               <button 
                                 onClick={() => handleDeleteUser(u.id)}
                                 className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors" 
                                 title="Delete"
                               >
                                 <Trash2 size={16} />
                               </button>
                             </div>
                           </td>
                         </tr>
                       ))
                     )}
                   </tbody>
                 </table>
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Courses Management</h2>
              <button
                onClick={() => setShowCourseForm(!showCourseForm)}
                className={`btn-primary flex items-center gap-2 ${showCourseForm ? 'bg-red-500 hover:bg-red-600 text-white' : ''}`}
                style={showCourseForm ? { background: '#ef4444' } : {}}
              >
                {showCourseForm ? <><X size={18} /> Cancel</> : <><Plus size={18} /> Add Course</>}
              </button>
            </div>

            <AnimatePresence>
              {showCourseForm && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg data-[closed]:border-transparent overflow-hidden mb-8"
                >
                  <div className="p-6 md:p-8">
                    <h3 className="text-xl font-bold text-white mb-6">Create New Course</h3>
                    <form onSubmit={handleAddCourse} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-sm font-medium text-gray-400 ml-1">Course Title</label>
                          <input
                            type="text"
                            required
                            value={courseForm.title}
                            onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                            placeholder="e.g., Advanced Python Programming"
                            className="w-full p-4 rounded-xl bg-[#0f172a] border border-white/10 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none text-white "
                          />
                        </div>

                        <div className="md:col-span-2 space-y-1">
                          <label className="text-sm font-medium text-gray-400 ml-1">Description</label>
                          <textarea
                            required
                            value={courseForm.description}
                            onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                            placeholder="Describe what students will learn..."
                            rows="3"
                            className="w-full p-4 rounded-xl bg-[#0f172a] border border-white/10 focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 outline-none transition-all resize-none text-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-sm font-medium text-gray-400 ml-1">Instructor</label>
                          <div className="relative">
                            <select
                              required
                              value={courseForm.instructor_id}
                              onChange={(e) => setCourseForm({ ...courseForm, instructor_id: e.target.value })}
                              className="w-full p-4 rounded-xl bg-[#0f172a] border border-white/10 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none appearance-none text-white"
                            >
                              <option value="" className="bg-gray-900">Select Instructor</option>
                              {users
                                .filter(u => u.role === 'teacher')
                                .map(teacher => (
                                  <option key={teacher.id} value={teacher.id} className="bg-gray-900">
                                    {teacher.username}
                                  </option>
                                ))}
                            </select>
                             <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                               ▼
                             </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-400 ml-1">Credits</label>
                            <input
                              type="number"
                              min="1"
                              max="10"
                              required
                              value={courseForm.credits}
                              onChange={(e) => setCourseForm({ ...courseForm, credits: parseInt(e.target.value) })}
                              className="w-full p-4 rounded-xl bg-[#0f172a] border border-white/10 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none text-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-400 ml-1">Capacity</label>
                            <input
                              type="number"
                              min="1"
                              max="1000"
                              required
                              value={courseForm.capacity}
                              onChange={(e) => setCourseForm({ ...courseForm, capacity: parseInt(e.target.value) })}
                              className="w-full p-4 rounded-xl bg-[#0f172a] border border-white/10 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none text-white"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <button
                          type="submit"
                          className="bg-neon-blue hover:bg-neon-purple text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all"
                        >
                          <Plus size={18} /> Create Course
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <motion.div
                  key={course.id}
                  layout 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all"
                >
                  <div className="p-6">
                     <div className="flex justify-between items-start mb-4">
                       <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold">
                          {course.title.charAt(0)}
                       </div>
                       <div className="text-xs font-bold text-gray-500 bg-white/5 px-2 py-1 rounded-lg">ID: {course.id}</div>
                     </div>
                     
                     <h3 className="text-lg font-bold text-white mb-2 line-clamp-1" title={course.title}>{course.title}</h3>
                     <p className="text-gray-400 text-sm mb-4 line-clamp-2 h-10">{course.description}</p>
                     
                     <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mb-6">
                       <span className="flex items-center gap-1"><Shield size={12} /> {course.credits} Credits</span>
                       <span className="flex items-center gap-1"><Users size={12} /> {course.capacity} Cap</span>
                     </div>
                     
                     <div className="flex gap-2">
                       <button className="flex-1 py-2 rounded-lg bg-white/5 text-gray-400 text-sm font-semibold hover:bg-white/10 hover:text-white transition">
                         Edit
                       </button>
                       <button className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition">
                         <Trash2 size={18} />
                       </button>
                     </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
