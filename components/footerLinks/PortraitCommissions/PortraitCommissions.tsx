'use client';

import React from 'react';
import CommissionPage, { CommissionTierGroup } from '../CommissionPage';
import type { Artwork } from '../../work/ArtworkDetail';

const steps = [
  {
    title: 'Initial consultation',
    description: 'We discuss your vision, review reference photos, and decide the right approach for your portrait.',
  },
  {
    title: 'Sketch approval',
    description: 'I create a detailed preliminary sketch for your approval before beginning the final artwork.',
  },
  {
    title: 'Creation process',
    description: 'Your portrait comes to life through careful layering of graphite and charcoal, with progress updates.',
  },
  {
    title: 'Final review',
    description: 'Final adjustments are made based on your feedback before professional packaging and delivery.',
  },
];

const tierGroups: CommissionTierGroup[] = [
  {
    id: 'portraits',
    label: 'Portraits',
    tiers: [
      {
        name: 'Standard',
        price: '$1,800',
        detail: '16" x 20"',
        timeline: '4-5 weeks',
        points: [
          'Single subject portrait',
          'Professional graphite on premium paper',
          '3 revision rounds included',
          'High-resolution digital scan',
          'Certificate of authenticity',
          'Protective packaging & shipping',
        ],
      },
      {
        name: 'Large',
        price: '$2,400',
        detail: '18" x 24"',
        timeline: '5-6 weeks',
        points: [
          'Single or dual subject portrait',
          'Premium graphite & charcoal blend',
          '4 revision rounds included',
          'High-resolution digital scan',
          'Certificate of authenticity',
          'Professional framing consultation',
          'White glove delivery service',
        ],
        popular: true,
      },
      {
        name: 'Premium',
        price: '$3,200',
        detail: '24" x 30"',
        timeline: '6-8 weeks',
        points: [
          'Multiple subjects or complex composition',
          'Premium mixed media techniques',
          'Unlimited revision rounds',
          'High-resolution digital scan',
          'Certificate of authenticity',
          'Professional framing included',
          'Personal consultation & progress updates',
          'White glove delivery service',
        ],
      },
    ],
  },
];

const faqs = [
  {
    question: 'What makes a good reference photo?',
    answer:
      "High-resolution images with good lighting work best. I prefer photos where the subject's eyes are clearly visible and well-lit. I can work with multiple reference photos to create the perfect composition.",
  },
  {
    question: 'How many revisions are included?',
    answer:
      "The number of revision rounds varies by package, but I work closely with you throughout the process to ensure you're completely satisfied with the final result.",
  },
  {
    question: 'Do you work from old or damaged photos?',
    answer:
      'Absolutely. I specialize in memorial portraits and can work with vintage, damaged, or low-quality photos to create beautiful tributes to your loved ones.',
  },
  {
    question: "What's your typical turnaround time?",
    answer:
      "Standard commissions take 4-6 weeks, depending on complexity. I'll provide a specific timeline when we discuss your project and keep you updated throughout the process.",
  },
  {
    question: 'Do you ship internationally?',
    answer:
      'Yes, I ship worldwide with full insurance and tracking. International shipping costs are calculated based on size and destination.',
  },
];

const isPortrait = (artwork: Artwork) => artwork.category === 'portraits';

const PortraitCommissionsPage: React.FC = () => (
  <CommissionPage
    eyebrow="Portrait commissions"
    title="A portrait, drawn slowly"
    intro="Turn a cherished photograph into a drawing built layer by layer in graphite and charcoal, capturing more than a likeness."
    portfolio={{
      heading: 'Portraits from the studio',
      text: 'A selection of portraits from the portfolio. Select one to see the details.',
      filter: isPortrait,
    }}
    steps={steps}
    stepsHeading="From photo to finished portrait"
    tierGroups={tierGroups}
    tiersHeading="Commission pricing"
    tiersText="Transparent pricing with no hidden fees. Each commission includes everything needed to deliver a museum-quality portrait to your door."
    faqs={faqs}
    closing="Ready to start your portrait?"
  />
);

export default PortraitCommissionsPage;
