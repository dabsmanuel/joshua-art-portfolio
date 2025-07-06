'use client'

import React, { useEffect, useState } from 'react';
import { X, ZoomIn, Palette, Feather } from 'lucide-react';
import ImageZoomModal from './ImageZoom';
import Image from 'next/image';
import { ArtworkResponse } from '@/types/artwork';

interface ArtworkModalProps {
  artwork: ArtworkResponse;
  onClose: () => void;
}

const ArtworkModal: React.FC<ArtworkModalProps> = ({ artwork, onClose }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showImageZoom, setShowImageZoom] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !showImageZoom) {
        onClose();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [onClose, showImageZoom]);

  const imageUrl = artwork.primaryImage?.url || artwork.images?.[0]?.url || '';
  const imageAlt = artwork.primaryImage?.alt || artwork.images?.[0]?.alt || artwork.title;

  const handleImageClick = () => {
    if (imageUrl) {
      setShowImageZoom(true);
    }
  };

  const handleCloseImageZoom = () => {
    setShowImageZoom(false);
  };

  const getStatusLabel = () => {
    if (artwork.featured) return 'Featured';
    if (artwork.sold) return 'Sold';
    return 'Available';
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-black bg-opacity-95 backdrop-blur-sm animate-fadeIn"
          onClick={onClose}
        />
        
        <div className="fixed inset-0 pointer-events-none">
          <div 
            className="absolute w-2 h-2 bg-amber-400/60 rounded-full transition-all duration-1000 ease-out"
            style={{
              left: mousePosition.x * 0.02 + 50,
              top: mousePosition.y * 0.02 + 30,
            }}
          ></div>
          <div 
            className="absolute w-1 h-1 bg-blue-400/40 rounded-full transition-all duration-1500 ease-out"
            style={{
              left: mousePosition.x * 0.03 + 200,
              top: mousePosition.y * 0.03 + 100,
            }}
          ></div>
          <div 
            className="absolute w-3 h-3 bg-purple-400/30 rounded-full transition-all duration-2000 ease-out"
            style={{
              left: mousePosition.x * 0.01 + 300,
              top: mousePosition.y * 0.01 + 150,
            }}
          ></div>
        </div>

        <div className="fixed inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 border border-gray-600 rounded-full animate-pulse"></div>
          <div className="absolute bottom-32 right-20 w-96 h-96 border border-gray-700 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-48 h-48 border border-gray-500 rounded-full animate-pulse delay-500"></div>
        </div>
        
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-8">
          <div className="relative w-full max-w-7xl animate-scaleIn">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-4 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md rounded-full text-white hover:from-amber-600/80 hover:to-amber-700/80 transition-all duration-300 group border border-gray-600/50 hover:border-amber-400/50 shadow-2xl"
            >
              <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>

            <div className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-black rounded-2xl shadow-2xl w-full overflow-hidden border border-gray-700/50">
              <div className="absolute -inset-2 bg-gradient-to-r from-amber-600/20 to-blue-600/20 rounded-2xl blur-lg"></div>
              
              <div className="relative flex flex-col lg:flex-row">
                <div className="flex-1 flex items-center justify-center p-8 lg:p-12 bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-[60vh] lg:min-h-[80vh]">
                  <div className="relative w-full h-full max-w-4xl flex items-center justify-center">
                    <div className="absolute -inset-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg shadow-2xl"></div>
                    <div className="absolute -inset-2 bg-gradient-to-br from-white to-gray-100 rounded-lg shadow-inner"></div>
                    <div className="relative bg-white p-4 md:p-6 rounded-lg shadow-inner border-2 border-gray-200 w-full h-full flex items-center justify-center">
                      <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-transparent via-gray-100 to-transparent rounded-lg"></div>
                      
                      <div className="relative z-10 w-full h-full flex items-center justify-center">
                        {imageUrl ? (
                          <div className="relative group cursor-pointer" onClick={handleImageClick}>
                            <Image
                              src={imageUrl}
                              alt={imageAlt}
                              width={500}
                              height={500}
                              className="w-full h-full max-w-full max-h-full object-contain shadow-lg rounded-sm transition-transform duration-300 hover:scale-105"
                              onError={(e) => {
                                console.error(`Image failed to load in modal for ${artwork.title}: ${imageUrl}`);
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback = target.parentElement?.nextElementSibling as HTMLDivElement;
                                if (fallback) fallback.classList.remove('hidden');
                              }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center group-hover:bg-opacity-30 transition-all duration-300 rounded-sm">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white rounded-full p-3">
                                <ZoomIn size={24} className="text-gray-800" />
                              </div>
                            </div>
                          </div>
                        ) : null}
                        
                        <div className={`text-center p-8 md:p-12 ${imageUrl ? 'hidden' : ''}`}>
                          <ZoomIn className="mx-auto mb-6 text-gray-400" size={48} />
                          <div className="text-gray-500 font-light text-2xl md:text-4xl mb-4 tracking-wide font-serif">
                            {artwork.title}
                          </div>
                          <div className="text-gray-400 font-light text-lg italic">
                            {imageUrl ? 'Image failed to load' : 'No image available'}
                          </div>
                        </div>
                        
                        <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-gray-300"></div>
                        <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-gray-300"></div>
                        <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-gray-300"></div>
                        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-gray-300"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-80 xl:w-96 bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white border-t lg:border-t-0 lg:border-l border-gray-700/50 flex flex-col">
                  <div className="p-4 md:p-6 border-b border-gray-700/50">
                    <div className="flex items-center mb-4 md:mb-6">
                      <div className="inline-flex items-center px-3 md:px-4 py-2 bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-lg rounded-full text-amber-400 text-sm font-light tracking-wider border border-gray-600/30">
                        <Feather className="w-4 h-4 mr-2" />
                        Artwork Details
                      </div>
                    </div>
                    
                    <h2 className="text-2xl md:text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-blue-200 mb-4 tracking-wide font-serif">
                      {artwork.title}
                    </h2>
                    
                    <div className="flex items-center space-x-4 mb-4 md:mb-6">
                      <div className="w-16 h-0.5 bg-gradient-to-r from-amber-400 to-transparent"></div>
                      <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                      <div className="w-12 h-0.5 bg-gradient-to-r from-amber-400 to-transparent"></div>
                    </div>
                  </div>

                  <div className="flex-1 p-4 md:p-6 space-y-6 md:space-y-8">
                    <div className="space-y-4 md:space-y-6">
                      <div className="bg-gradient-to-br from-amber-900/20 to-blue-900/20 p-4 md:p-6 rounded-xl border border-amber-400/20 backdrop-blur-sm">
                        <h3 className="text-sm font-medium text-amber-400 uppercase tracking-wide mb-3 flex items-center">
                          <Palette className="w-4 h-4 mr-2" />
                          Medium
                        </h3>
                        <p className="text-white font-light text-lg md:text-xl italic">{artwork.medium}</p>
                      </div>
                      
                      <div className="border-l-4 border-amber-400/50 pl-4 md:pl-6">
                        <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wide mb-3">Dimensions</h3>
                        <p className="text-white font-light text-base md:text-lg">{artwork.dimensions}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wide mb-3">Description</h3>
                        <p className="text-gray-300 font-light leading-relaxed text-sm md:text-base">{artwork.description}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wide mb-3">Status</h3>
                        <p className="text-white font-light text-base md:text-lg">{getStatusLabel()}</p>
                      </div>
                      
                      {artwork.availableOnPrint && artwork.printSizes.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wide mb-3">Prints Available</h3>
                          <ul className="text-gray-300 font-light text-sm md:text-base space-y-2">
                            {artwork.printSizes.map(({ size, price }) => (
                              <li key={size}>
                                {size.charAt(0).toUpperCase() + size.slice(1)}: £{price}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 md:p-6 border-t border-gray-700/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-12 md:w-16 h-px bg-gradient-to-r from-amber-400 to-transparent"></div>
                        <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
                      </div>
                      <div className="text-amber-400/80 font-light text-xs tracking-widest uppercase">
                        {artwork.availableOnPrint ? 'Prints Available' : 'Original Artwork'}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
                        <div className="w-12 md:w-16 h-px bg-gradient-to-l from-amber-400 to-transparent"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes scaleIn {
            from { 
              opacity: 0; 
              transform: scale(0.95); 
            }
            to { 
              opacity: 1; 
              transform: scale(1); 
            }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.4s ease-out;
          }
          
          .animate-scaleIn {
            animation: scaleIn 0.5s ease-out;
          }
        `}</style>
      </div>

      {showImageZoom && (
        <ImageZoomModal
          imageUrl={imageUrl}
          imageAlt={imageAlt}
          onClose={handleCloseImageZoom}
        />
      )}
    </>
  );
};

export default ArtworkModal;