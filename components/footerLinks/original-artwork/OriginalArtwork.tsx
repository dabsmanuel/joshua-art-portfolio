/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Grid, List, Search } from 'lucide-react';
import Reveal from '../../shared/Reveal';
import PageHeader from '../../shared/PageHeader';
import { useArtworks } from '../../../hooks/useArtwork';
import { ArtworkModal, type Artwork } from '../../work/ArtworkDetail';

const categoryLabels: Record<string, string> = {
  portraits: 'Portraits',
  landscapes: 'Landscapes',
  'still-life': 'Still life',
  sketches: 'Sketches',
};

const priceOf = (artwork: Artwork) => {
  const value = parseFloat(artwork.price ?? '');
  return Number.isNaN(value) ? null : value;
};

const formatPrice = (artwork: Artwork) => {
  const value = priceOf(artwork);
  return value === null ? 'Price on request' : `£${value.toLocaleString('en-GB')}`;
};

const OriginalArtworkPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  // Everything in the portfolio that has not been sold is an available original
  const { data, isLoading, isError } = useArtworks({ sold: false, limit: 200 });

  const available: Artwork[] = useMemo(
    () =>
      (data?.artworks ?? []).map(
        (artwork: any) =>
          ({
            ...artwork,
            tags: artwork.tags ?? [],
            images: artwork.images ?? [],
            primaryImage: artwork.primaryImage ?? undefined,
            printSizes: artwork.printSizes ?? [],
          }) as Artwork
      ),
    [data]
  );

  const categories = useMemo(() => {
    const present = Array.from(new Set(available.map((a) => a.category)));
    return [
      { id: 'all', name: 'All', count: available.length },
      ...present.map((id) => ({
        id,
        name: categoryLabels[id] ?? id,
        count: available.filter((a) => a.category === id).length,
      })),
    ];
  }, [available]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return available
      .filter((artwork) => {
        const matchesCategory = selectedCategory === 'all' || artwork.category === selectedCategory;
        const matchesSearch =
          !term ||
          artwork.title.toLowerCase().includes(term) ||
          artwork.description.toLowerCase().includes(term);
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return (priceOf(a) ?? Infinity) - (priceOf(b) ?? Infinity);
          case 'price-high':
            return (priceOf(b) ?? -Infinity) - (priceOf(a) ?? -Infinity);
          case 'oldest':
            return a.year - b.year;
          case 'newest':
          default:
            return b.year - a.year;
        }
      });
  }, [available, selectedCategory, searchTerm, sortBy]);

  const navigate = (direction: 'next' | 'prev') => {
    if (!selectedArtwork || filtered.length === 0) return;
    const index = filtered.findIndex((a) => a.id === selectedArtwork.id);
    const next =
      direction === 'next'
        ? (index + 1) % filtered.length
        : index <= 0
          ? filtered.length - 1
          : index - 1;
    setSelectedArtwork(filtered[next]);
  };

  const imageFor = (artwork: Artwork) => artwork.primaryImage?.url || artwork.images?.[0]?.url || null;

  return (
    <div className="min-h-screen">
      <PageHeader
        eyebrow="Original artwork"
        title="Available originals"
        intro="One-of-a-kind pencil and charcoal artworks, each an original drawing ready to find a wall."
      />

      {/* Controls */}
      <div className="border-b border-rule">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-5 lg:px-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-x-7 gap-y-2" role="tablist" aria-label="Filter by category">
              {categories.map((category) => {
                const active = selectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`border-b px-1 py-1.5 text-sm transition-colors ${
                      active ? 'border-ink text-ink' : 'border-transparent text-lead hover:text-ink'
                    }`}
                  >
                    {category.name}
                    <span className="label ml-1.5">{category.count}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <label className="relative">
                <span className="sr-only">Search originals</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search"
                  className="w-44 border border-rule bg-white py-2 pl-9 pr-3 text-sm focus:border-ink focus:outline-none"
                />
              </label>

              <label>
                <span className="sr-only">Sort by</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-rule bg-white px-3 py-2 text-sm focus:border-ink focus:outline-none"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                </select>
              </label>

              <div className="flex border border-rule">
                <button
                  onClick={() => setViewMode('grid')}
                  aria-label="Gallery view"
                  aria-pressed={viewMode === 'grid'}
                  className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-ink text-mat' : 'text-lead hover:text-ink'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                  aria-pressed={viewMode === 'list'}
                  className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-ink text-mat' : 'text-lead hover:text-ink'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Works */}
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-20">
        {isLoading && <p className="label py-16 text-center" role="status">Loading originals…</p>}

        {isError && (
          <p className="border border-rule px-6 py-16 text-center text-lead">
            The originals could not be loaded. Refresh the page to try again.
          </p>
        )}

        {!isLoading && !isError && available.length === 0 && (
          <p className="border border-rule px-6 py-16 text-center text-lead">
            There are no originals available right now. You can still{' '}
            <Link href="/portraits-commission" className="text-ink underline underline-offset-4">commission a portrait</Link>{' '}
            or <Link href="/contact" className="text-ink underline underline-offset-4">get in touch</Link>.
          </p>
        )}

        {!isLoading && !isError && available.length > 0 && filtered.length === 0 && (
          <p className="border border-rule px-6 py-16 text-center text-lead">
            No originals match your search. Clear it, or choose All.
          </p>
        )}

        {viewMode === 'grid' ? (
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((artwork, index) => {
              const imageUrl = imageFor(artwork);
              return (
                <Reveal key={artwork.id} delay={(index % 3) * 90}>
                  <button
                    type="button"
                    onClick={() => setSelectedArtwork(artwork)}
                    className="group block w-full text-left"
                    aria-label={`View ${artwork.title}`}
                  >
                    <div className="hung transition-transform duration-500 group-hover:-translate-y-1">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={artwork.primaryImage?.alt || artwork.title}
                          width={600}
                          height={750}
                          className="block aspect-[4/5] w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex aspect-[4/5] items-center justify-center bg-gray-100 p-6 text-center text-lead">
                          {artwork.title}
                        </div>
                      )}
                    </div>
                    <div className="mt-5 flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="font-display text-xl font-semibold leading-tight">{artwork.title}</h3>
                        <p className="label mt-2">{artwork.medium}, {artwork.year}</p>
                        <p className="label">{artwork.dimensions}</p>
                      </div>
                      <span className="label !text-ink pt-1">{formatPrice(artwork)}</span>
                    </div>
                  </button>
                </Reveal>
              );
            })}
          </div>
        ) : (
          <ul className="divide-y divide-rule border-y border-rule">
            {filtered.map((artwork) => {
              const imageUrl = imageFor(artwork);
              return (
                <li key={artwork.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedArtwork(artwork)}
                    className="group grid w-full gap-6 py-8 text-left sm:grid-cols-[9rem_1fr] md:grid-cols-[12rem_1fr_auto] md:gap-10"
                    aria-label={`View ${artwork.title}`}
                  >
                    <div className="hung">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={artwork.primaryImage?.alt || artwork.title}
                          width={300}
                          height={375}
                          className="block aspect-[4/5] w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex aspect-[4/5] items-center justify-center bg-gray-100 text-center text-sm text-lead">
                          {artwork.title}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display text-2xl font-semibold transition-colors group-hover:text-lead md:text-3xl">
                        {artwork.title}
                      </h3>
                      <p className="label mt-3">
                        {artwork.medium} · {artwork.dimensions} · {artwork.year}
                      </p>
                      <p className="mt-4 line-clamp-3 max-w-xl text-lead">{artwork.description}</p>
                    </div>
                    <div className="label !text-ink sm:col-start-2 md:col-start-auto md:text-right">
                      {formatPrice(artwork)}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Closing call */}
      <section className="bg-charcoal py-20 text-mat">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 sm:flex-row sm:items-center lg:px-10">
          <h2 className="max-w-lg text-3xl font-semibold sm:text-4xl">Looking for something made for you?</h2>
          <Link
            href="/contact?type=commission"
            className="bg-mat px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-white"
          >
            Start a commission
          </Link>
        </div>
      </section>

      {selectedArtwork && (
        <ArtworkModal
          artwork={selectedArtwork}
          isOpen
          onClose={() => setSelectedArtwork(null)}
          onNext={() => navigate('next')}
          onPrev={() => navigate('prev')}
        />
      )}
    </div>
  );
};

export default OriginalArtworkPage;
