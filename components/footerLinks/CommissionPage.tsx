/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Reveal from '../shared/Reveal';
import PageHeader from '../shared/PageHeader';
import { useArtworks } from '../../hooks/useArtwork';
import { ArtworkModal, StatusLabel, type Artwork } from '../work/ArtworkDetail';

export interface CommissionTier {
  name: string;
  price: string;
  detail: string;
  timeline: string;
  points: string[];
  popular?: boolean;
}

export interface CommissionTierGroup {
  id: string;
  label: string;
  tiers: CommissionTier[];
}

interface CommissionPageProps {
  eyebrow: string;
  title: string;
  intro: string;
  portfolio: {
    heading: string;
    text: string;
    filter: (artwork: Artwork) => boolean;
  };
  steps?: { title: string; description: string }[];
  stepsHeading?: string;
  tierGroups: CommissionTierGroup[];
  tiersHeading: string;
  tiersText: string;
  tips?: { title: string; description: string }[];
  tipsHeading?: string;
  faqs?: { question: string; answer: string }[];
  closing: string;
}

const CommissionPage: React.FC<CommissionPageProps> = ({
  eyebrow,
  title,
  intro,
  portfolio,
  steps,
  stepsHeading = 'How a commission works',
  tierGroups,
  tiersHeading,
  tiersText,
  tips,
  tipsHeading = 'Choosing a photo',
  faqs,
  closing,
}) => {
  const [activeGroup, setActiveGroup] = useState(tierGroups[0]?.id);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  const { data } = useArtworks({ limit: 200 });

  // Only work the artist has actually uploaded, never sample pieces
  const works: Artwork[] = useMemo(
    () =>
      (data?.artworks ?? [])
        .map((artwork: any) => ({
          ...artwork,
          tags: artwork.tags ?? [],
          images: artwork.images ?? [],
          primaryImage: artwork.primaryImage ?? undefined,
          printSizes: artwork.printSizes ?? [],
        }) as Artwork)
        .filter(portfolio.filter)
        .slice(0, 6),
    [data, portfolio.filter]
  );

  const currentTiers = tierGroups.find((group) => group.id === activeGroup)?.tiers ?? [];

  return (
    <div className="min-h-screen">
      <PageHeader eyebrow={eyebrow} title={title} intro={intro}>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Link
            href="/contact?type=commission"
            className="bg-ink px-7 py-3.5 text-sm font-medium text-mat transition-colors hover:bg-lead"
          >
            Start a commission
          </Link>
          <Link href="/work" className="group inline-flex items-center gap-2 text-sm font-medium">
            <span className="border-b border-ink pb-0.5">View the portfolio</span>
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </PageHeader>

      {/* Real work from the portfolio */}
      {works.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <Reveal className="mb-12 max-w-2xl">
            <p className="label mb-4">From the portfolio</p>
            <h2 className="text-3xl font-semibold sm:text-4xl lg:text-5xl">{portfolio.heading}</h2>
            <p className="mt-4 text-lead">{portfolio.text}</p>
          </Reveal>

          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {works.map((artwork, index) => {
              const imageUrl = artwork.primaryImage?.url || artwork.images?.[0]?.url;
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
                        <div className="flex aspect-[4/5] items-center justify-center bg-gray-100 text-lead">
                          {artwork.title}
                        </div>
                      )}
                    </div>
                    <div className="mt-5 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-xl font-semibold leading-tight">{artwork.title}</h3>
                        <p className="label mt-2">{artwork.medium}, {artwork.year}</p>
                        <p className="label">{artwork.dimensions}</p>
                      </div>
                      <StatusLabel artwork={artwork} />
                    </div>
                  </button>
                </Reveal>
              );
            })}
          </div>
        </section>
      )}

      {/* Process */}
      {steps && steps.length > 0 && (
        <section className="border-t border-rule py-20 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-12 lg:gap-20 lg:px-10">
            <Reveal className="lg:col-span-4">
              <p className="label mb-4">Process</p>
              <h2 className="text-3xl font-semibold sm:text-4xl">{stepsHeading}</h2>
            </Reveal>
            <ol className="lg:col-span-8">
              {steps.map((step, index) => (
                <Reveal as="li" key={step.title} delay={index * 70} className="grid grid-cols-[3.5rem_1fr] gap-4 border-b border-rule py-7 first:border-t md:grid-cols-[4rem_1fr_2fr] md:gap-8">
                  <span className="label pt-1">Step {index + 1}</span>
                  <h3 className="text-lg font-semibold md:col-start-2">{step.title}</h3>
                  <p className="col-start-2 leading-relaxed text-lead md:col-start-3">{step.description}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Sizes and timelines */}
      <section className="border-t border-rule py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal className="mb-12 max-w-2xl">
            <p className="label mb-4">Pricing</p>
            <h2 className="text-3xl font-semibold sm:text-4xl lg:text-5xl">{tiersHeading}</h2>
            <p className="mt-4 text-lead">{tiersText}</p>
          </Reveal>

          {tierGroups.length > 1 && (
            <div className="mb-10 flex gap-8 border-b border-rule" role="tablist" aria-label="Commission type">
              {tierGroups.map((group) => (
                <button
                  key={group.id}
                  role="tab"
                  aria-selected={activeGroup === group.id}
                  onClick={() => setActiveGroup(group.id)}
                  className={`-mb-px border-b-2 py-4 text-sm transition-colors ${
                    activeGroup === group.id ? 'border-ink text-ink' : 'border-transparent text-lead hover:text-ink'
                  }`}
                >
                  {group.label}
                </button>
              ))}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {currentTiers.map((tier) => (
              <div
                key={tier.name}
                className={`flex flex-col border bg-mat p-8 ${tier.popular ? 'border-ink' : 'border-rule'}`}
              >
                <div className="mb-6">
                  {tier.popular && <p className="label mb-3 !text-ink">Most requested</p>}
                  <h3 className="text-2xl font-semibold">{tier.name}</h3>
                  <p className="label mt-3">{tier.detail}</p>
                  <p className="label">{tier.timeline}</p>
                  <p className="mt-5 font-display text-4xl font-semibold">{tier.price}</p>
                </div>
                <ul className="mb-8 flex-1 space-y-3 border-t border-rule pt-6 text-sm text-lead">
                  {tier.points.map((point) => (
                    <li key={point} className="flex gap-3">
                      <span aria-hidden className="mt-2 h-px w-3 shrink-0 bg-ink" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact?type=commission"
                  className={`block px-5 py-3 text-center text-sm font-medium transition-colors ${
                    tier.popular
                      ? 'bg-ink text-mat hover:bg-lead'
                      : 'border border-ink text-ink hover:bg-ink hover:text-mat'
                  }`}
                >
                  Select {tier.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo tips */}
      {tips && tips.length > 0 && (
        <section className="border-t border-rule py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <Reveal className="mb-12 max-w-2xl">
              <p className="label mb-4">Before you send a photo</p>
              <h2 className="text-3xl font-semibold sm:text-4xl">{tipsHeading}</h2>
            </Reveal>
            <dl className="grid gap-x-10 gap-y-8 border-t border-rule pt-8 sm:grid-cols-2 lg:grid-cols-4">
              {tips.map((tip) => (
                <div key={tip.title}>
                  <dt className="font-display text-lg font-semibold">{tip.title}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-lead">{tip.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs && faqs.length > 0 && (
        <section className="border-t border-rule py-20 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-12 lg:gap-20 lg:px-10">
            <div className="lg:col-span-4">
              <p className="label mb-4">Questions</p>
              <h2 className="text-3xl font-semibold sm:text-4xl">Before you commission</h2>
            </div>
            <div className="divide-y divide-rule border-y border-rule lg:col-span-8">
              {faqs.map((faq) => (
                <details key={faq.question} className="group py-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold">
                    {faq.question}
                    <span aria-hidden className="font-label text-xl transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-4 max-w-2xl leading-relaxed text-lead">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Closing call */}
      <section className="bg-charcoal py-20 text-mat">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 sm:flex-row sm:items-center lg:px-10">
          <h2 className="max-w-lg text-3xl font-semibold sm:text-4xl">{closing}</h2>
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
        />
      )}
    </div>
  );
};

export default CommissionPage;
