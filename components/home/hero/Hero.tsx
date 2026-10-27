'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const slides = [
  { id: 1, src: '/images/art6.jpeg', alt: 'Portrait of a young woman in a green headwrap and yellow striped knit' },
  { id: 2, src: '/images/art1.jpeg', alt: 'Portrait of a man with green hair and a red bead necklace' },
  { id: 3, src: '/images/art5.jpeg', alt: 'Portrait of a woman half hidden behind long blue hair' },
  { id: 4, src: '/images/art2.jpeg', alt: 'Portrait of a young woman looking away against a blue ground' },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section id="home" className="relative flex min-h-[100svh] items-center overflow-hidden pb-14 pt-28 lg:pt-32">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-6 lg:grid-cols-12 lg:gap-8 lg:px-10">
        {/* Words */}
        <div className="lg:col-span-7">
          <p className="label animate-fade-in">Joshua Otuonye · Pencil artist · Luton, UK</p>

          <h1 className="animate-rise-in mt-6 text-[clamp(2.9rem,8.2vw,7.2rem)] font-semibold leading-[0.98] tracking-[-0.035em]">
            Shadow, light,
            <br />
            and the person
            <br />
            in between.
          </h1>

          <p className="mt-8 max-w-lg text-lg leading-relaxed text-lead">
            I am an African visual artist based in the United Kingdom. I draw portraits in
            pencil, graphite and charcoal, with colour used sparingly.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href="/work"
              className="bg-ink px-7 py-3.5 text-sm font-medium text-mat transition-colors hover:bg-lead"
            >
              View the work
            </Link>
            <Link
              href="/portraits-commission"
              className="group inline-flex items-center gap-2 text-sm font-medium text-ink"
            >
              <span className="border-b border-ink pb-0.5">Commission a portrait</span>
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>

        {/* The hung work */}
        <figure className="mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-md lg:justify-self-end">
          <div className="hung">
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-200">
              {slides.map((slide, index) => (
                <Image
                  key={slide.id}
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  sizes="(min-width: 1024px) 28rem, 90vw"
                  aria-hidden={index !== currentSlide}
                  className={`object-cover transition-opacity duration-1000 ease-in-out ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
            </div>
          </div>

          <figcaption className="mt-5 flex items-center justify-between">
            <span className="label">
              Selected work · {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </span>
            <div className="flex items-center gap-2" role="tablist" aria-label="Choose artwork">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  role="tab"
                  aria-selected={index === currentSlide}
                  aria-label={`Show artwork ${index + 1}`}
                  onClick={() => goToSlide(index)}
                  className="group flex h-8 w-6 items-center"
                >
                  <span
                    className={`block h-px w-full transition-all duration-300 ${
                      index === currentSlide ? 'h-0.5 bg-ink' : 'bg-gray-400 group-hover:bg-ink'
                    }`}
                  />
                </button>
              ))}
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
};

export default Hero;
