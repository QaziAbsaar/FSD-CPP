// frontend/src/pages/Home.jsx
import React from 'react';
import { Hero } from '../components/Hero';

export const Home = () => {
  return (
    <div className="bg-white">
      <Hero />
      
      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-text-dark mb-4">
              Why Choose Campus Hub?
            </h2>
            <p className="text-lg text-text-gray max-w-2xl mx-auto">
              Designed for students seeking a seamless learning experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl p-8 shadow-card hover:shadow-lg transition">
              <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white text-2xl mb-4">
                🎓
              </div>
              <h3 className="text-xl font-bold text-text-dark mb-2">Expert Instructors</h3>
              <p className="text-text-gray">Learn from industry professionals and academic experts.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-white to-pink-50 rounded-2xl p-8 shadow-card hover:shadow-lg transition">
              <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center text-white text-2xl mb-4">
                📱
              </div>
              <h3 className="text-xl font-bold text-text-dark mb-2">Flexible Learning</h3>
              <p className="text-text-gray">Access courses anytime, anywhere on any device.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-8 shadow-card hover:shadow-lg transition">
              <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white text-2xl mb-4">
                🏆
              </div>
              <h3 className="text-xl font-bold text-text-dark mb-2">Certifications</h3>
              <p className="text-text-gray">Earn recognized certificates upon course completion.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-subtle">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-text-dark mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-lg text-text-gray mb-8">
            Join thousands of students already learning on Campus Hub
          </p>
          <a
            href="/signup"
            className="inline-block px-8 py-3 rounded-full bg-gradient-mint text-white font-semibold hover:shadow-lg transition"
          >
            Start Learning Today
          </a>
        </div>
      </section>
    </div>
  );
};
