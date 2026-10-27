'use client';

import React from 'react';
import Hero from '../components/home/hero/Hero';
import Work from '../components/home/work/Work';
import Commissions from '../components/home/commissions/Commissions';
import About from '../components/home/about/About';

const HomePage: React.FC = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <Work />
      <Commissions />
      <About />
    </main>
  );
};

export default HomePage;
