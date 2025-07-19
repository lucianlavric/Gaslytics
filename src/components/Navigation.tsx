import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Home, Archive, BookOpen } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/saved', icon: Archive, label: 'Saved' },
    { path: '/resources', icon: BookOpen, label: 'Resources' },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-amber-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-amber-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="text-xl font-semibold text-slate-700">Gasalytics</span>
          </Link>
          
          <div className="flex space-x-6">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
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
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;