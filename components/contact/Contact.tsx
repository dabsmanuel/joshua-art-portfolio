'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, Send, User, Heart, CheckCircle } from 'lucide-react';

import { LuFacebook, LuInstagram } from "react-icons/lu";
import { FaXTwitter, FaTiktok } from "react-icons/fa6";

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
    inquiryType: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());

  const contactInfo: ContactInfo[] = [
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Email",
      value: "Joshuaotuonye98@gmail.com",
      link: "mailto:Joshuaotuonye98@gmail.com"
    },
    {
      icon: <Phone className="w-5 h-5" />,
      label: "Phone",
      value: "+44 7990 136683",
      link: "tel:+447990136683"
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: "Studio Location",
      value: "320 Devon Road, luton United Kingdom"
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: "Response Time",
      value: "Within 24 hours"
    }
  ];

  const inquiryTypes = [
    { id: 'general', name: 'General Inquiry', description: 'Questions about my work or process' },
    { id: 'commission', name: 'Commission Request', description: 'Custom artwork commission' },
    { id: 'purchase', name: 'Purchase Inquiry', description: 'Interest in purchasing existing work' },
    { id: 'exhibition', name: 'Exhibition/Collaboration', description: 'Gallery shows or partnerships' }
  ];

  const socialLinks = [
    { icon: <LuInstagram className="w-5 h-5" />, name: 'Instagram', url: 'https://www.instagram.com/joc_arts?igsh=MXZ0NWw2eTE3bWc3dg%3D%3D&utm_source=qr', handle: '@joc_arts' },
    { icon: <FaXTwitter className="w-5 h-5" />, name: 'Twitter', url: 'https://x.com/skye_worldwide1?s=21', handle: 'skye_worldwide1' },
    { icon: <LuFacebook className="w-5 h-5" />, name: 'Facebook', url: 'https://www.facebook.com/share/1AYRhXUtQH/?mibextid=wwXIfr', handle: 'joshua otuonye' },
    { icon: <FaTiktok className="w-5 h-5" />, name: 'TikTok', url: 'https://www.tiktok.com/@skye_worldwide?_t=ZM-8xZpNt2GNZl&_r=1', handle: '@skye_worldwide' }
  ];

  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleElements(prev => new Set(prev).add(entry.target.id));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: '-20px'
    });

    const elementsToObserve = document.querySelectorAll('[data-animate]');
    elementsToObserve.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after success message
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              I&apos;d love to hear from you. Whether you&apos;re interested in commissioning a piece, 
              purchasing existing work, or simply want to connect, don&apos;t hesitate to reach out.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div
            id="contact-form"
            data-animate
            className={`transition-all duration-700 ${
              visibleElements.has('contact-form')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-semibold text-gray-900 mb-2">Send a Message</h2>
                <p className="text-gray-600">Fill out the form below and I&apos;ll get back to you soon.</p>
              </div>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600">Thank you for reaching out. I&apos;ll respond within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Inquiry Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      What can I help you with?
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {inquiryTypes.map((type) => (
                        <label key={type.id} className="relative">
                          <input
                            type="radio"
                            name="inquiryType"
                            value={type.id}
                            checked={formData.inquiryType === type.id}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                            formData.inquiryType === type.id
                              ? 'border-gray-900 bg-gray-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}>
                            <div className="font-medium text-gray-900">{type.name}</div>
                            <div className="text-sm text-gray-500 mt-1">{type.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Name and Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 text-gray-700"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 text-gray-700"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 text-gray-700"
                      placeholder="Brief subject line"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 resize-none text-gray-700"
                      placeholder="Tell me more about your inquiry..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gray-900 text-white py-4 rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
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
            {/* Contact Details */}
            <div
              id="contact-info"
              data-animate
              className={`transition-all duration-700 delay-200 ${
                visibleElements.has('contact-info')
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Contact Information</h3>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="p-2 bg-gray-100 rounded-lg text-gray-700">
                        {info.icon}
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">{info.label}</div>
                        {info.link ? (
                          <a
                            href={info.link}
                            className="text-gray-900 font-medium hover:text-gray-700 transition-colors"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <div className="text-gray-900 font-medium">{info.value}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* About */}
            <div
              id="about-brief"
              data-animate
              className={`transition-all duration-700 delay-300 ${
                visibleElements.has('about-brief')
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <User className="w-6 h-6 text-gray-700" />
                  <h3 className="text-2xl font-semibold text-gray-900">About the Artist</h3>
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">
                  I&apos;m a pencil artist passionate about capturing the subtle interplay of light and shadow. 
                  My work focuses on realistic portraits and atmospheric landscapes, created with traditional 
                  graphite and charcoal techniques.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Based in Luton, I work from my studio where I create both commissioned pieces and 
                  personal artwork. I believe in the timeless beauty of traditional drawing methods and 
                  the intimate connection between artist and subject.
                </p>
              </div>
            </div>

            {/* Social Media */}
            <div
              id="social-media"
              data-animate
              className={`transition-all duration-700 delay-400 ${
                visibleElements.has('social-media')
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Follow My Work</h3>
                <div className="space-y-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="p-2 bg-gray-100 rounded-lg text-gray-700 group-hover:bg-gray-200 transition-colors">
                        {social.icon}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{social.name}</div>
                        <div className="text-sm text-gray-500">{social.handle}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Commission Info */}
            <div
              id="commission-info"
              data-animate
              className={`transition-all duration-700 delay-500 ${
                visibleElements.has('commission-info')
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-lg p-8 text-white">
                <div className="flex items-center space-x-3 mb-6">
                  <Heart className="w-6 h-6" />
                  <h3 className="text-2xl font-semibold">Commission Work</h3>
                </div>
                <p className="text-gray-200 leading-relaxed mb-6">
                  I accept a limited number of commissions each year to ensure quality and personal attention. 
                  Portrait commissions typically take 4-6 weeks to complete.
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Portrait (16&quot; x 20&quot;):</span>
                    <span className="font-medium">Starting at $1,800</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Portrait (18&quot; x 24&quot;):</span>
                    <span className="font-medium">Starting at $2,400</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Custom landscapes:</span>
                    <span className="font-medium">Contact for pricing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;