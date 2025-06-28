'use client';

import React, { useState, useEffect } from 'react';
import { Clock, User, CheckCircle, Star, ArrowRight, Mail, Palette, Award } from 'lucide-react';
import Image from 'next/image';

interface PortfolioItem {
  id: number;
  image: string;
  title: string;
  size: string;
  completion: string;
  description: string;
}

interface PricingTier {
  size: string;
  dimensions: string;
  price: string;
  timeline: string;
  features: string[];
  popular?: boolean;
}

const PortraitCommissionsPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());

  const portfolioItems: PortfolioItem[] = [
    {
      id: 1,
      image: "/api/placeholder/400/500",
      title: "Sarah's Portrait",
      size: "16\" x 20\"",
      completion: "2024",
      description: "A contemplative portrait capturing Sarah's gentle spirit and warm expression."
    },
    {
      id: 2,
      image: "/api/placeholder/400/500",
      title: "The Johnson Family",
      size: "18\" x 24\"",
      completion: "2024",
      description: "Multi-figure commission showcasing three generations of the Johnson family."
    },
    {
      id: 3,
      image: "/api/placeholder/400/500",
      title: "Memorial Portrait",
      size: "14\" x 18\"",
      completion: "2023",
      description: "A touching memorial piece created from treasured family photographs."
    }
  ];

  const pricingTiers: PricingTier[] = [
    {
      size: "Standard",
      dimensions: "16\" x 20\"",
      price: "$1,800",
      timeline: "4-5 weeks",
      features: [
        "Single subject portrait",
        "Professional graphite on premium paper",
        "3 revision rounds included",
        "High-resolution digital scan",
        "Certificate of authenticity",
        "Protective packaging & shipping"
      ]
    },
    {
      size: "Large",
      dimensions: "18\" x 24\"",
      price: "$2,400",
      timeline: "5-6 weeks",
      features: [
        "Single or dual subject portrait",
        "Premium graphite & charcoal blend",
        "4 revision rounds included",
        "High-resolution digital scan",
        "Certificate of authenticity",
        "Professional framing consultation",
        "White glove delivery service"
      ],
      popular: true
    },
    {
      size: "Premium",
      dimensions: "24\" x 30\"",
      price: "$3,200",
      timeline: "6-8 weeks",
      features: [
        "Multiple subjects or complex composition",
        "Premium mixed media techniques",
        "Unlimited revision rounds",
        "High-resolution digital scan",
        "Certificate of authenticity",
        "Professional framing included",
        "Personal consultation & progress updates",
        "White glove delivery service"
      ]
    }
  ];

  const processSteps = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Initial Consultation",
      description: "We discuss your vision, review reference photos, and determine the perfect approach for your portrait."
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Sketch Approval",
      description: "I create a detailed preliminary sketch for your approval before beginning the final artwork."
    },
    {
      icon: <User className="w-6 h-6" />,
      title: "Creation Process",
      description: "Your portrait comes to life through careful layering of graphite and charcoal, with progress updates."
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Final Review",
      description: "Final adjustments are made based on your feedback before professional packaging and delivery."
    }
  ];

  const testimonials = [
    {
      name: "Maria Rodriguez",
      location: "London",
      rating: 5,
      text: "Joshua captured my daughter's personality perfectly. The attention to detail is extraordinary, and the entire process was smooth and professional."
    },
    {
      name: "David Thompson",
      location: "Manchester",
      rating: 5,
      text: "Commissioned a memorial portrait of my late father. Joshua's sensitivity and skill created something truly beautiful that our family will treasure forever."
    },
    {
      name: "Jennifer Walsh",
      location: "Birmingham",
      rating: 5,
      text: "The wedding portrait Joshua created exceeded all expectations. The likeness is incredible, and it's become the centerpiece of our home."
    }
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

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep(prev => (prev + 1) % processSteps.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-32">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Award className="w-8 h-8 text-gray-700" />
              <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">Premium Commissions</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-6">
              Portrait Commissions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Transform your most cherished memories into timeless works of art. Each portrait is meticulously 
              crafted using traditional graphite techniques, capturing not just likeness but the essence of your subject.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gray-900 text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium flex items-center justify-center space-x-2">
                <span>Start Your Commission</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium">
                View Portfolio
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Gallery */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div
            id="portfolio"
            data-animate
            className={`text-center mb-16 transition-all duration-700 ${
              visibleElements.has('portfolio')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">Recent Commissions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Each portrait tells a unique story, crafted with precision and care to capture the personality 
              and character that makes your subject special.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioItems.map((item, index) => (
              <div
                key={item.id}
                data-animate
                id={`portfolio-${item.id}`}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
                  visibleElements.has(`portfolio-${item.id}`)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-[4/5] bg-gray-200 relative overflow-hidden">
                  <Image 
                    src={item.image} 
                    alt={item.title}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                    <span>{item.size}</span>
                    <span>{item.completion}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div
            id="process"
            data-animate
            className={`text-center mb-16 transition-all duration-700 ${
              visibleElements.has('process')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">Commission Process</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A collaborative journey from initial concept to final masterpiece, 
              ensuring your vision comes to life exactly as you imagined.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div
                key={index}
                className={`text-center transition-all duration-500 ${
                  activeStep === index ? 'scale-105' : ''
                }`}
              >
                <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                  activeStep === index 
                    ? 'bg-gray-900 text-white shadow-lg' 
                    : 'bg-white text-gray-700 shadow-md'
                }`}>
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div
            id="pricing"
            data-animate
            className={`text-center mb-16 transition-all duration-700 ${
              visibleElements.has('pricing')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">Commission Pricing</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Transparent pricing with no hidden fees. Each commission includes everything needed 
              to deliver a museum-quality portrait to your door.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl shadow-lg p-8 relative ${
                  tier.popular ? 'ring-2 ring-gray-900 scale-105' : ''
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gray-900 text-white px-6 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">{tier.size}</h3>
                  <p className="text-gray-500 mb-4">{tier.dimensions}</p>
                  <div className="text-4xl font-light text-gray-900 mb-2">{tier.price}</div>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{tier.timeline}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
                  tier.popular
                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}>
                  Select {tier.size}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div
            id="testimonials"
            data-animate
            className={`text-center mb-16 transition-all duration-700 ${
              visibleElements.has('testimonials')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">Client Testimonials</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from clients who have experienced the joy of seeing their loved ones 
              immortalized in graphite and charcoal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">&quot;{testimonial.text}&quot;</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div
            id="faq"
            data-animate
            className={`text-center mb-16 transition-all duration-700 ${
              visibleElements.has('faq')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "What makes a good reference photo?",
                answer: "High-resolution images with good lighting work best. I prefer photos where the subject's eyes are clearly visible and well-lit. I can work with multiple reference photos to create the perfect composition."
              },
              {
                question: "How many revisions are included?",
                answer: "The number of revision rounds varies by package, but I work closely with you throughout the process to ensure you're completely satisfied with the final result."
              },
              {
                question: "Do you work from old or damaged photos?",
                answer: "Absolutely. I specialize in memorial portraits and can work with vintage, damaged, or low-quality photos to create beautiful tributes to your loved ones."
              },
              {
                question: "What's your typical turnaround time?",
                answer: "Standard commissions take 4-6 weeks, depending on complexity. I'll provide a specific timeline when we discuss your project and keep you updated throughout the process."
              },
              {
                question: "Do you ship internationally?",
                answer: "Yes, I ship worldwide with full insurance and tracking. International shipping costs are calculated based on size and destination."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default PortraitCommissionsPage;