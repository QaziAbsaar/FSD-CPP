// frontend/src/components/Hero.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Hero = () => {
  const { isAuthenticated } = useAuth();
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section 
      ref={heroRef}
      className="bg-white min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Enhanced Background with Subtle Gradients */}
      <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
        {/* Animated Gradient Orbs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-transparent rounded-full blur-3xl animate-float" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-gradient-to-br from-emerald-200/20 to-transparent rounded-full blur-3xl animate-float" style={{ animationDuration: '10s', animationDelay: '1s' }}></div>
        <div className="absolute -bottom-40 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-transparent rounded-full blur-3xl animate-float" style={{ animationDuration: '12s', animationDelay: '2s' }}></div>
        
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center min-h-[600px] md:min-h-[700px]">
          
          {/* Left Column - Text Content */}
          <div className="space-y-8 pt-8 md:pt-0" style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold text-slate-700">Welcome to Campus Hub</span>
            </div>

            {/* Main Heading - High Contrast */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-tight tracking-tight animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                Learn{' '}
                <span className="bg-gradient-to-r from-blue-600 via-emerald-500 to-purple-600 bg-clip-text text-transparent font-black animate-text-shimmer inline-block">
                  Without
                </span>
                <br />
                <span className="text-slate-900">Limits</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 font-medium animate-fade-in-up max-w-2xl leading-relaxed" style={{ animationDelay: '0.4s' }}>
                Empower your future with expert-led courses designed for real-world success
              </p>
            </div>

            {/* Description */}
            <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-xl animate-fade-in-up font-normal" style={{ animationDelay: '0.5s' }}>
              Join thousands of students unlocking their potential. From beginner to expert, find your path to success.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="group relative px-8 md:px-10 py-4 md:py-5 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-bold rounded-xl md:rounded-2xl text-center overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Go to Dashboard
                      <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                  <Link
                    to="/courses"
                    className="group relative px-8 md:px-10 py-4 md:py-5 border-2 border-blue-600 text-blue-600 font-bold rounded-xl md:rounded-2xl text-center hover:bg-blue-600 hover:text-white transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 bg-white"
                  >
                    Browse Courses
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="group relative px-8 md:px-10 py-4 md:py-5 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-bold rounded-xl md:rounded-2xl text-center overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Get Started Free
                      <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                  <Link
                    to="/login"
                    className="group relative px-8 md:px-10 py-4 md:py-5 border-2 border-blue-600 text-blue-600 font-bold rounded-xl md:rounded-2xl text-center hover:bg-blue-600 hover:text-white transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 bg-white"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Stats - Enhanced */}
            <div className="pt-8 grid grid-cols-3 gap-4 md:gap-6 animate-fade-in-up border-t border-slate-200 pt-8" style={{ animationDelay: '0.7s' }}>
              {[
                { number: '7.5K+', label: 'Students', icon: '👥' },
                { number: '150+', label: 'Courses', icon: '📚' },
                { number: '95%', label: 'Satisfaction', icon: '⭐' }
              ].map((stat, idx) => (
                <div 
                  key={idx}
                  className="group p-3 md:p-4 bg-white rounded-lg md:rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer hover:bg-gradient-to-br hover:from-blue-50 hover:to-emerald-50"
                >
                  <div className="text-2xl md:text-3xl mb-2 group-hover:scale-125 transition-transform">{stat.icon}</div>
                  <p className="font-black text-lg md:text-xl bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                    {stat.number}
                  </p>
                  <p className="text-xs md:text-sm text-slate-600 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Visual Element with Enhanced Cards */}
          <div className="relative h-96 md:h-[600px] lg:h-full flex items-center justify-center" style={{
            perspective: '1000px',
          }}>
            {/* Animated Central Element */}
            <div 
              className="absolute w-64 h-64 md:w-80 md:h-80 rounded-3xl bg-gradient-to-br from-blue-100 to-emerald-100 border-2 border-blue-200 shadow-2xl flex items-center justify-center animate-float"
              style={{
                transform: `translateY(${scrollY * 0.08}px) rotateX(${mousePosition.y * 5}deg) rotateY(${mousePosition.x * 5}deg)`,
                transition: 'transform 0.3s ease-out'
              }}
            >
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-black animate-pulse">
                  🎓
                </div>
                <p className="text-sm md:text-base text-slate-700 font-semibold mt-4">Start Learning Now</p>
              </div>
            </div>

            {/* Enhanced Floating Cards - Premium Style */}
            <div 
              className="absolute top-8 right-0 md:top-0 md:right-8 w-56 md:w-64 p-5 md:p-6 bg-white rounded-2xl shadow-2xl border border-slate-100 hover:shadow-3xl hover:border-blue-200 transition-all duration-500 hover:scale-110 cursor-pointer animate-float-delayed-1"
              style={{
                transform: `translateY(${scrollY * 0.04}px) translateX(${mousePosition.x * 10}px)`,
              }}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0 animate-bounce-glow">
                  👥
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">7.5K+</p>
                  <p className="text-sm text-slate-600 font-semibold">Active Learners</p>
                </div>
              </div>
            </div>

            <div 
              className="absolute bottom-24 md:bottom-12 left-4 md:left-0 w-56 md:w-64 p-5 md:p-6 bg-white rounded-2xl shadow-2xl border border-slate-100 hover:shadow-3xl hover:border-emerald-200 transition-all duration-500 hover:scale-110 cursor-pointer animate-float-delayed-2"
              style={{
                transform: `translateY(${scrollY * 0.06}px) translateX(${mousePosition.x * -8}px)`,
              }}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0 animate-bounce-glow" style={{ animationDelay: '0.2s' }}>
                  📚
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-black bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">150+</p>
                  <p className="text-sm text-slate-600 font-semibold">Expert Courses</p>
                </div>
              </div>
            </div>

            <div 
              className="absolute bottom-0 right-2 md:right-0 w-56 md:w-64 p-5 md:p-6 bg-white rounded-2xl shadow-2xl border border-slate-100 hover:shadow-3xl hover:border-purple-200 transition-all duration-500 hover:scale-110 cursor-pointer animate-float-delayed-3"
              style={{
                transform: `translateY(${scrollY * 0.1}px) translateX(${mousePosition.x * 5}px)`,
              }}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0 animate-bounce-glow" style={{ animationDelay: '0.4s' }}>
                  ⭐
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">95%</p>
                  <p className="text-sm text-slate-600 font-semibold">Satisfaction Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-slow z-20">
        <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-slate-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};
