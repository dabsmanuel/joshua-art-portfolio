/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState } from 'react';
import ArtworkCard from './ArtworkCard';
import ArtworkModal from './ArtworkModal';
import Reveal from '../../shared/Reveal';
import Link from 'next/link';
import { useFeaturedArtworks } from '../../../hooks/useArtwork';

interface WorkProps {
  visibleElements?: Set<string>;
}

// Staggered "hang" so the row reads as a wall, not a grid of equal tiles
const hangOffsets = ['lg:mt-0', 'lg:mt-16', 'lg:mt-6'];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Work: React.FC<WorkProps> = ({ visibleElements }) => {
  const [selectedArtwork, setSelectedArtwork] = useState<any | null>(null);
  const { data: artworks = [], isLoading, isError } = useFeaturedArtworks();

  const handleArtworkClick = (artwork: any) => {
    setSelectedArtwork(artwork);
  };

  const handleCloseModal = () => {
    setSelectedArtwork(null);
  };

  // Get the latest 3 featured artworks with deduplication
  const uniqueArtworks = artworks.filter((artwork, index, self) =>
    index === self.findIndex(a => a.id === artwork.id)
  );
  const latestThreeArtworks = uniqueArtworks.slice(0, 3);

  const renderArtworks = () => {
    if (isLoading) {
      return (
        <div className="grid gap-10 md:grid-cols-3" aria-busy="true" aria-label="Loading artworks">
          {[...Array(3)].map((_, index) => (
            <div key={index} className={hangOffsets[index]}>
              <div className="hung">
                <div className="aspect-[4/5] animate-pulse bg-gray-200" />
              </div>
              <div className="mt-5 h-3 w-1/2 animate-pulse bg-gray-200" />
            </div>
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <p className="border border-rule px-6 py-10 text-center text-lead">
          The featured works could not be loaded. Refresh the page, or{' '}
          <Link href="/work" className="text-ink underline underline-offset-4">browse the full portfolio</Link>.
        </p>
      );
    }

    if (latestThreeArtworks.length === 0) {
      return (
        <p className="border border-rule px-6 py-10 text-center text-lead">
          New work is being hung. Check back soon, or{' '}
          <Link href="/contact" className="text-ink underline underline-offset-4">get in touch</Link>{' '}
          about a commission.
        </p>
      );
    }

    return (
      <div className="grid gap-x-8 gap-y-14 md:grid-cols-3">
        {latestThreeArtworks.map((artworkResponse, index) => {
          const uniqueKey = `artwork-${artworkResponse.id}-${index}`;
          return (
            <Reveal key={uniqueKey} delay={index * 120} className={hangOffsets[index % hangOffsets.length]}>
              <ArtworkCard
                artwork={artworkResponse}
                isVisible={true}
                delay={index * 150}
                onClick={() => handleArtworkClick(artworkResponse)}
              />
            </Reveal>
          );
        })}
      </div>
    );
  };

  return (
    <section id="work" className="border-t border-rule py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end lg:mb-20">
          <div>
            <p className="label mb-4">Recent work</p>
            <h2 className="text-4xl font-semibold sm:text-5xl lg:text-6xl">Featured artworks</h2>
          </div>
          <Link
            href="/work"
            className="group inline-flex items-center gap-2 text-sm font-medium"
          >
            <span className="border-b border-ink pb-0.5">See the full portfolio</span>
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </Reveal>

        {renderArtworks()}
      </div>

      {selectedArtwork && (
        <ArtworkModal
          artwork={selectedArtwork}
          onClose={handleCloseModal}
        />
      )}
    </section>
  );
};

export default Work;
