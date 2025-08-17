import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Edit3, Sun, Moon } from 'lucide-react';

type Theme = 'light' | 'dark';

const Landing = () => {
  // Initialize with light mode first, then update in useEffect
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Initialize theme after component mounts to avoid hydration issues
  useEffect(() => {
    const initializeTheme = () => {
      // Check if we're in the browser
      if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('theme') as Theme;
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const initialTheme = savedTheme || systemTheme;
        
        setTheme(initialTheme);
        setMounted(true);
      }
    };
    
    initializeTheme();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
  };

  // Apply theme to document
  useEffect(() => {
    if (mounted) {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      
      // Also update the class attribute directly as a fallback
      if (theme === 'dark') {
        root.setAttribute('class', 'dark');
      } else {
        root.removeAttribute('class');
      }
    }
  }, [theme, mounted]);



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 opacity-50" />
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-[float_6s_ease-in-out_infinite]" />
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite] delay-1000" />
      
      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">BLOGY</span>
        </div>
        
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 ring-2 ring-transparent hover:ring-gray-300 dark:hover:ring-gray-600"
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
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 animate-[float_4s_ease-in-out_infinite] transition-colors">
              Your Stories,
              <br />
              Your Voice
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed transition-colors">
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
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 transition-colors">Write & Publish</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors">Beautiful editor for crafting your stories</p>
            </div>
            
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-xl p-6 text-center group hover:scale-105 transition-all duration-300 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-4 h-4 text-purple-500" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 transition-colors">Discover</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors">Explore amazing stories from writers worldwide</p>
            </div>
            
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-xl p-6 text-center group hover:scale-105 transition-all duration-300 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <ArrowRight className="w-4 h-4 text-blue-500" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 transition-colors">Connect</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors">Build your audience and engage with readers</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl mt-20">
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-10">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">BLOGY</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-md transition-colors">
                Share your thoughts, connect with writers, and discover amazing content. Join our community of passionate storytellers and creative minds.
              </p>
              
              {/* Social Links */}
              <div className="flex gap-4 pt-4">
                <a 
                  href="https://leetcode.com/u/xoaadilll/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-orange-500/10 hover:bg-orange-500/20 rounded-lg flex items-center justify-center transition-all group"
                  title="LeetCode"
                >
                  <span className="text-orange-500 font-bold text-sm group-hover:scale-110 transition-transform">LC</span>
                </a>
                
                <a 
                  href="https://x.com/aaadil2004" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-500/10 hover:bg-gray-500/20 rounded-lg flex items-center justify-center transition-all group"
                  title="Twitter/X"
                >
                  <span className="text-gray-900 dark:text-white font-bold text-sm group-hover:scale-110 transition-transform">𝕏</span>
                </a>
                
                <a 
                  href="https://linkedin.com/in/aadil-siddiqui-88a014294" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg flex items-center justify-center transition-all group"
                  title="LinkedIn"
                >
                  <span className="text-blue-600 font-bold text-sm group-hover:scale-110 transition-transform">in</span>
                </a>
                
                <a 
                  href="mailto:aaadil2004@gmail.com"
                  className="w-10 h-10 bg-red-500/10 hover:bg-red-500/20 rounded-lg flex items-center justify-center transition-all group"
                  title="Email"
                >
                  <span className="text-red-500 font-bold text-sm group-hover:scale-110 transition-transform">@</span>
                </a>
              </div>
            </div>

            {/* Quick Links - Desktop */}
            <div className="hidden lg:block space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors">Quick Links</h3>
              <nav className="flex flex-col space-y-3">
                <Link to="/home" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  Home
                </Link>
                <Link to="/explore" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  Explore
                </Link>
                <Link to="/trending" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  Trending
                </Link>
                <Link to="/categories" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  Categories
                </Link>
              </nav>
            </div>
            
            {/* Support - Desktop */}
            <div className="hidden lg:block space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors">Support</h3>
              <nav className="flex flex-col space-y-3">
                <Link to="/help" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  Help Center
                </Link>
                <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  About Us
                </Link>
                <Link to="/contact" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  Contact
                </Link>
                <Link to="/feedback" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  Feedback
                </Link>
              </nav>
            </div>

            {/* Mobile Layout */}
            <div className="col-span-1 lg:hidden grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors">Quick Links</h3>
                <nav className="flex flex-col space-y-3">
                  <Link to="/home" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors text-sm">
                    Home
                  </Link>
                  <Link to="/explore" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors text-sm">
                    Explore
                  </Link>
                  <Link to="/trending" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors text-sm">
                    Trending
                  </Link>
                  <Link to="/categories" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors text-sm">
                    Categories
                  </Link>
                </nav>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors">Support</h3>
                <nav className="flex flex-col space-y-3">
                  <Link to="/help" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors text-sm">
                    Help Center
                  </Link>
                  <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors text-sm">
                    About Us
                  </Link>
                  <Link to="/contact" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors text-sm">
                    Contact
                  </Link>
                  <Link to="/feedback" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors text-sm">
                    Feedback
                  </Link>
                </nav>
              </div>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="border-t border-gray-200/30 dark:border-gray-700/30 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors">
                © 2025 BLOGY. All rights reserved.
              </p>
              
              <div className="flex flex-wrap gap-6 text-sm">
                <Link to="/privacy" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                  Terms of Service
                </Link>
                <Link to="/cookies" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>
            
            {/* Developer Credit */}
            <div className="mt-4 pt-4 border-t border-gray-200/20 dark:border-gray-700/20 text-center">
              <p className="text-xs text-gray-400 dark:text-gray-500 transition-colors">
                Crafted with ❤️ by Aadil Siddiqui
              </p>
            </div>
          </div>
        </div>
        
        {/* Subtle background decoration */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      </footer>
    </div>
  );
};

export default Landing;