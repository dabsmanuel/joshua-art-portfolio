'use client'

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { X, Feather } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  isScrolled: boolean;
}

const Header: React.FC<HeaderProps> = ({ isScrolled }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Define navigation items with their corresponding routes
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Work', path: '/work' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const handleNavClick = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Mouse move effect for floating elements - moved before conditional return
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Hide header on admin routes - moved after all hooks
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 bg-gradient-to-br from-slate-900/95 via-gray-900/95 to-black/95 backdrop-blur-sm ${
        isScrolled ? 'shadow-xl border-b border-gray-600/30' : ''
      }`}>
        {/* Artistic Background Elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-5 left-5 w-32 h-32 border border-gray-600 rounded-full animate-pulse"></div>
          <div className="absolute top-10 right-10 w-24 h-24 border border-gray-700 rounded-full animate-pulse delay-500"></div>
        </div>

        {/* Floating Artistic Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute w-1 h-1 bg-amber-400 rounded-full opacity-50 transition-all duration-1000 ease-out"
            style={{ left: mousePosition.x * 0.05 + 50, top: mousePosition.y * 0.05 + 20 }}
          ></div>
          <div
            className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-40 transition-all duration-1500 ease-out"
            style={{ left: mousePosition.x * 0.03 + 100, top: mousePosition.y * 0.03 + 30 }}
          ></div>
        </div>

        <nav className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-center py-2">
            {/* Logo with hover effect */}
            <div className="relative group cursor-pointer">
              <Feather className="absolute -top-2 -left-2 w-5 h-5 text-amber-400 animate-pulse" />
              <div className="text-2xl font-light font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-blue-200 tracking-wider transition-all duration-300 group-hover:scale-105">
                <Link href='/'>
                  Joshua Otuonye
                </Link>
              </div>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-blue-400 transition-all duration-500 group-hover:w-full"></div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.path)}
                  className="relative px-4 py-2 text-gray-300 hover:text-amber-400 font-light font-serif transition-all duration-300 group rounded-lg hover:bg-gray-800/50"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {item.name}
                  <span className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-blue-400 transition-all duration-300 group-hover:w-3/4 transform -translate-x-1/2 rounded-full"></span>
                </button>
              ))}
            </div>

            {/* Mobile Menu Button with animation */}
            <button
              className="md:hidden relative p-3 rounded-lg hover:bg-gray-800/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <div className="relative w-6 h-6">
                <span className={`absolute top-1/2 left-1/2 w-6 h-0.5 bg-gray-300 transform transition-all duration-300 ${
                  isMobileMenuOpen 
                    ? 'rotate-45 -translate-x-1/2 -translate-y-1/2' 
                    : 'rotate-0 -translate-x-1/2 -translate-y-2'
                }`}></span>
                <span className={`absolute top-1/2 left-1/2 w-6 h-0.5 bg-gray-300 transform transition-all duration-300 ${
                  isMobileMenuOpen 
                    ? 'opacity-0 scale-0' 
                    : 'opacity-100 scale-100 -translate-x-1/2 -translate-y-1/2'
                }`}></span>
                <span className={`absolute top-1/2 left-1/2 w-6 h-0.5 bg-gray-300 transform transition-all duration-300 ${
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
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={toggleMobileMenu}
        ></div>
        
        {/* Mobile Menu Panel */}
        <div className={`absolute top-0 right-0 w-80 h-full bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-sm shadow-2xl transform transition-all duration-500 ease-out border-l border-gray-600/30 ${
          isMobileMenuOpen 
            ? 'translate-x-0' 
            : 'translate-x-full'
        }`}>
          {/* Mobile Menu Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-600/30">
            <div className="text-lg font-light font-serif text-gray-300">Menu</div>
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
              aria-label="Close menu"
            >
              <X size={24} className="text-gray-300 hover:text-amber-400" />
            </button>
          </div>
          
          {/* Mobile Navigation Items */}
          <div className="p-6 space-y-2">
            {navItems.map((item, index) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.path)}
                className={`block w-full text-left p-4 text-gray-300 hover:text-amber-400 font-light font-serif rounded-xl hover:bg-gray-700/50 transition-all duration-300 transform ${
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
                  <div className="w-2 h-2 rounded-full bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </div>
              </button>
            ))}
          </div>
          
          {/* Mobile Menu Footer */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="text-center text-sm text-gray-400 font-light border-t border-gray-600/30 pt-6 flex items-center justify-center space-x-2">
              <Feather className="w-4 h-4 text-amber-400" />
              <span>© {new Date().getFullYear()} Joshua Otuonye</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;