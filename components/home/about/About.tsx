import React, { useState, useEffect } from 'react';
import { 
  Palette,  
  Users, 
  Heart, 
  Clock, 
  MapPin,
  Quote,
  Feather,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface AboutProps {
  visibleElements: Set<string>;
}

// Artistic stats/achievements
const achievements = [
  {
    icon: Palette,
    number: "500+",
    label: "Portraits Created",
    description: "Each telling a unique story"
  },
  {
    icon: Clock,
    number: "8+",
    label: "Years Experience",
    description: "Mastering the art of graphite"
  },
  {
    icon: Users,
    number: "200+",
    label: "Happy Clients",
    description: "Capturing precious memories"
  },
  {
    icon: Heart,
    number: "∞",
    label: "Passion Projects",
    description: "Art that speaks from the soul"
  }
];

const About: React.FC<AboutProps> = ({ visibleElements }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section id="about" className="py-24 lg:py-32 bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white relative overflow-hidden">
      {/* Artistic Background Elements */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 border border-gray-600 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 right-20 w-96 h-96 border border-gray-700 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-48 h-48 border border-gray-500 rounded-full animate-pulse delay-500"></div>
      </div>

      {/* Floating Artistic Elements */}
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

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header - Canvas Style */}
        <div className="text-center mb-20">
          <div 
            id="about-subtitle"
            data-animate
            className={`transition-all duration-700 ${
              visibleElements.has('about-subtitle')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-lg rounded-full text-amber-400 text-sm font-light tracking-wider mb-8 border border-gray-600/30">
              <Feather className="w-4 h-4 mr-2" />
              The Artist Behind the Art
            </div>
          </div>
          
          <h2 
            id="about-title"
            data-animate
            className={`text-6xl md:text-8xl font-light text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-blue-200 mb-6 font-serif tracking-wider transition-all duration-700 ${
              visibleElements.has('about-title')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            About
            <span className="block text-5xl md:text-6xl font-light italic text-gray-300 mt-2">
              Joshua Otuonye
            </span>
          </h2>

          {/* Artistic divider */}
          <div 
            id="about-divider"
            data-animate
            className={`flex items-center justify-center space-x-4 transition-all duration-700 ${
              visibleElements.has('about-divider')
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-95'
            }`}
          >
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Artist Image */}
          <div 
            id="about-image"
            data-animate
            className={`relative transition-all duration-1000 ${
              visibleElements.has('about-image')
                ? 'opacity-100 translate-x-0 rotate-0'
                : 'opacity-0 -translate-x-12 -rotate-3'
            }`}
          >
            <div className="relative group">
              {/* Artistic frame effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-600/20 to-blue-600/20 rounded-3xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
              <div className="absolute -inset-2 bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl"></div>
              
              <div className="relative bg-white p-4 rounded-xl">
                <Image
                  src="/images/joshua.jpg"
                  alt="Joshua Otuonye - Pencil Artist"
                  width={500}
                  height={500}
                  className="aspect-square rounded-lg object-cover w-full filter grayscale hover:grayscale-0 transition-all duration-700"
                />
                
                {/* Artist's signature overlay */}
                <div className="absolute bottom-6 right-6 bg-black/80 backdrop-blur-sm p-3 rounded-xl border border-gray-600">
                  <div className="flex items-center space-x-2 text-white">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-light">Luton, UK</span>
                  </div>
                </div>
              </div>

              {/* Floating sketch elements */}
              <div className="absolute -top-6 -right-6 w-12 h-12 border-2 border-amber-400/50 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-8 h-8 border-2 border-blue-400/50 rounded-full animate-pulse delay-1000"></div>
            </div>
          </div>

          {/* Artist Story */}
          <div 
            id="about-text"
            data-animate
            className={`space-y-8 transition-all duration-1000 delay-300 ${
              visibleElements.has('about-text')
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-12'
            }`}
          >
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-0.5 bg-gradient-to-r from-amber-400 to-transparent"></div>
                <span className="text-amber-400 font-light tracking-wide">JOSHUA</span>
              </div>
              
              <h3 className="text-5xl font-light text-white leading-tight font-serif">
                Capturing life&apos;s 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-blue-400 italic block">
                  quiet poetry
                </span>
                through pencil & soul
              </h3>

              {/* Opening quote */}
              <div className="bg-gradient-to-br from-amber-900/20 to-blue-900/20 p-8 rounded-2xl border border-amber-400/20 backdrop-blur-sm">
                <Quote className="w-12 h-12 text-amber-400/60 mb-6" />
                <p className="text-xl italic text-gray-200 mb-6 font-light leading-relaxed">
                  &quot;My artistic vision is to convey unique perspectives and experiences through the timeless medium of pencil and paper.&quot;
                </p>
              </div>

              {/* Main content */}
              <div className="space-y-6 text-lg leading-relaxed text-gray-300">
                <p className="border-l-4 border-amber-400/50 pl-6">
                  <strong className="text-white font-medium">I am Joshua Otuonye</strong>, an African visual artist based in the United Kingdom, where I&apos;ve dedicated my craft to pushing the boundaries of pencil artistry and challenging conventional norms through my creations.
                </p>
                
                <p>
                  My visual artworks are characterized by their boundary-pushing nature, expression of diverse viewpoints, and meticulous attention to detail that captures the very essence of my subjects.
                </p>

                <p>
                  <strong className="text-white font-medium">Born and raised in Nigeria</strong>, my creativity knows no bounds. Each piece I create is designed to captivate and inspire those fortunate enough to encounter it, leaving a lasting impression that speaks volumes.
                </p>

                <p>
                  My ability to seamlessly blend various techniques and styles within the pencil medium results in a dynamic and thought-provoking body of work that transforms simple graphite into powerful storytelling.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="group cursor-pointer">
                  <div className="flex items-center space-x-3 bg-gradient-to-r from-gray-800/50 to-transparent p-4 rounded-xl border border-gray-700/50 hover:border-amber-400/50 transition-all duration-300">
                    <Palette className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="text-gray-300 text-sm group-hover:text-white transition-colors">Traditional Mastery</span>
                  </div>
                </div>
                <div className="group cursor-pointer">
                  <div className="flex items-center space-x-3 bg-gradient-to-r from-gray-800/50 to-transparent p-4 rounded-xl border border-gray-700/50 hover:border-blue-400/50 transition-all duration-300">
                    <Heart className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-gray-300 text-sm group-hover:text-white transition-colors">Emotional Depth</span>
                  </div>
                </div>
              </div>

              {/* Call to action */}
              <div className="pt-6">
                <Link href='/about' className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-2xl font-medium hover:from-amber-600 hover:to-amber-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-2xl">
                  <span>Explore My Journey</span>
                  <div className="ml-3 w-5 h-5 border-2 border-white rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Stats - Sketch Book Style */}
        <div 
          id="about-stats"
          data-animate
          className={`mt-20 transition-all duration-1000 delay-500 ${
            visibleElements.has('about-stats')
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-12'
          }`}
        >
          {/* Sketch book effect */}
          <div className="bg-gradient-to-r from-amber-50 to-blue-50 p-8 rounded-2xl relative transform rotate-1 shadow-2xl">
            <div className="absolute top-4 left-8 w-2 h-2 bg-red-400 rounded-full"></div>
            <div className="absolute top-4 left-14 w-2 h-2 bg-red-400 rounded-full"></div>
            <div className="absolute top-4 left-20 w-2 h-2 bg-red-400 rounded-full"></div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-gray-800">
              {achievements.map((achievement, index) => (
                <div key={index} className="text-center group">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-4 bg-white rounded-full shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                      <div className="text-gray-700 group-hover:text-amber-600 transition-colors">
                        <achievement.icon className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                  <div className="text-4xl font-light text-gray-900 mb-2 font-serif">{achievement.number}</div>
                  <div className="text-gray-800 font-medium mb-1">{achievement.label}</div>
                  <div className="text-sm text-gray-600 italic">{achievement.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;