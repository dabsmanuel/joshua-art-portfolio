import React, { useState, useEffect } from 'react';
import {Sparkles, Feather, Quote } from 'lucide-react';

// Artistic slides focused on pencil art
const slides = [
  {
    id: 1,
    background: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop&crop=center',
    title: 'Pencil',
    subtitle: 'Artist',
    description: 'Where graphite meets soul, creating portraits that breathe life into paper',
    accent: 'Capturing essence through shadow and light',
    overlay: 'from-slate-900/60 via-slate-800/40 to-slate-900/60'
  },
  {
    id: 2,
    background: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Master of',
    subtitle: 'Details',
    description: 'Every stroke tells a story, every texture whispers emotion',
    accent: 'Precision in every mark',
    overlay: 'from-stone-900/50 via-stone-700/30 to-stone-900/50'
  },
  {
    id: 3,
    background: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center',
    title: 'Artistic',
    subtitle: 'Vision',
    description: 'Transforming fleeting moments into timeless graphite masterpieces',
    accent: 'Beauty in monochrome',
    overlay: 'from-gray-900/55 via-gray-700/35 to-gray-900/55'
  },
  {
    id: 4,
    background: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1920&h=1080&fit=crop&crop=center',
    title: 'Creative',
    subtitle: 'Excellence',
    description: 'Where imagination meets precision in detailed pencil artistry',
    accent: 'Craftsmanship redefined',
    overlay: 'from-neutral-900/50 via-neutral-700/30 to-neutral-900/50'
  }
];

// Artistic floating elements
type SizeType = 'small' | 'medium' | 'large';
type ElementType = 'sketch' | 'pencil' | 'spark';

interface ArtisticFloatingElementProps {
  delay?: number;
  size?: SizeType;
  type?: ElementType;
}

