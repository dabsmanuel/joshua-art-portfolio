/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useMemo } from 'react';
import { Grid, List } from 'lucide-react';
import { useArtworks } from '../../hooks/useArtwork';
import Image from 'next/image';
import Reveal from '../shared/Reveal';
import PageHeader from '../shared/PageHeader';
import { ArtworkModal, StatusLabel, cleanTag, type Artwork } from './ArtworkDetail';
import { getOptimizedImageUrl } from '@/utils/image';

const categoryList = [
  { id: 'all', name: 'All work' },
  { id: 'portraits', name: 'Portraits' },
  { id: 'landscapes', name: 'Landscapes' },
  { id: 'still-life', name: 'Still life' },
  { id: 'sketches', name: 'Sketches' },
];

const WorkPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Load the whole portfolio once and filter in the page, so every category count stays accurate
  const { data, isLoading, isError, error } = useArtworks({ limit: 200 });

  const allArtworks: Artwork[] = useMemo(
    () =>
      (data?.artworks || []).map((artwork: any) => ({
        id: artwork.id,
        title: artwork.title,
        category: artwork.category,
        medium: artwork.medium,
        dimensions: artwork.dimensions,
        year: artwork.year,
        description: artwork.description,
        tags: artwork.tags ?? [],
        featured: artwork.featured,
        sold: artwork.sold,
        price: artwork.price,
        images: artwork.images ?? [],
        primaryImage: artwork.primaryImage ?? undefined,
        slug: artwork.slug ?? '',
        availableOnPrint: artwork.availableOnPrint ?? false,
        printSizes: artwork.printSizes ?? [],
        isActive: artwork.isActive ?? true,
        views: artwork.views ?? 0,
      })),
    [data]
  );

  const categories = categoryList.map((category) => ({
    ...category,
    count:
      category.id === 'all'
        ? allArtworks.length
        : allArtworks.filter((a) => a.category === category.id).length,
  }));

  const filteredArtworks = useMemo(
    () =>
      selectedCategory === 'all'
        ? allArtworks
        : allArtworks.filter((a) => a.category === selectedCategory),
    [allArtworks, selectedCategory]
  );

  const openModal = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArtwork(null);
    document.body.style.overflow = 'unset';
  };

  const navigateModal = (direction: 'next' | 'prev') => {
    if (!selectedArtwork) return;

    const currentIndex = filteredArtworks.findIndex((a) => a.id === selectedArtwork.id);
    let newIndex;

    if (direction === 'next') {
      newIndex = (currentIndex + 1) % filteredArtworks.length;
    } else {
      newIndex = currentIndex === 0 ? filteredArtworks.length - 1 : currentIndex - 1;
    }

    setSelectedArtwork(filteredArtworks[newIndex]);
  };

  const getPrimaryImage = (artwork: Artwork): string | null => {
    if (artwork.primaryImage?.url) {
      return getOptimizedImageUrl(artwork.primaryImage.url);
    }
    if (artwork.images && artwork.images.length > 0) {
      return getOptimizedImageUrl(artwork.images[0].url);
    }
    return null;
  };

  const getImageAlt = (artwork: Artwork): string => {
    if (artwork.primaryImage?.alt) {
      return artwork.primaryImage.alt;
    }
    if (artwork.images && artwork.images.length > 0 && artwork.images[0].alt) {
      return artwork.images[0].alt;
    }
    return artwork.title;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center" role="status">
        <div className="text-center">
          <div className="mx-auto mb-5 h-7 w-7 animate-spin rounded-full border border-ink border-t-transparent"></div>
          <p className="label">Hanging the work…</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <p className="max-w-md text-center text-lg text-lead">
          The portfolio could not be loaded{error?.message ? `: ${error.message}` : ''}. Refresh the page to try again.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        eyebrow="Portfolio"
        title="The work"
        intro="Graphite and charcoal portraits, landscapes and still life, capturing human emotion and everyday moments."
      />

      {/* Filters and controls */}
      <div className="border-b border-rule">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div className="-mx-1 flex flex-wrap gap-x-7 gap-y-2" role="tablist" aria-label="Filter by category">
            {categories.map((category) => {
              const active = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-1 py-1.5 text-sm transition-colors ${
                    active
                      ? 'border-b border-ink text-ink'
                      : 'border-b border-transparent text-lead hover:text-ink'
                  }`}
                >
                  {category.name}
                  <span className="label ml-1.5">{category.count}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-5">
            <span className="label">
              {filteredArtworks.length} {filteredArtworks.length === 1 ? 'piece' : 'pieces'}
            </span>
            <div className="flex border border-rule">
              <button
                onClick={() => setViewMode('grid')}
                aria-label="Gallery view"
                aria-pressed={viewMode === 'grid'}
                className={`p-2.5 transition-colors ${
                  viewMode === 'grid' ? 'bg-ink text-mat' : 'text-lead hover:text-ink'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                aria-label="List view"
                aria-pressed={viewMode === 'list'}
                className={`p-2.5 transition-colors ${
                  viewMode === 'list' ? 'bg-ink text-mat' : 'text-lead hover:text-ink'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Artwork grid / list */}
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-20">
        {filteredArtworks.length === 0 && (
          <p className="border border-rule px-6 py-16 text-center text-lead">
            Nothing is hung in this category yet. Try another, or choose All work.
          </p>
        )}

        {viewMode === 'grid' ? (
          <div className="columns-1 gap-8 sm:columns-2 lg:columns-3">
            {filteredArtworks.map((artwork, index) => {
              const imageUrl = getPrimaryImage(artwork);
              const imageAlt = getImageAlt(artwork);

              return (
                <Reveal key={artwork.id} delay={(index % 3) * 90} className="mb-14 break-inside-avoid">
                  <button
                    type="button"
                    id={`artwork-${artwork.id}`}
                    onClick={() => openModal(artwork)}
                    className="group block w-full text-left"
                    aria-label={`View ${artwork.title}`}
                  >
                    <div className="hung transition-transform duration-500 group-hover:-translate-y-1">
                      {imageUrl ? (
                        <>
                          <Image
                            src={imageUrl}
                            alt={imageAlt}
                            height={750}
                            width={600}
                            className="block h-auto w-full"
                            loading="lazy"
                            onError={(e) => {
                              console.error(`Image failed to load for ${artwork.title}: ${imageUrl}`);
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement | null;
                              if (fallback) {
                                fallback.classList.remove('hidden');
                                fallback.classList.add('flex');
                              }
                            }}
                          />
                          <div className="hidden aspect-[4/5] items-center justify-center bg-gray-100 p-6 text-center font-display text-lg text-lead">
                            {artwork.title}
                          </div>
                        </>
                      ) : (
                        <div className="flex aspect-[4/5] items-center justify-center bg-gray-100 p-6 text-center font-display text-lg text-lead">
                          {artwork.title}
                        </div>
                      )}
                    </div>

                    {/* Wall label */}
                    <div className="mt-5 flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="font-display text-xl font-semibold leading-tight">{artwork.title}</h3>
                        <p className="label mt-2">
                          {artwork.medium}, {artwork.year}
                        </p>
                        <p className="label">{artwork.dimensions}</p>
                        {artwork.tags.length > 0 && (
                          <p className="label mt-2 normal-case !tracking-normal">
                            {artwork.tags.slice(0, 2).map(cleanTag).join(' · ')}
                          </p>
                        )}
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1 pt-1">
                        <span className="label !text-ink">{artwork.price ? `£${artwork.price}` : 'Inquire'}</span>
                        <StatusLabel artwork={artwork} />
                      </div>
                    </div>
                  </button>
                </Reveal>
              );
            })}
          </div>
        ) : (
          <ul className="divide-y divide-rule border-y border-rule">
            {filteredArtworks.map((artwork, index) => {
              const imageUrl = getPrimaryImage(artwork);
              const imageAlt = getImageAlt(artwork);

              return (
                <Reveal as="li" key={artwork.id} delay={Math.min(index, 4) * 60}>
                  <button
                    type="button"
                    id={`artwork-list-${artwork.id}`}
                    onClick={() => openModal(artwork)}
                    className="group grid w-full gap-6 py-8 text-left sm:grid-cols-[9rem_1fr] md:grid-cols-[12rem_1fr_auto] md:gap-10"
                    aria-label={`View ${artwork.title}`}
                  >
                    <div className="hung">
                      {imageUrl ? (
                        <>
                          <Image
                            src={imageUrl}
                            alt={imageAlt}
                            width={300}
                            height={375}
                            className="block aspect-[4/5] w-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              console.error(`List image failed to load for ${artwork.title}: ${imageUrl}`);
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement | null;
                              if (fallback) {
                                fallback.classList.remove('hidden');
                                fallback.classList.add('flex');
                              }
                            }}
                          />
                          <div className="hidden aspect-[4/5] items-center justify-center bg-gray-100 text-center text-sm text-lead">
                            {artwork.title}
                          </div>
                        </>
                      ) : (
                        <div className="flex aspect-[4/5] items-center justify-center bg-gray-100 text-center text-sm text-lead">
                          {artwork.title}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="mb-3 flex items-center gap-4">
                        <StatusLabel artwork={artwork} />
                      </div>
                      <h3 className="font-display text-2xl font-semibold transition-colors group-hover:text-lead md:text-3xl">
                        {artwork.title}
                      </h3>
                      <p className="label mt-3">
                        {artwork.medium} · {artwork.dimensions} · {artwork.year}
                      </p>
                      <p className="mt-4 line-clamp-3 max-w-xl text-lead">{artwork.description}</p>
                      {artwork.tags.length > 0 && (
                        <p className="label mt-4 normal-case !tracking-normal">
                          {artwork.tags.map(cleanTag).join(' · ')}
                        </p>
                      )}
                    </div>

                    <div className="label !text-ink sm:col-start-2 md:col-start-auto md:text-right">
                      {artwork.price ? `£${artwork.price}` : 'Price on request'}
                    </div>
                  </button>
                </Reveal>
              );
            })}
          </ul>
        )}
      </div>

      {/* Modal */}
      <ArtworkModal
        artwork={selectedArtwork}
        isOpen={isModalOpen}
        onClose={closeModal}
        onNext={() => navigateModal('next')}
        onPrev={() => navigateModal('prev')}
      />
    </div>
  );
};

export default WorkPage;
