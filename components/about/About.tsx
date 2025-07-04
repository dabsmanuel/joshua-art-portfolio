/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Award, 
  BookOpen, 
  Heart, 
  Clock, 
  Users, 
  Camera, 
  Lightbulb,
  MapPin,
  Calendar,
  Quote,
  Star,
  Brush,
  Eye,
  Feather
} from 'lucide-react';
import Image from 'next/image';

interface Achievement {
  year: string;
  title: string;
  description: string;
  type: 'exhibition' | 'award' | 'education' | 'milestone';
}

interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const AboutPage: React.FC = () => {
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());
  const [selectedTab, setSelectedTab] = useState<'story' | 'process' | 'philosophy'>('story');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const processSteps: ProcessStep[] = [
    {
      step: 1,
      title: 'Observation & Study',
      description: 'I begin by spending time with my subject, studying the interplay of light and shadow.',
      icon: <Eye className="w-6 h-6" />
    },
    {
      step: 2,
      title: 'Initial Sketches',
      description: 'Multiple rough sketches help me explore composition and capture the essence of what draws me to the subject.',
      icon: <Brush className="w-6 h-6" />
    },
    {
      step: 3,
      title: 'Detailed Planning',
      description: 'I create detailed studies focusing on values, proportions, and the emotional core of the piece.',
      icon: <Lightbulb className="w-6 h-6" />
    },
    {
      step: 4,
      title: 'Final Execution',
      description: 'Using traditional graphite and charcoal techniques, I build the drawing layer by layer, focusing on depth and atmosphere.',
      icon: <Palette className="w-6 h-6" />
    }
  ];

  const stats = [
    { number: '50+', label: 'Artworks Created', icon: <Palette className="w-5 h-5" /> },
    { number: '10', label: 'Years Experience', icon: <Clock className="w-5 h-5" /> },
    { number: '50+', label: 'Happy Collectors', icon: <Users className="w-5 h-5" /> },
    { number: '12', label: 'Exhibitions', icon: <Award className="w-5 h-5" /> }
  ];

  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleElements(prev => new Set(prev).add(entry.target.id));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: '-20px'
    });

    const elementsToObserve = document.querySelectorAll('[data-animate]');
    elementsToObserve.forEach(el => observer.observe(el));

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const getAchievementIcon = (type: Achievement['type']) => {
    switch (type) {
      case 'exhibition': return <Camera className="w-5 h-5" />;
      case 'award': return <Award className="w-5 h-5" />;
      case 'education': return <BookOpen className="w-5 h-5" />;
      case 'milestone': return <Star className="w-5 h-5" />;
      default: return <Calendar className="w-5 h-5" />;
    }
  };

  const getAchievementColor = (type: Achievement['type']) => {
    switch (type) {
      case 'exhibition': return 'bg-blue-100 text-blue-700';
      case 'award': return 'bg-yellow-100 text-yellow-700';
      case 'education': return 'bg-green-100 text-green-700';
      case 'milestone': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white relative overflow-hidden">
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

      {/* Header - Canvas Style */}
      <div className="relative z-10 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-32">
          <div className="text-center relative">
            {/* Artist signature style */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
              <Feather className="w-8 h-8 text-amber-400 animate-bounce" />
            </div>
            
            <h1 className="text-6xl md:text-8xl font-light text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-blue-200 mb-6 font-serif tracking-wider">
              The Artist
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-8"></div>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light italic">
              &quot;Where graphite meets soul, and shadows dance with light—exploring the profound beauty 
              of human experience through the timeless art of pencil and charcoal.&quot;
            </p>
          </div>
        </div>
      </div>

      {/* Hero Section - Gallery Style */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div
            id="hero-image"
            data-animate
            className={`transition-all duration-1000 ${
              visibleElements.has('hero-image')
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
                  alt="Joshua - The Artist"
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

          <div
            id="hero-content"
            data-animate
            className={`transition-all duration-1000 delay-300 ${
              visibleElements.has('hero-content')
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-12'
            }`}
          >
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-0.5 bg-gradient-to-r from-amber-400 to-transparent"></div>
                <span className="text-amber-400 font-light tracking-wide">JOSHUA</span>
              </div>
              
              <h2 className="text-5xl font-light text-white leading-tight font-serif">
                Capturing life&apos;s 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-blue-400 italic block">
                  quiet poetry
                </span>
                through pencil & soul
              </h2>

              <p className="text-lg text-gray-300 leading-relaxed font-light">
                For years, I&apos;ve been enchanted by the alchemy of transforming simple graphite into 
                windows of human emotion. Each stroke is a whispered conversation between artist and subject, 
                revealing the extraordinary within the ordinary.
              </p>

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
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section - Sketch Book Style */}
      <div
        id="stats-section"
        data-animate
        className={`relative z-10 my-20 transition-all duration-1000 delay-500 ${
          visibleElements.has('stats-section')
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-12'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Sketch book effect */}
          <div className="bg-gradient-to-r from-amber-50 to-blue-50 p-8 rounded-2xl relative transform rotate-1 shadow-2xl">
            <div className="absolute top-4 left-8 w-2 h-2 bg-red-400 rounded-full"></div>
            <div className="absolute top-4 left-14 w-2 h-2 bg-red-400 rounded-full"></div>
            <div className="absolute top-4 left-20 w-2 h-2 bg-red-400 rounded-full"></div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-gray-800">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-4 bg-white rounded-full shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                      <div className="text-gray-700 group-hover:text-amber-600 transition-colors">
                        {stat.icon}
                      </div>
                    </div>
                  </div>
                  <div className="text-4xl font-light text-gray-900 mb-2 font-serif">{stat.number}</div>
                  <div className="text-gray-600 font-light">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Art Gallery Style */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 relative z-10">
        <div
          id="content-tabs"
          data-animate
          className={`transition-all duration-1000 delay-700 ${
            visibleElements.has('content-tabs')
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-12'
          }`}
        >
          {/* Tab Navigation - Palette Style */}
          <div className="flex justify-center mb-16">
            <div className="bg-gradient-to-r from-gray-800/80 via-gray-700/80 to-gray-800/80 backdrop-blur-lg p-2 rounded-2xl border border-gray-600/50 shadow-2xl">
              {[
                { key: 'story', label: 'Origin Story', icon: <BookOpen className="w-5 h-5" /> },
                { key: 'process', label: 'Creative Ritual', icon: <Brush className="w-5 h-5" /> },
                { key: 'philosophy', label: 'Artist\'s Creed', icon: <Heart className="w-5 h-5" /> }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedTab(tab.key as any)}
                  className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-light transition-all duration-300 group ${
                    selectedTab === tab.key
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg scale-105'
                      : 'text-gray-300 hover:text-white hover:bg-gray-600/50'
                  }`}
                >
                  <div className={`transition-transform duration-300 ${selectedTab === tab.key ? 'rotate-12' : 'group-hover:rotate-6'}`}>
                    {tab.icon}
                  </div>
                  <span className="tracking-wide">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content - Canvas Style */}
          <div className="bg-gradient-to-br from-gray-800/40 via-gray-700/40 to-gray-800/40 backdrop-blur-xl rounded-3xl shadow-2xl p-12 lg:p-16 border border-gray-600/30">
            {selectedTab === 'story' && (
              <div className="space-y-12">
                <div className="text-center mb-16">
                  <h3 className="text-4xl font-light text-white mb-6 font-serif">The Artist&apos;s Genesis</h3>
                  <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-6"></div>
                  <p className="text-xl text-gray-300 max-w-4xl mx-auto font-light leading-relaxed">
                    From childhood sketches to masterful portraits, every line drawn has been a step 
                    towards understanding the delicate dance between light and shadow, emotion and form.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                  <div className="space-y-10">
                    {[
                      {
                        title: "Early Beginnings & Family Influence",
                        content: "My love for drawing began in childhood, inspired by my elder brother who was already exploring sculpting and various art forms. Growing up in an artistic household, I spent hours sketching everything from family pets to the trees outside my window, developing what would become a lifelong passion for capturing life through pencil and charcoal."
                      },
                      {
                        title: "Academic Journey",
                        content: "While pursuing my Bachelor of Agriculture in Animal Science at the University of Port Harcourt, Nigeria, and later my Master's in Environmental Management at the University of Hertfordshire, UK, I continued developing my artistic skills as a self-taught artist. My formal education provided me with discipline and analytical thinking that unexpectedly enhanced my approach to art."
                      },
                      {
                        title: "Multiple Creative Outlets",
                        content: "Alongside my visual art, I discovered another passion in music, working as a background vocalist on several Nigerian music productions. While I don't pursue singing professionally, this musical background has deepened my understanding of rhythm, emotion, and creative expression, all of which influence my approach to drawing."
                      }
                    ].map((section, index) => (
                      <div key={index} className="relative group">
                        <div className="absolute -left-4 top-6 w-2 h-2 bg-amber-400 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                        <div className="pl-8">
                          <h4 className="text-2xl font-light text-white mb-4 font-serif group-hover:text-amber-400 transition-colors duration-300">
                            {section.title}
                          </h4>
                          <p className="text-gray-300 leading-relaxed font-light">
                            {section.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-10">
                    <div className="bg-gradient-to-br from-amber-900/20 to-blue-900/20 p-8 rounded-2xl border border-amber-400/20 backdrop-blur-sm">
                      <Quote className="w-12 h-12 text-amber-400/60 mb-6" />
                      <p className="text-xl italic text-gray-200 mb-6 font-light leading-relaxed">
                        &quot;Every line I draw is a conversation between myself and the subject. It&apos;s about finding that moment of connection, 
                        that spark of recognition that makes a drawing come alive.&quot;
                      </p>
                      <div className="text-amber-400 font-light tracking-wide">— Artist Statement, 2024</div>
                    </div>

                    <div className="relative group">
                      <div className="absolute -left-4 top-6 w-2 h-2 bg-blue-400 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                      <div className="pl-8">
                        <h4 className="text-2xl font-light text-white mb-4 font-serif group-hover:text-blue-400 transition-colors duration-300">
                          Present Day
                        </h4>
                        <p className="text-gray-300 leading-relaxed font-light">
                          Today, I work from my Luton studio, dividing my time between commissioned portraits and personal projects. 
                          Each piece is an exploration of light, shadow, and the infinite complexity of human emotion. 
                          As a young revolutionary in Luton, my involvement with the RevoLutonary Cohort has enriched my artistic journey, 
                          enhancing my creative abilities and inspiring me to make a positive impact through art that celebrates 
                          Luton&apos;s rich cultural tapestry.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'process' && (
              <div className="space-y-16">
                <div className="text-center">
                  <h3 className="text-4xl font-light text-white mb-6 font-serif">The Sacred Ritual</h3>
                  <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-6"></div>
                  <p className="text-xl text-gray-300 max-w-4xl mx-auto font-light leading-relaxed">
                    Each artwork emerges through a meditative dance of observation, intuition, and countless hours 
                    of patient mark-making—a ritual as ancient as art itself.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {processSteps.map((step, index) => (
                    <div key={step.step} className="group">
                      <div className="flex space-x-8 items-start">
                        <div className="flex-shrink-0 relative">
                          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-2xl flex items-center justify-center font-light text-xl shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                            {step.step}
                          </div>
                          {index < processSteps.length - 1 && (
                            <div className="absolute top-20 left-8 w-0.5 h-20 bg-gradient-to-b from-amber-400/50 to-transparent"></div>
                          )}
                        </div>
                        <div className="flex-grow pt-2">
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="p-3 bg-gray-700/50 rounded-xl text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                              {step.icon}
                            </div>
                            <h4 className="text-2xl font-light text-white font-serif group-hover:text-amber-400 transition-colors duration-300">
                              {step.title}
                            </h4>
                          </div>
                          <p className="text-gray-300 leading-relaxed font-light group-hover:text-gray-200 transition-colors duration-300">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-br from-gray-700/30 to-gray-800/30 backdrop-blur-sm rounded-2xl p-12 border border-gray-600/30">
                  <h4 className="text-3xl font-light text-white mb-10 font-serif text-center">The Artist&apos;s Arsenal</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[
                      {
                        title: "Pencils",
                        items: ["Staedtler Mars Lumograph (2H-8B)", "Faber-Castell 9000 series", "Mechanical pencils for detail work"],
                        color: "amber"
                      },
                      {
                        title: "Paper",
                        items: ["Strathmore 400 Series Drawing", "Canson XL Bristol", "Fabriano Artistico for special pieces"],
                        color: "blue"
                      },
                      {
                        title: "Accessories",
                        items: ["Kneaded erasers", "Blending stumps", "White charcoal for highlights"],
                        color: "purple"
                      }
                    ].map((category, index) => (
                      <div key={index} className="group">
                        <h5 className={`font-light text-xl text-white mb-6 font-serif group-hover:text-${category.color}-400 transition-colors duration-300`}>
                          {category.title}
                        </h5>
                        <ul className="space-y-3">
                          {category.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="text-gray-300 font-light flex items-center space-x-3 group-hover:text-gray-200 transition-colors duration-300">
                              <div className={`w-1.5 h-1.5 bg-${category.color}-400 rounded-full opacity-60`}></div>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'philosophy' && (
              <div className="space-y-16">
                <div className="text-center">
                  <h3 className="text-4xl font-light text-white mb-6 font-serif">The Artist&apos;s Creed</h3>
                  <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-6"></div>
                  <p className="text-xl text-gray-300 max-w-4xl mx-auto font-light leading-relaxed">
                    Art is not merely about technique—it is a philosophy of seeing, feeling, and translating 
                    the ineffable essence of human experience into tangible form.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                  <div className="space-y-12">
                    <div className="group">
                      <h4 className="text-3xl font-light text-white mb-6 font-serif group-hover:text-amber-400 transition-colors duration-300">
                        The Power of Simplicity
                      </h4>
                      <p className="text-gray-300 leading-relaxed mb-6 font-light">
                        In a world filled with digital noise and constant stimulation, I find profound meaning in the simplicity of pencil on paper. 
                        This ancient medium demands patience, contemplation, and genuine connection with the subject.
                      </p>
                      <p className="text-gray-300 leading-relaxed font-light">
                        Each mark is intentional, each shadow carefully considered. There&apos;s no undo button, no digital manipulation—just the honest 
                        dialogue between artist, tool, and surface.
                      </p>
                    </div>

                    <div className="group">
                      <h4 className="text-3xl font-light text-white mb-6 font-serif group-hover:text-blue-400 transition-colors duration-300">
                        Capturing the Ephemeral
                      </h4>
                      <p className="text-gray-300 leading-relaxed font-light">
                        My portraits seek to capture not just physical likeness, but the fleeting expressions and emotions that make us human. 
                        A slight smile, the way light catches in someone&apos;s eyes, the weight of years in weathered hands—these are the moments I strive to preserve.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-12">
                    <div className="bg-gradient-to-br from-amber-900/30 via-gray-900/50 to-blue-900/30 p-10 rounded-2xl border border-amber-400/20 backdrop-blur-sm">
                      <h4 className="text-3xl font-light text-white mb-8 font-serif">Sacred Principles</h4>
                      <ul className="space-y-6">
                        {[
                          { icon: <Heart className="w-6 h-6 text-red-400" />, text: "Art should evoke emotion and create genuine human connection" },
                          { icon: <Eye className="w-6 h-6 text-amber-400" />, text: "Patient observation reveals beauty in the most ordinary subjects" },
                          { icon: <Clock className="w-6 h-6 text-blue-400" />, text: "The slow, meditative process of drawing is as important as the final result" },
                          { icon: <Lightbulb className="w-6 h-6 text-purple-400" />, text: "Traditional techniques carry wisdom that remains relevant today" }
                        ].map((belief, index) => (
                        <li key={index} className="flex items-start space-x-4 group">
                          <div className="p-2 bg-gray-800/50 rounded-lg group-hover:bg-gray-700/50 transition-all duration-300">
                            {belief.icon}
                          </div>
                          <span className="text-gray-200 font-light leading-relaxed group-hover:text-white transition-colors duration-300">
                            {belief.text}
                          </span>
                        </li>
                        ))}
                      </ul>
                    </div>

                    <div className="group">
                      <h4 className="text-3xl font-light text-white mb-6 font-serif group-hover:text-purple-400 transition-colors duration-300">
                        Looking Forward
                      </h4>
                      <p className="text-gray-300 leading-relaxed font-light">
                        As I continue to grow as an artist, I&apos;m excited to explore new subjects while deepening my mastery of traditional techniques. 
                        My goal is to create work that stands the test of time—drawings that will move viewers decades from now, 
                        just as the old masters continue to inspire us today.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Inspirational closing */}
                <div className="bg-gradient-to-r from-transparent via-amber-400/10 to-transparent p-12 rounded-2xl text-center">
                  <div className="max-w-3xl mx-auto">
                    <Quote className="w-16 h-16 text-amber-400/40 mx-auto mb-6" />
                    <p className="text-2xl font-light text-gray-200 italic leading-relaxed mb-6">
                      &quot;In every stroke lies a heartbeat, in every shadow a story, 
                      in every drawing a piece of the artist&apos;s soul made manifest.&quot;
                    </p>
                    <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer - Signature Style */}
      <div className="relative z-10 mt-32 mb-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm px-8 py-4 rounded-full border border-gray-600/30">
            <Brush className="w-6 h-6 text-amber-400" />
            <span className="text-gray-300 font-light tracking-wider">Crafted with passion in Luton</span>
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;