/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React from 'react';
import { useScrollEffects } from '../hooks/useScrollEffects';
import { Artwork } from '../types';
import Hero from '../components/home/hero/Hero';
import Work from '../components/home/work/Work';
import About from '../components/home/about/About';
import AnimationStyles from '../components/layout/AnimationStyles';

const HomePage: React.FC = () => {
  const { isScrolled, visibleElements } = useScrollEffects();

  const artworks: Artwork[] = [
    {
      id: 1,
      title: "Silent Contemplation",
      medium: "Graphite on Paper",
      dimensions: "18\" x 24\"",
      description: "A study in quiet introspection"
    },
    {
      id: 2,
      title: "Morning Light",
      medium: "Charcoal on Paper", 
      dimensions: "12\" x 16\"",
      description: "Capturing the gentle warmth of dawn"
    },
    {
      id: 3,
      title: "Old Wisdom",
      medium: "Graphite on Paper",
      dimensions: "14\" x 18\"",
      description: "Lines that tell a lifetime of stories"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Hero />
      <Work artworks={artworks} visibleElements={visibleElements} />
      <About visibleElements={visibleElements} />
      <AnimationStyles />
    </div>
  );
};

export default HomePage;