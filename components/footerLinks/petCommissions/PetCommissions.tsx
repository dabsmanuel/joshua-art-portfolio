'use client';

import React from 'react';
import CommissionPage, { CommissionTierGroup } from '../CommissionPage';
import type { Artwork } from '../../work/ArtworkDetail';

const tierGroups: CommissionTierGroup[] = [
  {
    id: 'single',
    label: 'Pet portraits',
    tiers: [
      {
        name: 'Single Pet',
        price: '£1,200',
        detail: '16" x 20" · one beloved companion',
        timeline: '3-4 weeks',
        points: [
          'Single pet portrait',
          'Premium graphite on archival paper',
          '2 revision rounds',
          'High-resolution digital scan',
          'Certificate of authenticity',
          'Protective packaging & shipping',
        ],
      },
      {
        name: 'Pet Pair',
        price: '£1,800',
        detail: '18" x 24" · two pets together',
        timeline: '4-5 weeks',
        points: [
          'Two pets in one composition',
          'Premium graphite & charcoal blend',
          '3 revision rounds',
          'High-resolution digital scan',
          'Certificate of authenticity',
          'Custom background options',
          'Protective packaging & shipping',
        ],
        popular: true,
      },
      {
        name: 'Multi-Pet Family',
        price: '£2,400',
        detail: '20" x 30" · 3+ pets or a complex scene',
        timeline: '5-6 weeks',
        points: [
          'Multiple pets or family scene',
          'Premium mixed media',
          'Unlimited revisions',
          'High-resolution digital scan',
          'Certificate of authenticity',
          'Custom composition design',
          'Progress updates throughout',
          'Premium framing consultation',
        ],
      },
    ],
  },
  {
    id: 'memorial',
    label: 'Memorial portraits',
    tiers: [
      {
        name: 'Memorial Portrait',
        price: '£1,000',
        detail: '14" x 18" · beloved companion tribute',
        timeline: '2-3 weeks',
        points: [
          'Sensitive memorial portrait',
          'Works with any photo quality',
          'Subtle rainbow bridge elements',
          '2 revision rounds',
          'High-resolution digital scan',
          'Memorial certificate',
          'Complimentary sympathy card',
        ],
      },
      {
        name: 'Legacy Portrait',
        price: '£1,600',
        detail: '18" x 24" · premium memorial tribute',
        timeline: '3-4 weeks',
        points: [
          'Large memorial portrait',
          'Enhanced from old/damaged photos',
          'Custom memorial elements',
          '3 revision rounds',
          'High-resolution digital scan',
          'Personalized memorial plaque',
          'Memory book with process photos',
          'Complimentary sympathy arrangement',
        ],
      },
    ],
  },
];

const tips = [
  {
    title: 'High resolution',
    description: 'Use the highest quality setting on your camera or phone for crisp details.',
  },
  {
    title: 'Natural expression',
    description: 'Capture your pet relaxed and natural, showing their personality.',
  },
  {
    title: 'Good lighting',
    description: 'Natural light works best. Avoid harsh shadows or dim indoor lighting.',
  },
  {
    title: 'Eye level',
    description: "Get down to your pet's eye level for the most engaging perspective.",
  },
];

// Pet pieces are the ones tagged as such when they are uploaded in the admin
const petTags = ['pet', 'pets', 'dog', 'cat', 'horse', 'animal'];
const isPet = (artwork: Artwork) =>
  (artwork.tags ?? []).some((tag) => petTags.includes(tag.replace(/[\[\]"]/g, '').trim().toLowerCase()));

const PetPortraitsPage: React.FC = () => (
  <CommissionPage
    eyebrow="Pet commissions"
    title="Celebrate your best friend"
    intro="Every pet has a personality worth keeping. I draw the spirit, character and unconditional love that make your companion so special."
    portfolio={{
      heading: 'Pet portraits',
      text: 'Pieces from the portfolio tagged as pets. Select one to see the details.',
      filter: isPet,
    }}
    tierGroups={tierGroups}
    tiersHeading="Packages and pricing"
    tiersText="Choose the portrait that fits your companion. Memorial portraits are available for pets who are no longer with you."
    tips={tips}
    tipsHeading="Choosing the right photo"
    closing="Ready to celebrate your companion?"
  />
);

export default PetPortraitsPage;
