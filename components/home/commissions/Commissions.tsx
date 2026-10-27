import React from 'react';
import Link from 'next/link';
import Reveal from '../../shared/Reveal';

const offers = [
  {
    href: '/portraits-commission',
    title: 'Portrait commissions',
    text: 'A likeness built layer by layer in graphite and charcoal, from your reference photos.',
    cta: 'See how it works',
  },
  {
    href: '/pet-commissions',
    title: 'Pet commissions',
    text: 'The character of a companion, drawn to be kept. Memorial pieces are welcome.',
    cta: 'Celebrate your pet',
  },
  {
    href: '/original-artwork',
    title: 'Original artwork',
    text: 'One-of-a-kind pencil and charcoal pieces, ready to find a wall.',
    cta: 'Browse originals',
  },
];

const Commissions: React.FC = () => (
  <section id="commissions" className="bg-charcoal py-24 text-mat lg:py-32">
    <div className="mx-auto max-w-7xl px-6 lg:px-10">
      <Reveal className="mb-14 max-w-2xl lg:mb-20">
        <p className="label mb-4 !text-mat/55">Ways to collect</p>
        <h2 className="text-4xl font-semibold sm:text-5xl lg:text-6xl">
          Take a drawing home.
        </h2>
      </Reveal>

      <ul className="grid border-t border-white/15 md:grid-cols-3">
        {offers.map((offer, index) => (
          <Reveal as="li" key={offer.href} delay={index * 100} className="border-b border-white/15 md:border-b-0 md:border-r md:last:border-r-0">
            <Link
              href={offer.href}
              className="group flex h-full flex-col justify-between gap-12 p-8 transition-colors hover:bg-white/[0.04] lg:p-10"
            >
              <div>
                <h3 className="text-2xl font-semibold">{offer.title}</h3>
                <p className="mt-4 text-mat/65">{offer.text}</p>
              </div>
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                <span className="border-b border-mat/60 pb-0.5">{offer.cta}</span>
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
            </Link>
          </Reveal>
        ))}
      </ul>
    </div>
  </section>
);

export default Commissions;
