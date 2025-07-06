'use client'

import React from 'react';
import Image from 'next/image';
import { ArtworkResponse } from '@/types/artwork';
import { Edit, Trash2, Eye, Star } from 'lucide-react';

interface ArtworkCardProps {
  artwork: ArtworkResponse;
  onEdit: (artwork: ArtworkResponse) => void;
  onDelete: (id: string) => void;
  onView: (artwork: ArtworkResponse) => void;
  isDeleting?: boolean;
}

export const ArtworkCard: React.FC<ArtworkCardProps> = ({
  artwork,
  onEdit,
  onDelete,
  onView,
  isDeleting = false,
}) => {
  const primaryImage = artwork.primaryImage || artwork.images?.[0];
  const hasPrice = artwork.price && typeof artwork.price === 'string' && !isNaN(parseFloat(artwork.price));

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Image Section */}
      <div className="relative h-40 bg-gray-50 cursor-pointer" onClick={() => onView(artwork)}>
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={artwork.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            No Image
          </div>
        )}
        
        {/* Status Badges */}
        {(artwork.featured || artwork.sold) && (
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {artwork.featured && (
              <div className="bg-white/90 backdrop-blur-sm text-amber-600 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                <Star size={10} fill="currentColor" />
                Featured
              </div>
            )}
            {artwork.sold && (
              <div className="bg-white/90 backdrop-blur-sm text-red-600 px-2 py-1 rounded text-xs font-medium">
                Sold
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3 space-y-2">
        {/* Title and Price */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-gray-900 text-sm line-clamp-1 flex-1">
            {artwork.title}
          </h3>
          {hasPrice && (
            <span className="text-sm font-semibold text-gray-900 shrink-0">
              £{parseFloat(artwork.price ?? '0').toLocaleString('en-GB')}
            </span>
          )}
        </div>

        {/* Category and Medium */}
        <p className="text-xs text-gray-500">
          {artwork.category} • {artwork.medium}
        </p>

        {/* Description */}
        {artwork.description && (
          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
            {artwork.description}
          </p>
        )}

        {/* Tags */}
        {artwork.tags && artwork.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {artwork.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs"
              >
                {tag.replace(/[\[\]"]+/g, '')}
              </span>
            ))}
            {artwork.tags.length > 2 && (
              <span className="text-xs text-gray-400">
                +{artwork.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <button
            onClick={() => onView(artwork)}
            className="text-gray-600 hover:text-gray-900 transition-colors p-1"
            title="View artwork"
          >
            <Eye size={16} />
          </button>
          
          <button
            onClick={() => onEdit(artwork)}
            className="text-blue-600 hover:text-blue-700 transition-colors p-1"
            title="Edit artwork"
          >
            <Edit size={16} />
          </button>
          
          <button
            onClick={() => onDelete(artwork.id)}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-700 transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed"
            title={isDeleting ? 'Deleting...' : 'Delete artwork'}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};