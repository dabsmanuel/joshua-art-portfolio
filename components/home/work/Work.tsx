import React from 'react';
import { Artwork } from '../../../types';
import ArtworkCard from './ArtworkCard';
import Link from 'next/link';
import { ArrowBigRight } from 'lucide-react';

interface WorkProps {
  artworks: Artwork[];
  visibleElements: Set<string>;
}

const Work: React.FC<WorkProps> = ({ artworks, visibleElements }) => {
  return (
    <section id="work" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h2 
          id="work-title"
          data-animate
          className={`text-5xl md:text-6xl font-light text-center text-gray-900 mb-16 transition-all duration-700 ${
            visibleElements.has('work-title') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          Featured Work
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {artworks.map((artwork, index) => (
            <ArtworkCard
              key={artwork.id}
              artwork={artwork}
              isVisible={visibleElements.has(`artwork-${artwork.id}`)}
              delay={index * 200}
            />
          ))}
        </div>
        <div className='flex items-center justify-center pt-10'>
          <Link href='/work' className='text-gray-500 flex items-center font-medium border-b-3 hover:text-gray-900'>
            See More 
            <ArrowBigRight/>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Work;