import React from 'react';
import { Artwork } from '../../../types/index';

interface ArtworkCardProps {
  artwork: Artwork;
  isVisible: boolean;
  delay: number;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork, isVisible, delay }) => {
  return (
    <div
      id={`artwork-${artwork.id}`}
      data-animate
      className={`group cursor-pointer transition-all duration-700 ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
        <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-500 font-medium text-lg group-hover:scale-105 transition-transform duration-500">
          {artwork.title}
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {artwork.title}
          </h3>
          <p className="text-gray-600 italic mb-2">
            {artwork.medium}, {artwork.dimensions}
          </p>
          <p className="text-gray-500 text-sm">
            {artwork.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArtworkCard;