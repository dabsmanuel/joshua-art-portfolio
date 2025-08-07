/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, Ruler, Palette, Eye, ArrowLeft, ArrowRight, Grid, List, ChevronDown } from 'lucide-react';
import { useArtworks } from '../../hooks/useArtwork';
import { useCreateInquiry } from '@/hooks/useInquiry';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

interface ArtworkImage {
  url: string;
  alt: string;
  isPrimary: boolean;
  _id: string;
  id: string;
}

interface Artwork {
  id: string;
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
  images: ArtworkImage[];
  primaryImage?: ArtworkImage;
  slug: string;
  availableOnPrint: boolean;
  isActive: boolean;
  views: number;
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
  const [isInquiryFormOpen, setIsInquiryFormOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError, error } = useArtworks({
    category: selectedCategory === 'all' ? undefined : selectedCategory,
  });

  const artworks = data?.artworks || [];

  const categories = [
    { id: 'all', name: 'All Work', count: artworks.length },
    {
      id: 'portraits',
      name: 'Portraits',
      count: artworks.filter((a) => a.category === 'portraits').length,
    },
    {
      id: 'landscapes',
      name: 'Landscapes',
      count: artworks.filter((a) => a.category === 'landscapes').length,
    },
    {
      id: 'still-life',
      name: 'Still Life',
      count: artworks.filter((a) => a.category === 'still-life').length,
    },
    {
      id: 'sketches',
      name: 'Sketches',
      count: artworks.filter((a) => a.category === 'sketches').length,
    },
  ];

