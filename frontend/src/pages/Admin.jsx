import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

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

  // Check if user is admin
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
      const response = await axios.get('http://localhost:5000/users', { withCredentials: true });
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
      const response = await axios.get('http://localhost:5000/courses', { withCredentials: true });
      setCourses(response.data.courses || []);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/courses', courseForm, { withCredentials: true });
      setSuccess('Course added successfully!');
      setCourses([...courses, response.data.course || response.data]);
      setCourseForm({ title: '', description: '', credits: 3, capacity: 30, instructor_id: '' });
      setShowCourseForm(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add course');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role) => {
    const roleStyles = {
      admin: 'bg-red-100 text-red-800',
      teacher: 'bg-blue-100 text-blue-800',
      student: 'bg-green-100 text-green-800'
    };
    return roleStyles[role] || 'bg-gray-100 text-gray-800';
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">
            {error || 'You do not have permission to access the admin panel.'}
          </p>
          <p className="text-gray-600 mt-2">Admin privileges are required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users and system settings</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'users'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Users Management
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'courses'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Courses Management
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
                <h3 className="text-gray-500 text-sm font-semibold uppercase">Total Users</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">{users.length}</p>
                <p className="text-gray-500 text-sm mt-2">Active accounts</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
                <h3 className="text-gray-500 text-sm font-semibold uppercase">Students</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {users.filter(u => u.role === 'student').length}
                </p>
                <p className="text-gray-500 text-sm mt-2">Enrolled students</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
                <h3 className="text-gray-500 text-sm font-semibold uppercase">Teachers</h3>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {users.filter(u => u.role === 'teacher').length}
                </p>
                <p className="text-gray-500 text-sm mt-2">Course instructors</p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{error}</p>
                <button
                  onClick={fetchUsers}
                  className="mt-2 text-red-600 hover:text-red-800 font-semibold underline"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Users Management Section */}
            <div className="bg-white rounded-xl shadow-lg">
              {/* Header with Search and Filter */}
              <div className="border-b border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">User Management</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Search Input */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by username or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
                  </div>

                  {/* Role Filter */}
                  <div>
                    <select
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Roles</option>
                      <option value="admin">Admin</option>
                      <option value="teacher">Teacher</option>
                      <option value="student">Student</option>
                    </select>
                  </div>
                </div>

                <p className="text-sm text-gray-500 mt-4">
                  Showing {filteredUsers.length} of {users.length} users
                </p>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <p className="mt-4 text-gray-600">Loading users...</p>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-gray-500 text-lg">No users found</p>
                    <p className="text-gray-400 mt-2">Try adjusting your search or filter</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Username
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Created At
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                                {u.username.charAt(0).toUpperCase()}
                              </div>
                              <span className="ml-3 font-medium text-slate-900">{u.username}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {u.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRoleBadge(u.role)}`}>
                              {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(u.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button className="text-blue-600 hover:text-blue-800 font-semibold mr-4">
                              View
                            </button>
                            <button className="text-orange-600 hover:text-orange-800 font-semibold mr-4">
                              Edit
                            </button>
                            <button className="text-red-600 hover:text-red-800 font-semibold">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Courses Tab */}
      {activeTab === 'courses' && (
        <div>
          {/* Add Course Button */}
          <button
            onClick={() => setShowCourseForm(!showCourseForm)}
            className="mb-6 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition"
          >
            {showCourseForm ? 'Cancel' : '+ Add New Course'}
          </button>

          {/* Add Course Form */}
          {showCourseForm && (
            <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Create New Course</h3>
              <form onSubmit={handleAddCourse} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                    placeholder="e.g., Advanced Python Programming"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    value={courseForm.description}
                    onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                    placeholder="Describe what students will learn..."
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Assign Teacher *
                  </label>
                  <select
                    required
                    value={courseForm.instructor_id}
                    onChange={(e) => setCourseForm({ ...courseForm, instructor_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">-- Select a Teacher --</option>
                    {users
                      .filter(u => u.role === 'teacher')
                      .map(teacher => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.username} ({teacher.email})
                        </option>
                      ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Credits *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="4"
                      required
                      value={courseForm.credits}
                      onChange={(e) => setCourseForm({ ...courseForm, credits: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Capacity *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      required
                      value={courseForm.capacity}
                      onChange={(e) => setCourseForm({ ...courseForm, capacity: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition"
                >
                  Create Course
                </button>
              </form>
            </div>
          )}

          {/* Courses List */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6">All Courses ({courses.length})</h3>
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin">
                  <div className="h-8 w-8 border-4 border-orange-500 border-r-transparent rounded-full"></div>
                </div>
                <p className="text-gray-600 mt-2">Loading courses...</p>
              </div>
            ) : courses.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No courses found. Create your first course!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map((course) => (
                  <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <h4 className="font-bold text-gray-900 mb-2">{course.title}</h4>
                    <p className="text-gray-600 text-sm mb-3">{course.description}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        <strong>Credits:</strong> {course.credits}
                      </span>
                      <span className="text-gray-700">
                        <strong>Capacity:</strong> {course.capacity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">System Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Admin Account</h4>
              <p className="text-gray-600">Username: <span className="font-mono font-semibold">admin</span></p>
              <p className="text-gray-600">Email: <span className="font-mono font-semibold">admin@campus.edu</span></p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Quick Stats</h4>
              <p className="text-gray-600">Total System Users: <span className="font-semibold">{users.length}</span></p>
              <p className="text-gray-600">Last Updated: <span className="font-semibold">{new Date().toLocaleString()}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
