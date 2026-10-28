'use client';

import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
import { useCreateInquiry } from '@/hooks/useInquiry';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

export interface ArtworkImage {
  url: string;
  alt: string;
  isPrimary: boolean;
  _id: string;
  id: string;
}

export interface Artwork {
  id: string;
  title: string;
  category: 'portraits' | 'landscapes' | 'still-life' | 'sketches';
  medium: string;
  dimensions: string;
  year: number;
  description: string;
  tags: string[];
  featured: boolean;
  sold: boolean;
  price?: string;
  images: ArtworkImage[];
  primaryImage?: ArtworkImage;
  slug: string;
  availableOnPrint: boolean;
  printSizes?: { size: string; price: string }[];
  isActive: boolean;
  views: number;
}

interface ArtworkModalProps {
  artwork: Artwork | null;
  isOpen: boolean;
  onClose: () => void;
  // Previous/Next are optional: pages that show a single piece leave them out
  onNext?: () => void;
  onPrev?: () => void;
}

export const cleanTag = (tag: string) => tag.replace(/[\[\]"]/g, '');

export const StatusLabel: React.FC<{ artwork: Artwork }> = ({ artwork }) => {
  if (artwork.sold) {
    return (
      <span className="label flex items-center gap-2">
        <span className="sold-dot" aria-hidden />
        Sold
      </span>
    );
  }
  if (artwork.featured) return <span className="label">Featured</span>;
  return null;
};

const fieldClass =
  'w-full border border-rule bg-white px-4 py-3 text-ink placeholder:text-gray-400 focus:border-ink focus:outline-none';

export const ArtworkModal: React.FC<ArtworkModalProps> = ({ artwork, isOpen, onClose, onNext, onPrev }) => {
  const [isInquiryFormOpen, setIsInquiryFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    artworkId: artwork?.id.toString() || '',
    artworkTitle: artwork?.title || '',
  });
  const { mutate: createInquiry, isPending: isSubmitting, isError, error } = useCreateInquiry();

  useEffect(() => {
    setFormData({
      name: '',
      email: '',
      message: '',
      artworkId: artwork?.id.toString() || '',
      artworkTitle: artwork?.title || '',
    });
  }, [artwork]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createInquiry(formData, {
      onSuccess: () => {
        toast.success('Inquiry submitted successfully!');
        setFormData({ name: '', email: '', message: '', artworkId: artwork?.id.toString() || '', artworkTitle: artwork?.title || '' });
        setTimeout(() => {
          setIsInquiryFormOpen(false);
        }, 2000);
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to submit inquiry');
      },
    });
  };

  const getPrimaryImage = (artwork: Artwork): string | null => {
    if (artwork.primaryImage?.url) {
      return artwork.primaryImage.url;
    }
    if (artwork.images && artwork.images.length > 0) {
      return artwork.images[0].url;
    }
    return null;
  };

  const getImageAlt = (artwork: Artwork): string => {
    if (artwork.primaryImage?.alt) {
      return artwork.primaryImage.alt;
    }
    if (artwork.images && artwork.images.length > 0 && artwork.images[0].alt) {
      return artwork.images[0].alt;
    }
    return artwork.title;
  };

  if (!isOpen || !artwork) return null;

  const imageUrl = getPrimaryImage(artwork);
  const imageAlt = getImageAlt(artwork);

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-charcoal/90 p-3 backdrop-blur-sm md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={artwork.title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="animate-rise-in max-h-[94vh] w-full max-w-6xl overflow-y-auto bg-wall shadow-2xl">
        {!isInquiryFormOpen ? (
          <>
            <div className="grid lg:grid-cols-[1.15fr_1fr]">
              {/* The work */}
              <div className="relative flex items-center justify-center bg-gray-100 p-6 md:p-10">
                {imageUrl ? (
                  <div className="hung">
                    <Image
                      src={imageUrl}
                      alt={imageAlt}
                      width={900}
                      height={1100}
                      className="block h-auto max-h-[68vh] w-auto max-w-full object-contain"
                      loading="lazy"
                      onError={(e) => {
                        console.error(`Modal image failed to load for ${artwork.title}: ${imageUrl}`);
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className="py-24 font-display text-2xl text-lead">{artwork.title}</div>
                )}
              </div>

              {/* The label */}
              <div className="flex flex-col p-6 md:p-10">
                <div className="mb-8 flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-3 min-h-[1.1rem]">
                      <StatusLabel artwork={artwork} />
                    </div>
                    <h2 className="text-3xl font-semibold md:text-4xl">{artwork.title}</h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="-mr-2 -mt-2 flex h-11 w-11 shrink-0 items-center justify-center text-lead transition-colors hover:text-ink"
                    aria-label="Close"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-rule pt-6">
                  <div>
                    <dt className="label mb-1">Year</dt>
                    <dd>{artwork.year}</dd>
                  </div>
                  <div>
                    <dt className="label mb-1">Dimensions</dt>
                    <dd>{artwork.dimensions}</dd>
                  </div>
                  <div>
                    <dt className="label mb-1">Medium</dt>
                    <dd>{artwork.medium}</dd>
                  </div>
                  <div>
                    <dt className="label mb-1">Price</dt>
                    <dd className="font-medium">{artwork.price ? `£${artwork.price}` : 'Price on request'}</dd>
                  </div>
                </dl>

                <div className="mt-6 border-t border-rule pt-6">
                  <p className="label mb-2">Description</p>
                  <p className="leading-relaxed text-lead">{artwork.description}</p>
                </div>

                {artwork.tags.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {artwork.tags.map((tag, tagIndex) => (
                      <span key={`${tag}-${tagIndex}`} className="label border border-rule px-2 py-1">
                        {cleanTag(tag)}
                      </span>
                    ))}
                  </div>
                )}

                {artwork.availableOnPrint && artwork.printSizes && artwork.printSizes.length > 0 && (
                  <div className="mt-6 border-t border-rule pt-6">
                    <p className="label mb-3">Prints available</p>
                    <ul className="space-y-2">
                      {artwork.printSizes.map(({ size, price }) => (
                        <li key={size} className="flex items-baseline justify-between border-b border-dashed border-rule pb-2">
                          <span>{size.charAt(0).toUpperCase() + size.slice(1)}</span>
                          <span className="font-label">£{price}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {!artwork.sold && (
                  <button
                    onClick={() => setIsInquiryFormOpen(true)}
                    className="mt-10 w-full bg-ink py-3.5 text-sm font-medium text-mat transition-colors hover:bg-lead"
                  >
                    Inquire about this piece
                  </button>
                )}
              </div>
            </div>

            {onPrev && onNext && (
              <div className="flex items-center justify-between border-t border-rule px-6 py-4 md:px-10">
                <button
                  onClick={onPrev}
                className="flex items-center gap-2 py-2 text-sm text-lead transition-colors hover:text-ink"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </button>
                <button
                  onClick={onNext}
                className="flex items-center gap-2 py-2 text-sm text-lead transition-colors hover:text-ink"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
              </div>
            )}
          </>
        ) : (
          <div className="mx-auto max-w-xl p-6 md:p-10">
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <p className="label mb-3">Inquiry</p>
                <h2 className="text-3xl font-semibold">{artwork.title}</h2>
              </div>
              <button
                onClick={() => setIsInquiryFormOpen(false)}
                className="-mr-2 -mt-2 flex h-11 w-11 items-center justify-center text-lead transition-colors hover:text-ink"
                aria-label="Back to artwork"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="label mb-2 block">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={fieldClass}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label htmlFor="email" className="label mb-2 block">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={fieldClass}
                  placeholder="Your email address"
                />
              </div>
              <div>
                <label htmlFor="message" className="label mb-2 block">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className={fieldClass}
                  rows={4}
                  placeholder="Your inquiry details"
                ></textarea>
              </div>
              <p className="label border-t border-dashed border-rule pt-4">
                About: <span className="!text-ink">{artwork.title}</span>
                {artwork.price && ` (£${artwork.price})`}
              </p>
              {isError && (
                <p className="border border-dot/40 bg-dot/5 p-4 text-sm text-dot" role="alert">
                  {error?.message || 'Failed to submit inquiry'}
                </p>
              )}
              {isSubmitting && (
                <p className="label" role="status">Submitting your inquiry…</p>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInquiryFormOpen(false)}
                  className="border border-rule px-6 py-3 text-sm text-lead transition-colors hover:border-ink hover:text-ink"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-ink px-6 py-3 text-sm font-medium text-mat transition-colors hover:bg-lead ${
                    isSubmitting ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                >
                  {isSubmitting ? 'Submitting…' : 'Submit inquiry'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};


export default ArtworkModal;
