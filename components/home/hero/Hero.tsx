import React, { useState, useEffect } from 'react';
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

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: React.SetStateAction<number>) => {
    setCurrentSlide(index);
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      {/* Subtle animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 border border-gray-900 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 border border-gray-900 rounded-full animate-pulse delay-1000"></div>
      </div>
      
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-100/20 to-transparent"></div>
      
      <div className="text-center max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Artist Name - Always Visible */}
        <div className="mb-10">
          <h1 className="text-6xl md:text-8xl font-thin text-gray-900  tracking-widest transition-all duration-700 ease-out font-display  ">
            {slides[currentSlide].title}
          </h1>
          
          {/* Animated underline */}
          <div className="relative mx-auto mb-8">
            <div className="w-32 h-px bg-gray-300 mx-auto"></div>
            <div className="w-16 h-px bg-gray-900 mx-auto -mt-px transition-all duration-700"></div>
          </div>
        </div>

        {/* Subtitle and Description - Animated */}
        <div className="mb-6  min-h-32">
          <h2 className="text-2xl md:text-3xl font-light text-gray-700 mb-6 transition-all duration-500 ease-in-out transform">
            {slides[currentSlide].subtitle}
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed transition-all duration-500 ease-in-out">
            {slides[currentSlide].description}
          </p>
        </div>
        
        {/* Elegant CTA Button */}
        <div className="mb-10">
          <Link href='/work'
            className="group relative inline-block px-12 py-4 border border-gray-400 text-gray-900 hover:border-gray-900 transition-all duration-500 text-sm tracking-widest uppercase overflow-hidden"
          >
            <span className="relative z-10 group-hover:text-white transition-colors duration-500 ">
              View Portfolio
            </span>
            <div className="absolute inset-0 bg-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          </Link>
        </div>
        
        {/* Sophisticated Slide Indicators */}
        <div className="flex justify-center items-center space-x-6">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`group relative transition-all duration-500 ${
                index === currentSlide ? 'scale-110' : 'hover:scale-105'
              }`}
            >
              <div className={`w-12 h-px transition-all duration-500 ${
                index === currentSlide 
                  ? 'bg-gray-900 shadow-sm shadow-gray-900/30' 
                  : 'bg-gray-300 group-hover:bg-gray-600'
              }`}></div>
              
              {/* Active indicator enhancement */}
              {index === currentSlide && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 border border-gray-400 rounded-full animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Elegant corner accents */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-gray-300"></div>
      <div className="absolute top-8 right-8 w-16 h-16 border-r border-t border-gray-300"></div>
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l border-b border-gray-300"></div>
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-gray-300"></div>
    </section>
  );
};

export default Hero;