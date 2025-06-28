'use client';

import React, { useState, useEffect } from 'react';
import {  Grid, List, Search, ShoppingCart, Eye, Heart, Tag, Palette, Award, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface Artwork {
  id: number;
  title: string;
  image: string;
  price: number;
  size: string;
  medium: string;
  year: number;
  category: string;
  description: string;
  available: boolean;
  featured?: boolean;
}

interface Category {
  name: string;
  count: number;
  description: string;
}

const OriginalArtworkPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());

  const artworks: Artwork[] = [
    {
      id: 1,
      title: "Morning Light",
      image: "/api/placeholder/400/500",
      price: 850,
      size: "16\" x 20\"",
      medium: "Graphite on paper",
      year: 2024,
      category: "landscapes",
      description: "A serene landscape capturing the first light of dawn breaking through ancient oak trees.",
      available: true,
      featured: true
    },
    {
      id: 2,
      title: "The Thinker",
      image: "/api/placeholder/400/500",
      price: 1200,
      size: "18\" x 24\"",
      medium: "Charcoal and graphite",
      year: 2024,
      category: "portraits",
      description: "A contemplative portrait study exploring the depths of human expression and emotion.",
      available: true
    },
    {
      id: 3,
      title: "Victorian Rose",
      image: "/api/placeholder/400/500",
      price: 650,
      size: "12\" x 16\"",
      medium: "Detailed graphite",
      year: 2024,
      category: "still-life",
      description: "An intricate study of a single rose, showcasing delicate petal textures and subtle shadows.",
      available: true
    },
    {
      id: 4,
      title: "Urban Solitude",
      image: "/api/placeholder/400/500",
      price: 1100,
      size: "20\" x 24\"",
      medium: "Charcoal on paper",
      year: 2023,
      category: "urban",
      description: "A powerful urban scene capturing the isolation and beauty of city life.",
      available: false
    },
    {
      id: 5,
      title: "Ancient Hands",
      image: "/api/placeholder/400/500",
      price: 750,
      size: "14\" x 18\"",
      medium: "Graphite study",
      year: 2024,
      category: "studies",
      description: "A detailed study of weathered hands, telling stories through every line and wrinkle.",
      available: true,
      featured: true
    },
    {
      id: 6,
      title: "Misty Harbor",
      image: "/api/placeholder/400/500",
      price: 950,
      size: "18\" x 24\"",
      medium: "Mixed graphite",
      year: 2023,
      category: "landscapes",
      description: "A moody harbor scene with boats emerging from morning mist.",
      available: true
    },
    {
      id: 7,
      title: "Classical Drapery",
      image: "/api/placeholder/400/500",
      price: 580,
      size: "11\" x 14\"",
      medium: "Charcoal study",
      year: 2024,
      category: "studies",
      description: "A classical study of flowing fabric, exploring light, shadow, and form.",
      available: true
    },
    {
      id: 8,
      title: "City Rain",
      image: "/api/placeholder/400/500",
      price: 1300,
      size: "20\" x 30\"",
      medium: "Charcoal and graphite",
      year: 2023,
      category: "urban",
      description: "An atmospheric urban scene with rain-soaked streets and reflected city lights.",
      available: true,
      featured: true
    }
  ];

  const categories: Category[] = [
    { name: 'all', count: artworks.length, description: 'All available artwork' },
    { name: 'landscapes', count: artworks.filter(a => a.category === 'landscapes').length, description: 'Natural scenes and environments' },
    { name: 'portraits', count: artworks.filter(a => a.category === 'portraits').length, description: 'Human expression and character studies' },
    { name: 'still-life', count: artworks.filter(a => a.category === 'still-life').length, description: 'Objects and botanical studies' },
    { name: 'urban', count: artworks.filter(a => a.category === 'urban').length, description: 'City scenes and architecture' },
    { name: 'studies', count: artworks.filter(a => a.category === 'studies').length, description: 'Technical and practice studies' }
  ];

  const featuredArtworks = artworks.filter(artwork => artwork.featured);

  const filteredArtworks = artworks
    .filter(artwork => {
      const matchesCategory = selectedCategory === 'all' || artwork.category === selectedCategory;
      const matchesSearch = artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           artwork.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'oldest': return a.year - b.year;
        case 'newest':
        default: return b.year - a.year;
      }
    });

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

  const formatPrice = (price: number) => `£${price.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-32">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Palette className="w-8 h-8 text-gray-700" />
              <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">Original Artwork</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-6">
              Available Originals
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover unique, one-of-a-kind pencil and charcoal artworks available for immediate purchase. 
              Each piece is an original creation, meticulously crafted and ready to find its perfect home.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Artworks */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div
            id="featured"
            data-animate
            className={`text-center mb-16 transition-all duration-700 ${
              visibleElements.has('featured')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Award className="w-6 h-6 text-yellow-600" />
              <h2 className="text-4xl font-light text-gray-900">Featured Originals</h2>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Handpicked pieces that showcase the range and depth of my artistic practice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredArtworks.map((artwork, index) => (
              <div
                key={artwork.id}
                data-animate
                id={`featured-${artwork.id}`}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
                  visibleElements.has(`featured-${artwork.id}`)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-[4/5] bg-gray-200 relative overflow-hidden group">
                  <Image 
                    src={artwork.image} 
                    alt={artwork.title}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-3">
                      <button className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition-colors">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition-colors">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-medium">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{artwork.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{artwork.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span>{artwork.size}</span>
                    <span>{artwork.medium}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-semibold text-gray-900">{formatPrice(artwork.price)}</span>
                    <button className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2">
                      <ShoppingCart className="w-4 h-4" />
                      <span>Purchase</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters and Gallery */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Search and Filters */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search artworks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              {/* Sort and View Controls */}
              <div className="flex items-center space-x-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>

                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${
                      viewMode === 'grid'
                        ? 'bg-gray-900 text-white'
                        : 'bg-white text-gray-400 hover:text-gray-600'
                    } transition-colors`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${
                      viewMode === 'list'
                        ? 'bg-gray-900 text-white'
                        : 'bg-white text-gray-400 hover:text-gray-600'
                    } transition-colors`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.name
                      ? 'bg-gray-900 text-white shadow-lg'
                      : 'bg-white text-gray-600 border border-gray-300 hover:border-gray-400 hover:shadow-md'
                  }`}
                >
                  {category.name === 'all' ? 'All' : category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                  <span className="ml-2 text-xs opacity-75">({category.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-8">
            <p className="text-gray-600">
              Showing {filteredArtworks.length} of {artworks.length} artworks
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>

          {/* Gallery Grid */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredArtworks.map((artwork, index) => (
                <div
                  key={artwork.id}
                  data-animate
                  id={`artwork-${artwork.id}`}
                  className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 ${
                    visibleElements.has(`artwork-${artwork.id}`)
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="aspect-[4/5] bg-gray-200 relative overflow-hidden group">
                    <Image
                      src={artwork.image} 
                      alt={artwork.title}
                      height={500}
                      width={500}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                        <button className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors">
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {!artwork.available && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Sold
                        </span>
                      </div>
                    )}
                    {artwork.featured && artwork.available && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{artwork.title}</h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{artwork.description}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                      <span>{artwork.size}</span>
                      <span>{artwork.year}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-semibold text-gray-900">{formatPrice(artwork.price)}</span>
                      {artwork.available ? (
                        <button className="bg-gray-900 text-white px-3 py-1 rounded-md hover:bg-gray-800 transition-colors text-sm flex items-center space-x-1">
                          <ShoppingCart className="w-3 h-3" />
                          <span>Buy</span>
                        </button>
                      ) : (
                        <span className="text-red-500 text-sm font-medium">Sold Out</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-6">
              {filteredArtworks.map((artwork, index) => (
                <div
                  key={artwork.id}
                  data-animate
                  id={`list-artwork-${artwork.id}`}
                  className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 ${
                    visibleElements.has(`list-artwork-${artwork.id}`)
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-64 aspect-[4/5] md:aspect-square bg-gray-200 relative overflow-hidden group">
                      <Image
                        src={artwork.image} 
                        alt={artwork.title}
                        width={500}
                        height={500}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {!artwork.available && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            Sold
                          </span>
                        </div>
                      )}
                      {artwork.featured && artwork.available && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium">
                            Featured
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-semibold text-gray-900 mb-2">{artwork.title}</h3>
                          <p className="text-gray-600 mb-4">{artwork.description}</p>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Eye className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Heart className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
                        <div>
                          <span className="text-gray-500">Size:</span>
                          <p className="font-medium text-gray-900">{artwork.size}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Medium:</span>
                          <p className="font-medium text-gray-900">{artwork.medium}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Year:</span>
                          <p className="font-medium text-gray-900">{artwork.year}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Category:</span>
                          <p className="font-medium text-gray-900 capitalize">{artwork.category}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-3xl font-semibold text-gray-900">{formatPrice(artwork.price)}</span>
                        {artwork.available ? (
                          <button className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2">
                            <ShoppingCart className="w-4 h-4" />
                            <span>Purchase Original</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-red-500 text-lg font-medium">Sold Out</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {filteredArtworks.length === 0 && (
            <div className="text-center py-12">
              <div className="mb-4">
                <Tag className="w-12 h-12 text-gray-400 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No artworks found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or category filters.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="text-gray-900 hover:text-gray-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default OriginalArtworkPage;