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
  console.log('ArtworkCard received artwork:', artwork);
  const primaryImage = artwork.primaryImage || artwork.images?.[0];
  const hasPrice = artwork.price && typeof artwork.price === 'string' && !isNaN(parseFloat(artwork.price));

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-gray-200">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={artwork.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No Image
          </div>
        )}
        
        <div className="absolute top-2 left-2 flex gap-1">
          {artwork.featured && (
            <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <Star size={12} />
              Featured
            </span>
          )}
          {artwork.sold && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
              Sold
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
          {artwork.title}
        </h3>
        
        <div className="text-sm text-gray-600 mb-2">
          <p className="mb-1">{artwork.category} • {artwork.medium}</p>
          {hasPrice && (
            <p className="flex items-center gap-1">
              <span>£</span>
              {parseFloat(artwork.price ?? '0').toLocaleString('en-GB', { currency: 'GBP', style: 'currency' }).replace('£', '')}
            </p>
          )}
        </div>

        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {artwork.description}
        </p>

        {artwork.tags && artwork.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {artwork.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs"
              >
                {tag.replace(/[\[\]"]+/g, '')}
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => onView(artwork)}
            className="flex-1 bg-gray-800 text-white py-2 px-3 rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
          >
            <Eye size={16} />
            View
          </button>
          
          <button
            onClick={() => onEdit(artwork)}
            className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Edit size={16} />
            Edit
          </button>
          
          <button
            onClick={() => onDelete(artwork.id)}
            disabled={isDeleting}
            className="flex-1 bg-red-600 text-white py-2 px-3 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Trash2 size={16} />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};