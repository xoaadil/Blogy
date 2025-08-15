import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Edit3, Sun, Moon } from 'lucide-react';

type Theme = 'light' | 'dark';

const Landing = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first, then system preference
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) return savedTheme;
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 opacity-50" />
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-[float_6s_ease-in-out_infinite]" />
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite]" style={{ animationDelay: '1s' }} />
      
      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">BlogCraft</span>
        </div>
        
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          <div className="relative w-6 h-6">
            <Sun 
              className={`absolute inset-0 w-6 h-6 text-amber-500 transition-all duration-300 ${
                theme === 'light' 
                  ? 'rotate-0 scale-100 opacity-100' 
                  : 'rotate-90 scale-0 opacity-0'
              }`}
            />
            <Moon 
              className={`absolute inset-0 w-6 h-6 text-blue-400 transition-all duration-300 ${
                theme === 'dark' 
                  ? 'rotate-0 scale-100 opacity-100' 
                  : '-rotate-90 scale-0 opacity-0'
              }`}
            />
          </div>
        </button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center px-6 py-12">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Headline */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 animate-[float_4s_ease-in-out_infinite]">
              Your Stories,
              <br />
              Your Voice
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Join a community of passionate writers and share your unique perspective with the world.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link 
              to="/login" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all group flex items-center gap-3 min-w-[200px] justify-center"
            >
              <Edit3 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Login
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              to="/signup" 
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all group flex items-center gap-3 min-w-[200px] justify-center border border-gray-200 dark:border-gray-700"
            >
              Sign Up
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              to="/home" 
              className="bg-transparent text-gray-900 dark:text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-all group flex items-center gap-3 min-w-[200px] justify-center border border-gray-300 dark:border-gray-600"
            >
              Continue Without Login
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-xl p-6 text-center group hover:scale-105 transition-all duration-300 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Edit3 className="w-4 h-4 text-blue-500" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Write & Publish</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Beautiful editor for crafting your stories</p>
            </div>
            
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-xl p-6 text-center group hover:scale-105 transition-all duration-300 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-4 h-4 text-purple-500" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Discover</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Explore amazing stories from writers worldwide</p>
            </div>
            
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-xl p-6 text-center group hover:scale-105 transition-all duration-300 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <ArrowRight className="w-4 h-4 text-blue-500" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Connect</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Build your audience and engage with readers</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;