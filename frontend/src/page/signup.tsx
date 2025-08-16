import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Edit3, Sun, Moon } from 'lucide-react';

type Theme = 'light' | 'dark';

interface userinfo{
  _id : string;
  name : string;
  role : string
}
interface signupinfo {
  message: string;
  success: boolean;
  user: userinfo;
  token: string;
}

export default function Signup() {

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

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [loding, setLoding] = useState<boolean>(false);
  const [admincode, setAdmincode] = useState<string>("");
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({ show: false, message: '', type: 'info' });

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'info' });
    }, 4000);
  };

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // If token exists, redirect to home immediately
      window.location.href = "/home";
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoding(true);
    
    // Basic validation
    if (!name || !email || !password) {
      showNotification("Please fill in all required fields!", 'error');
      setLoding(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/Signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, admincode }),
      });
      const data: signupinfo = await res.json();
      if(data.success){
        localStorage.setItem("token",data.token);
  const User = {
    _id: data.user._id,
     name: data.user.name,
   role: data.user.role
  };
        localStorage.setItem("user", JSON.stringify(User));
        showNotification("Account created successfully! Redirecting...", 'success');
        // Navigate to /home on success
        setTimeout(() => {
          window.location.href = "/home";
        }, 1500);
      } else {
        showNotification(data.message || "Something went wrong!", 'error');
      }
      console.log("Success:", data);
    } catch (err: unknown) {
      showNotification("Network error! Please try again.", 'error');
      console.log("Error", err);
    } finally {
      setLoding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 opacity-50" />
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-[float_6s_ease-in-out_infinite]" />
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite]" style={{ animationDelay: '1s' }} />
      
      {/* Custom Notification */}
      {notification.show && (
        <div className={`fixed top-4 left-4 right-4 md:top-6 md:right-6 md:left-auto z-50 max-w-sm md:w-full transform transition-all duration-300 ease-out ${
          notification.show ? 'translate-y-0 md:translate-x-0 opacity-100' : '-translate-y-full md:translate-y-0 md:translate-x-full opacity-0'
        }`}>
          <div className={`p-3 md:p-4 rounded-lg shadow-lg backdrop-blur-sm border mx-auto md:mx-0 ${
            notification.type === 'success' 
              ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-100' 
              : notification.type === 'error'
              ? 'bg-red-500/20 border-red-500/30 text-red-100'
              : 'bg-blue-500/20 border-blue-500/30 text-blue-100'
          }`}>
            <div className="flex items-center gap-2 md:gap-3">
              {notification.type === 'success' && (
                <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {notification.type === 'error' && (
                <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {notification.type === 'info' && (
                <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <p className="text-xs md:text-sm font-medium">{notification.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">BLOGY</span>
        </Link>
        
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
        <div className="w-full max-w-md">
          {/* Form Container */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h2>
              <p className="text-gray-600 dark:text-gray-300">Join our community of passionate writers</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setName(e.target.value)
                  }
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                />
              </div>

              {/* Admin Code Field */}
              <div className="space-y-2">
                <label htmlFor="admincode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Admin Code <span className="text-gray-500 dark:text-gray-400">(Optional)</span>
                </label>
                <input
                  id="admincode"
                  type="text"
                  className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter admin code if applicable"
                  value={admincode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setAdmincode(e.target.value)
                  }
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loding}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              >
                {loding ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </div>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Edit3 className="w-5 h-5" />
                    Create Account
                  </span>
                )}
              </button>

              {/* Login Link */}
              <div className="text-center pt-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Already have an account?{" "}
                  <Link to="/login" className="text-blue-500 hover:text-blue-400 font-medium transition-colors duration-200">
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
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
                <span className="text-2xl font-bold text-gray-900 dark:text-white">BLOGY</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-md">
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

            {/* Links Section - Mobile side by side, Desktop separate columns */}
            <div className="col-span-1 lg:hidden grid grid-cols-2 gap-8">
              {/* Quick Links */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Links</h3>
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
              
              {/* Support */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Support</h3>
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

            {/* Desktop Layout - Separate columns */}
            {/* Quick Links - Desktop */}
            <div className="hidden lg:block space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Links</h3>
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Support</h3>
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
          </div>
          
          {/* Bottom Section */}
          <div className="border-t border-gray-200/30 dark:border-gray-700/30 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
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
              <p className="text-xs text-gray-400 dark:text-gray-500">
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
}