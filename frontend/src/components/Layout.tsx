import  {  useState, useEffect, useRef } from "react";
import React, { type ReactNode } from "react";
import { Plus, User, LogOut, Settings, ChevronDown,BookOpen ,Menu, X, Search } from "lucide-react";



interface LayoutProps {
  children: ReactNode;
}


interface User {
  _id: string;
  name: string;
  role: string;
}

export const Header = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for token and user data in localStorage
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileMenu]);

  const handleNewPost = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    } else {
      window.location.href = "/createpost";
    }
    setShowMobileMenu(false);
  };

  const handleProfileClick = () => {
    if (user) {
      window.location.href = `/profile/${user._id}`;
    }
    setShowMobileMenu(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
    setShowMobileMenu(false);
  };

  const handleSettings = () => {
    window.location.href = "/settings";
    setShowMobileMenu(false);
  };

  const handleLogoClick = () => {
    window.location.href = "/";
    setShowMobileMenu(false);
  };

  const handleNavigation = (path: string) => {
    window.location.href = path;
    setShowMobileMenu(false);
  };

  return (
    <>
      <header className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg' 
          : 'bg-white/20 dark:bg-gray-900/20 backdrop-blur-sm border-b border-gray-200/30 dark:border-gray-700/30'
        }
      `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            
            {/* Logo */}
            <div 
              onClick={handleLogoClick}
              className="cursor-pointer flex items-center gap-3 hover:opacity-80 transition-all duration-200 group"
            >
              <div className="w-9 h-9 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
                <BookOpen className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                BLOGY
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              {/* Navigation Links */}
              <nav className="flex items-center gap-1">
                <button
                  onClick={() => handleNavigation("/")}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 font-medium"
                >
                  Home
                </button>
                <button
                  onClick={() => handleNavigation("/explore")}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 font-medium"
                >
                  Explore
                </button>
                <button
                  onClick={() => handleNavigation("/trending")}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 font-medium"
                >
                  Trending
                </button>
              </nav>

              {/* Search Button */}
              <button className="p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200">
                <Search className="w-5 h-5" />
              </button>

              {/* New Post Button */}
              <button
                onClick={handleNewPost}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-4 h-4" />
                New Post
              </button>

              {/* User Section */}
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-md"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-semibold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium hidden xl:inline">{user.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Desktop Dropdown */}
                  {showDropdown && (
                    <div className="absolute right-0 top-full mt-3 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                      {/* User Info */}
                      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                        <p className="text-gray-900 dark:text-white font-semibold">{user.name}</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm capitalize">{user.role}</p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <button
                          onClick={() => {
                            handleProfileClick();
                            setShowDropdown(false);
                          }}
                          className="w-full flex items-center gap-3 px-6 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                        >
                          <User className="w-5 h-5" />
                          View Profile
                        </button>
                        
                        <button
                          onClick={() => {
                            handleSettings();
                            setShowDropdown(false);
                          }}
                          className="w-full flex items-center gap-3 px-6 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                        >
                          <Settings className="w-5 h-5" />
                          Settings
                        </button>
                        
                        <hr className="my-2 border-gray-200 dark:border-gray-700" />
                        
                        <button
                          onClick={() => {
                            handleLogout();
                            setShowDropdown(false);
                          }}
                          className="w-full flex items-center gap-3 px-6 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                        >
                          <LogOut className="w-5 h-5" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleNavigation("/login")}
                    className="px-5 py-2.5 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 font-medium"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handleNavigation("/signup")}
                    className="px-5 py-2.5 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-3">
              {/* Mobile New Post Button */}
              <button
                onClick={handleNewPost}
                className="p-2.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Plus className="w-5 h-5" />
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2.5 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
              >
                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300" />
          <div 
            ref={mobileMenuRef}
            className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-2xl animate-in slide-in-from-right duration-300"
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">BLOGY</span>
              </div>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Menu Content */}
            <div className="flex flex-col h-full">
              <div className="flex-1 py-6">
                {/* User Section */}
                {user && (
                  <div className="px-6 mb-6">
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-gray-900 dark:text-white font-semibold">{user.name}</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm capitalize">{user.role}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Links */}
                <nav className="px-6 space-y-2">
                  <button
                    onClick={() => handleNavigation("/")}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 text-left"
                  >
                    Home
                  </button>
                  <button
                    onClick={() => handleNavigation("/explore")}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 text-left"
                  >
                    Explore
                  </button>
                  <button
                    onClick={() => handleNavigation("/trending")}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 text-left"
                  >
                    Trending
                  </button>

                  <hr className="my-4 border-gray-200 dark:border-gray-700" />

                  {user ? (
                    <>
                      <button
                        onClick={handleProfileClick}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 text-left"
                      >
                        <User className="w-5 h-5" />
                        View Profile
                      </button>
                      <button
                        onClick={handleSettings}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 text-left"
                      >
                        <Settings className="w-5 h-5" />
                        Settings
                      </button>
                         <button
                          onClick={() => {
                            handleLogout();
                            setShowDropdown(false);
                          }}
                          className="w-full flex items-center gap-3 px-6 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                        >
                          <LogOut className="w-5 h-5" />
                          Logout
                        </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleNavigation("/login")}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 text-left"
                      >
                        Login
                      </button>
                      <button
                        onClick={() => handleNavigation("/signup")}
                        className="w-full flex items-center gap-3 px-4 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 rounded-xl transition-all duration-200 text-left font-semibold"
                      >
                        Sign Up
                      </button>
                    </>
                  )}
                </nav>
              </div>

              {/* Mobile Menu Footer */}
              {user && (
                <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 font-medium"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Spacer to prevent content from being hidden under fixed header */}
      <div className="h-16 lg:h-18" />
    </>
  );
};

// Footer Component
export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
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
                <a href="/home" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors text-sm">
                  Home
                </a>
                <a href="/explore" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors text-sm">
                  Explore
                </a>
                <a href="/trending" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors text-sm">
                  Trending
                </a>
                <a href="/categories" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors text-sm">
                  Categories
                </a>
              </nav>
            </div>
            
            {/* Support */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Support</h3>
              <nav className="flex flex-col space-y-3">
                <a href="/help" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors text-sm">
                  Help Center
                </a>
                <a href="/about" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors text-sm">
                  About Us
                </a>
                <a href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors text-sm">
                  Contact
                </a>
                <a href="/feedback" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors text-sm">
                  Feedback
                </a>
              </nav>
            </div>
          </div>

          {/* Desktop Layout - Separate columns */}
          {/* Quick Links - Desktop */}
          <div className="hidden lg:block space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Links</h3>
            <nav className="flex flex-col space-y-3">
              <a href="/home" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                Home
              </a>
              <a href="/explore" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                Explore
              </a>
              <a href="/trending" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                Trending
              </a>
              <a href="/categories" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                Categories
              </a>
            </nav>
          </div>
          
          {/* Support - Desktop */}
          <div className="hidden lg:block space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Support</h3>
            <nav className="flex flex-col space-y-3">
              <a href="/help" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                Help Center
              </a>
              <a href="/about" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                About Us
              </a>
              <a href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                Contact
              </a>
              <a href="/feedback" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                Feedback
              </a>
            </nav>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-gray-200/30 dark:border-gray-700/30 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © {currentYear} BLOGY. All rights reserved.
            </p>
            
            <div className="flex flex-wrap gap-6 text-sm">
              <a href="/privacy" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                Terms of Service
              </a>
              <a href="/cookies" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                Cookie Policy
              </a>
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
  );
};

// Demo Layout Component to show how to use Header and Footer
export default function Layout({ children }: LayoutProps) {
  // Mock user data for demonstration
//   const mockUser = {
//     _id: "user123",
//     name: "John Doe",
//     role: "user"
//   };

  // Simulate logged in state
  React.useEffect(() => {
    // Uncomment these lines to test logged in state
    // localStorage.setItem("token", "mock-token");
    // localStorage.setItem("user", JSON.stringify(mockUser));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <Header />
      
      <main className="flex-1">{children}</main>
      {/* Footer */}
      <Footer />
    </div>
  );
}