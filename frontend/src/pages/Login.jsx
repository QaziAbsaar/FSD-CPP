// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Loader } from 'lucide-react';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setUsername('john_doe');
    setPassword('student123');
  };

  return (
    <div className="min-h-screen pt-20 pb-12 flex items-center justify-center px-4 relative overflow-hidden bg-[#020617] text-white">
      
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-neon-purple/20 rounded-full blur-[100px] animate-float-delayed-1" />
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-neon-blue/20 rounded-full blur-[100px] animate-float-delayed-3" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-2xl shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.05 }}
              className="bg-gradient-to-br from-neon-blue to-neon-purple w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-neon-blue/30"
            >
              CH
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold text-white text-center mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-400 text-center mb-8">
              Sign in to manage your academic journey
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-300 ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full pl-11 pr-4 py-3 bg-[#0f172a] border border-white/10 rounded-xl focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue text-white placeholder-gray-600 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-300 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-[#0f172a] border border-white/10 rounded-xl focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue text-white placeholder-gray-600 transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 group hover:shadow-lg hover:shadow-neon-blue/25 transition-all"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-xs text-center text-gray-500 mb-4 uppercase tracking-wider font-semibold">
              Quick Access
            </p>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-medium hover:bg-white/10 hover:border-neon-blue/50 hover:text-neon-blue transition-all text-sm dashed"
            >
              Use Demo Account (John Doe)
            </button>
          </div>

          <p className="text-center text-gray-500 mt-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-neon-blue font-semibold hover:text-neon-purple transition-colors">
              Create Account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