  useEffect(() => {
    if (data?.artworks) {
      setFilteredArtworks(
        data.artworks.map((artwork: any) => ({
          id: artwork.id,
          title: artwork.title,
          category: artwork.category,
          medium: artwork.medium,
          dimensions: artwork.dimensions,
          year: artwork.year,
          description: artwork.description,
          tags: artwork.tags,
          featured: artwork.featured,
          sold: artwork.sold,
          price: artwork.price,
          images: artwork.images,
          primaryImage: artwork.primaryImage,
          slug: artwork.slug ?? '',
          availableOnPrint: artwork.availableOnPrint ?? false,
          isActive: artwork.isActive ?? true,
          views: artwork.views ?? 0,
        }))
      );
    }
  }, [data, selectedCategory]);

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

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      observer.disconnect();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [filteredArtworks]);

  const openModal = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsInquiryFormOpen(false);
    setSelectedArtwork(null);
    document.body.style.overflow = 'unset';
  };

  const navigateModal = (direction: 'next' | 'prev') => {
    if (!selectedArtwork) return;

    const currentIndex = filteredArtworks.findIndex((a) => a.id === selectedArtwork.id);
    let newIndex;

    if (direction === 'next') {
      newIndex = (currentIndex + 1) % filteredArtworks.length;
    } else {
      newIndex = currentIndex === 0 ? filteredArtworks.length - 1 : currentIndex - 1;
    }

    setSelectedArtwork(filteredArtworks[newIndex]);
    setIsInquiryFormOpen(false);
  };

  const getPrimaryImage = (artwork: Artwork): string | null => {
    if (artwork.primaryImage?.url) {
      return artwork.primaryImage.url;
    }
    if (artwork.images && artwork.images.length > 0) {
      return artwork.images[0].url;
    }
    return null;
  };

  const getImageAlt = (artwork: Artwork): string => {
    if (artwork.primaryImage?.alt) {
      return artwork.primaryImage.alt;
    }
    if (artwork.images && artwork.images.length > 0 && artwork.images[0].alt) {
      return artwork.images[0].alt;
    }
    return artwork.title;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading artworks...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-red-500 text-lg">
          Error loading artworks: {error?.message || 'Please try again later.'}
        </p>
      </div>
    );
  }

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
            Portfolio
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
            A collection of graphite and charcoal artworks capturing human emotion, nature, and everyday moments.
          </p>
        </div>
      </section>

      {/* Filters and Controls */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 px-4 py-2 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors bg-white"
              >
                <span className="text-gray-700">
                  {categories.find((cat) => cat.id === selectedCategory)?.name || 'Select Category'} ({categories.find((cat) => cat.id === selectedCategory)?.count || 0})
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                        selectedCategory === category.id ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className="text-sm text-gray-400">{category.count}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 border border-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="w-4 h-4" />
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
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArtworks.map((artwork, index) => {
              const imageUrl = getPrimaryImage(artwork);
              const imageAlt = getImageAlt(artwork);

              return (
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
                  <div className="bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="relative aspect-square bg-gray-50">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={imageAlt}
                          height={400}
                          width={400}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          onError={(e) => {
                            console.error(`Image failed to load for ${artwork.title}: ${imageUrl}`);
                            const target = e.target as HTMLImageElement;
                            target.classList.add('hidden');
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-display  ">
                          {artwork.title}
                        </div>
                      )}
                      {artwork.featured && (
                        <div className="absolute top-3 left-3 bg-black text-white px-2 py-1 text-xs rounded">
                          Featured
                        </div>
                      )}
                      {artwork.sold && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 text-xs rounded">
                          Sold
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                        {artwork.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 space-x-4 mb-3">
                        <span>{artwork.year}</span>
                        <span>•</span>
                        <span>{artwork.dimensions}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{artwork.medium}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {artwork.tags.slice(0, 2).map((tag, tagIndex) => (
                            <span
                              key={`${tag}-${tagIndex}`}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                            >
                              {tag.replace(/[\[\]"]/g, '')}
                            </span>
                          ))}
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {artwork.price ? `£${artwork.price}` : 'Inquire'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-8">
            {filteredArtworks.map((artwork, index) => {
              const imageUrl = getPrimaryImage(artwork);
              const imageAlt = getImageAlt(artwork);

              return (
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
                  <div className="bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3">
                        <div className="relative aspect-square bg-gray-50">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={imageAlt}
                              width={400}
                              height={400}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                              onError={(e) => {
                                console.error(`List view image failed to load for ${artwork.title}: ${imageUrl}`);
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                              {artwork.title}
                            </div>
                          )}
                          {artwork.featured && (
                            <div className="absolute top-3 left-3 bg-black text-white px-2 py-1 text-xs rounded">
                              Featured
                            </div>
                          )}
                          {artwork.sold && (
                            <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 text-xs rounded">
                              Sold
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="md:w-2/3 p-8 flex flex-col justify-between">
                        <div>
                          <h3 className="text-2xl font-medium text-gray-900 mb-4 group-hover:text-gray-700 transition-colors">
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
                          <p className="text-gray-600 leading-relaxed mb-6">{artwork.description}</p>
                          <div className="flex flex-wrap gap-2 mb-6">
                            {artwork.tags.map((tag, tagIndex) => (
                              <span
                                key={`${tag}-${tagIndex}`}
                                className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded"
                              >
                                {tag.replace(/[\[\]"]/g, '')}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-medium text-gray-900">
                            {artwork.price ? `£${artwork.price}` : 'Price on Request'}
                          </div>
                          <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
  const [isInquiryFormOpen, setIsInquiryFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    artworkId: artwork?.id.toString() || '',
    artworkTitle: artwork?.title || '',
  });
  const { mutate: createInquiry, isPending: isSubmitting, isError, error } = useCreateInquiry();

  useEffect(() => {
    setFormData({
      name: '',
      email: '',
      message: '',
      artworkId: artwork?.id.toString() || '',
      artworkTitle: artwork?.title || '',
    });
  }, [artwork]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createInquiry(formData, {
      onSuccess: () => {
        toast.success('Inquiry submitted successfully!');
        setFormData({ name: '', email: '', message: '', artworkId: artwork?.id.toString() || '', artworkTitle: artwork?.title || '' });
        setTimeout(() => {
          setIsInquiryFormOpen(false);
        }, 2000);
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to submit inquiry');
      },
    });
  };

  const getPrimaryImage = (artwork: Artwork): string | null => {
    if (artwork.primaryImage?.url) {
      return artwork.primaryImage.url;
    }
    if (artwork.images && artwork.images.length > 0) {
      return artwork.images[0].url;
    }
    return null;
  };

  const getImageAlt = (artwork: Artwork): string => {
    if (artwork.primaryImage?.alt) {
      return artwork.primaryImage.alt;
    }
    if (artwork.images && artwork.images.length > 0 && artwork.images[0].alt) {
      return artwork.images[0].alt;
    }
    return artwork.title;
  };

  if (!isOpen || !artwork) return null;

  const imageUrl = getPrimaryImage(artwork);
  const imageAlt = getImageAlt(artwork);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-8">
          {!isInquiryFormOpen ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-medium text-gray-900">
                  {artwork.title}
                </h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="relative">
                  <div className="bg-gray-50 rounded-lg overflow-hidden">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={imageAlt}
                        width={600}
                        height={600}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          console.error(`Modal image failed to load for ${artwork.title}: ${imageUrl}`);
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xl">
                        {artwork.title}
                      </div>
                    )}
                    {artwork.featured && (
                      <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-sm rounded">
                        Featured
                      </div>
                    )}
                    {artwork.sold && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 text-sm rounded">
                        Sold
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Year</h4>
                      <p className="text-gray-900">{artwork.year}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Dimensions</h4>
                      <p className="text-gray-900">{artwork.dimensions}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Medium</h4>
                      <p className="text-gray-900">{artwork.medium}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Price</h4>
                      <p className="text-gray-900 font-medium">{artwork.price ? `£${artwork.price}` : 'Price on Request'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Description</h4>
                    <p className="text-gray-700 leading-relaxed">{artwork.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {artwork.tags.map((tag, tagIndex) => (
                        <span
                          key={`${tag}-${tagIndex}`}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                        >
                          {tag.replace(/[\[\]"]/g, '')}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {!artwork.sold && (
                    <button
                      onClick={() => setIsInquiryFormOpen(true)}
                      className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Inquire About This Piece
                    </button>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-100">
                <button
                  onClick={onPrev}
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </button>
                <button
                  onClick={onNext}
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-medium text-gray-900">Inquire About {artwork.title}</h2>
                <button
                  onClick={() => setIsInquiryFormOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="Your email address"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    rows={4}
                    placeholder="Your inquiry details"
                  ></textarea>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Inquiring about: <span className="font-medium text-gray-900">{artwork.title}</span>
                    {artwork.price && ` (£${artwork.price})`}
                  </p>
                </div>
                {isError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 text-sm">{error?.message || 'Failed to submit inquiry'}</p>
                  </div>
                )}
                {isSubmitting && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-600 text-sm">Submitting your inquiry...</p>
                  </div>
                )}
                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setIsInquiryFormOpen(false)}
                    className="px-6 py-3 text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkPage;