'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Ruler, Palette, Eye, ArrowLeft, ArrowRight, Grid, List } from 'lucide-react';

interface Artwork {
  id: number;
  title: string;
  category: 'portraits' | 'landscapes' | 'still-life' | 'sketches';
  medium: string;
  dimensions: string;
  year: number;
  description: string;
  tags: string[];
  featured: boolean;
  sold: boolean;
  price?: string;
}

interface ArtworkModalProps {
  artwork: Artwork | null;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const WorkPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>([]);

  const artworks: Artwork[] = [
    {
      id: 1,
      title: "Silent Contemplation",
      category: "portraits",
      medium: "Graphite on Paper",
      dimensions: "18\" x 24\"",
      year: 2024,
      description: "A deeply introspective portrait exploring the quiet moments of human reflection. The interplay of light and shadow creates a sense of peaceful solitude.",
      tags: ["realistic", "emotion", "light-study"],
      featured: true,
      sold: false,
      price: "$1,200"
    },
    {
      id: 2,
      title: "Mountain Vista",
      category: "landscapes",
      medium: "Charcoal on Paper",
      dimensions: "16\" x 20\"",
      year: 2024,
      description: "Capturing the majestic grandeur of mountain peaks shrouded in morning mist. The texture and depth showcase the raw beauty of nature.",
      tags: ["nature", "atmospheric", "texture"],
      featured: true,
      sold: false,
      price: "$950"
    },
    {
      id: 3,
      title: "Old Wisdom",
      category: "portraits",
      medium: "Graphite on Paper",
      dimensions: "14\" x 18\"",
      year: 2023,
      description: "Every line tells a story in this portrait of aged hands and weathered features. A celebration of life's journey etched in graphite.",
      tags: ["elderly", "character", "detailed"],
      featured: false,
      sold: true,
      price: "Sold"
    },
    {
      id: 4,
      title: "Morning Coffee",
      category: "still-life",
      medium: "Graphite on Paper",
      dimensions: "12\" x 16\"",
      year: 2024,
      description: "The simple pleasure of morning rituals captured in detailed realism. Steam, texture, and light create an intimate moment.",
      tags: ["daily-life", "texture", "light"],
      featured: false,
      sold: false,
      price: "$750"
    },
    {
      id: 5,
      title: "Urban Sketch Series #3",
      category: "sketches",
      medium: "Pencil on Paper",
      dimensions: "9\" x 12\"",
      year: 2024,
      description: "Quick observational sketch capturing the energy and movement of city life. Loose yet confident strokes convey urban rhythm.",
      tags: ["urban", "movement", "observational"],
      featured: false,
      sold: false,
      price: "$400"
    },
    {
      id: 6,
      title: "Childhood Dreams",
      category: "portraits",
      medium: "Graphite on Paper",
      dimensions: "20\" x 24\"",
      year: 2023,
      description: "A tender portrait capturing the innocence and wonder of youth. Soft rendering techniques emphasize the subject's gentle nature.",
      tags: ["children", "soft", "emotion"],
      featured: true,
      sold: false,
      price: "$1,400"
    },
    {
      id: 7,
      title: "Forest Path",
      category: "landscapes",
      medium: "Charcoal and Graphite",
      dimensions: "18\" x 24\"",
      year: 2023,
      description: "A mysterious woodland path disappearing into dappled shadows. The mixed media approach creates rich tonal variations.",
      tags: ["forest", "mystery", "mixed-media"],
      featured: false,
      sold: false,
      price: "$1,100"
    },
    {
      id: 8,
      title: "Vintage Books",
      category: "still-life",
      medium: "Graphite on Paper",
      dimensions: "14\" x 18\"",
      year: 2024,
      description: "Weathered spines and worn pages tell stories of knowledge passed down through generations. Texture study in graphite.",
      tags: ["vintage", "texture", "knowledge"],
      featured: false,
      sold: true,
      price: "Sold"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Work', count: artworks.length },
    { id: 'portraits', name: 'Portraits', count: artworks.filter(a => a.category === 'portraits').length },
    { id: 'landscapes', name: 'Landscapes', count: artworks.filter(a => a.category === 'landscapes').length },
    { id: 'still-life', name: 'Still Life', count: artworks.filter(a => a.category === 'still-life').length },
    { id: 'sketches', name: 'Sketches', count: artworks.filter(a => a.category === 'sketches').length }
  ];

  useEffect(() => {
    const filtered = selectedCategory === 'all' 
      ? artworks 
      : artworks.filter(artwork => artwork.category === selectedCategory);
    setFilteredArtworks(filtered);
  }, [selectedCategory]);

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
  }, [filteredArtworks]);

  const openModal = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArtwork(null);
    document.body.style.overflow = 'unset';
  };

  const navigateModal = (direction: 'next' | 'prev') => {
    if (!selectedArtwork) return;
    
    const currentIndex = filteredArtworks.findIndex(a => a.id === selectedArtwork.id);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % filteredArtworks.length;
    } else {
      newIndex = currentIndex === 0 ? filteredArtworks.length - 1 : currentIndex - 1;
    }
    
    setSelectedArtwork(filteredArtworks[newIndex]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-4">
              Portfolio
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A collection of pencil artwork spanning portraits, landscapes, and observational studies. 
              Each piece represents a moment captured in graphite and charcoal.
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-gray-900 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>

            {/* View Controls */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
              <div className="text-sm text-gray-500">
                {filteredArtworks.length} {filteredArtworks.length === 1 ? 'piece' : 'pieces'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Artwork Grid/List */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArtworks.map((artwork, index) => (
              <div
                key={artwork.id}
                id={`artwork-${artwork.id}`}
                data-animate
                className={`group cursor-pointer transition-all duration-700 ${
                  visibleElements.has(`artwork-${artwork.id}`)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onClick={() => openModal(artwork)}
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
                  <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-medium text-lg group-hover:scale-105 transition-transform duration-500">
                      {artwork.title}
                    </div>
                    {artwork.featured && (
                      <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold">
                        Featured
                      </div>
                    )}
                    {artwork.sold && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Sold
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                      <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {artwork.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 space-x-4 mb-3">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {artwork.year}
                      </span>
                      <span className="flex items-center">
                        <Ruler className="w-4 h-4 mr-1" />
                        {artwork.dimensions}
                      </span>
                    </div>
                    <p className="text-gray-600 italic mb-3">
                      {artwork.medium}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {artwork.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        {artwork.price}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredArtworks.map((artwork, index) => (
              <div
                key={artwork.id}
                id={`artwork-list-${artwork.id}`}
                data-animate
                className={`group cursor-pointer transition-all duration-700 ${
                  visibleElements.has(`artwork-list-${artwork.id}`)
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onClick={() => openModal(artwork)}
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-medium">
                          {artwork.title}
                        </div>
                        {artwork.featured && (
                          <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
                            Featured
                          </div>
                        )}
                        {artwork.sold && (
                          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            Sold
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="md:w-2/3 flex flex-col justify-between">
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                          {artwork.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 space-x-6 mb-4">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {artwork.year}
                          </span>
                          <span className="flex items-center">
                            <Ruler className="w-4 h-4 mr-2" />
                            {artwork.dimensions}
                          </span>
                          <span className="flex items-center">
                            <Palette className="w-4 h-4 mr-2" />
                            {artwork.medium}
                          </span>
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-4">
                          {artwork.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {artwork.tags.map((tag) => (
                            <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xl font-semibold text-gray-900">
                          {artwork.price}
                        </div>
                        <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                          <Eye className="w-5 h-5 mr-2" />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <ArtworkModal
        artwork={selectedArtwork}
        isOpen={isModalOpen}
        onClose={closeModal}
        onNext={() => navigateModal('next')}
        onPrev={() => navigateModal('prev')}
      />
    </div>
  );
};

const ArtworkModal: React.FC<ArtworkModalProps> = ({ artwork, isOpen, onClose, onNext, onPrev }) => {
  if (!isOpen || !artwork) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-80" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-semibold text-gray-900">{artwork.title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image */}
            <div className="relative">
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-gray-500 font-medium text-xl">
                {artwork.title}
              </div>
              {artwork.featured && (
                <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                  Featured
                </div>
              )}
              {artwork.sold && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Sold
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Year:</span>
                  <p className="font-medium">{artwork.year}</p>
                </div>
                <div>
                  <span className="text-gray-500">Dimensions:</span>
                  <p className="font-medium">{artwork.dimensions}</p>
                </div>
                <div>
                  <span className="text-gray-500">Medium:</span>
                  <p className="font-medium">{artwork.medium}</p>
                </div>
                <div>
                  <span className="text-gray-500">Price:</span>
                  <p className="font-medium text-lg">{artwork.price}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{artwork.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {artwork.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {!artwork.sold && (
                <button className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
                  Inquire About This Piece
                </button>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onPrev}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Previous
            </button>
            <button
              onClick={onNext}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Next
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkPage;