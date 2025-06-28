import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import FloatingElements from '../hero/FloatingElements';


// Sample background images - replace with your actual image URLs
const slides = [
  {
    id: 1,
    background: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop&crop=center',
    title: 'Pencil Artist',
    subtitle: 'Creating detailed portraits and sketches that capture the essence of life',
    overlay: 'from-black/40 via-black/20 to-black/40'
  },
  {
    id: 2,
    background: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1920&h=1080&fit=crop&crop=center',
    title: 'Master of Details',
    subtitle: 'Every stroke tells a story, every shadow brings emotion to life',
    overlay: 'from-black/50 via-black/30 to-black/50'
  },
  {
    id: 3,
    background: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center',
    title: 'Artistic Vision',
    subtitle: 'Transforming moments into timeless pencil masterpieces',
    overlay: 'from-black/45 via-black/25 to-black/45'
  },
  {
    id: 4,
    background: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1920&h=1080&fit=crop&crop=center',
    title: 'Creative Excellence',
    subtitle: 'Where imagination meets precision in every detailed drawing',
    overlay: 'from-black/40 via-black/20 to-black/40'
  }
];

type FloatingElementProps = {
  size: 'small' | 'large';
  position: 'top-left' | 'bottom-right';
  animation: 'float' | 'bounce';
};

const FloatingElement = ({ size, position, animation }: FloatingElementProps) => {
  const sizeClasses = {
    small: 'w-20 h-20',
    large: 'w-32 h-32'
  };
  
  const positionClasses = {
    'top-left': 'top-20 left-20',
    'bottom-right': 'bottom-20 right-20'
  };
  
  const animationClasses = {
    float: 'animate-bounce',
    bounce: 'animate-pulse'
  };
  
  return (
    <div className={`absolute ${positionClasses[position]} ${sizeClasses[size]} ${animationClasses[animation]} opacity-20`}>
      <div className="w-full h-full rounded-full bg-gradient-to-br from-white to-gray-300 shadow-lg"></div>
    </div>
  );
};

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsTransitioning(false);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: React.SetStateAction<number>) => {
    if (index !== currentSlide) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(index);
        setIsTransitioning(false);
      }, 500);
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slide.background})` }}
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${slide.overlay}`} />
        </div>
      ))}
      
      {/* Floating Elements */}
      <FloatingElement size="large" position="top-left" animation="float" />
      <FloatingElement size="small" position="bottom-right" animation="bounce" />
      <FloatingElements size="large" position="top-left" animation="float" />
      <FloatingElements size="small" position="bottom-right" animation="bounce" />
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <div className={`transition-all duration-500 ${isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-light text-white mb-6 drop-shadow-lg">
            {slides[currentSlide].title}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 font-light leading-relaxed drop-shadow-md">
            {slides[currentSlide].subtitle}
          </p>
        </div>
        
        <button
          onClick={() => scrollToSection('work')}
          className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-full font-medium uppercase tracking-wider text-sm hover:bg-white/30 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/30"
        >
          View My Work
          <ChevronDown className="ml-2 w-4 h-4" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white shadow-lg scale-110' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-20">
        <div 
          className="h-full bg-white transition-all duration-75 ease-linear"
          style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`
          }}
        />
      </div>
    </section>
  );
};

export default Hero;