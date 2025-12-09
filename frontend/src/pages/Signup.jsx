// frontend/src/pages/Signup.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Lock, CheckCircle, ArrowRight, Loader, GraduationCap } from 'lucide-react';

export const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register(username, email, password, role);
      navigate('/dashboard');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 flex items-center justify-center px-4 relative overflow-hidden bg-[#020617] text-white">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[20%] w-[300px] h-[300px] bg-neon-purple/20 rounded-full blur-[80px] animate-float" />
        <div className="absolute bottom-[10%] left-[20%] w-[400px] h-[400px] bg-neon-blue/20 rounded-full blur-[100px] animate-float-delayed-2" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-2xl shadow-2xl">
          <div className="flex justify-center mb-8">
            <motion.div 
              whileHover={{ rotate: -10, scale: 1.05 }}
              className="bg-gradient-to-br from-neon-blue to-neon-purple w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-neon-blue/30"
            >
              CH
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold text-white text-center mb-2">
              Create Account
            </h1>
            <p className="text-gray-400 text-center mb-8">
              Join Campus Hub and start learning today
            </p>
          </motion.div>

          {error && (
             <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* Username */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-300 ml-1">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="john_doe"
                    className="w-full pl-11 pr-4 py-3 bg-[#0f172a] border border-white/10 rounded-xl focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue text-white placeholder-gray-600 transition-all"
                    required
                  />
                </div>
              </div>

               {/* Role */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-300 ml-1">Account Type</label>
                <div className="relative">
                  <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-[#0f172a] border border-white/10 rounded-xl focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue text-white appearance-none"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-300 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-[#0f172a] border border-white/10 rounded-xl focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue text-white placeholder-gray-600 transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* Password */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-300 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full pl-11 pr-4 py-3 bg-[#0f172a] border border-white/10 rounded-xl focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue text-white placeholder-gray-600 transition-all"
                    required
                  />
                </div>
              </div>

               {/* Confirm Password */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-300 ml-1">Confirm</label>
                <div className="relative">
                  <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full pl-11 pr-4 py-3 bg-[#0f172a] border border-white/10 rounded-xl focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue text-white placeholder-gray-600 transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 mt-6 group hover:shadow-lg hover:shadow-neon-blue/25 transition-all"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-neon-blue font-semibold hover:text-neon-purple transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
