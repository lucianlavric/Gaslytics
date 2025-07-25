import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Home, Archive, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/saved', icon: Archive, label: 'Saved' },
    { path: '/resources', icon: BookOpen, label: 'Resources' },
  ];

  return (
    <nav className="bg-white/10 backdrop-blur-2xl border-b border-white/10 shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/logo.png" 
              alt="Gaslytics Logo" 
              className="w-8 h-8 object-contain"
            />
            <span className="text-xl font-semibold text-slate-700">Gaslytics</span>
          </Link>
          
          <div className="flex space-x-6">
            {navItems.map(({ path, icon: Icon, label }) => (
              <motion.div
                key={path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    location.pathname === path
                      ? 'bg-sage-100 text-sage-700'
                      : 'text-slate-600 hover:text-sage-600 hover:bg-sage-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;