'use client'

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { LuFacebook, LuInstagram } from "react-icons/lu";
import { FaXTwitter, FaTiktok } from "react-icons/fa6";


interface HeaderProps {
  isScrolled: boolean;
}

const Header: React.FC<HeaderProps> = ({ isScrolled }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHamburgerVisible, setIsHamburgerVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Work', path: '/work' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Exhibitions', path: '/exhibitions' }
  ];

  const socialLinks = [
    { icon: LuInstagram, label: 'Instagram', href: 'https://www.instagram.com/joc_arts?igsh=MXZ0NWw2eTE3bWc3dg%3D%3D&utm_source=qr' },
    { icon: LuFacebook, label: 'Facebook', href: 'https://www.facebook.com/share/1AYRhXUtQH/?mibextid=wwXIfr' },
    { icon: FaXTwitter, label: 'Twitter', href: 'https://x.com/skye_worldwide1?s=21' },
    { icon: FaTiktok, label: 'TikTok', href: 'https://www.tiktok.com/@skye_worldwide?_t=ZM-8xZpNt2GNZl&_r=1' }
  ];

  const handleNavClick = (path: string) => {
    router.push(path);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle scroll direction detection
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Only hide/show if we've scrolled more than 10px to avoid jitter
      if (Math.abs(currentScrollY - lastScrollY) < 10) return;
      
      if (currentScrollY < lastScrollY) {
        // Scrolling up - show hamburger
        setIsHamburgerVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and not at the very top - hide hamburger
        setIsHamburgerVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Hide header on admin routes
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/invoice')) {
    return null;
  }

  return (
    <>
      <div className={`fixed left-6 top-1/2 transform -translate-y-1/2 z-40 flex-col space-y-6 transition-all duration-500 hidden lg:flex ${
        isMenuOpen ? 'opacity-0 invisible translate-x-[-20px]' : isScrolled ? 'opacity-60 scale-90' : 'opacity-100 scale-100'
      }`}>
        {socialLinks.map((social) => {
          const IconComponent = social.icon;
          return (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-12 h-12  flex items-center justify-center rounded-full transition-all duration-500 hover:scale-110 hover:shadow-xl hover:border-gray-900 hover:bg-gray-900 hover:text-white ${
                isScrolled 
                  ? 'bg-white/80 backdrop-blur-md border border-gray-200/50 shadow-md' 
                  : 'bg-white border border-gray-200 shadow-lg'
              }`}
              aria-label={social.label}
            >
              <IconComponent className="w-6 h-6 " />
            </a>
          );
        })}
      </div>

      {/* Floating Hamburger Menu - Responsive to scroll and scroll direction */}
      <button
        onClick={toggleMenu}
        className={`fixed left-1/2 transform -translate-x-1/2 z-50 w-12 h-12 flex items-center justify-center rounded-full focus:outline-none transition-all duration-500 hover:scale-110 hover:shadow-xl ${
          isScrolled 
            ? 'top-4 bg-white/80 backdrop-blur-md border border-gray-200/50 shadow-md scale-95' 
            : 'top-6 bg-white border border-gray-200 shadow-lg scale-100'
        } ${
          isHamburgerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
        aria-label="Toggle menu"
      >
        <div className="relative w-5 h-5">
          <span className={`absolute top-1 left-0 w-5 h-px transition-all duration-500 ${
            isMenuOpen ? 'rotate-45 translate-y-2 bg-gray-900' : isScrolled ? 'bg-gray-700' : 'bg-gray-900'
          }`}></span>
          <span className={`absolute top-2.5 left-0 w-5 h-px transition-all duration-500 ${
            isMenuOpen ? 'opacity-0' : isScrolled ? 'bg-gray-700' : 'bg-gray-900'
          }`}></span>
          <span className={`absolute top-4 left-0 w-5 h-px transition-all duration-500 ${
            isMenuOpen ? '-rotate-45 -translate-y-2 bg-gray-900' : isScrolled ? 'bg-gray-700' : 'bg-gray-900'
          }`}></span>
        </div>
      </button>

      {/* Full Screen Menu Overlay */}
      <div className={`fixed inset-0 z-40 bg-white transition-all duration-500 font-display ${
        isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        <div className="flex flex-col items-center justify-center min-h-screen py-20">
          <nav className="text-center mb-10">
            {navItems.map((item, index) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.path)}
                className={`block w-full py-4 text-4xl md:text-5xl font-light text-gray-900 hover:text-gray-600 transition-all duration-300 transform ${
                  isMenuOpen 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-8 opacity-0'
                }`}
                style={{ 
                  transitionDelay: isMenuOpen ? `${index * 100 + 200}ms` : '0ms'
                }}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Social Links in Menu */}
          <div className={`flex space-x-6 transition-all duration-300 transform ${
            isMenuOpen 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-8 opacity-0'
          }`}
          style={{ 
            transitionDelay: isMenuOpen ? `${navItems.length * 100 + 400}ms` : '0ms'
          }}>
            {socialLinks.map((social) => {
              const IconComponent = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center border border-gray-300 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 rounded-full"
                  aria-label={social.label}
                >
                  <IconComponent className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Close button (alternative to hamburger) */}
        <button
          onClick={toggleMenu}
          className="absolute top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 flex items-center justify-center text-gray-900 hover:text-gray-600 transition-colors duration-300"
          aria-label="Close menu"
        >
          <X size={24} />
        </button>
      </div>
    </>
  );
};

export default Header;