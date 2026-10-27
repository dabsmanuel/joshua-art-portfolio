import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Reveal from '../../shared/Reveal';

interface AboutProps {
  visibleElements?: Set<string>;
}

const facts = [
  { number: '50+', label: 'Portraits created' },
  { number: '10+', label: 'Years drawing' },
  { number: '50+', label: 'Happy clients' },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const About: React.FC<AboutProps> = ({ visibleElements }) => {
  return (
    <section id="about" className="border-t border-rule py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-12 lg:gap-20 lg:px-10">
        <Reveal className="lg:col-span-5">
          <figure>
            <div className="hung">
              <Image
                src="/images/joshua.jpg"
                alt="Joshua Otuonye, pencil artist"
                width={640}
                height={800}
                className="aspect-[4/5] w-full object-cover grayscale-[0.15]"
              />
            </div>
            <figcaption className="label mt-4">The artist · Luton, UK</figcaption>
          </figure>
        </Reveal>

        <Reveal className="lg:col-span-7" delay={120}>
          <p className="label mb-5">About</p>
          <h2 className="text-4xl font-semibold leading-[1.05] sm:text-5xl">
            Born in Nigeria. Drawing in the UK.
          </h2>

          <blockquote className="mt-8 border-l-2 border-ink pl-6 text-xl leading-relaxed sm:text-2xl">
            My artistic vision is to convey unique perspectives and experiences through the
            timeless medium of pencil and paper.
          </blockquote>

          <div className="mt-8 max-w-xl space-y-5 text-lead">
            <p>
              I am Joshua Otuonye, an African visual artist based in the United Kingdom. I
              work to push the boundaries of pencil artistry and to challenge conventional
              norms through my creations.
            </p>
            <p>
              Each piece blends techniques and styles within the pencil medium, paying close
              attention to detail so the drawing captures the essence of its subject.
            </p>
          </div>

          <dl className="mt-10 grid max-w-xl grid-cols-3 gap-6 border-t border-rule pt-8">
            {facts.map((fact) => (
              <div key={fact.label} className="flex flex-col">
                <dt className="label order-2 mt-1">{fact.label}</dt>
                <dd className="font-display text-3xl font-semibold">{fact.number}</dd>
              </div>
            ))}
          </dl>

          <Link
            href="/about"
            className="group mt-10 inline-flex items-center gap-2 text-sm font-medium"
          >
            <span className="border-b border-ink pb-0.5">Read the full story</span>
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
};

export default About;
