'use client';

import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { LuFacebook, LuInstagram } from 'react-icons/lu';
import { FaXTwitter, FaTiktok } from 'react-icons/fa6';
import PageHeader from '../shared/PageHeader';
import { contactService } from '../../services/contactService';
import { handleApiError } from '../../utils/errorHandler';
import type { TypedApiError } from '../../types/error';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  inquiryType: 'commission' | 'purchase' | 'general' | 'exhibition';
}

const inquiryTypes = [
  { id: 'general', name: 'General' },
  { id: 'commission', name: 'Commission' },
  { id: 'purchase', name: 'Purchase' },
  { id: 'exhibition', name: 'Exhibition' },
];

const socials = [
  { icon: LuInstagram, label: 'Instagram', href: 'https://www.instagram.com/joc_arts?igsh=MXZ0NWw2eTE3bWc3dg%3D%3D&utm_source=qr' },
  { icon: FaXTwitter, label: 'Twitter', href: 'https://x.com/skye_worldwide1?s=21' },
  { icon: LuFacebook, label: 'Facebook', href: 'https://www.facebook.com/share/1AYRhXUtQH/?mibextid=wwXIfr' },
  { icon: FaTiktok, label: 'TikTok', href: 'https://www.tiktok.com/@skye_worldwide?_t=ZM-8xZpNt2GNZl&_r=1' },
];

const lineField =
  'w-full border-0 border-b border-gray-400 bg-transparent px-0 py-3 text-lg text-ink placeholder:text-gray-400 focus:border-ink focus:outline-none';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: 'general',
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Links such as /contact?type=commission preselect the inquiry type
  useEffect(() => {
    const type = new URLSearchParams(window.location.search).get('type');
    if (type && inquiryTypes.some((t) => t.id === type)) {
      setFormData((prev) => ({ ...prev, inquiryType: type as FormData['inquiryType'] }));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    setErrorMessage('');

    try {
      await contactService.createContact(formData);
      setFormStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        inquiryType: 'general',
      });
    } catch (error) {
      setFormStatus('error');
      setErrorMessage(handleApiError(error as TypedApiError));
    }
  };

  if (formStatus === 'success') {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="max-w-md text-center" role="status">
          <CheckCircle className="mx-auto mb-6 h-12 w-12 text-ink" strokeWidth={1.25} />
          <h1 className="mb-4 text-3xl font-semibold">Message sent</h1>
          <p className="mb-8 text-lead">Thank you for reaching out. I&apos;ll get back to you within 24 hours.</p>
          <button
            onClick={() => setFormStatus('idle')}
            className="border-b border-ink pb-0.5 text-sm font-medium"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        eyebrow="Contact"
        title="Say hello"
        intro="Get in touch about commissions, purchases, exhibitions, or just to say hello."
      />

      <div className="mx-auto grid max-w-7xl gap-16 px-6 py-16 lg:grid-cols-12 lg:gap-24 lg:px-10 lg:py-24">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-10 lg:col-span-7">
          <fieldset>
            <legend className="label mb-4">I&apos;m interested in</legend>
            <div className="flex flex-wrap gap-3">
              {inquiryTypes.map((type) => (
                <label key={type.id} className="cursor-pointer">
                  <input
                    type="radio"
                    name="inquiryType"
                    value={type.id}
                    checked={formData.inquiryType === type.id}
                    onChange={handleInputChange}
                    className="peer sr-only"
                  />
                  <span
                    className={`block border px-5 py-2.5 text-sm transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink ${
                      formData.inquiryType === type.id
                        ? 'border-ink bg-ink text-mat'
                        : 'border-rule text-lead hover:border-ink hover:text-ink'
                    }`}
                  >
                    {type.name}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <label htmlFor="name" className="label block">Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Your name"
                className={lineField}
              />
            </div>
            <div>
              <label htmlFor="email" className="label block">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="your@email.com"
                className={lineField}
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="label block">Subject</label>
            <input
              id="subject"
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
              minLength={5}
              maxLength={150}
              placeholder="What is this about?"
              className={lineField}
            />
          </div>

          <div>
            <label htmlFor="message" className="label block">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              maxLength={2000}
              rows={5}
              placeholder="Tell me about your project or inquiry..."
              className={`${lineField} resize-none`}
            />
          </div>

          {formStatus === 'error' && (
            <div className="flex items-center text-dot" role="alert">
              <AlertCircle className="mr-2 h-4 w-4" />
              <span className="text-sm">{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={formStatus === 'submitting'}
            className="flex w-full items-center justify-center gap-2 bg-ink px-8 py-4 text-sm font-medium text-mat transition-colors hover:bg-lead disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {formStatus === 'submitting' ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-mat border-t-transparent" />
                <span>Sending…</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Send message</span>
              </>
            )}
          </button>
        </form>

        {/* Details */}
        <aside className="lg:col-span-5">
          <dl className="divide-y divide-rule border-y border-rule">
            <div className="py-6">
              <dt className="label mb-2">Email</dt>
              <dd>
                <a href="mailto:Joshuaotuonye98@gmail.com" className="break-all text-lg underline-offset-4 hover:underline">
                  Joshuaotuonye98@gmail.com
                </a>
              </dd>
            </div>
            <div className="py-6">
              <dt className="label mb-2">Studio</dt>
              <dd className="text-lg">Luton, UK</dd>
            </div>
            <div className="py-6">
              <dt className="label mb-2">Reply time</dt>
              <dd className="text-lg">Within 24 hours</dd>
            </div>
            <div className="py-6">
              <dt className="label mb-3">Follow</dt>
              <dd className="flex gap-3">
                {socials.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex h-11 w-11 items-center justify-center border border-rule transition-colors hover:border-ink hover:bg-ink hover:text-mat"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </dd>
            </div>
          </dl>

          <p className="mt-8 border border-rule bg-mat p-5 text-sm leading-relaxed text-lead">
            I accept a limited number of commissions each year. Portrait commissions typically take 4-6 weeks to complete.
          </p>
        </aside>
      </div>
    </div>
  );
};

export default ContactPage;
