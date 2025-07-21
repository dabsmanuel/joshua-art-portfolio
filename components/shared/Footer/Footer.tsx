'use client'

import { Mail,  MapPin, Heart, Feather } from 'lucide-react';
import { LuFacebook, LuInstagram } from "react-icons/lu";
import { FaXTwitter, FaTiktok } from "react-icons/fa6";
import { SocialButtonProps, ContactItemProps } from '@/types';
import { FC, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const SocialButton: FC<SocialButtonProps> = ({ icon: Icon, label, href = '#' }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 rounded-lg hover:bg-gray-700/50 transition-all duration-300 group"
      aria-label={label}
    >
      <Icon className="w-5 h-5 text-gray-300 group-hover:text-amber-400 transition-colors duration-300" />
    </a>
  );
};

const ContactItem: React.FC<ContactItemProps & { isVisible: boolean }> = ({ icon: Icon, label, value, href, delay = 0, isVisible }) => {
  return (
    <div 
      className={`group flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700/50 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="p-2 bg-gray-800/50 rounded-lg group-hover:bg-gradient-to-br group-hover:from-amber-600/50 group-hover:to-blue-600/50 transition-all duration-300">
        <Icon className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors duration-300" />
      </div>
      <div className="flex-1">
        <div className="text-xs text-gray-400 uppercase tracking-wider font-light">{label}</div>
        {href ? (
          <a 
            href={href}
            className="text-gray-300 group-hover:text-amber-400 transition-colors duration-300 font-light"
          >
            {value}
          </a>
        ) : (
          <div className="text-gray-300 group-hover:text-amber-400 transition-colors duration-300 font-light">
            {value}
          </div>
        )}
      </div>
    </div>
  );
};

const Footer = () => {
  const pathname = usePathname();
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const socialLinks = [
    { icon: LuInstagram, label: 'Instagram', href: 'https://www.instagram.com/joc_arts?igsh=MXZ0NWw2eTE3bWc3dg%3D%3D&utm_source=qr' },
    { icon: LuFacebook, label: 'Facebook', href: 'https://www.facebook.com/share/1AYRhXUtQH/?mibextid=wwXIfr' },
    { icon: FaXTwitter, label: 'Twitter', href: 'https://x.com/skye_worldwide1?s=21' },
    { icon: FaTiktok, label: 'TikTok', href: 'https://www.tiktok.com/@skye_worldwide?_t=ZM-8xZpNt2GNZl&_r=1' }
  ];

  const contactInfo = [
    { 
      icon: Mail, 
      label: 'Email', 
      value: 'Joshuaotuonye98@gmail.com',
      href: 'mailto:Joshuaotuonye98@gmail.com'
    },
    { 
      icon: MapPin, 
      label: 'Location', 
      value: 'Luton, United Kingdom'
    }
  ];

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Portfolio', href: '/work' },
    { name: 'About Me', href: '/about' },
    { name: 'Commissions', href: '/contact' },
  ];

  // IntersectionObserver for animations
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleElements((prev) => new Set(prev).add(entry.target.id));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: '-20px',
    });

    const elementsToObserve = document.querySelectorAll('[data-animate]');
    elementsToObserve.forEach((el) => observer.observe(el));

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Hide footer on admin routes - moved after hooks
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer id="contact" className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white overflow-hidden text-sm">
      {/* Artistic Background Elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 border border-gray-600 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 border border-gray-700 rounded-full animate-pulse delay-500"></div>
      </div>

      {/* Floating Artistic Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-2 h-2 bg-amber-400 rounded-full opacity-50 transition-all duration-1000 ease-out"
          style={{ left: mousePosition.x * 0.1 + 100, top: mousePosition.y * 0.1 + 50 }}
        ></div>
        <div
          className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-40 transition-all duration-1500 ease-out"
          style={{ left: mousePosition.x * 0.05 + 200, top: mousePosition.y * 0.05 + 100 }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand Section */}
          <div id="brand-section" data-animate className="lg:col-span-2 space-y-6">
            <div className={`transition-all duration-500 ${visibleElements.has('brand-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="relative">
                <Feather className="absolute -top-2 -left-2 w-5 h-5 text-amber-400 animate-pulse" />
                <h2 className="text-3xl sm:text-4xl font-light font-serif mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-blue-200 tracking-wider">
                  Joshua Otuonye
                </h2>
              </div>
              <p className="text-gray-300 font-light leading-relaxed max-w-md">
                Creating detailed portraits and sketches that capture the essence of life through the timeless art of pencil drawing.
              </p>
            </div>
            
            {/* Social Links */}
            <div id="social-links" data-animate className={`space-y-4 transition-all duration-500 delay-100 ${visibleElements.has('social-links') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h3 className="text-lg font-light font-serif text-gray-200 mb-4">Connect With Me</h3>
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <div 
                    key={social.label}
                    style={{ animationDelay: `${index * 100}ms` }}
                    className="animate-fade-in-up"
                  >
                    <SocialButton {...social} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div id="contact-info" data-animate className={`space-y-6 transition-all duration-500 delay-200 ${visibleElements.has('contact-info') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h3 className="text-xl font-light font-serif text-gray-200 mb-6 tracking-wide">Get In Touch</h3>
            <div className="space-y-2">
              {contactInfo.map((contact, index) => (
                <ContactItem 
                  key={contact.label} 
                  {...contact} 
                  delay={index * 100}
                  isVisible={visibleElements.has('contact-info')}
                />
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div id="quick-links" data-animate className={`space-y-6 transition-all duration-500 delay-300 ${visibleElements.has('quick-links') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h3 className="text-xl font-light font-serif text-gray-200 mb-6 tracking-wide">Quick Links</h3>
            <div className="space-y-3">
              {quickLinks.map((link, index) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-gray-300 hover:text-amber-400 transition-all duration-300 hover:translate-x-2 py-1 font-light font-serif"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-600/30 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-gray-300 text-sm font-light flex items-center space-x-2">
              <span>© {new Date().getFullYear()} Joshua Otuonye. All rights reserved.</span>
            </div>
            
            <div className="flex items-center space-x-4 text-xs text-gray-300 font-light">
              <div className="flex items-center space-x-1">
                <span>
                  <a href="https://dabsmanuel.netlify.app">Crafted by Dabs Manuel with</a>
                  </span>
                <Heart className="w-4 h-4 text-amber-400 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;