const ArtisticFloatingElement = ({ delay = 0, size = 'medium', type = 'sketch' }: ArtisticFloatingElementProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const sizeClasses: Record<SizeType, string> = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const elements = {
    sketch: (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/10 rounded-lg transform rotate-12 backdrop-blur-sm"></div>
        <div className="relative bg-white/20 rounded-lg p-2 backdrop-blur-sm border border-white/30">
          <div className="w-full h-full bg-gradient-to-br from-gray-400/50 to-gray-600/50 rounded"></div>
        </div>
      </div>
    ),
    pencil: (
      <div className="relative">
        <div className="w-full h-2 bg-gradient-to-r from-yellow-600/60 to-yellow-700/60 rounded-full transform rotate-45 backdrop-blur-sm"></div>
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-gray-800/60 rounded-full"></div>
      </div>
    ),
    spark: (
      <Sparkles className="w-full h-full text-white/40" />
    )
  };

  return (
    <div 
      className={`absolute ${sizeClasses[size]} transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{
        top: `${Math.random() * 80 + 10}%`,
        left: `${Math.random() * 80 + 10}%`,
        animationDelay: `${delay}ms`
      }}
    >
      <div className="animate-pulse hover:animate-bounce cursor-pointer">
        {elements[type]}
      </div>
    </div>
  );
};

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mouse tracking effect from About component
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  interface ScrollToSectionFn {
    (sectionId: string): void;
  }

  const scrollToSection: ScrollToSectionFn = (sectionId) => {
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
      }, 800);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  interface GoToSlideFn {
    (index: number): void;
  }

  const goToSlide: GoToSlideFn = (index) => {
    if (index !== currentSlide) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(index);
        setIsTransitioning(false);
      }, 800);
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Artistic Background Elements - Similar to About */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 border border-gray-600 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 right-20 w-96 h-96 border border-gray-700 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-48 h-48 border border-gray-500 rounded-full animate-pulse delay-500"></div>
      </div>

      {/* Floating Mouse-Tracked Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute w-2 h-2 bg-amber-400 rounded-full opacity-70 transition-all duration-1000 ease-out"
          style={{
            left: mousePosition.x * 0.1 + 100,
            top: mousePosition.y * 0.1 + 50,
          }}
        ></div>
        <div 
          className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-50 transition-all duration-1500 ease-out"
          style={{
            left: mousePosition.x * 0.05 + 200,
            top: mousePosition.y * 0.05 + 100,
          }}
        ></div>
        <div 
          className="absolute w-3 h-3 bg-purple-400 rounded-full opacity-40 transition-all duration-2000 ease-out"
          style={{
            left: mousePosition.x * 0.08 + 300,
            top: mousePosition.y * 0.08 + 150,
          }}
        ></div>
      </div>

      {/* Background Images with Artistic Overlay */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1500 ${
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transform transition-transform duration-1500"
            style={{ backgroundImage: `url(${slide.background})` }}
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${slide.overlay}`} />
          {/* Artistic paper texture overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-30 mix-blend-overlay"></div>
        </div>
      ))}
      
      {/* Floating Artistic Elements */}
      {mounted && (
        <>
          <ArtisticFloatingElement delay={0} size="large" type="sketch" />
          <ArtisticFloatingElement delay={500} size="medium" type="pencil" />
          <ArtisticFloatingElement delay={1000} size="small" type="spark" />
          <ArtisticFloatingElement delay={1500} size="medium" type="sketch" />
          <ArtisticFloatingElement delay={2000} size="small" type="pencil" />
          <ArtisticFloatingElement delay={2500} size="large" type="spark" />
        </>
      )}
      
      {/* Artistic Border Frame - Enhanced with About styling */}
      <div className="absolute inset-4 border-2 border-white/20 rounded-lg pointer-events-none z-10">
        <div className="absolute -top-2 -left-2 w-6 h-6 border-l-2 border-t-2 border-amber-400/60 rounded-tl-lg"></div>
        <div className="absolute -top-2 -right-2 w-6 h-6 border-r-2 border-t-2 border-blue-400/60 rounded-tr-lg"></div>
        <div className="absolute -bottom-2 -left-2 w-6 h-6 border-l-2 border-b-2 border-amber-400/60 rounded-bl-lg"></div>
        <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-2 border-b-2 border-blue-400/60 rounded-br-lg"></div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-20 text-center max-w-6xl mx-auto px-8">
        <div className={`transition-all duration-800 ${
          isTransitioning 
            ? 'opacity-0 transform translate-y-8 scale-95' 
            : 'opacity-100 transform translate-y-0 scale-100'
        }`}>
          {/* Accent Text - Enhanced with About styling */}
          <div className="mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-lg rounded-full text-amber-400 text-sm font-light tracking-wider mt-10 border border-gray-600/30">
              <Feather className="w-4 h-4 mr-2" />
              {slides[currentSlide].accent}
            </div>
          </div>

          {/* Main Title - Enhanced with About styling */}
          <div className="mb-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-light text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-blue-200 mb-2 font-serif tracking-wider">
              <span className="block leading-none">{slides[currentSlide].title}</span>
              <span className="block text-5xl md:text-6xl lg:text-7xl font-light italic text-gray-300 leading-none mt-2">
                {slides[currentSlide].subtitle}
              </span>
            </h1>
          </div>

          {/* Artistic divider - From About component */}
          <div className="mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '1.0s', animationFillMode: 'forwards' }}>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
            </div>
          </div>
          
          {/* Description - Enhanced styling */}
          <div className="mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '1.1s', animationFillMode: 'forwards' }}>
            <div className="bg-gradient-to-br from-amber-900/20 to-blue-900/20 p-6 rounded-2xl border border-amber-400/20 backdrop-blur-sm max-w-3xl mx-auto">
              <Quote className="w-8 h-8 text-amber-400/60 mb-4 mx-auto" />
              <p className="text-xl md:text-2xl text-gray-200 font-light leading-relaxed italic">
                {slides[currentSlide].description}
              </p>
            </div>
          </div>
        </div>
        
        {/* CTA Button - Enhanced with About styling */}
        <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}>
          <button
            onClick={() => scrollToSection('work')}
            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-2xl font-medium hover:from-amber-600 hover:to-amber-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-2xl"
          >
            <span>Explore My Artistry</span>
            <div className="ml-3 w-5 h-5 border-2 border-white rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </button>
        </div>
      </div>

      {/* Artistic Slide Indicators - Enhanced */}
      <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex items-center space-x-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-lg rounded-full px-6 py-3 border border-gray-600/30">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative w-3 h-3 rounded-full transition-all duration-500 ${
                index === currentSlide 
                  ? 'bg-amber-400 shadow-lg shadow-amber-400/50 scale-125' 
                  : 'bg-white/40 hover:bg-white/70 hover:scale-110'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            >
              {index === currentSlide && (
                <div className="absolute inset-0 rounded-full bg-amber-400 animate-ping"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced Progress Bar with About styling */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-black/40 via-black/20 to-black/40 z-20">
        <div className="h-full bg-gradient-to-r from-amber-400/60 via-amber-500/80 to-amber-600/60 shadow-lg shadow-amber-400/20 transition-all duration-300 ease-out relative overflow-hidden"
          style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent animate-pulse"></div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
      `}</style>
    </section>
  );
};

export default Hero;