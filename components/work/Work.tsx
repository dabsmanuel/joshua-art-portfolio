/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, Ruler, Palette, Eye, ArrowLeft, ArrowRight, Grid, List, Feather, ChevronDown } from 'lucide-react';
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showImageZoom, setShowImageZoom] = useState(false);
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

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <p className="text-gray-300 font-light text-lg">Loading artworks...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <p className="text-red-500 font-light text-lg">
          Error loading artworks: {error?.message || 'Please try again later.'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white relative overflow-hidden">
      {/* Artistic Background Elements */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 border border-gray-600 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 right-20 w-96 h-96 border border-gray-700 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-48 h-48 border border-gray-500 rounded-full animate-pulse delay-500"></div>
      </div>

      {/* Floating Artistic Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute w-2 h-2 bg-amber-400 rounded-full opacity-70 transition-all duration-1000 ease-out"
          style={{ left: mousePosition.x * 0.1 + 100, top: mousePosition.y * 0.1 + 50 }}
        ></div>
        <div
          className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-50 transition-all duration-1500 ease-out"
          style={{ left: mousePosition.x * 0.05 + 200, top: mousePosition.y * 0.05 + 100 }}
        ></div>
        <div
          className="absolute w-3 h-3 bg-purple-400 rounded-full opacity-40 transition-all duration-2000 ease-out"
          style={{ left: mousePosition.x * 0.08 + 300, top: mousePosition.y * 0.08 + 150 }}
        ></div>
      </div>

      {/* Hero Section */}
      <section id="hero" className="py-20 lg:py-32 relative z-10 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="relative">
            <Feather className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 w-8 h-8 text-amber-400 animate-bounce" />
            <h1
              id="hero-title"
              data-animate
              className={`text-5xl md:text-7xl font-light text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-blue-200 mb-6 font-serif tracking-wider transition-all duration-1000 ${
                visibleElements.has('hero-title') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
            >
              Portfolio
              <span className="block text-6xl md:text-8xl font-extralight -mt-3 tracking-wider">
                Gallery
              </span>
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-8"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light italic leading-relaxed">
              A curated collection of graphite and charcoal artworks, capturing the essence of human emotion, nature, and everyday moments.
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Controls */}
      <div className="bg-gradient-to-r from-gray-800/80 via-gray-700/80 to-gray-800/80 backdrop-blur-lg sticky top-0 z-40 border-b border-gray-600/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 px-6 py-3 rounded-xl font-light transition-all duration-300 bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg hover:bg-amber-700"
              >
                <Palette className="w-5 h-5 text-white" />
                <span>
                  {categories.find((cat) => cat.id === selectedCategory)?.name || 'Select Category'} ({categories.find((cat) => cat.id === selectedCategory)?.count || 0})
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-gray-800/95 backdrop-blur-lg rounded-xl shadow-xl border border-gray-600/30 z-50 overflow-hidden">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-200 ${
                        selectedCategory === category.id ? 'bg-gray-700/50 text-white' : ''
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
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    viewMode === 'grid'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-gray-600/50 border border-gray-600/30'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    viewMode === 'list'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-gray-600/50 border border-gray-600/30'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
              <div className="text-sm text-gray-300 font-light">
                {filteredArtworks.length} {filteredArtworks.length === 1 ? 'piece' : 'pieces'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Artwork Grid/List */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 relative z-10">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredArtworks.map((artwork, index) => {
              const imageUrl = getPrimaryImage(artwork);
              const imageAlt = getImageAlt(artwork);

              return (
                <div
                  key={artwork.id}
                  id={`artwork-${artwork.id}`}
                  data-animate
                  className={`group cursor-pointer transition-all duration-1000 ${
                    visibleElements.has(`artwork-${artwork.id}`)
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-12'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                  onClick={() => openModal(artwork)}
                >
                  <div className="relative bg-gradient-to-br from-gray-800/40 to-gray-700/40 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-600/30 group-hover:shadow-xl transition-all duration-300">
                    <div className="absolute -inset-2 bg-gradient-to-r from-amber-600/20 to-blue-６00/20 rounded-3xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
                    <div className="relative p-4">
                      <div className="aspect-[1/1] relative bg-gray-900 rounded-lg overflow-hidden">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={imageAlt}
                            height={500}
                            width={500}
                            className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700"
                            loading="lazy"
                            onLoad={() => console.log(`Image loaded successfully for ${artwork.title}`)}
                            onError={(e) => {
                              console.error(`Image failed to load for ${artwork.title}: ${imageUrl}`);
                              const target = e.target as HTMLImageElement;
                              target.classList.add('hidden');
                            }}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-gray-300 font-light text-lg">
                            {artwork.title}
                          </div>
                        )}
                        {artwork.featured && (
                          <div className="absolute top-4 left-4 bg-amber-400 text-amber-900 px-3 py-1 rounded-full text-xs font-light">
                            Featured
                          </div>
                        )}
                        {artwork.sold && (
                          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-light">
                            Sold
                          </div>
                        )}
                        <div className="absolute inset-0 transition-all duration-300 flex items-center justify-center">
                          <Eye className="w-8 h-8 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-light text-white mb-2 font-serif tracking-wide group-hover:text-amber-400 transition-colors duration-300">
                          {artwork.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-300 font-light space-x-4 mb-3">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1 text-amber-400" />
                            {artwork.year}
                          </span>
                          <span className="flex items-center">
                            <Ruler className="w-4 h-4 mr-1 text-amber-400" />
                            {artwork.dimensions}
                          </span>
                        </div>
                        <p className="text-gray-300 font-light italic mb-3">{artwork.medium}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {artwork.tags.slice(0, 2).map((tag, tagIndex) => (
                              <span
                                key={`${tag}-${tagIndex}`}
                                className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full font-light group-hover:bg-amber-500/50 group-hover:text-white transition-all duration-300"
                              >
                                {tag.replace(/[\[\]"]/g, '')}
                              </span>
                            ))}
                          </div>
                          <div className="text-lg font-light text-gray-300 group-hover:text-amber-400 transition-colors duration-300">
                            {artwork.price ? `£${artwork.price}` : 'Price on Request'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredArtworks.map((artwork, index) => {
              const imageUrl = getPrimaryImage(artwork);
              const imageAlt = getImageAlt(artwork);

              return (
                <div
                  key={artwork.id}
                  id={`artwork-list-${artwork.id}`}
                  data-animate
                  className={`group cursor-pointer transition-all duration-1000 ${
                    visibleElements.has(`artwork-list-${artwork.id}`)
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 -translate-x-12'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                  onClick={() => openModal(artwork)}
                >
                  <div className="relative bg-gradient-to-br from-gray-800/40 to-gray-700/40 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-600/30 group-hover:shadow-xl transition-all duration-300">
                    <div className="absolute -inset-2 bg-gradient-to-r from-amber-600/20 to-blue-600/20 rounded-3xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
                    <div className="relative flex flex-col md:flex-row gap-6 p-6">
                      <div className="md:w-1/3">
                        <div className="aspect-[1/1] relative bg-gray-900 rounded-lg overflow-hidden">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={imageAlt}
                              width={500}
                              height={500}
                              className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700"
                              loading="lazy"
                              onError={(e) => {
                                console.error(`List view image failed to load for ${artwork.title}: ${imageUrl}`);
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-300 font-light">
                              {artwork.title}
                            </div>
                          )}
                          {artwork.featured && (
                            <div className="absolute top-3 left-3 bg-amber-400 text-amber-900 px-2 py-1 rounded-full text-xs font-light">
                              Featured
                            </div>
                          )}
                          {artwork.sold && (
                            <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-light">
                              Sold
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="md:w-2/3 flex flex-col justify-between">
                        <div>
                          <h3 className="text-2xl font-light text-white mb-3 font-serif tracking-wide group-hover:text-amber-400 transition-colors duration-300">
                            {artwork.title}
                          </h3>
                          <div className="flex items-center text-sm text-gray-300 font-light space-x-6 mb-4">
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2 text-amber-400" />
                              {artwork.year}
                            </span>
                            <span className="flex items-center">
                              <Ruler className="w-4 h-4 mr-2 text-amber-400" />
                              {artwork.dimensions}
                            </span>
                            <span className="flex items-center">
                              <Palette className="w-4 h-4 mr-2 text-amber-400" />
                              {artwork.medium}
                            </span>
                          </div>
                          <p className="text-gray-300 font-light leading-relaxed mb-4">{artwork.description}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {artwork.tags.map((tag, tagIndex) => (
                              <span
                                key={`${tag}-${tagIndex}`}
                                className="px-3 py-1 bg-gray-700/50 text-gray-300 text-sm rounded-full font-light group-hover:bg-amber-500/50 group-hover:text-white transition-all duration-300"
                              >
                                {tag.replace(/[\[\]"]/g, '')}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-light text-gray-300 group-hover:text-amber-400 transition-colors duration-300">
                            {artwork.price ? `£${artwork.price}` : 'Price on Request'}
                          </div>
                          <button className="flex items-center text-gray-300 hover:text-amber-400 transition-colors font-light">
                            <Eye className="w-5 h-5 mr-2" />
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

      {/* Footer */}
      <div className="relative z-10 mt-32 mb-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm px-8 py-4 rounded-full border border-gray-600/30">
            <Feather className="w-6 h-6 text-amber-400" />
            <span className="text-gray-300 font-light tracking-wider">Crafted with passion in Luton</span>
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-700/80 backdrop-blur-xl rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-600/30">
        <div className="absolute -inset-2 bg-gradient-to-r from-amber-600/20 to-blue-600/20 rounded-3xl blur-lg"></div>
        <div className="relative p-8">
          {!isInquiryFormOpen ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-light text-white font-serif tracking-wide group-hover:text-amber-400 transition-colors duration-300">
                  {artwork.title}
                </h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-600/50 rounded-full transition-colors">
                  <X className="w-6 h-6 text-gray-300 hover:text-amber-400" />
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-amber-600/20 to-blue-600/20 rounded-2xl blur-lg"></div>
                  <div className="relative aspect-[1/1] bg-gray-900 rounded-lg overflow-hidden">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={imageAlt}
                        width={500}
                        height={500}
                        className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700"
                        loading="lazy"
                        onError={(e) => {
                          console.error(`Modal image failed to load for ${artwork.title}: ${imageUrl}`);
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-300 font-light text-xl">
                        {artwork.title}
                      </div>
                    )}
                    {artwork.featured && (
                      <div className="absolute top-4 left-4 bg-amber-400 text-amber-900 px-3 py-1 rounded-full text-xs font-light">
                        Featured
                      </div>
                    )}
                    {artwork.sold && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-light">
                        Sold
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-300 font-light">Year:</span>
                      <p className="font-light text-white">{artwork.year}</p>
                    </div>
                    <div>
                      <span className="text-gray-300 font-light">Dimensions:</span>
                      <p className="font-light text-white">{artwork.dimensions}</p>
                    </div>
                    <div>
                      <span className="text-gray-300 font-light">Medium:</span>
                      <p className="font-light text-white">{artwork.medium}</p>
                    </div>
                    <div>
                      <span className="text-gray-300 font-light">Price:</span>
                      <p className="font-light text-lg text-white">{artwork.price ? `£${artwork.price}` : 'Price on Request'}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-light text-white mb-2 font-serif tracking-wide">Description</h3>
                    <p className="text-gray-300 font-light leading-relaxed">{artwork.description}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-light text-white mb-2 font-serif tracking-wide">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {artwork.tags.map((tag, tagIndex) => (
                        <span
                          key={`${tag}-${tagIndex}`}
                          className="px-3 py-1 bg-gray-700/50 text-gray-300 text-sm rounded-full font-light hover:bg-amber-500/50 hover:text-white transition-all duration-300"
                        >
                          {tag.replace(/[\[\]"]/g, '')}
                        </span>
                      ))}
                    </div>
                  </div>
                  {!artwork.sold && (
                    <button
                      onClick={() => setIsInquiryFormOpen(true)}
                      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition-all duration-300 shadow-sm hover:shadow-md font-light"
                    >
                      Inquire About This Piece
                    </button>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-600/30">
                <button
                  onClick={onPrev}
                  className="flex items-center px-4 py-2 text-gray-300 hover:text-amber-400 transition-colors font-light"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Previous
                </button>
                <button
                  onClick={onNext}
                  className="flex items-center px-4 py-2 text-gray-300 hover:text-amber-400 transition-colors font-light"
                >
                  Next
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-light text-white font-serif tracking-wide">Inquire About {artwork.title}</h2>
                <button
                  onClick={() => setIsInquiryFormOpen(false)}
                  className="p-2 hover:bg-gray-600/50 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-300 hover:text-amber-400" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-light text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-white bg-gray-800/50"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-light text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-white bg-gray-800/50"
                    placeholder="Your email address"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-light text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-white bg-gray-800/50"
                    rows={4}
                    placeholder="Your inquiry details"
                  ></textarea>
                </div>
                <div>
                  <p className="text-sm text-gray-300 font-light">
                    Inquiring about: <span className="font-light text-white">{artwork.title}</span>
                    {artwork.price && ` (£${artwork.price})`}
                  </p>
                </div>
                {isError && <p className="text-red-500 text-sm">{error?.message || 'Failed to submit inquiry'}</p>}
                {isSubmitting && <p className="text-gray-300 text-sm">Submitting...</p>}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsInquiryFormOpen(false)}
                    className="px-4 py-2 text-gray-300 hover:text-amber-400 border border-gray-600/30 rounded-lg transition-colors font-light"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-light ${
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