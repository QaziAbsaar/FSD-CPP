// frontend/src/pages/Home.jsx
import React from 'react';
import { Hero } from '../components/Hero';
import { motion } from 'framer-motion';
import { GraduationCap, Smartphone, Award, ArrowRight, CheckCircle2, Zap, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: GraduationCap,
    title: 'Expert Instructors',
    description: 'Learn from industry titans and academic legends. Real-world experience delivered directly to you.',
    color: 'text-neon-blue',
    bg: 'bg-neon-blue/10',
    border: 'border-neon-blue/20',
    delay: 0.1
  },
  {
    icon: Smartphone,
    title: 'Adaptive Learning',
    description: 'Our AI-driven platform adjusts to your pace. Learn anytime, anywhere, on any device.',
    color: 'text-neon-purple',
    bg: 'bg-neon-purple/10',
    border: 'border-neon-purple/20',
    delay: 0.2
  },
  {
    icon: Award,
    title: 'Global Certification',
    description: 'Earn recognized credentials that validate your mastery and boost your professional portfolio.',
    color: 'text-green-400',
    bg: 'bg-green-400/10',
    border: 'border-green-400/20',
    delay: 0.3
  }
];

export const Home = () => {
  return (
    <div className="bg-[#020617] min-h-screen text-white overflow-x-hidden selection:bg-neon-purple/30">
      <Hero />
      
      {/* Features Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#020617]" />
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-radial from-neon-purple/20 to-transparent opacity-40 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple drop-shadow-lg">Campus Hub</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
              Unlock your potential with a platform designed for the future of education.
            </p>
          </motion.div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className={`group relative bg-white/5 backdrop-blur-md rounded-[2rem] p-8 border border-white/10 hover:border-white/30 transition-all duration-300 overflow-hidden`}
              >
                {/* Internal Glow */}
                <div className={`absolute top-0 right-0 w-64 h-64 ${feature.bg} blur-[80px] opacity-0 group-hover:opacity-50 transition-opacity duration-500 rounded-full pointer-events-none -mr-32 -mt-32`} />
                
                <div className={`w-20 h-20 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-black/20`}>
                  <feature.icon size={40} strokeWidth={1.5} />
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-200 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed group-hover:text-gray-200 transition-colors">
                  {feature.description}
                </p>
                
                {/* Bottom line accent */}
                <div className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-700 bg-gradient-to-r from-transparent via-${feature.color.replace('text-', '')} to-transparent opacity-50`} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats/Social Proof Section */}
      <section className="py-20 border-y border-white/5 bg-white/[0.02] relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-blue/50 to-transparent opacity-50" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-neon-purple/50 to-transparent opacity-50" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
             {[
               { num: "50k+", label: "Active Learners" },
               { num: "200+", label: "Expert Mentors" },
               { num: "4.9", label: "Average Rating" },
               { num: "95%", label: "Success Rate" }
             ].map((stat, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, scale: 0.8 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.1 }}
                 className="relative group"
               >
                 <div className="text-5xl md:text-6xl font-bold text-white mb-2 tracking-tighter group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-b group-hover:from-white group-hover:to-gray-400 transition-all">
                   {stat.num}
                 </div>
                 <div className="text-sm font-semibold text-gray-500 uppercase tracking-widest group-hover:text-neon-blue transition-colors">{stat.label}</div>
                 
                 {/* Decorative dot */}
                 <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/10 hidden md:block last:hidden" />
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Redesigned */}
      <section className="py-32 relative overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-[600px] bg-gradient-radial from-neon-purple/10 via-neon-blue/5 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="group relative rounded-[3rem] p-12 md:p-24 overflow-hidden"
          >
             {/* Glass Container Background */}
             <div className="absolute inset-0 bg-[#0A0F1E] border border-white/10 rounded-[3rem] shadow-2xl shadow-neon-purple/10" />
             
             {/* Animated Gradient Border Effect */}
             <div className="absolute inset-0 opacity-20 bg-[conic-gradient(from_var(--shimmer-angle),theme(colors.slate.900),theme(colors.slate.100),theme(colors.slate.900))] animate-[spin_8s_linear_infinite]" />
             
             {/* Inner Content */}
             <div className="relative z-10 flex flex-col items-center">
               <motion.div 
                 initial={{ y: 20, opacity: 0 }}
                 whileInView={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.2 }}
                 className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-neon-blue mb-8 backdrop-blur"
               >
                 <Sparkles size={16} className="text-neon-purple" /> Limited Time Upgrade
               </motion.div>

               <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter text-white max-w-4xl mx-auto leading-[0.9]">
                 Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-white to-neon-purple">Transformation</span> Your Career?
               </h2>
               
               <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-light">
                  Don't just learn. Evolve. Join 50,000+ others who are shaping the future. Start your free trial today.
               </p>
               
               <div className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full max-w-md mx-auto">
                 <Link
                   to="/signup"
                   className="w-full sm:w-auto relative group/btn overflow-hidden rounded-full p-[1px]"
                 >
                   <div className="absolute inset-0 bg-gradient-to-r from-neon-blue to-neon-purple animate-spin-slow" />
                   <div className="relative bg-dark-bg h-full rounded-full flex items-center justify-center px-8 py-4 bg-gray-900 group-hover/btn:bg-gradient-to-r group-hover/btn:from-neon-blue group-hover/btn:to-neon-purple transition-all duration-300">
                      <span className="text-lg font-bold text-white flex items-center gap-2 group-hover/btn:scale-105 transition-transform">
                        Get Started Now <ArrowRight size={20} />
                      </span>
                   </div>
                 </Link>
                 
               </div>
               
               <p className="mt-8 text-sm text-gray-500 flex items-center gap-2">
                 <CheckCircle2 size={16} className="text-green-500" /> 14-day free trial, no credit card required.
               </p>
             </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
