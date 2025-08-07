/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React from 'react';
import { useScrollEffects } from '../hooks/useScrollEffects';
import Hero from '../components/home/hero/Hero';
import Work from '../components/home/work/Work';
import About from '../components/home/about/About';
import AnimationStyles from '../components/layout/AnimationStyles';

const HomePage: React.FC = () => {
  const { isScrolled, visibleElements } = useScrollEffects();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Hero />
      <About visibleElements={visibleElements} />
      <AnimationStyles />
    </div>
  );
};

export default HomePage;