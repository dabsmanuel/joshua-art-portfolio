/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

'use client'
import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Award, 
  BookOpen, 
  Heart, 
  Clock, 
  Users, 
  Lightbulb,
  MapPin,
  Quote,
  Brush,
  Eye,
  Feather
} from 'lucide-react';
import Image from 'next/image';

interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const AboutPage: React.FC = () => {
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());
  const [selectedTab, setSelectedTab] = useState<'story' | 'process' | 'philosophy'>('story');

  const processSteps: ProcessStep[] = [
    {
      step: 1,
      title: 'Observation & Study',
      description: 'I begin by spending time with my subject, studying the interplay of light and shadow.',
      icon: <Eye className="w-4 h-4" />
    },
    {
      step: 2,
      title: 'Initial Sketches',
      description: 'Multiple rough sketches help me explore composition and capture the essence of what draws me to the subject.',
      icon: <Brush className="w-4 h-4" />
    },
    {
      step: 3,
      title: 'Detailed Planning',
      description: 'I create detailed studies focusing on values, proportions, and the emotional core of the piece.',
      icon: <Lightbulb className="w-4 h-4" />
    },
    {
      step: 4,
      title: 'Final Execution',
      description: 'Using traditional graphite and charcoal techniques, I build the drawing layer by layer, focusing on depth and atmosphere.',
      icon: <Palette className="w-4 h-4" />
    }
  ];

  const stats = [
    { number: '50+', label: 'Artworks Created', icon: <Palette className="w-4 h-4" /> },
    { number: '10', label: 'Years Experience', icon: <Clock className="w-4 h-4" /> },
    { number: '50+', label: 'Happy Collectors', icon: <Users className="w-4 h-4" /> },
    { number: '12', label: 'Exhibitions', icon: <Award className="w-4 h-4" /> }
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

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Feather className="w-6 h-6 mx-auto mb-8 text-gray-400" />
          <h1 className="text-5xl md:text-7xl font-thin text-gray-900 tracking-widest mb-8 transition-all duration-700  artist-heading">
            The Artist
          </h1>
          <div className="w-12 h-px bg-gray-300 mx-auto mb-8"></div>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            &quot;Where graphite meets soul, and shadows dance with light—exploring the profound beauty 
            of human experience through the timeless art of pencil and charcoal.&quot;
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        
        {/* Introduction */}
        <div
          id="intro-section"
          data-animate
          className={`mb-20 transition-all duration-700 ${
            visibleElements.has('intro-section')
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-2">
              <div className="aspect-square bg-gray-50 rounded overflow-hidden">
                <Image
                  src="/images/joshua.jpg"
                  alt="Joshua - The Artist"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  width={400}
                  height={400}
                />
              </div>
              <div className="flex items-center space-x-2 text-gray-500 text-sm mt-4">
                <MapPin className="w-4 h-4" />
                <span>Luton, UK</span>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <div>
                <span className="text-gray-400 font-light tracking-wider text-sm">JOSHUA</span>
                <h2 className="text-3xl font-light text-gray-800 mt-2">
                  Capturing life&apos;s quiet poetry through pencil & soul
                </h2>
              </div>
              
              <p className="text-gray-600 leading-relaxed">
                For years, I&apos;ve been enchanted by the alchemy of transforming simple graphite into 
                windows of human emotion. Each stroke is a whispered conversation between artist and subject, 
                revealing the extraordinary within the ordinary.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 pt-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-light text-gray-800">{stat.number}</div>
                    <div className="text-gray-500 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          id="tab-nav"
          data-animate
          className={`mb-12 transition-all duration-700 ${
            visibleElements.has('tab-nav')
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="flex justify-center border-b border-gray-200">
            {[
              { key: 'story', label: 'Story', icon: <BookOpen className="w-4 h-4" /> },
              { key: 'process', label: 'Process', icon: <Brush className="w-4 h-4" /> },
              { key: 'philosophy', label: 'Philosophy', icon: <Heart className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key as any)}
                className={`flex items-center space-x-2 px-6 py-4 transition-all duration-300 ${
                  selectedTab === tab.key
                    ? 'border-b-2 border-gray-800 text-gray-800'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div
          id="tab-content"
          data-animate
          className={`transition-all duration-700 ${
            visibleElements.has('tab-content')
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          {selectedTab === 'story' && (
            <div className="space-y-12">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-light text-gray-800 mb-4">The Artist&apos;s Genesis</h3>
                <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  From childhood sketches to masterful portraits, every line drawn has been a step 
                  towards understanding the delicate dance between light and shadow, emotion and form.
                </p>
              </div>

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
                  },
                  {
                    title: "Present Day",
                    content: "Today, I work from my Luton studio, dividing my time between commissioned portraits and personal projects. Each piece is an exploration of light, shadow, and the infinite complexity of human emotion. As a young revolutionary in Luton, my involvement with the RevoLutonary Cohort has enriched my artistic journey, enhancing my creative abilities and inspiring me to make a positive impact through art that celebrates Luton's rich cultural tapestry."
                  }
                ].map((section, index) => (
                  <div key={index} className="border-l-2 border-gray-100 pl-6">
                    <h4 className="text-xl font-light text-gray-800 mb-3">
                      {section.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 p-8 rounded">
                <Quote className="w-6 h-6 text-gray-400 mb-4" />
                <p className="text-lg italic text-gray-700 mb-4 leading-relaxed">
                  &quot;Every line I draw is a conversation between myself and the subject. It&apos;s about finding that moment of connection, 
                  that spark of recognition that makes a drawing come alive.&quot;
                </p>
                <div className="text-gray-500 text-sm">— Artist Statement, 2024</div>
              </div>
            </div>
          )}

          {selectedTab === 'process' && (
            <div className="space-y-12">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-light text-gray-800 mb-4">The Sacred Ritual</h3>
                <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Each artwork emerges through a meditative dance of observation, intuition, and countless hours 
                  of patient mark-making—a ritual as ancient as art itself.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {processSteps.map((step, index) => (
                  <div key={step.step} className="flex space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm">
                        {step.step}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-light text-gray-800 mb-2">
                        {step.title}
                      </h4>
                      <p className="text-gray-600 leading-relaxed text-sm">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded p-8">
                <h4 className="text-2xl font-light text-gray-800 mb-6 text-center">The Artist&apos;s Arsenal</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      title: "Pencils",
                      items: ["Staedtler Mars Lumograph (2H-8B)", "Faber-Castell 9000 series", "Mechanical pencils for detail work"]
                    },
                    {
                      title: "Paper",
                      items: ["Strathmore 400 Series Drawing", "Canson XL Bristol", "Fabriano Artistico for special pieces"]
                    },
                    {
                      title: "Accessories",
                      items: ["Kneaded erasers", "Blending stumps", "White charcoal for highlights"]
                    }
                  ].map((category, index) => (
                    <div key={index}>
                      <h5 className="font-light text-lg text-gray-800 mb-4">
                        {category.title}
                      </h5>
                      <ul className="space-y-2">
                        {category.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-gray-600 text-sm">
                            • {item}
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
            <div className="space-y-12">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-light text-gray-800 mb-4">The Artist&apos;s Creed</h3>
                <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Art is not merely about technique—it is a philosophy of seeing, feeling, and translating 
                  the ineffable essence of human experience into tangible form.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div>
                    <h4 className="text-2xl font-light text-gray-800 mb-4">
                      The Power of Simplicity
                    </h4>
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
                    <h4 className="text-2xl font-light text-gray-800 mb-4">
                      Capturing the Ephemeral
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      My portraits seek to capture not just physical likeness, but the fleeting expressions and emotions that make us human. 
                      A slight smile, the way light catches in someone&apos;s eyes, the weight of years in weathered hands—these are the moments I strive to preserve.
                    </p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-gray-50 p-6 rounded">
                    <h4 className="text-2xl font-light text-gray-800 mb-6">Sacred Principles</h4>
                    <ul className="space-y-4">
                      {[
                        { icon: <Heart className="w-4 h-4 text-red-500" />, text: "Art should evoke emotion and create genuine human connection" },
                        { icon: <Eye className="w-4 h-4 text-blue-500" />, text: "Patient observation reveals beauty in the most ordinary subjects" },
                        { icon: <Clock className="w-4 h-4 text-green-500" />, text: "The slow, meditative process of drawing is as important as the final result" },
                        { icon: <Lightbulb className="w-4 h-4 text-yellow-500" />, text: "Traditional techniques carry wisdom that remains relevant today" }
                      ].map((belief, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="mt-1">
                          {belief.icon}
                        </div>
                        <span className="text-gray-600 text-sm leading-relaxed">
                          {belief.text}
                        </span>
                      </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-2xl font-light text-gray-800 mb-4">
                      Looking Forward
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      As I continue to grow as an artist, I&apos;m excited to explore new subjects while deepening my mastery of traditional techniques. 
                      My goal is to create work that stands the test of time—drawings that will move viewers decades from now, 
                      just as the old masters continue to inspire us today.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center bg-gray-50 p-8 rounded">
                <Quote className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                <p className="text-xl font-light text-gray-700 italic leading-relaxed mb-4">
                  &quot;In every stroke lies a heartbeat, in every shadow a story, 
                  in every drawing a piece of the artist&apos;s soul made manifest.&quot;
                </p>
                <div className="w-12 h-px bg-gray-300 mx-auto"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;