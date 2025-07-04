/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, Send, User, Heart, CheckCircle, AlertCircle, Feather } from 'lucide-react';
import { LuFacebook, LuInstagram } from 'react-icons/lu';
import { FaXTwitter, FaTiktok } from 'react-icons/fa6';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  inquiryType: 'commission' | 'purchase' | 'general' | 'exhibition';
}

interface ContactInfo {
  icon: React.ReactNode;
  label: string;
  value: string;
  link?: string;
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
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const contactInfo: ContactInfo[] = [
    {
      icon: <Mail className="w-5 h-5" />,
      label: 'Email',
      value: 'Joshuaotuonye98@gmail.com',
      link: 'mailto:Joshuaotuonye98@gmail.com',
    },
    {
      icon: <Phone className="w-5 h-5" />,
      label: 'Phone',
      value: '+44 7990 136683',
      link: 'tel:+447990136683',
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: 'Studio Location',
      value: '320 Devon Road, Luton, United Kingdom',
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: 'Response Time',
      value: 'Within 24 hours',
    },
  ];

  const inquiryTypes = [
    { id: 'general', name: 'General Inquiry', description: 'Questions about my work or process' },
    { id: 'commission', name: 'Commission Request', description: 'Custom artwork commission' },
    { id: 'purchase', name: 'Purchase Inquiry', description: 'Interest in purchasing existing work' },
    { id: 'exhibition', name: 'Exhibition/Collaboration', description: 'Gallery shows or partnerships' },
  ];

