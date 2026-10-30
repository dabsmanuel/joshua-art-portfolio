import React from 'react';
import { ArtworkResponse } from '@/types/artwork';
import Image from 'next/image';
import { getOptimizedImageUrl } from '@/utils/image';

interface ArtworkCardProps {
  artwork: ArtworkResponse;
  isVisible: boolean;
  delay: number;
  onClick: () => void;
}

// A work on the wall with its museum label underneath.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork, isVisible, delay, onClick }) => {
  const rawImageUrl = artwork.primaryImage?.url || artwork.images?.[0]?.url || '';
  const imageUrl = getOptimizedImageUrl(rawImageUrl);
  const imageAlt = artwork.primaryImage?.alt || artwork.images?.[0]?.alt || artwork.title;

  const getStatusLabel = () => {
    if (artwork.sold) return 'Sold';
    if (artwork.featured) return 'Featured';
    return 'Available';
  };

  return (
    <button
      type="button"
      id={`artwork-${artwork.id}`}
      onClick={onClick}
      className="group block w-full text-left"
      aria-label={`View ${artwork.title}`}
    >
      <div className="hung transition-transform duration-500 group-hover:-translate-y-1">
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-200">
          <Image
            src={imageUrl}
            alt={imageAlt}
            width={600}
            height={750}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLDivElement;
              if (fallback) fallback.classList.remove('hidden');
            }}
          />

          {/* Fallback content */}
          <div className="absolute inset-0 hidden items-center justify-center bg-gray-100 p-6 text-center">
            <div>
              <div className="font-display text-xl font-semibold">{artwork.title}</div>
              <div className="label mt-2">Image not available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Wall label */}
      <div className="mt-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-display text-xl font-semibold leading-tight">{artwork.title}</h3>
          <p className="label mt-2">
            {[artwork.medium, artwork.year].filter(Boolean).join(', ')}
          </p>
          <p className="label">{artwork.dimensions}</p>
          {artwork.availableOnPrint && artwork.printSizes.length > 0 && (
            <p className="label mt-2 !text-ink">
              Prints: {artwork.printSizes
                .map(({ size, price }) => `${size.charAt(0).toUpperCase() + size.slice(1)} £${price}`)
                .join(' · ')}
            </p>
          )}
        </div>
        <span className="label flex shrink-0 items-center gap-2 pt-1">
          {artwork.sold && <span className="sold-dot" aria-hidden />}
          {getStatusLabel()}
        </span>
      </div>
    </button>
  );
};

export default ArtworkCard;
