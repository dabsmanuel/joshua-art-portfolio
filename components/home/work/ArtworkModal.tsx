'use client'

import React, { useEffect, useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import ImageZoomModal from './ImageZoom';
import Image from 'next/image';
import { ArtworkResponse } from '@/types/artwork';
import { getOptimizedImageUrl } from '@/utils/image';

interface ArtworkModalProps {
  artwork: ArtworkResponse;
  onClose: () => void;
}

const ArtworkModal: React.FC<ArtworkModalProps> = ({ artwork, onClose }) => {
  const [showImageZoom, setShowImageZoom] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !showImageZoom) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose, showImageZoom]);

  const rawImageUrl = artwork.primaryImage?.url || artwork.images?.[0]?.url || '';
  const imageUrl = getOptimizedImageUrl(rawImageUrl);
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
    if (artwork.sold) return 'Sold';
    if (artwork.featured) return 'Featured';
    return 'Available';
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label={artwork.title}
      >
        <div
          className="animate-fade-in fixed inset-0 bg-charcoal/92 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="relative z-10 flex min-h-full items-center justify-center p-3 md:p-8">
          <div className="animate-rise-in relative w-full max-w-6xl bg-wall shadow-2xl">
            <button
              onClick={onClose}
              className="absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center bg-mat/90 text-ink transition-colors hover:bg-ink hover:text-mat"
              aria-label="Close artwork"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col lg:flex-row">
              {/* The work */}
              <div className="flex flex-1 items-center justify-center bg-gray-100 p-6 md:p-12 lg:min-h-[78vh]">
                {imageUrl ? (
                  <button
                    type="button"
                    onClick={handleImageClick}
                    className="hung group relative block max-w-full cursor-zoom-in"
                    aria-label="Zoom in on artwork"
                  >
                    <Image
                      src={imageUrl}
                      alt={imageAlt}
                      width={900}
                      height={1100}
                      className="block h-auto max-h-[70vh] w-auto max-w-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    <span className="absolute bottom-4 right-4 flex items-center gap-2 bg-ink px-3 py-2 text-mat opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                      <ZoomIn size={14} />
                      <span className="label !text-mat">Zoom</span>
                    </span>
                  </button>
                ) : (
                  <div className="p-12 text-center">
                    <div className="font-display text-3xl font-semibold text-lead">{artwork.title}</div>
                    <div className="label mt-3">No image available</div>
                  </div>
                )}
              </div>

              {/* The label */}
              <aside className="flex w-full flex-col border-t border-rule bg-mat lg:w-96 lg:border-l lg:border-t-0">
                <div className="flex-1 space-y-8 p-6 pt-8 md:p-8">
                  <div>
                    <p className="label mb-3 flex items-center gap-2">
                      {artwork.sold && <span className="sold-dot" aria-hidden />}
                      {getStatusLabel()}
                    </p>
                    <h2 className="text-3xl font-semibold">{artwork.title}</h2>
                  </div>

                  <dl className="space-y-5 border-t border-rule pt-6">
                    <div>
                      <dt className="label mb-1">Medium</dt>
                      <dd>{artwork.medium}</dd>
                    </div>
                    <div>
                      <dt className="label mb-1">Dimensions</dt>
                      <dd>{artwork.dimensions}</dd>
                    </div>
                  </dl>

                  <div className="border-t border-rule pt-6">
                    <p className="label mb-2">Description</p>
                    <p className="leading-relaxed text-lead">{artwork.description}</p>
                  </div>

                  {artwork.availableOnPrint && artwork.printSizes.length > 0 && (
                    <div className="border-t border-rule pt-6">
                      <p className="label mb-3">Prints available</p>
                      <ul className="space-y-2">
                        {artwork.printSizes.map(({ size, price }) => (
                          <li key={size} className="flex items-baseline justify-between border-b border-dashed border-rule pb-2">
                            <span>{size.charAt(0).toUpperCase() + size.slice(1)}</span>
                            <span className="font-label">£{price}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="border-t border-rule p-6 md:px-8">
                  <p className="label">
                    {artwork.availableOnPrint ? 'Prints available' : 'Original artwork'}
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </div>
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
