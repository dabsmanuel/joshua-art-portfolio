'use client'

import { Mail, Phone, MapPin, Heart } from 'lucide-react';
import { LuFacebook, LuInstagram } from "react-icons/lu";
import { FaXTwitter, FaTiktok } from "react-icons/fa6";
import { SocialButtonProps, ContactItemProps } from '@/types';
import { FC } from 'react';

const SocialButton: FC<SocialButtonProps> = ({ icon: Icon, label, href = '#' }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className=""
      aria-label={label}
    >
      <Icon className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors duration-300" />
    </a>
  );
};

const ContactItem: React.FC<ContactItemProps> = ({ icon: Icon, label, value, href, delay = 0 }) => {
  return (
    <div 
      className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800/50 transition-all duration-300 cursor-pointer"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-gradient-to-br group-hover:from-gray-700 group-hover:to-gray-600 transition-all duration-300">
        <Icon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-300" />
      </div>
      <div className="flex-1">
        <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">{label}</div>
        {href ? (
          <a 
            href={href}
            className=" text-gray-300 group-hover:text-white transition-colors duration-300"
          >
            {value}
          </a>
        ) : (
          <div className=" text-gray-300 group-hover:text-white transition-colors duration-300">
            {value}
          </div>
        )}
      </div>
    </div>
  );
};

const Footer = () => {
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
      icon: Phone, 
      label: 'Phone', 
      value: '+44 7990 136683',
      href: 'tel:+447990136683'
    },
    { 
      icon: MapPin, 
      label: 'Location', 
      value: '320 Devon Road, Luton, United Kingdom'
    }
  ];

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Portfolio', href: '/work' },
    { name: 'About Me', href: '/about' },
    { name: 'Commissions', href: '/contact' },
    // { name: 'Privacy Policy', href: '#' },
    // { name: 'Terms of Service', href: '#' }

  ];

  return (
    <footer id="contact" className="relative bg-gray-900  text-white overflow-hidden text-sm">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-white rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Joshua Otuonye
              </h2>
              <p className="text-gray-400 leading-relaxed max-w-md">
                Creating detailed portraits and sketches that capture the essence of life through the timeless art of pencil drawing.
              </p>
            </div>
            
            {/* Social Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-200">Connect With Me</h3>
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
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-200 mb-6">Get In Touch</h3>
            <div className="space-y-2">
              {contactInfo.map((contact, index) => (
                <ContactItem 
                  key={contact.label} 
                  {...contact} 
                  delay={index * 100}
                />
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-200 mb-6">Quick Links</h3>
            <div className="space-y-3">
              {quickLinks.map((link, index) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-2 py-1"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-700/50 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-gray-400 text-sm flex items-center space-x-2">
              <span>© {new Date().getFullYear()} Joshua Otuonye. All rights reserved.</span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1 text-xs">
                <span>Crafted with</span>
                <Heart className="w-4 h-4 text-red-300 animate-pulse shadow-2xl shadow-red-500" />
                <span>in Nigeria</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;