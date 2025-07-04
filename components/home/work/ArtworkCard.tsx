import React from 'react';
import { Artwork } from '../../../types/index';
import Image from 'next/image';

interface ArtworkCardProps {
  artwork: Artwork;
  isVisible: boolean;
  delay: number;
  onClick: () => void;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork, isVisible, delay, onClick }) => {
  const imageUrl = artwork.images?.[0]?.url || '';
  const imageAlt = artwork.images?.[0]?.alt || artwork.title;

  return (
    <div
      id={`artwork-${artwork.id}`}
      data-animate
      className={`group cursor-pointer transition-all duration-1000 ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-12'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
      onClick={onClick}
    >
      <div className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-black rounded-2xl overflow-hidden border border-gray-700/50 hover:border-amber-400/50 transition-all duration-700 transform hover:-translate-y-3 shadow-2xl hover:shadow-3xl">
        {/* Artistic glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-600/20 to-blue-600/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Main artwork display area */}
        <div className="relative aspect-[4/5] bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
          {/* Paper texture overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gray-100/30 to-transparent opacity-40"></div>
          
          {/* Artwork image */}
          <Image
            src={imageUrl}
            alt={imageAlt}
            width={500}
            height={500}
            className="w-full h-full object-cover filter grayscale-[10%] group-hover:grayscale-0 transition-all duration-700"
            loading="lazy"
            onLoad={() => console.log(`Image loaded successfully for ${artwork.title}`)}
            onError={(e) => {
              console.error(`Image failed to load for ${artwork.title}: ${imageUrl}`);
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              // Show fallback
              const fallback = target.nextElementSibling as HTMLDivElement;
              if (fallback) fallback.classList.remove('hidden');
            }}
          />
          
          {/* Fallback content */}
          <div className="hidden w-full h-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center text-gray-500">
              <div className="text-2xl font-light mb-2">{artwork.title}</div>
              <div className="text-sm italic">Image not available</div>
            </div>
          </div>
          
          {/* Artistic frame corners */}
          <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-white/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-white/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-white/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-white/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
        
        {/* Information panel with sophisticated typography */}
        <div className="relative p-6 bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white">
          {/* Subtle divider line */}
          <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"></div>
          
          <h3 className="text-2xl font-light text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-blue-200 mb-3 tracking-wide group-hover:from-amber-300 group-hover:to-blue-300 transition-all duration-300 font-serif">
            {artwork.title}
          </h3>
          
          <div className="flex items-center mb-4 text-sm text-gray-300 font-light">
            <span className="italic text-amber-400/80">{artwork.medium}</span>
            <span className="mx-3 w-1 h-1 bg-amber-400/60 rounded-full"></span>
            <span className="text-gray-400">{artwork.dimensions}</span>
          </div>
          
          <p className="text-gray-300 text-sm leading-relaxed font-light line-clamp-3 mb-4">
            {artwork.description?.substring(0, 40)}
            {artwork.description && artwork.description.length > 30 ? '...' : ''}
          </p>
          
          {/* Artistic signature section */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-px bg-gradient-to-r from-amber-400/50 to-transparent"></div>
              <div className="w-1 h-1 bg-amber-400/50 rounded-full"></div>
            </div>
            <div className="text-xs text-gray-500 font-light tracking-widest uppercase">Original</div>
          </div>
        </div>
        
        {/* Hover overlay with artistic effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default ArtworkCard;