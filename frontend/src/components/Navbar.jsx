// frontend/src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User as UserIcon, LogOut, LayoutDashboard, BookOpen, Shield, Settings } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    ...(isAuthenticated ? [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Courses', path: '/courses', icon: BookOpen },
    ] : []),
    ...(user?.role === 'admin' ? [
      { name: 'Admin', path: '/admin', icon: Shield },
    ] : []),
  ];

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/';
  // If we are on home + not scrolled, use dark/transparent theme styles
  const isTransparent = isHome && !scrolled;

  const textColorClass = 'text-white';
  const navBackgroundClass = isTransparent 
    ? 'bg-transparent border-transparent' 
    : 'bg-[#020617]/80 backdrop-blur-md border-white/10 shadow-sm';

  return (
    <nav className={`${isHome ? 'fixed' : 'sticky'} top-0 z-50 w-full transition-all duration-300 border-b ${navBackgroundClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg transition-transform group-hover:rotate-6 ${isTransparent ? 'bg-white/10 backdrop-blur text-white border border-white/20' : 'bg-gradient-mint text-white shadow-primary/30'}`}>
              CH
            </div>
            <span className={`text-xl font-bold tracking-tight ${textColorClass}`}>
              Campus<span className={isTransparent ? 'text-neon-blue' : 'text-primary'}>Hub</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.path 
                    ? (isTransparent ? 'text-neon-blue' : 'text-primary') 
                    : (isTransparent ? 'text-gray-300 hover:text-white' : 'text-gray-600')
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-3 focus:outline-none"
                >
                  <span className={`text-sm font-medium ${textColorClass}`}>{user?.username}</span>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-light p-0.5 shadow-md">
                    {user?.profile_picture_url ? (
                      <img
                        src={user.profile_picture_url}
                        alt={user?.username}
                        className="w-full h-full rounded-full object-cover border-2 border-white"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-primary font-bold">
                        {user?.username?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-[#020617] rounded-xl shadow-lg border border-white/10 py-1 overflow-hidden backdrop-blur-xl"
                      onMouseLeave={() => setShowProfileMenu(false)}
                    >
                      <Link
                        to={`/profile/${user?.id}`}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 flex items-center gap-2"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <Settings size={16} /> Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-2"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className={`text-sm font-medium transition-colors hover:text-primary ${textColorClass}`}>
                  Login
                </Link>
                <Link to="/signup" className="btn-primary flex items-center gap-2">
                   Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`${textColorClass} hover:text-primary transition-colors`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-[#020617] border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block text-base font-medium text-gray-400 hover:text-white"
                >
                  <div className="flex items-center gap-2">
                    {link.icon && <link.icon size={18} />}
                    {link.name}
                  </div>
                </Link>
              ))}
              
              <div className="border-t border-white/10 pt-4 mt-4">
                {isAuthenticated ? (
                  <>
                    <Link
                      to={`/profile/${user?.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 text-gray-300 mb-4"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {user?.username?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium">{user?.username}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full btn-secondary text-red-500 border-red-500/20 hover:bg-red-500/10"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="w-full btn-secondary text-center"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsOpen(false)}
                      className="w-full btn-primary text-center"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
