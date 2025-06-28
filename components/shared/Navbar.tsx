'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

interface HeaderProps {
  isScrolled: boolean;
}

const Header: React.FC<HeaderProps> = ({ isScrolled }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  // Define navigation items with their corresponding routes
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Work', path: '/work' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const handleNavClick = (path: string) => {
    // For Next.js client-side navigation
    router.push(path);
    
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-xl border-b border-gray-100' 
          : 'bg-white/90 backdrop-blur-md'
      }`}>
        <nav className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo with hover effect */}
            <div className="relative group cursor-pointer">
              <div className="text-2xl font-bold text-gray-900 tracking-tight transition-all duration-300 group-hover:text-gray-700">
                Joshua Otuonye
              </div>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-gray-600 to-gray-900 transition-all duration-500 group-hover:w-full"></div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.path)}
                  className="relative px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-all duration-300 group rounded-lg hover:bg-gray-50"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {item.name}
                  <span className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-gray-600 to-gray-900 transition-all duration-300 group-hover:w-3/4 transform -translate-x-1/2 rounded-full"></span>
                </button>
              ))}
            </div>

            {/* Mobile Menu Button with animation */}
            <button
              className="md:hidden relative p-3 rounded-lg hover:bg-gray-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <div className="relative w-6 h-6">
                <span className={`absolute top-1/2 left-1/2 w-6 h-0.5 bg-gray-700 transform transition-all duration-300 ${
                  isMobileMenuOpen 
                    ? 'rotate-45 -translate-x-1/2 -translate-y-1/2' 
                    : 'rotate-0 -translate-x-1/2 -translate-y-2'
                }`}></span>
                <span className={`absolute top-1/2 left-1/2 w-6 h-0.5 bg-gray-700 transform transition-all duration-300 ${
                  isMobileMenuOpen 
                    ? 'opacity-0 scale-0' 
                    : 'opacity-100 scale-100 -translate-x-1/2 -translate-y-1/2'
                }`}></span>
                <span className={`absolute top-1/2 left-1/2 w-6 h-0.5 bg-gray-700 transform transition-all duration-300 ${
                  isMobileMenuOpen 
                    ? '-rotate-45 -translate-x-1/2 -translate-y-1/2' 
                    : 'rotate-0 -translate-x-1/2 translate-y-1'
                }`}></span>
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
        isMobileMenuOpen 
          ? 'opacity-100 visible' 
          : 'opacity-0 invisible'
      }`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-all duration-300 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={toggleMobileMenu}
        ></div>
        
        {/* Mobile Menu Panel */}
        <div className={`absolute top-0 right-0 w-80 h-full bg-white/95 backdrop-blur-lg shadow-2xl transform transition-all duration-500 ease-out ${
          isMobileMenuOpen 
            ? 'translate-x-0' 
            : 'translate-x-full'
        }`}>
          {/* Mobile Menu Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <div className="text-lg font-semibold text-gray-900">Menu</div>
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label="Close menu"
            >
              <X size={24} className="text-gray-700" />
            </button>
          </div>
          
          {/* Mobile Navigation Items */}
          <div className="p-6 space-y-2">
            {navItems.map((item, index) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.path)}
                className={`block w-full text-left p-4 text-gray-700 hover:text-gray-900 font-medium rounded-xl hover:bg-gray-50 transition-all duration-300 transform ${
                  isMobileMenuOpen 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-4 opacity-0'
                }`}
                style={{ 
                  transitionDelay: isMobileMenuOpen ? `${index * 100 + 200}ms` : '0ms'
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{item.name}</span>
                  <div className="w-2 h-2 rounded-full bg-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </div>
              </button>
            ))}
          </div>
          
          {/* Mobile Menu Footer */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="text-center text-sm text-gray-500 border-t border-gray-200 pt-6">
              © {new Date().getFullYear()} Joshua Otuonye
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;