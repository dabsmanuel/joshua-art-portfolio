'use client'

import React from 'react';
import Image from 'next/image';
import { ArtworkResponse } from '@/types/artwork';
import { X } from 'lucide-react';

interface ArtworkDetailModalProps {
  artwork: ArtworkResponse;
  onClose: () => void;
  onEdit: (artwork: ArtworkResponse) => void;
  onManageImages: (artwork: ArtworkResponse) => void;
}

export const ArtworkDetailModal: React.FC<ArtworkDetailModalProps> = ({
  artwork,
  onClose,
  onEdit,
  onManageImages,
}) => {
  const primaryImage = artwork.primaryImage || artwork.images?.[0];
  const hasPrice = artwork.price && typeof artwork.price === 'string' && !isNaN(parseFloat(artwork.price));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{artwork.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {primaryImage ? (
                <Image
                  src={primaryImage.url}
                  alt={artwork.title}
                  width={400}
                  height={400}
                  className="w-full h-auto object-cover rounded-md"
                />
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-200 rounded-md">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
              <button
                onClick={() => onManageImages(artwork)}
                className="mt-4 w-full px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
              >
                Manage Images
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Details</h3>
                <p className="text-gray-600"><strong>Category:</strong> {artwork.category}</p>
                <p className="text-gray-600"><strong>Medium:</strong> {artwork.medium}</p>
                <p className="text-gray-600"><strong>Dimensions:</strong> {artwork.dimensions}</p>
                <p className="text-gray-600"><strong>Year:</strong> {artwork.year}</p>
                {hasPrice && (
                  <p className="text-gray-600 flex items-center gap-1">
                    <strong>Price:</strong> 
                    <span>£</span>
                    {parseFloat(artwork.price ?? '0').toLocaleString('en-GB', { currency: 'GBP', style: 'currency' }).replace('£', '')}
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800">Status</h3>
                <p className="text-gray-600">
                  <strong>Featured:</strong> {artwork.featured ? 'Yes' : 'No'}
                </p>
                <p className="text-gray-600">
                  <strong>Sold:</strong> {artwork.sold ? 'Yes' : 'No'}
                </p>
                <p className="text-gray-600">
                  <strong>Available on Print:</strong> {artwork.availableOnPrint ? 'Yes' : 'No'}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800">Description</h3>
                <p className="text-gray-600">{artwork.description}</p>
              </div>

              {artwork.tags && artwork.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {artwork.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm"
                      >
                        {tag.replace(/[\[\]"]+/g, '')}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {artwork.printSizes && artwork.printSizes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Print Sizes</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {artwork.printSizes.map((printSize, index) => (
                      <li key={index}>
                        {printSize.size} - £{parseFloat(printSize.price).toLocaleString('en-GB', { currency: 'GBP', style: 'currency' }).replace('£', '')}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => onEdit(artwork)}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
              >
                Edit Artwork
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};