/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users, ExternalLink, ChevronDown, Filter } from 'lucide-react';
import Image from 'next/image';

interface Exhibition {
  id: string;
  title: string;
  venue: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  type: 'solo' | 'group';
  status: 'upcoming' | 'current' | 'past';
  images: {
    url: string;
    alt: string;
    isPrimary: boolean;
  }[];
  website?: string;
  artworksCount: number;
  featured: boolean;
  openingReception?: {
    date: string;
    time: string;
  };
}

const ExhibitionsPage: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'upcoming' | 'current' | 'past'>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'solo' | 'group'>('all');
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Mock data - replace with actual data fetching
  const exhibitions: Exhibition[] = [
    {
      id: '1',
      title: 'Shadows and Light: A Charcoal Journey',
      venue: 'Modern Art Gallery',
      location: 'London, UK',
      startDate: '2025-09-15',
      endDate: '2025-11-30',
      description: 'A comprehensive solo exhibition featuring 25 charcoal and graphite works exploring the interplay between light and shadow in portraiture and landscape.',
      type: 'solo',
      status: 'upcoming',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
          alt: 'Gallery interior with charcoal artworks',
          isPrimary: true,
        }
      ],
      website: 'https://modernartgallery.com/exhibitions/shadows-and-light',
      artworksCount: 25,
      featured: true,
      openingReception: {
        date: '2025-09-15',
        time: '18:00 - 21:00'
      }
    },
    {
      id: '2',
      title: 'Contemporary Voices',
      venue: 'City Arts Centre',
      location: 'Birmingham, UK',
      startDate: '2025-08-01',
      endDate: '2025-08-31',
      description: 'A group exhibition featuring emerging artists working in traditional mediums. Showcasing the relevance of classical techniques in contemporary art.',
      type: 'group',
      status: 'current',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
          alt: 'Group exhibition space',
          isPrimary: true,
        }
      ],
      artworksCount: 8,
      featured: false,
    },
    {
      id: '3',
      title: 'Portraits in Graphite',
      venue: 'The Drawing Studio',
      location: 'Manchester, UK',
      startDate: '2025-03-10',
      endDate: '2025-04-28',
      description: 'An intimate solo exhibition focusing on portrait work, featuring commissioned pieces and personal studies in graphite.',
      type: 'solo',
      status: 'past',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800&h=600&fit=crop',
          alt: 'Portrait drawings displayed in gallery',
          isPrimary: true,
        }
      ],
      artworksCount: 18,
      featured: true,
    },
    {
      id: '4',
      title: 'Emerging Talent',
      venue: 'Local Art Collective',
      location: 'Luton, UK',
      startDate: '2024-11-05',
      endDate: '2024-12-20',
      description: 'A group exhibition showcasing local emerging artists working across various mediums and styles.',
      type: 'group',
      status: 'past',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=600&fit=crop',
          alt: 'Local art collective exhibition',
          isPrimary: true,
        }
      ],
      artworksCount: 6,
      featured: false,
    },
    {
      id: '5',
      title: 'First Light: Debut Exhibition',
      venue: 'Community Art Space',
      location: 'Luton, UK',
      startDate: '2024-06-15',
      endDate: '2024-07-31',
      description: 'My first solo exhibition featuring a collection of landscape and still-life studies created over two years.',
      type: 'solo',
      status: 'past',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&h=600&fit=crop',
          alt: 'First exhibition setup',
          isPrimary: true,
        }
      ],
      artworksCount: 15,
      featured: true,
    },
  ];

  const filteredExhibitions = exhibitions.filter(exhibition => {
    const statusMatch = selectedFilter === 'all' || exhibition.status === selectedFilter;
    const typeMatch = selectedType === 'all' || exhibition.type === selectedType;
    return statusMatch && typeMatch;
  });

  const upcomingCount = exhibitions.filter(e => e.status === 'upcoming').length;
  const currentCount = exhibitions.filter(e => e.status === 'current').length;
  const pastCount = exhibitions.filter(e => e.status === 'past').length;

  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleElements((prev) => new Set(prev).add(entry.target.id));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: '-20px',
    });

    const elementsToObserve = document.querySelectorAll('[data-animate]');
    elementsToObserve.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [filteredExhibitions]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: Exhibition['status']) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-700';
      case 'current':
        return 'bg-green-100 text-green-700';
      case 'past':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = (status: Exhibition['status']) => {
    switch (status) {
      case 'upcoming':
        return 'Upcoming';
      case 'current':
        return 'Current';
      case 'past':
        return 'Past';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="py-20 lg:py-32 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
          <h1
            id="hero-title"
            data-animate
            className={`text-5xl md:text-7xl font-thin text-gray-900 tracking-widest mb-8 transition-all duration-700 font-display ${
              visibleElements.has('hero-title') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Exhibitions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
            A journey through gallery spaces where charcoal and graphite artworks come to life, connecting with audiences in curated environments.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div
              id="stat-1"
              data-animate
              className={`transition-all duration-700 ${
                visibleElements.has('stat-1') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="text-3xl font-light text-gray-900 mb-2">{exhibitions.length}</div>
              <div className="text-gray-600">Total Exhibitions</div>
            </div>
            <div
              id="stat-2"
              data-animate
              className={`transition-all duration-700 delay-100 ${
                visibleElements.has('stat-2') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="text-3xl font-light text-gray-900 mb-2">{upcomingCount}</div>
              <div className="text-gray-600">Upcoming</div>
            </div>
            <div
              id="stat-3"
              data-animate
              className={`transition-all duration-700 delay-200 ${
                visibleElements.has('stat-3') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="text-3xl font-light text-gray-900 mb-2">{currentCount}</div>
              <div className="text-gray-600">Current</div>
            </div>
            <div
              id="stat-4"
              data-animate
              className={`transition-all duration-700 delay-300 ${
                visibleElements.has('stat-4') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="text-3xl font-light text-gray-900 mb-2">
                {exhibitions.reduce((sum, ex) => sum + ex.artworksCount, 0)}
              </div>
              <div className="text-gray-600">Artworks Displayed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-0  bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap gap-4">
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors bg-white md:hidden"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <div className={`${isFilterOpen ? 'block' : 'hidden'} md:flex absolute md:relative top-full md:top-auto left-0 md:left-auto mt-2 md:mt-0 bg-white md:bg-transparent border md:border-0 border-gray-200 rounded-lg md:rounded-none shadow-lg md:shadow-none z-50 md:z-auto p-4 md:p-0 space-y-2 md:space-y-0 md:space-x-4 min-w-[200px] md:min-w-0`}>
                  {/* Status Filter */}
                  <div className="flex flex-wrap gap-1">
                    {[
                      { id: 'all', label: 'All', count: exhibitions.length },
                      { id: 'upcoming', label: 'Upcoming', count: upcomingCount },
                      { id: 'current', label: 'Current', count: currentCount },
                      { id: 'past', label: 'Past', count: pastCount },
                    ].map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => {
                          setSelectedFilter(filter.id as any);
                          setIsFilterOpen(false);
                        }}
                        className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedFilter === filter.id
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {filter.label} ({filter.count})
                      </button>
                    ))}
                  </div>
                  
                  <div className="w-px bg-gray-200 hidden md:block"></div>
                  
                  {/* Type Filter */}
                  <div className="flex flex-wrap gap-1">
                    {[
                      { id: 'all', label: 'All Types' },
                      { id: 'solo', label: 'Solo' },
                      { id: 'group', label: 'Group' },
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => {
                          setSelectedType(type.id as any);
                          setIsFilterOpen(false);
                        }}
                        className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedType === type.id
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-gray-500">
              {filteredExhibitions.length} {filteredExhibitions.length === 1 ? 'exhibition' : 'exhibitions'}
            </div>
          </div>
        </div>
      </div>

      {/* Exhibitions Grid */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {filteredExhibitions.map((exhibition, index) => (
            <div
              key={exhibition.id}
              id={`exhibition-${exhibition.id}`}
              data-animate
              className={`transition-all duration-700 ${
                visibleElements.has(`exhibition-${exhibition.id}`)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  {/* Image */}
                  <div className="relative aspect-video lg:aspect-square">
                    <Image
                      src={exhibition.images[0]?.url}
                      alt={exhibition.images[0]?.alt}
                      fill
                      className="object-cover"
                      loading="lazy"
                    />
                    {exhibition.featured && (
                      <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-sm rounded">
                        Featured
                      </div>
                    )}
                    <div className={`absolute top-4 right-4 px-3 py-1 text-sm rounded ${getStatusColor(exhibition.status)}`}>
                      {getStatusText(exhibition.status)}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-8 lg:p-12 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-3 mb-4">
                        <span className={`px-3 py-1 text-sm rounded ${
                          exhibition.type === 'solo' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {exhibition.type === 'solo' ? 'Solo Exhibition' : 'Group Exhibition'}
                        </span>
                      </div>
                      
                      <h2 className="text-2xl lg:text-3xl font-medium text-gray-900 mb-4">
                        {exhibition.title}
                      </h2>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-3 flex-shrink-0" />
                          <span>{exhibition.venue}, {exhibition.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-3 flex-shrink-0" />
                          <span>
                            {formatDate(exhibition.startDate)} - {formatDate(exhibition.endDate)}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Users className="w-4 h-4 mr-3 flex-shrink-0" />
                          <span>{exhibition.artworksCount} artworks</span>
                        </div>
                        {exhibition.openingReception && (
                          <div className="flex items-center text-gray-600">
                            <Clock className="w-4 h-4 mr-3 flex-shrink-0" />
                            <span>
                              Opening: {formatDate(exhibition.openingReception.date)}, {exhibition.openingReception.time}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-gray-700 leading-relaxed mb-6">
                        {exhibition.description}
                      </p>
                    </div>
                    
                    {exhibition.website && (
                      <div className="flex justify-start">
                        <a
                          href={exhibition.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-gray-900 hover:text-gray-700 transition-colors"
                        >
                          <span>Visit Exhibition Page</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExhibitionsPage;