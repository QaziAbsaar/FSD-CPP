// frontend/src/components/Hero.jsx
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, PlayCircle, Zap, Shield, Globe } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 50, damping: 20 }
  }
};

export const Hero = () => {
  const { isAuthenticated } = useAuth();
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  return (
    <section ref={targetRef} className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-dark-bg text-white">
      
      {/* Cosmic Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] bg-neon-purple/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-neon-blue/20 rounded-full blur-[100px] mix-blend-screen animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8 text-center lg:text-left"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-purple opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-purple"></span>
              </span>
              <span className="text-sm font-medium text-gray-300">New Era of Learning</span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9]">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">
                Discipline
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue">
                Creates
              </span>
              <span className="block text-white">
                Success.
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              Experience the future of education. Immersive courses, real-time collaboration, and global certification in a single cosmic platform.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-4">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="btn-glow px-8 py-4 text-lg font-semibold flex items-center justify-center gap-2 rounded-full"
                >
                  Enter Dashboard <ArrowRight size={20} />
                </Link>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="btn-glow px-8 py-4 text-lg font-semibold flex items-center justify-center gap-2 rounded-full"
                  >
                    Start Free Trial <ArrowRight size={20} />
                  </Link>
                  <Link
                    to="/courses"
                    className="px-8 py-4 text-lg font-semibold flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full backdrop-blur-sm transition-all text-white"
                  >
                    <PlayCircle size={20} /> Watch Demo
                  </Link>
                </>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="pt-10 flex items-center gap-8 justify-center lg:justify-start grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
               {/* Logos or trust indicators could go here */}
               <div className="flex items-center gap-2 text-sm font-semibold text-gray-500"><Globe size={16} /> Global Access</div>
               <div className="flex items-center gap-2 text-sm font-semibold text-gray-500"><Shield size={16} /> Secure Platform</div>
               <div className="flex items-center gap-2 text-sm font-semibold text-gray-500"><Zap size={16} /> Fast Learning</div>
            </motion.div>
          </motion.div>

          {/* Right Visual - 3D Mockup */}
          <motion.div
            style={{ opacity, scale, y }}
            initial={{ opacity: 0, rotateX: 20, rotateY: -20, rotateZ: 5 }}
            animate={{ 
              opacity: 1, 
              rotateX: [10, 5, 10], 
              rotateY: [-10, -5, -10],
              rotateZ: [2, 1, 2]
            }}
            transition={{ 
              duration: 1.5,
              rotateX: { duration: 8, repeat: Infinity, ease: "easeInOut" },
              rotateY: { duration: 10, repeat: Infinity, ease: "easeInOut" },
              rotateZ: { duration: 12, repeat: Infinity, ease: "easeInOut" }
            }}
            className="hidden lg:block relative perspective-1000"
          >
            {/* The Main Card Mockup */}
            <div className="relative w-full aspect-[4/3] bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden group">
              {/* Header Bar */}
              <div className="h-12 border-b border-white/5 flex items-center px-6 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <div className="ml-4 w-64 h-6 rounded-full bg-white/5 text-[10px] flex items-center px-3 text-gray-500 font-mono">
                  https://campushub.education/learning
                </div>
              </div>
              
              {/* Content Mockup */}
              <div className="p-8 grid grid-cols-12 gap-6 h-full">
                {/* Sidebar */}
                <div className="col-span-3 space-y-4">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="h-2 w-full bg-white/5 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s`}} />
                   ))}
                   <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-neon-purple/20 to-transparent border border-white/5">
                      <div className="h-8 w-8 rounded-lg bg-neon-purple/50 mb-2" />
                      <div className="h-2 w-16 bg-white/20 rounded-full" />
                   </div>
                </div>
                
                {/* Main Area */}
                <div className="col-span-9 space-y-6">
                   <div className="flex gap-4 mb-8">
                      <div className="h-32 w-1/2 rounded-2xl bg-gradient-to-br from-neon-blue/10 to-transparent border border-white/5 p-4 relative overflow-hidden group-hover:border-neon-blue/30 transition-colors">
                        <div className="absolute top-4 right-4 text-neon-blue"><Zap /></div>
                        <div className="absolute bottom-4 left-4 h-2 w-24 bg-neon-blue/30 rounded-full" />
                      </div>
                      <div className="h-32 w-1/2 rounded-2xl bg-gradient-to-br from-neon-purple/10 to-transparent border border-white/5 p-4 relative overflow-hidden group-hover:border-neon-purple/30 transition-colors">
                         <div className="absolute top-4 right-4 text-neon-purple"><Globe /></div>
                         <div className="absolute bottom-4 left-4 h-2 w-24 bg-neon-purple/30 rounded-full" />
                      </div>
                   </div>
                   
                   <div className="h-40 w-full rounded-2xl bg-white/5 border border-white/5 p-4">
                      <div className="flex items-end gap-2 h-full pb-2">
                        {[40, 70, 45, 90, 60, 80, 50, 85].map((h, i) => (
                          <div 
                             key={i} 
                             className="w-full bg-gradient-to-t from-neon-blue/50 to-neon-purple/50 rounded-t-sm" 
                             style={{ height: `${h}%`, opacity: 0.5 + (i/20) }} 
                          />
                        ))}
                      </div>
                   </div>
                </div>
              </div>

              {/* Reflection Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none" />
            
            </div>

            {/* Float Elements */}
            <motion.div 
               animate={{ y: [-10, 10, -10] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -right-8 -bottom-8 w-48 p-4 bg-gray-800/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl z-20"
            >
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
                   <Zap size={20} />
                 </div>
                 <div>
                   <p className="text-white text-sm font-bold">Course Completed</p>
                   <p className="text-gray-400 text-xs">+500 Points</p>
                 </div>
              </div>
            </motion.div>

          </motion.div>

        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-500 flex flex-col items-center gap-2"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-gray-500 to-transparent" />
      </motion.div>

      {/* Bottom Fade Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#020617] via-[#020617]/50 to-transparent z-10 pointer-events-none" />

    </section>
  );
};
