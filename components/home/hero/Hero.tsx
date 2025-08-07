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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goToSlide = (index: React.SetStateAction<number>) => {
    setCurrentSlide(index);
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Parallax Background Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-700 ease-in-out"
        style={{
          backgroundImage: `url('/images/art2.jpeg')`,
          transform: `translateY(${scrollY * 0.8}px)`,
          height: '130%', // Make it taller for parallax effect
          top: '-10%',
          backgroundPosition: 'center center',
          filter: 'brightness(0.6) contrast(1.2)',
        }}
      />
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/5 "></div>
      
      {/* Subtle animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 border border-gray-900 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 border border-gray-900 rounded-full animate-pulse delay-1000"></div>
      </div>
      
      {/* Additional gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-100/30 to-transparent"></div>
      
      <div className="text-center max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Artist Name - Always Visible */}
        <div className="mb-10">
          <h1 className="text-6xl md:text-8xl font-thin text-gray-200 tracking-widest transition-all duration-700 ease-out font-display drop-shadow-sm">
            {slides[currentSlide].title}
          </h1>
          
          {/* Animated underline */}
          <div className="relative mx-auto mb-8">
            <div className="w-32 h-px bg-gray-200 mx-auto"></div>
            <div className="w-16 h-px bg-gray-500 mx-auto -mt-px transition-all duration-700"></div>
          </div>
        </div>

        {/* Subtitle and Description - Animated */}
        <div className="mb-6 min-h-32">
          <h2 className="text-2xl md:text-3xl font-light text-gray-200 mb-6 transition-all duration-500 ease-in-out transform drop-shadow-sm">
            {slides[currentSlide].subtitle}
          </h2>
          
          <p className="text-lg md:text-xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed transition-all duration-500 ease-in-out drop-shadow-sm">
            {slides[currentSlide].description}
          </p>
        </div>
        
        {/* Elegant CTA Button */}
        <div className="mb-10">
          <Link href='/work'
            className="group relative inline-block px-12 py-4 border border-gray-600 text-gray-200 hover:border-gray-900 transition-all duration-500 text-sm tracking-widest uppercase overflow-hidden backdrop-blur-sm bg-black/20"
          >
            <span className="relative z-10 group-hover:text-white transition-colors duration-500">
              View Portfolio
            </span>
            <div className="absolute inset-0 bg-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          </Link>
        </div>
        
      </div>
      
      {/* Elegant corner accents */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-gray-400 z-20"></div>
      <div className="absolute top-8 right-8 w-16 h-16 border-r border-t border-gray-400 z-20"></div>
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l border-b border-gray-400 z-20"></div>
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-gray-400 z-20"></div>
    </section>
  );
};

export default Hero;