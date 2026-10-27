/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import React, { useState, useMemo } from 'react';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Reveal from '../shared/Reveal';
import PageHeader from '../shared/PageHeader';
import { useExhibitions } from '../../hooks/useExhibition';
import { Exhibition, getExhibitionStatus } from '../../types/exhibition';

type ExhibitionStatus = 'upcoming' | 'current' | 'past';

interface ExhibitionView extends Exhibition {
  status: ExhibitionStatus;
}

const ExhibitionsPage: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'upcoming' | 'current' | 'past'>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'solo' | 'group'>('all');

  const { data, isLoading, isError } = useExhibitions();

  const exhibitions: ExhibitionView[] = useMemo(
    () => (data ?? []).map((exhibition) => ({ ...exhibition, status: getExhibitionStatus(exhibition) })),
    [data]
  );

  const filteredExhibitions = exhibitions.filter(exhibition => {
    const statusMatch = selectedFilter === 'all' || exhibition.status === selectedFilter;
    const typeMatch = selectedType === 'all' || exhibition.type === selectedType;
    return statusMatch && typeMatch;
  });

  const upcomingCount = exhibitions.filter(e => e.status === 'upcoming').length;
  const currentCount = exhibitions.filter(e => e.status === 'current').length;
  const pastCount = exhibitions.filter(e => e.status === 'past').length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusText = (status: ExhibitionStatus) => {
    switch (status) {
      case 'upcoming':
        return 'Upcoming';
      case 'current':
        return 'On now';
      case 'past':
        return 'Past';
      default:
        return status;
    }
  };

  const statusClass = (status: ExhibitionStatus) => {
    switch (status) {
      case 'current':
        return 'bg-ink text-mat border-ink';
      case 'upcoming':
        return 'border-ink text-ink';
      default:
        return 'border-rule text-lead';
    }
  };

  const chip = (active: boolean) =>
    `px-1 py-1.5 text-sm transition-colors border-b ${
      active ? 'border-ink text-ink' : 'border-transparent text-lead hover:text-ink'
    }`;

  const totalWorks = exhibitions.reduce((sum, ex) => sum + ex.artworksCount, 0);

  return (
    <div className="min-h-screen">
      <PageHeader
        eyebrow="Exhibitions"
        title="On the wall"
        intro="Gallery spaces where charcoal and graphite artworks meet an audience in person."
      >
        <dl className="mt-14 grid grid-cols-2 gap-6 border-t border-rule pt-8 sm:grid-cols-4">
          {[
            { value: exhibitions.length, label: 'Exhibitions' },
            { value: upcomingCount, label: 'Upcoming' },
            { value: currentCount, label: 'On now' },
            { value: totalWorks, label: 'Artworks shown' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <dd className="font-display text-4xl font-semibold">{stat.value}</dd>
              <dt className="label mt-1">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </PageHeader>

      {/* Filters */}
      <div className="border-b border-rule">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between lg:px-10">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <div className="flex flex-wrap gap-x-6 gap-y-1" role="group" aria-label="Filter by status">
              {[
                { id: 'all', label: 'All', count: exhibitions.length },
                { id: 'upcoming', label: 'Upcoming', count: upcomingCount },
                { id: 'current', label: 'On now', count: currentCount },
                { id: 'past', label: 'Past', count: pastCount },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id as any)}
                  aria-pressed={selectedFilter === filter.id}
                  className={chip(selectedFilter === filter.id)}
                >
                  {filter.label}
                  <span className="label ml-1.5">{filter.count}</span>
                </button>
              ))}
            </div>

            <span className="hidden h-5 w-px bg-rule md:block" aria-hidden />

            <div className="flex flex-wrap gap-x-6 gap-y-1" role="group" aria-label="Filter by type">
              {[
                { id: 'all', label: 'All types' },
                { id: 'solo', label: 'Solo' },
                { id: 'group', label: 'Group' },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id as any)}
                  aria-pressed={selectedType === type.id}
                  className={chip(selectedType === type.id)}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <span className="label">
            {filteredExhibitions.length} {filteredExhibitions.length === 1 ? 'exhibition' : 'exhibitions'}
          </span>
        </div>
      </div>

      {/* Exhibitions */}
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {isLoading && (
          <p className="label my-16 text-center" role="status">Loading exhibitions…</p>
        )}

        {isError && (
          <p className="my-16 border border-rule px-6 py-16 text-center text-lead">
            The exhibitions could not be loaded. Refresh the page to try again.
          </p>
        )}

        {!isLoading && !isError && exhibitions.length === 0 && (
          <p className="my-16 border border-rule px-6 py-16 text-center text-lead">
            No exhibitions are listed yet. Check back soon.
          </p>
        )}

        {!isLoading && !isError && exhibitions.length > 0 && filteredExhibitions.length === 0 && (
          <p className="my-16 border border-rule px-6 py-16 text-center text-lead">
            No exhibitions match these filters. Choose All to see every show.
          </p>
        )}

        <ul className="divide-y divide-rule">
          {filteredExhibitions.map((exhibition) => (
            <Reveal as="li" key={exhibition.id} className="py-12 lg:py-16">
              <article id={`exhibition-${exhibition.id}`} className="grid items-start gap-8 lg:grid-cols-12 lg:gap-14">
                <div className="lg:col-span-5">
                  <div className="hung">
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
                      {exhibition.image ? (
                        <Image
                          src={exhibition.image.url}
                          alt={exhibition.title}
                          fill
                          sizes="(min-width: 1024px) 34rem, 90vw"
                          className="object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center p-6 text-center font-display text-lg text-lead">
                          {exhibition.venue}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col lg:col-span-7">
                  <div className="mb-5 flex flex-wrap items-center gap-3">
                    <span className={`label border px-2.5 py-1 ${statusClass(exhibition.status)}`}>
                      {getStatusText(exhibition.status)}
                    </span>
                    <span className="label">
                      {exhibition.type === 'solo' ? 'Solo exhibition' : 'Group exhibition'}
                    </span>
                    {exhibition.featured && <span className="label">Featured</span>}
                  </div>

                  <h2 className="text-3xl font-semibold sm:text-4xl">{exhibition.title}</h2>

                  <dl className="mt-6 grid gap-x-8 gap-y-4 border-t border-rule pt-6 sm:grid-cols-2">
                    <div>
                      <dt className="label mb-1">Venue</dt>
                      <dd>{exhibition.venue}, {exhibition.location}</dd>
                    </div>
                    <div>
                      <dt className="label mb-1">Dates</dt>
                      <dd>{formatDate(exhibition.startDate)} – {formatDate(exhibition.endDate)}</dd>
                    </div>
                    <div>
                      <dt className="label mb-1">Works shown</dt>
                      <dd>{exhibition.artworksCount} artworks</dd>
                    </div>
                    {exhibition.openingReception?.date && (
                      <div>
                        <dt className="label mb-1">Opening</dt>
                        <dd>
                          {formatDate(exhibition.openingReception.date)}
                          {exhibition.openingReception.time ? `, ${exhibition.openingReception.time}` : ''}
                        </dd>
                      </div>
                    )}
                  </dl>

                  <p className="mt-6 max-w-xl leading-relaxed text-lead">{exhibition.description}</p>

                  {exhibition.website && (
                    <a
                      href={exhibition.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-8 inline-flex items-center gap-2 self-start text-sm font-medium"
                    >
                      <span className="border-b border-ink pb-0.5">Visit exhibition page</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExhibitionsPage;
