/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState, useEffect } from 'react';
import { Artwork } from '../../../types';
import ArtworkCard from './ArtworkCard';
import ArtworkModal from './ArtworkModal';
import Link from 'next/link';
import { Palette, Feather, Eye, Brush } from 'lucide-react';
import { useFeaturedArtworks } from '../../../hooks/useArtwork'; // Adjust the import path as needed

interface WorkProps {
  visibleElements?: Set<string>;
}

const Work: React.FC<WorkProps> = ({ visibleElements = new Set() }) => {
  const [selectedArtwork, setSelectedArtwork] = useState<any | null>(null); // Use ArtworkResponse or any to match modal prop
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { data: artworks = [], isLoading, isError } = useFeaturedArtworks();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    console.log('Artworks received in Work component:', artworks);
  }, [artworks]);

  const handleArtworkClick = (artwork: any) => {
    setSelectedArtwork(artwork); // artwork is ArtworkResponse
  };

  const handleCloseModal = () => {
    setSelectedArtwork(null);
  };

  // Get the latest 3 featured artworks with deduplication
  const uniqueArtworks = artworks.filter((artwork, index, self) => 
    index === self.findIndex(a => a.id === artwork.id)
  );
  const latestThreeArtworks = uniqueArtworks.slice(0, 3);

  // Component to render artwork cards with loading states
  const ArtworkCards = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-20">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="group relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-amber-600/20 to-blue-600/20 rounded-2xl blur-lg"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl"></div>
              
              <div className="relative bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 h-64 flex items-center justify-center">
                <div className="text-center">
                  <Brush className="w-8 h-8 mx-auto mb-4 text-amber-400 animate-spin" />
                  <div className="text-gray-400 text-sm">Loading artwork...</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-20">
          <div className="col-span-full flex justify-center">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-800/50 to-red-700/50 backdrop-blur-lg rounded-full text-red-400 text-sm font-light tracking-wider border border-red-600/30">
              <Eye className="w-4 h-4 mr-2" />
              Error loading artworks. Please try again later.
            </div>
          </div>
        </div>
      );
    }

    if (latestThreeArtworks.length === 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-20">
          <div className="col-span-full flex justify-center">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-lg rounded-full text-gray-400 text-sm font-light tracking-wider border border-gray-600/30">
              <Palette className="w-4 h-4 mr-2" />
              No featured artworks available at the moment.
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-20">
        {latestThreeArtworks.map((artworkResponse, index) => {
          // Convert ArtworkResponse to Artwork with proper ID handling
          const artwork: Artwork = {
            ...artworkResponse,
            // Use a fallback ID if the original ID is invalid
            id: (artworkResponse.id !== undefined && artworkResponse.id !== null && !isNaN(Number(artworkResponse.id))) 
              ? Number(artworkResponse.id) 
              : index + 1000, // Fallback to index-based ID
            year: String(artworkResponse.year),
            images: artworkResponse.images ?? [],
          };

          // Generate a unique key that combines both the artwork ID and index as extra safety
          const uniqueKey = `artwork-${artwork.id}-${index}`;

          return (
            <div 
              key={uniqueKey}
              className="group relative"
              style={{
                animationDelay: `${index * 150}ms`
              }}
            >
              {/* Artistic frame effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-amber-600/20 to-blue-600/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl"></div>
              
              <div className="relative">
                <ArtworkCard
                  artwork={artworkResponse}
                  isVisible={true}
                  delay={index * 150}
                  onClick={() => handleArtworkClick(artworkResponse)}
                />
              </div>

              {/* Floating accent elements */}
              <div className="absolute -top-3 -right-3 w-6 h-6 border-2 border-amber-400/50 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="absolute -bottom-3 -left-3 w-4 h-4 border-2 border-blue-400/50 rounded-full animate-pulse delay-500 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section id="work" className="py-24 lg:py-32 bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white relative overflow-hidden">
      {/* Artistic Background Elements */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute top-32 right-20 w-80 h-80 border border-gray-600 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-16 w-64 h-64 border border-gray-700 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/3 w-48 h-48 border border-gray-500 rounded-full animate-pulse delay-500"></div>
      </div>

      {/* Floating Artistic Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute w-2 h-2 bg-amber-400 rounded-full opacity-70 transition-all duration-1000 ease-out"
          style={{
            left: mousePosition.x * 0.1 + 150,
            top: mousePosition.y * 0.1 + 80,
          }}
        ></div>
        <div 
          className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-50 transition-all duration-1500 ease-out"
          style={{
            left: mousePosition.x * 0.05 + 250,
            top: mousePosition.y * 0.05 + 120,
          }}
        ></div>
        <div 
          className="absolute w-3 h-3 bg-purple-400 rounded-full opacity-40 transition-all duration-2000 ease-out"
          style={{
            left: mousePosition.x * 0.08 + 350,
            top: mousePosition.y * 0.08 + 180,
          }}
        ></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header - Canvas Style */}
        <div className="text-center mb-20">
          <div 
            id="work-subtitle"
            data-animate
            className={`transition-all duration-700 ${
              visibleElements.has('work-subtitle') || visibleElements.size === 0
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-lg rounded-full text-amber-400 text-sm font-light tracking-wider mb-8 border border-gray-600/30">
              <Feather className="w-4 h-4 mr-2" />
              Featured Creations
            </div>
          </div>
          
          <h2 
            id="work-title"
            data-animate
            className={`text-6xl md:text-8xl font-light text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-blue-200 mb-6 font-serif tracking-wider transition-all duration-700 ${
              visibleElements.has('work-title') || visibleElements.size === 0
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            Featured
            <span className="block text-5xl md:text-6xl font-light italic text-gray-300 mt-2">
              Artworks
            </span>
          </h2>

          {/* Artistic divider */}
          <div 
            id="work-divider"
            data-animate
            className={`flex items-center justify-center space-x-4 transition-all duration-700 ${
              visibleElements.has('work-divider') || visibleElements.size === 0
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-95'
            }`}
          >
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
          </div>

          <p 
            id="work-description"
            data-animate
            className={`text-xl text-gray-300 font-light tracking-wide mt-8 transition-all duration-700 delay-300 ${
              visibleElements.has('work-description') || visibleElements.size === 0
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            Graphite & Charcoal Compositions
          </p>
        </div>
        
        {/* Artworks Grid - Only this section depends on loading state */}
        <div 
          id="work-grid"
          data-animate
          className={`transition-all duration-1000 delay-500 ${
            visibleElements.has('work-grid') || visibleElements.size === 0
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-12'
          }`}
        >
          <ArtworkCards />
        </div>
        
        {/* Artistic "See More" section */}
        <div 
          id="work-cta"
          data-animate
          className={`flex items-center justify-center transition-all duration-1000 delay-700 ${
            visibleElements.has('work-cta') || visibleElements.size === 0
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="relative group">
            {/* Sketch-like border effects */}
            <div className="absolute -inset-4 bg-gradient-to-r from-amber-600/20 to-blue-600/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
            <div className="absolute -inset-2 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl"></div>
            
            <Link href='/work' className='relative bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 rounded-xl text-white flex items-center font-medium text-lg hover:from-amber-600 hover:to-amber-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-2xl'>
              <span>Explore Gallery</span>
              <div className="ml-3 w-5 h-5 border-2 border-white rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </Link>

            {/* Floating accent elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 border-2 border-amber-400/50 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 border-2 border-blue-400/50 rounded-full animate-pulse delay-500 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          </div>
        </div>
      </div>

      {/* Artwork Modal */}
      {selectedArtwork && (
        <ArtworkModal 
          artwork={selectedArtwork} // selectedArtwork is now ArtworkResponse
          onClose={handleCloseModal}
        />
      )}
    </section>
  );
};

export default Work;