/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

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
  Eye
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

  const achievements: Achievement[] = [
    {
      year: '2024',
      title: 'Solo Exhibition - "Quiet Moments"',
      description: 'Featured 25 portrait and landscape works at Brooklyn Gallery Space',
      type: 'exhibition'
    },
    {
      year: '2023',
      title: 'Artist Residency Program',
      description: 'Three-month residency at Hudson Valley Art Center',
      type: 'milestone'
    },
    {
      year: '2023',
      title: 'Regional Art Award',
      description: 'First place in Traditional Media category, New York State Art Competition',
      type: 'award'
    },
    {
      year: '2022',
      title: 'Group Exhibition - "Emerging Voices"',
      description: 'Selected for prestigious emerging artists showcase',
      type: 'exhibition'
    },
    {
      year: '2021',
      title: 'Master of Fine Arts',
      description: 'Graduated Summa Cum Laude from Pratt Institute',
      type: 'education'
    },
    {
      year: '2019',
      title: 'Bachelor of Fine Arts',
      description: 'Drawing and Painting concentration, Rhode Island School of Design',
      type: 'education'
    }
  ];

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

    return () => observer.disconnect();
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-4">
              About the Artist
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Exploring the beauty of the everyday through traditional pencil and charcoal techniques, 
              creating art that captures the quiet moments and profound emotions of human experience.
            </p>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div
            id="hero-image"
            data-animate
            className={`transition-all duration-700 ${
              visibleElements.has('hero-image')
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-8'
            }`}
          >
            <div className="relative">
              <Image
                src='/images/joshua.jpg'
                alt="the artist"
                width={500}
                height={400}
                className="aspect-[1/1] rounded-2xl object-cover h-full w-full"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900 font-medium">Luton, United Kingdom</span>
                </div>
              </div>
            </div>
          </div>

          <div
            id="hero-content"
            data-animate
            className={`transition-all duration-700 delay-200 ${
              visibleElements.has('hero-content')
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-8'
            }`}
          >
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-1 bg-gray-900"></div>
                <span className="text-gray-600 font-medium">Hello, I&apos;m Joshua</span>
              </div>
              
              <h2 className="text-4xl font-light text-gray-900 leading-tight">
                A pencil artist passionate about capturing 
                <span className="text-gray-600 italic"> life&apos;s quiet beauty</span>
              </h2>

              <p className="text-lg text-gray-600 leading-relaxed">
                For over ten years, I&apos;ve been drawn to the timeless art of pencil drawing. 
                There&apos;s something magical about creating depth and emotion using nothing but 
                graphite and paper—transforming simple materials into windows of human experience.
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full">
                  <Palette className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700 text-sm">Traditional Media</span>
                </div>
                <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full">
                  <Heart className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700 text-sm">Emotional Depth</span>
                </div>
                <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full">
                  <Eye className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700 text-sm">Observational Art</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div
        id="stats-section"
        data-animate
        className={`bg-white border-y border-gray-200 transition-all duration-700 delay-300 ${
          visibleElements.has('stats-section')
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-gray-100 rounded-full text-gray-700">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-light text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div
          id="content-tabs"
          data-animate
          className={`transition-all duration-700 delay-400 ${
            visibleElements.has('content-tabs')
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-100 p-1 rounded-lg">
              {[
                { key: 'story', label: 'My Story', icon: <BookOpen className="w-5 h-5" /> },
                { key: 'process', label: 'Process', icon: <Brush className="w-5 h-5" /> },
                { key: 'philosophy', label: 'Philosophy', icon: <Heart className="w-5 h-5" /> }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedTab(tab.key as any)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                    selectedTab === tab.key
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
            {selectedTab === 'story' && (
              <div className="space-y-8">
                <div className="text-center mb-12">
                  <h3 className="text-3xl font-light text-gray-900 mb-4">My Artistic Journey</h3>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    From childhood sketches to professional artistry, every step has shaped my unique perspective on capturing life through pencil and charcoal.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div className="relative pl-8">
                      <div className="absolute left-0 top-2 w-3 h-3 bg-gray-900 rounded-full"></div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">Early Beginnings & Family Influence</h4>
                      <p className="text-gray-600 leading-relaxed">
                        My love for drawing began in childhood, inspired by my elder brother who was already exploring sculpting and various art forms. 
                        Growing up in an artistic household, I spent hours sketching everything from family pets to the trees outside my window, 
                        developing what would become a lifelong passion for capturing life through pencil and charcoal.
                      </p>
                    </div>

                     <div className="relative pl-8">
                      <div className="absolute left-0 top-2 w-3 h-3 bg-gray-900 rounded-full"></div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">Academic Journey</h4>
                      <p className="text-gray-600 leading-relaxed">
                        While pursuing my Bachelor of Agriculture in Animal Science at the University of Port Harcourt, Nigeria, 
                        and later my Master&apos;s in Environmental Management at the University of Hertfordshire, UK, 
                        I continued developing my artistic skills as a self-taught artist. My formal education provided me with 
                        discipline and analytical thinking that unexpectedly enhanced my approach to art.
                      </p>
                    </div>

                    <div className="relative pl-8">
                      <div className="absolute left-0 top-2 w-3 h-3 bg-gray-900 rounded-full"></div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">Multiple Creative Outlets</h4>
                      <p className="text-gray-600 leading-relaxed">
                        Alongside my visual art, I discovered another passion in music, working as a background vocalist 
                        on several Nigerian music productions. While I don&apos;t pursue singing professionally, 
                        this musical background has deepened my understanding of rhythm, emotion, and creative expression, 
                        all of which influence my approach to drawing.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <Quote className="w-8 h-8 text-gray-400 mb-4" />
                      <p className="text-lg italic text-gray-700 mb-4">
                        &quot;Every line I draw is a conversation between myself and the subject. It&apos;s about finding that moment of connection, 
                        that spark of recognition that makes a drawing come alive.&quot;
                      </p>
                      <div className="text-gray-600 font-medium">— Artist Statement, 2024</div>
                    </div>

                    <div className="relative pl-8">
                      <div className="absolute left-0 top-2 w-3 h-3 bg-gray-900 rounded-full"></div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">Present Day</h4>
                      <p className="text-gray-600 leading-relaxed">
                        Today, I work from my Luton studio, dividing my time between commissioned portraits and personal projects. 
                        Each piece is an exploration of light, shadow, and the infinite complexity of human emotion. 
                        I continue to find new challenges and inspirations in this ancient art form.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'process' && (
              <div className="space-y-12">
                <div className="text-center">
                  <h3 className="text-3xl font-light text-gray-900 mb-4">Creative Process</h3>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Each artwork is a journey of discovery, built through careful observation, planning, and countless hours of patient mark-making.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {processSteps.map((step) => (
                    <div key={step.step} className="flex space-x-6">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center font-semibold">
                          {step.step}
                        </div>
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="p-2 bg-gray-100 rounded-lg text-gray-700">
                            {step.icon}
                          </div>
                          <h4 className="text-xl font-semibold text-gray-900">{step.title}</h4>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 rounded-xl p-8">
                  <h4 className="text-2xl font-semibold text-gray-900 mb-6">Tools & Materials</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-3">Pencils</h5>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Staedtler Mars Lumograph (2H-8B)</li>
                        <li>• Faber-Castell 9000 series</li>
                        <li>• Mechanical pencils for detail work</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-3">Paper</h5>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Strathmore 400 Series Drawing</li>
                        <li>• Canson XL Bristol</li>
                        <li>• Fabriano Artistico for special pieces</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-3">Accessories</h5>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Kneaded erasers</li>
                        <li>• Blending stumps</li>
                        <li>• White charcoal for highlights</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'philosophy' && (
              <div className="space-y-12">
                <div className="text-center">
                  <h3 className="text-3xl font-light text-gray-900 mb-4">Artistic Philosophy</h3>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    My work is guided by a belief in the power of quiet observation and the profound beauty found in simple, honest moments.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-2xl font-semibold text-gray-900 mb-4">The Power of Simplicity</h4>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        In a world filled with digital noise and constant stimulation, I find profound meaning in the simplicity of pencil on paper. 
                        This ancient medium demands patience, contemplation, and genuine connection with the subject.
                      </p>
                      <p className="text-gray-600 leading-relaxed">
                        Each mark is intentional, each shadow carefully considered. There&apos;s no undo button, no digital manipulation—just the honest 
                        dialogue between artist, tool, and surface.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-2xl font-semibold text-gray-900 mb-4">Capturing the Ephemeral</h4>
                      <p className="text-gray-600 leading-relaxed">
                        My portraits seek to capture not just physical likeness, but the fleeting expressions and emotions that make us human. 
                        A slight smile, the way light catches in someone&apos;s eyes, the weight of years in weathered hands—these are the moments I strive to preserve.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 rounded-xl">
                      <h4 className="text-2xl font-semibold mb-4">Core Beliefs</h4>
                      <ul className="space-y-4">
                        <li className="flex items-start space-x-3">
                          <Heart className="w-5 h-5 mt-1 text-gray-300" />
                          <span>Art should evoke emotion and create genuine human connection</span>
                        </li>
                        <li className="flex items-start space-x-3">
                          <Eye className="w-5 h-5 mt-1 text-gray-300" />
                          <span>Patient observation reveals beauty in the most ordinary subjects</span>
                        </li>
                        <li className="flex items-start space-x-3">
                          <Clock className="w-5 h-5 mt-1 text-gray-300" />
                          <span>The slow, meditative process of drawing is as important as the final result</span>
                        </li>
                        <li className="flex items-start space-x-3">
                          <Lightbulb className="w-5 h-5 mt-1 text-gray-300" />
                          <span>Traditional techniques carry wisdom that remains relevant today</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-2xl font-semibold text-gray-900 mb-4">Looking Forward</h4>
                      <p className="text-gray-600 leading-relaxed">
                        As I continue to grow as an artist, I&apos;m excited to explore new subjects while deepening my mastery of traditional techniques. 
                        My goal is to create work that stands the test of time—drawings that will move viewers decades from now, 
                        just as the old masters continue to inspire us today.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      {/* <div
        id="timeline-section"
        data-animate
        className={`bg-white border-t border-gray-200 transition-all duration-700 delay-500 ${
          visibleElements.has('timeline-section')
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-light text-gray-900 mb-4">Milestones & Achievements</h3>
            <p className="text-xl text-gray-600">Key moments that have shaped my artistic journey</p>
          </div>

          <div className="space-y-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-8">
                <div className="flex-shrink-0 flex items-center space-x-4">
                  <div className="text-2xl font-light text-gray-900 w-16">{achievement.year}</div>
                  <div className={`p-2 rounded-full ${getAchievementColor(achievement.type)}`}>
                    {getAchievementIcon(achievement.type)}
                  </div>
                </div>
                <div className="flex-grow bg-gray-50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">{achievement.title}</h4>
                  <p className="text-gray-600">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default AboutPage;