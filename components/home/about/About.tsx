import React from 'react';
import { 
  Palette,  
  Users, 
  Heart, 
  Clock, 
  MapPin,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface AboutProps {
  visibleElements?: Set<string>;
}

const achievements = [
  { icon: Palette, number: "50+", label: "Portraits Created" },
  { icon: Clock, number: "10+", label: "Years Experience" },
  { icon: Users, number: "50+", label: "Happy Clients" },
  { icon: Heart, number: "∞", label: "Passion Projects" }
];

const About: React.FC<AboutProps> = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 
            id="about-title"
            data-animate
            className="text-5xl md:text-7xl font-thin text-gray-900 tracking-widest mb-8 transition-all duration-700 font-display"
          >
            About
          </h2>
          <div 
            id="about-divider"
            data-animate
            className="w-16 h-px bg-gray-900 mx-auto transition-all duration-700 opacity-100"
          />
        </div>
        
        <div className="grid lg:grid-cols-2 gap-16 items-start mb-20">
          {/* Image */}
          <div 
            id="about-image"
            data-animate
            className="transition-all duration-1000 opacity-100"
          >
            <div className="relative bg-gray-50 p-8">
              <Image
                src="/images/joshua.jpg"
                alt="Joshua Otuonye - Pencil Artist"
                width={500}
                height={500}
                className="w-full aspect-square object-cover"
              />
              <div className="absolute bottom-4 right-4 bg-white px-3 py-2 shadow-sm">
                <div className="flex items-center space-x-2 text-gray-600 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>Luton, UK</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div 
            id="about-text"
            data-animate
            className="space-y-8 transition-all duration-1000 delay-200 opacity-100"
          >
            <div>
              <div className="w-12 h-px bg-gray-900 mb-4" />
              <span className="text-xs tracking-widest text-gray-500 uppercase">The Artist</span>
            </div>
            
            <h3 className="text-3xl md:text-4xl font-light text-gray-900 tracking-wide font-display">
              Joshua Otuonye
            </h3>

            <blockquote className="bg-gray-50 p-6 border-l-2 border-gray-200">
              <p className="text-lg italic text-gray-700 font-light">
                &quot;My artistic vision is to convey unique perspectives and experiences through the timeless medium of pencil and paper.&quot;
              </p>
            </blockquote>

            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p>
                I am <strong className="text-gray-900 font-display text-xl">Joshua Otuonye</strong>, an African visual artist based in the United Kingdom, where I&apos;ve dedicated my craft to pushing the boundaries of pencil artistry and challenging conventional norms through my creations.
              </p>
              
              <p>
                My visual artworks are characterized by their boundary-pushing nature, expression of diverse viewpoints, and meticulous attention to detail that captures the very essence of my subjects.
              </p>

              <p>
                <strong className="text-gray-900 font-display text-xl">Born and raised in Nigeria</strong>, my creativity knows no bounds. Each piece I create is designed to captivate and inspire those fortunate enough to encounter it, leaving a lasting impression that speaks volumes.
              </p>

              <p>
                My ability to seamlessly blend various techniques and styles within the pencil medium results in a dynamic and thought-provoking body of work that transforms simple graphite into powerful storytelling.
              </p>
            </div>

            <Link 
              href='/about' 
              className="inline-flex items-center px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-300 text-sm tracking-wide group"
            >
              <span>Explore My Journey</span>
              <div className="ml-3 w-3 h-3 border border-white rounded-full group-hover:bg-white group-hover:border-gray-900 transition-colors duration-300" />
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div 
          id="about-stats"
          data-animate
          className="bg-gray-50 p-8 transition-all duration-1000 delay-300 opacity-100"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div key={index} className="group">
                  <Icon className="w-5 h-5 text-gray-600 mx-auto mb-3" />
                  <div className="text-2xl font-light text-gray-900 mb-1">
                    {achievement.number}
                  </div>
                  <div className="text-sm text-gray-600">
                    {achievement.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;