  const socialLinks = [
    { icon: <LuInstagram className="w-5 h-5" />, name: 'Instagram', url: 'https://www.instagram.com/joc_arts?igsh=MXZ0NWw2eTE3bWc3dg%3D%3D&utm_source=qr', handle: '@joc_arts' },
    { icon: <FaXTwitter className="w-5 h-5" />, name: 'Twitter', url: 'https://x.com/skye_worldwide1?s=21', handle: 'skye_worldwide1' },
    { icon: <LuFacebook className="w-5 h-5" />, name: 'Facebook', url: 'https://www.facebook.com/share/1AYRhXUtQH/?mibextid=wwXIfr', handle: 'joshua otuonye' },
    { icon: <FaTiktok className="w-5 h-5" />, name: 'TikTok', url: 'https://www.tiktok.com/@skye_worldwide?_t=ZM-8xZpNt2GNZl&_r=1', handle: '@skye_worldwide' },
  ];

  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleElements((prev) => new Set(prev).add(entry.target.id));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: '-20px',
    });

    const elementsToObserve = document.querySelectorAll('[data-animate]');
    elementsToObserve.forEach((el) => observer.observe(el));

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
    };
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white relative overflow-hidden">
      {/* Artistic Background Elements */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 border border-gray-600 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 right-20 w-96 h-96 border border-gray-700 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-48 h-48 border border-gray-500 rounded-full animate-pulse delay-500"></div>
      </div>

      {/* Floating Artistic Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute w-2 h-2 bg-amber-400 rounded-full opacity-70 transition-all duration-1000 ease-out"
          style={{ left: mousePosition.x * 0.1 + 100, top: mousePosition.y * 0.1 + 50 }}
        ></div>
        <div
          className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-50 transition-all duration-1500 ease-out"
          style={{ left: mousePosition.x * 0.05 + 200, top: mousePosition.y * 0.05 + 100 }}
        ></div>
        <div
          className="absolute w-3 h-3 bg-purple-400 rounded-full opacity-40 transition-all duration-2000 ease-out"
          style={{ left: mousePosition.x * 0.08 + 300, top: mousePosition.y * 0.08 + 150 }}
        ></div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm border-b border-gray-600/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-32">
          <div className="text-center relative">
            <Feather className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 w-8 h-8 text-amber-400 animate-bounce" />
            <h1
              id="hero-title"
              data-animate
              className={`text-5xl md:text-7xl font-light text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-blue-200 mb-6 font-serif tracking-wider transition-all duration-1000 ${
                visibleElements.has('hero-title') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
            >
              Get in Touch
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-8"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light italic leading-relaxed">
              I would love to hear from you. Whether you are interested in commissioning a piece, purchasing existing work, or simply want to connect, do not hesitate to reach out.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div
            id="contact-form"
            data-animate
            className={`transition-all duration-700 ${
              visibleElements.has('contact-form') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="bg-gradient-to-br from-gray-800/40 to-gray-700/40 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-gray-600/30">
              {/* <div className="absolute -inset-2 bg-gradient-to-r from-amber-600/20 to-blue-600/20 rounded-3xl blur-lg"></div> */}
              <div className="relative mb-8">
                <h2 className="text-3xl font-light text-white font-serif mb-2 tracking-wide">Send a Message</h2>
                <p className="text-gray-300 font-light">Fill out the form below and I&apos;ll get back to you soon.</p>
              </div>

              {formStatus === 'success' ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-light text-white font-serif mb-2">Message Sent!</h3>
                  <p className="text-gray-300 font-light">Thank you for reaching out. I&apos;ll respond within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-light text-gray-300 mb-3">
                      What can I help you with?
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {inquiryTypes.map((type) => (
                        <label key={type.id} className="relative group">
                          <input
                            type="radio"
                            name="inquiryType"
                            value={type.id}
                            checked={formData.inquiryType === type.id}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <div
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                              formData.inquiryType === type.id
                                ? 'border-amber-400 bg-gray-800/50'
                                : 'border-gray-600/30 hover:border-amber-400/50'
                            }`}
                          >
                            <div className="font-light text-white group-hover:text-amber-400 transition-colors duration-300">{type.name}</div>
                            <div className="text-sm text-gray-300 mt-1">{type.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-light text-gray-300 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-white bg-gray-800/50"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-light text-gray-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-white bg-gray-800/50"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-light text-gray-300 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-white bg-gray-800/50"
                      placeholder="Brief subject line"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-light text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-white bg-gray-800/50 resize-none"
                      placeholder="Tell me more about your inquiry..."
                    />
                  </div>
                  {formStatus === 'error' && (
                    <div className="flex items-center text-red-500 text-sm">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      {errorMessage}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-4 rounded-lg hover:bg-amber-700 transition-all duration-200 font-light flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formStatus === 'submitting' ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div
              id="contact-info"
              data-animate
              className={`transition-all duration-700 delay-200 ${
                visibleElements.has('contact-info') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="bg-gradient-to-br from-gray-800/40 to-gray-700/40 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-gray-600/30">
                <div className="absolute -inset-2 bg-gradient-to-r from-amber-600/20 to-blue-600/20 rounded-3xl blur-lg"></div>
                <div className="relative">
                  <h3 className="text-2xl font-light text-white font-serif mb-6 tracking-wide">Contact Information</h3>
                  <div className="space-y-6">
                    {contactInfo.map((info, index) => (
                      <div key={index} className="flex items-start space-x-4 group">
                        <div className="p-2 bg-gray-700/50 rounded-lg text-amber-400 group-hover:bg-amber-500/50 group-hover:text-white transition-all duration-300">
                          {info.icon}
                        </div>
                        <div>
                          <div className="text-sm text-gray-300 mb-1">{info.label}</div>
                          {info.link ? (
                            <a
                              href={info.link}
                              className="text-white font-light hover:text-amber-400 transition-colors"
                            >
                              {info.value}
                            </a>
                          ) : (
                            <div className="text-white font-light">{info.value}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div
              id="about-brief"
              data-animate
              className={`transition-all duration-700 delay-300 ${
                visibleElements.has('about-brief') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="bg-gradient-to-br from-gray-800/40 to-gray-700/40 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-gray-600/30">
                <div className="absolute -inset-2 bg-gradient-to-r from-amber-600/20 to-blue-600/20 rounded-3xl blur-lg"></div>
                <div className="relative">
                  <div className="flex items-center space-x-3 mb-6">
                    <User className="w-6 h-6 text-amber-400" />
                    <h3 className="text-2xl font-light text-white font-serif tracking-wide">About the Artist</h3>
                  </div>
                  <p className="text-gray-300 font-light leading-relaxed mb-6">
                    I&apos;m a pencil artist passionate about capturing the subtle interplay of light and shadow. My work focuses on realistic portraits and atmospheric landscapes, created with traditional graphite and charcoal techniques.
                  </p>
                  <p className="text-gray-300 font-light leading-relaxed">
                    Based in Luton, I work from my studio where I create both commissioned pieces and personal artwork. I believe in the timeless beauty of traditional drawing methods and the intimate connection between artist and subject.
                  </p>
                </div>
              </div>
            </div>

            <div
              id="social-media"
              data-animate
              className={`transition-all duration-700 delay-400 ${
                visibleElements.has('social-media') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="bg-gradient-to-br from-gray-800/40 to-gray-700/40 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-gray-600/30">
                <div className="absolute -inset-2 bg-gradient-to-r from-amber-600/20 to-blue-600/20 rounded-3xl blur-lg"></div>
                <div className="relative">
                  <h3 className="text-2xl font-light text-white font-serif mb-6 tracking-wide">Follow My Work</h3>
                  <div className="space-y-4">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-600/50 transition-colors group"
                      >
                        <div className="p-2 bg-gray-700/50 rounded-lg text-amber-400 group-hover:bg-amber-500/50 group-hover:text-white transition-all duration-300">
                          {social.icon}
                        </div>
                        <div>
                          <div className="font-light text-white group-hover:text-amber-400 transition-colors">{social.name}</div>
                          <div className="text-sm text-gray-300">{social.handle}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div
              id="commission-info"
              data-animate
              className={`transition-all duration-700 delay-500 ${
                visibleElements.has('commission-info') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="bg-gradient-to-br from-amber-900/30 to-blue-900/30 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-amber-400/20">
                <div className="relative">
                  <div className="flex items-center space-x-3 mb-6">
                    <Heart className="w-6 h-6 text-amber-400" />
                    <h3 className="text-2xl font-light text-white font-serif tracking-wide">Commission Work</h3>
                  </div>
                  <p className="text-gray-200 font-light leading-relaxed mb-6">
                    I accept a limited number of commissions each year to ensure quality and personal attention. Portrait commissions typically take 4-6 weeks to complete.
                  </p>
                  <p>
                    <span className="font-light text-white">Contact for pricing</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-32 mb-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm px-8 py-4 rounded-full border border-gray-600/30">
            <Feather className="w-6 h-6 text-amber-400" />
            <span className="text-gray-300 font-light tracking-wider">Crafted with passion in Luton</span>
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;