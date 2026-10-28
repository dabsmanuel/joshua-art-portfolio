import React from 'react';

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  intro?: string;
  children?: React.ReactNode;
}

// Shared opening block for the inner pages: label, large title, short intro.
const PageHeader: React.FC<PageHeaderProps> = ({ eyebrow, title, intro, children }) => (
  <header className="border-b border-rule pt-32 pb-14 lg:pt-44 lg:pb-20">
    <div className="mx-auto max-w-7xl px-6 lg:px-10">
      <p className="label mb-6">{eyebrow}</p>
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <h1 className="text-5xl font-semibold sm:text-6xl lg:col-span-7 lg:text-8xl">{title}</h1>
        {intro && <p className="max-w-md text-lg leading-relaxed text-lead lg:col-span-5 lg:justify-self-end">{intro}</p>}
      </div>
      {children}
    </div>
  </header>
);

export default PageHeader;
