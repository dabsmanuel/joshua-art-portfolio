
'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Reveal from '../shared/Reveal';
import PageHeader from '../shared/PageHeader';

interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: 'Observation & Study',
    description: 'I begin by spending time with my subject, studying the interplay of light and shadow.',
  },
  {
    step: 2,
    title: 'Initial Sketches',
    description: 'Multiple rough sketches help me explore composition and capture the essence of what draws me to the subject.',
  },
  {
    step: 3,
    title: 'Detailed Planning',
    description: 'I create detailed studies focusing on values, proportions, and the emotional core of the piece.',
  },
  {
    step: 4,
    title: 'Final Execution',
    description: 'Using traditional graphite and charcoal techniques, I build the drawing layer by layer, focusing on depth and atmosphere.',
  },
];

const stats = [
  { number: '50+', label: 'Artworks created' },
  { number: '10', label: 'Years of experience' },
  { number: '50+', label: 'Happy collectors' },
  { number: '12', label: 'Exhibitions' },
];

const story = [
  {
    title: 'Early beginnings & family influence',
    content: "My love for drawing began in childhood, inspired by my elder brother who was already exploring sculpting and various art forms. Growing up in an artistic household, I spent hours sketching everything from family pets to the trees outside my window, developing what would become a lifelong passion for capturing life through pencil and charcoal."
  },
  {
    title: 'Academic journey',
    content: "While pursuing my Bachelor of Agriculture in Animal Science at the University of Port Harcourt, Nigeria, and later my Master's in Environmental Management at the University of Hertfordshire, UK, I continued developing my artistic skills as a self-taught artist. My formal education provided me with discipline and analytical thinking that unexpectedly enhanced my approach to art."
  },
  {
    title: 'Multiple creative outlets',
    content: "Alongside my visual art, I discovered another passion in music, working as a background vocalist on several Nigerian music productions. While I don't pursue singing professionally, this musical background has deepened my understanding of rhythm, emotion, and creative expression, all of which influence my approach to drawing."
  },
  {
    title: 'Present day',
    content: "Today, I work from my Luton studio, dividing my time between commissioned portraits and personal projects. Each piece is an exploration of light, shadow, and the infinite complexity of human emotion. As a young revolutionary in Luton, my involvement with the RevoLutonary Cohort has enriched my artistic journey, enhancing my creative abilities and inspiring me to make a positive impact through art that celebrates Luton's rich cultural tapestry."
  }
];

const materials = [
  {
    title: "Pencils",
    items: ["Staedtler Mars Lumograph (2H-8B)", "Faber-Castell 9000 series", "Mechanical pencils for detail work"]
  },
  {
    title: "Paper",
    items: ["Strathmore 400 Series Drawing", "Canson XL Bristol", "Fabriano Artistico for special pieces"]
  },
  {
    title: "Accessories",
    items: ["Kneaded erasers", "Blending stumps", "White charcoal for highlights"]
  }
];

const beliefs = [
  "Art should evoke emotion and create genuine human connection",
  "Patient observation reveals beauty in the most ordinary subjects",
  "The slow, meditative process of drawing is as important as the final result",
  "Traditional techniques carry wisdom that remains relevant today"
];

const tabs = [
  { key: 'story', label: 'Story' },
  { key: 'process', label: 'Process' },
  { key: 'philosophy', label: 'Philosophy' }
] as const;

const AboutPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'story' | 'process' | 'philosophy'>('story');

  return (
    <div className="min-h-screen">
      <PageHeader
        eyebrow="About the artist"
        title="Joshua Otuonye"
        intro="Where graphite meets soul, and shadows dance with light: exploring the beauty of human experience through pencil and charcoal."
      />

      {/* Introduction */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-5">
            <figure>
              <div className="hung">
                <Image
                  src="/images/joshua.jpg"
                  alt="Joshua, the artist"
                  className="aspect-[4/5] w-full object-cover"
                  width={640}
                  height={800}
                />
              </div>
              <figcaption className="label mt-4">Joshua Otuonye · Luton, UK</figcaption>
            </figure>
          </Reveal>

          <Reveal className="lg:col-span-7" delay={100}>
            <h2 className="text-3xl font-semibold leading-[1.1] sm:text-4xl lg:text-5xl">
              Capturing life&apos;s quiet poetry through pencil &amp; soul
            </h2>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-lead">
              For years, I&apos;ve been enchanted by the alchemy of transforming simple graphite into
              windows of human emotion. Each stroke is a whispered conversation between artist and subject,
              revealing the extraordinary within the ordinary.
            </p>

            <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-rule pt-8 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <dd className="font-display text-4xl font-semibold">{stat.number}</dd>
                  <dt className="label mt-1">{stat.label}</dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* Tabs */}
      <section className="border-t border-rule">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex gap-8 border-b border-rule" role="tablist" aria-label="About sections">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                role="tab"
                aria-selected={selectedTab === tab.key}
                onClick={() => setSelectedTab(tab.key)}
                className={`-mb-px border-b-2 py-5 text-sm transition-colors ${
                  selectedTab === tab.key
                    ? 'border-ink text-ink'
                    : 'border-transparent text-lead hover:text-ink'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="py-16 lg:py-24" role="tabpanel">
            {selectedTab === 'story' && (
              <div className="animate-fade-in grid gap-12 lg:grid-cols-12 lg:gap-20">
                <div className="lg:col-span-4">
                  <h3 className="text-3xl font-semibold sm:text-4xl">The artist&apos;s genesis</h3>
                  <p className="mt-5 leading-relaxed text-lead">
                    From childhood sketches to masterful portraits, every line drawn has been a step
                    towards understanding the delicate dance between light and shadow, emotion and form.
                  </p>
                </div>

                <div className="lg:col-span-8">
                  <div className="divide-y divide-rule border-y border-rule">
                    {story.map((section) => (
                      <div key={section.title} className="grid gap-3 py-8 md:grid-cols-3 md:gap-8">
                        <h4 className="text-lg font-semibold md:col-span-1">{section.title}</h4>
                        <p className="leading-relaxed text-lead md:col-span-2">{section.content}</p>
                      </div>
                    ))}
                  </div>

                  <blockquote className="mt-14 border-l-2 border-ink pl-6">
                    <p className="text-xl leading-relaxed sm:text-2xl">
                      &quot;Every line I draw is a conversation between myself and the subject. It&apos;s about finding that moment of connection,
                      that spark of recognition that makes a drawing come alive.&quot;
                    </p>
                    <footer className="label mt-4">Artist statement, 2024</footer>
                  </blockquote>
                </div>
              </div>
            )}

            {selectedTab === 'process' && (
              <div className="animate-fade-in space-y-20">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
                  <div className="lg:col-span-4">
                    <h3 className="text-3xl font-semibold sm:text-4xl">The sacred ritual</h3>
                    <p className="mt-5 leading-relaxed text-lead">
                      Each artwork emerges through a meditative dance of observation, intuition, and countless hours
                      of patient mark-making.
                    </p>
                  </div>

                  <ol className="lg:col-span-8">
                    {processSteps.map((step) => (
                      <li key={step.step} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-rule py-7 first:border-t md:grid-cols-[4rem_1fr_2fr] md:gap-8">
                        <span className="label pt-1">Step {step.step}</span>
                        <h4 className="text-lg font-semibold md:col-start-2">{step.title}</h4>
                        <p className="col-start-2 leading-relaxed text-lead md:col-start-3">{step.description}</p>
                      </li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h4 className="mb-8 text-2xl font-semibold">The artist&apos;s arsenal</h4>
                  <div className="grid gap-10 border-t border-rule pt-8 md:grid-cols-3">
                    {materials.map((category) => (
                      <div key={category.title}>
                        <h5 className="label mb-4 !text-ink">{category.title}</h5>
                        <ul className="space-y-2 text-lead">
                          {category.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'philosophy' && (
              <div className="animate-fade-in grid gap-12 lg:grid-cols-12 lg:gap-20">
                <div className="lg:col-span-4">
                  <h3 className="text-3xl font-semibold sm:text-4xl">The artist&apos;s creed</h3>
                  <p className="mt-5 leading-relaxed text-lead">
                    Art is not merely about technique. It is a philosophy of seeing, feeling, and translating
                    the ineffable essence of human experience into tangible form.
                  </p>
                </div>

                <div className="space-y-14 lg:col-span-8">
                  <div className="grid gap-10 md:grid-cols-2">
                    <div>
                      <h4 className="text-xl font-semibold">The power of simplicity</h4>
                      <p className="mt-4 leading-relaxed text-lead">
                        In a world filled with digital noise and constant stimulation, I find profound meaning in the simplicity of pencil on paper.
                        This ancient medium demands patience, contemplation, and genuine connection with the subject.
                      </p>
                      <p className="mt-4 leading-relaxed text-lead">
                        Each mark is intentional, each shadow carefully considered. There&apos;s no undo button, no digital manipulation, just the honest
                        dialogue between artist, tool, and surface.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold">Capturing the ephemeral</h4>
                      <p className="mt-4 leading-relaxed text-lead">
                        My portraits seek to capture not just physical likeness, but the fleeting expressions and emotions that make us human.
                        A slight smile, the way light catches in someone&apos;s eyes, the weight of years in weathered hands: these are the moments I strive to preserve.
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-rule pt-10">
                    <h4 className="label mb-6 !text-ink">Principles</h4>
                    <ul className="divide-y divide-rule border-y border-rule">
                      {beliefs.map((belief) => (
                        <li key={belief} className="py-4 text-lg">{belief}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold">Looking forward</h4>
                    <p className="mt-4 max-w-2xl leading-relaxed text-lead">
                      As I continue to grow as an artist, I&apos;m excited to explore new subjects while deepening my mastery of traditional techniques.
                      My goal is to create work that stands the test of time: drawings that will move viewers decades from now,
                      just as the old masters continue to inspire us today.
                    </p>
                  </div>

                  <blockquote className="border-l-2 border-ink pl-6 text-xl leading-relaxed sm:text-2xl">
                    &quot;In every stroke lies a heartbeat, in every shadow a story,
                    in every drawing a piece of the artist&apos;s soul made manifest.&quot;
                  </blockquote>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Closing call */}
      <section className="bg-charcoal py-20 text-mat">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 sm:flex-row sm:items-center lg:px-10">
          <h2 className="max-w-lg text-3xl font-semibold sm:text-4xl">See the drawings these stories became.</h2>
          <Link href="/work" className="bg-mat px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-white">
            View the work
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
