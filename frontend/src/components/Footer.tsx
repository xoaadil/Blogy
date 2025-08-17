
import { BookOpen  } from "lucide-react";


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