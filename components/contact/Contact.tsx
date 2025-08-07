/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import React, { useState, useEffect } from 'react';
import { Mail, MapPin, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { LuFacebook, LuInstagram } from 'react-icons/lu';
import { FaXTwitter, FaTiktok } from 'react-icons/fa6';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  inquiryType: 'commission' | 'purchase' | 'general' | 'exhibition';
}

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          inquiryType: 'general',
        });
        setTimeout(() => {
          setFormStatus('idle');
        }, 3000);
      } else {
        const errorData = await response.json();
        setFormStatus('error');
        setErrorMessage(errorData.message || 'Failed to submit inquiry');
      }
    } catch (error) {
      setFormStatus('error');
      setErrorMessage('An error occurred while submitting your inquiry');
    }
  };

  if (formStatus === 'success') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-gray-900 mx-auto mb-6" />
          <h1 className="text-2xl text-gray-900 mb-4">Message sent successfully</h1>
          <p className="text-gray-600 mb-8">Thank you for reaching out. I&apos;ll get back to you within 24 hours.</p>
          <button
            onClick={() => setFormStatus('idle')}
            className="text-gray-900 underline hover:no-underline transition-all"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-16 mt-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-thin text-gray-900 tracking-widest mb-8 transition-all duration-700 font-display">Contact</h1>
          <p className="text-gray-600 artist-subheading">Get in touch about commissions, purchases, or just to say hello.</p>
        </div>

        {/* Contact Form */}
        <div className="mb-16">
          <div className="space-y-8">
            
            {/* Inquiry Type */}
            <div>
              <p className="text-gray-900 mb-4">I&apos;m interested in:</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'general', name: 'General' },
                  { id: 'commission', name: 'Commission' },
                  { id: 'purchase', name: 'Purchase' },
                  { id: 'exhibition', name: 'Exhibition' },
                ].map((type) => (
                  <label key={type.id} className="cursor-pointer">
                    <input
                      type="radio"
                      name="inquiryType"
                      value={type.id}
                      checked={formData.inquiryType === type.id}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div
                      className={`p-3 text-center border rounded transition-all ${
                        formData.inquiryType === type.id
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {type.name}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Your name"
                  className="w-full p-4 border-b border-gray-300 bg-transparent focus:outline-none focus:border-gray-900 transition-colors"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="your@email.com"
                  className="w-full p-4 border-b border-gray-300 bg-transparent focus:outline-none focus:border-gray-900 transition-colors"
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                placeholder="Subject"
                className="w-full p-4 border-b border-gray-300 bg-transparent focus:outline-none focus:border-gray-900 transition-colors"
              />
            </div>

            {/* Message */}
            <div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={5}
                placeholder="Tell me about your project or inquiry..."
                className="w-full p-4 border border-gray-300 rounded resize-none bg-transparent focus:outline-none focus:border-gray-900 transition-colors"
              />
            </div>

            {/* Error Message */}
            {formStatus === 'error' && (
              <div className="flex items-center text-red-600">
                <AlertCircle className="w-4 h-4 mr-2" />
                <span className="text-sm">{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={formStatus === 'submitting'}
              className="w-full bg-gray-900 text-white py-4 px-8 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {formStatus === 'submitting' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-200 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <Mail className="w-5 h-5 mx-auto mb-2 text-gray-600" />
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <a href="mailto:Joshuaotuonye98@gmail.com" className="text-gray-900 hover:underline">
                Joshuaotuonye98@gmail.com
              </a>
            </div>
            <div className="text-center">
              <MapPin className="w-5 h-5 mx-auto mb-2 text-gray-600" />
              <p className="text-sm text-gray-600 mb-1">Location</p>
              <p className="text-gray-900">Luton, UK</p>
            </div>
            <div className="text-center">
              <Clock className="w-5 h-5 mx-auto mb-2 text-gray-600" />
              <p className="text-sm text-gray-600 mb-1">Response</p>
              <p className="text-gray-900">Within 24 hours</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex justify-center space-x-6 mb-12">
            <a 
              href="https://www.instagram.com/joc_arts?igsh=MXZ0NWw2eTE3bWc3dg%3D%3D&utm_source=qr" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Instagram"
            >
              <LuInstagram className="w-5 h-5" />
            </a>
            <a 
              href="https://x.com/skye_worldwide1?s=21" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Twitter"
            >
              <FaXTwitter className="w-5 h-5" />
            </a>
            <a 
              href="https://www.facebook.com/share/1AYRhXUtQH/?mibextid=wwXIfr" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Facebook"
            >
              <LuFacebook className="w-5 h-5" />
            </a>
            <a 
              href="https://www.tiktok.com/@skye_worldwide?_t=ZM-8xZpNt2GNZl&_r=1" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="TikTok"
            >
              <FaTiktok className="w-5 h-5" />
            </a>
          </div>

          {/* About */}
          <div className="text-center max-w-xl mx-auto">
            {/* <h3 className="text-lg text-gray-900 mb-4">About the Artist</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              I'm a pencil artist passionate about capturing light and shadow through traditional graphite and charcoal techniques. 
              Based in Luton, I create realistic portraits and atmospheric landscapes from my studio.
            </p> */}
            <p className="text-gray-600 text-sm border border-gray-200 p-4 bg-gray-50">
              I accept a limited number of commissions each year. Portrait commissions typically take 4-6 weeks to complete.
            </p>
          </div>
        </div>  
      </div>
    </div>
  );
};

export default ContactPage; 