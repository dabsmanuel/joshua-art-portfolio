/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from 'react';
import Link from 'next/link';

const slides = [
  {
    id: 1,
    title: 'JOC Arts',
    subtitle: 'Pencil Artist',
    description: 'Capturing essence through shadow and light'
  },
  {
    id: 2,
    title: 'JOC Arts',
    subtitle: 'Master of Details',
    description: 'Precision in every mark'
  },
  {
    id: 3,
    title: 'JOC Arts',
    subtitle: 'Artistic Vision',
    description: 'Beauty in monochrome'
  },
  {
    id: 4,
    title: 'JOC Arts',
    subtitle: 'Creative Excellence',
    description: 'Craftsmanship redefined'
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Check if device is mobile/touch device
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const handleScroll = () => {
      if (!isMobile) {
        setScrollY(window.scrollY);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile]);

  const goToSlide = (index: React.SetStateAction<number>) => {
    setCurrentSlide(index);
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Image with conditional parallax */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/art3.jpeg')`,
          backgroundAttachment: isMobile ? 'scroll' : 'fixed',
          transform: isMobile ? 'none' : `translateY(${scrollY * 0.5}px)`,
          height: isMobile ? '100%' : '120%',
          top: isMobile ? '0' : '-10%',
          backgroundPosition: 'center center',
          filter: 'brightness(0.6) contrast(1.2)',
          willChange: isMobile ? 'auto' : 'transform',
        }}
      />
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Subtle animated background pattern - disabled on mobile for performance */}
      {!isMobile && (
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 border border-gray-900 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-64 h-64 border border-gray-900 rounded-full animate-pulse delay-1000"></div>
        </div>
      )}
      
      {/* Additional gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-100/30 to-transparent"></div>
      
      <div className="text-center max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Artist Name - Always Visible */}
        <div className="mb-10">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-thin text-gray-200 tracking-widest transition-all duration-700 ease-out font-display drop-shadow-sm">
            {slides[currentSlide].title}
          </h1>
          
          {/* Animated underline */}
          <div className="relative mx-auto mb-8">
            <div className="w-32 h-px bg-gray-200 mx-auto"></div>
            <div className="w-16 h-px bg-gray-500 mx-auto -mt-px transition-all duration-700"></div>
          </div>
        </div>

        {/* Subtitle and Description - Animated */}
        <div className="mb-6 min-h-24 sm:min-h-32">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-light text-gray-200 mb-4 sm:mb-6 transition-all duration-500 ease-in-out transform drop-shadow-sm">
            {slides[currentSlide].subtitle}
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed transition-all duration-500 ease-in-out drop-shadow-sm px-4">
            {slides[currentSlide].description}
          </p>
        </div>
        
        {/* Elegant CTA Button */}
        <div className="mb-10">
          <Link href='/work'
            className="group relative inline-block px-8 sm:px-12 py-3 sm:py-4 border border-gray-600 text-gray-200 hover:border-gray-900 transition-all duration-500 text-xs sm:text-sm tracking-widest uppercase overflow-hidden backdrop-blur-sm bg-black/20"
          >
            <span className="relative z-10 group-hover:text-white transition-colors duration-500">
              View Portfolio
            </span>
            <div className="absolute inset-0 bg-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          </Link>
        </div>
        
      </div>
      
      {/* Elegant corner accents - adjusted for mobile */}
      <div className="absolute top-4 sm:top-8 left-4 sm:left-8 w-12 sm:w-16 h-12 sm:h-16 border-l border-t border-gray-400 z-20"></div>
      <div className="absolute top-4 sm:top-8 right-4 sm:right-8 w-12 sm:w-16 h-12 sm:h-16 border-r border-t border-gray-400 z-20"></div>
      <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 w-12 sm:w-16 h-12 sm:h-16 border-l border-b border-gray-400 z-20"></div>
      <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 w-12 sm:w-16 h-12 sm:h-16 border-r border-b border-gray-400 z-20"></div>
    </section>
  );
};

export default Hero;