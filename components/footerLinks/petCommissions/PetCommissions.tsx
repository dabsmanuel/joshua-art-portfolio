'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Camera, Clock, Star, CheckCircle, ArrowRight, Mail, PawPrint, } from 'lucide-react';
import Image from 'next/image';

interface PetPortfolio {
  id: number;
  image: string;
  petName: string;
  petType: string;
  size: string;
  description: string;
  isMemorial?: boolean;
}

interface Package {
  name: string;
  price: string;
  size: string;
  timeline: string;
  pets: string;
  features: string[];
  popular?: boolean;
}

const PetPortraitsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('single');
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());

  const petPortfolio: PetPortfolio[] = [
    {
      id: 1,
      image: "/api/placeholder/400/500",
      petName: "Luna",
      petType: "Golden Retriever",
      size: "16\" x 20\"",
      description: "A spirited golden retriever captured in her favorite sunny spot."
    },
    {
      id: 2,
      image: "/api/placeholder/400/500",
      petName: "Shadow",
      petType: "Black Cat",
      size: "14\" x 18\"",
      description: "An elegant black cat portrait highlighting piercing green eyes."
    },
    {
      id: 3,
      image: "/api/placeholder/400/500",
      petName: "Max",
      petType: "German Shepherd",
      size: "18\" x 24\"",
      description: "A noble German Shepherd portrayed with dignity and strength.",
      isMemorial: true
    },
    {
      id: 4,
      image: "/api/placeholder/400/500",
      petName: "Bella & Charlie",
      petType: "Bonded Pair",
      size: "20\" x 24\"",
      description: "Two rescue dogs who found their forever home together."
    },
    {
      id: 5,
      image: "/api/placeholder/400/500",
      petName: "Whiskers",
      petType: "Persian Cat",
      size: "12\" x 16\"",
      description: "A regal Persian cat with luxurious fur detail."
    },
    {
      id: 6,
      image: "/api/placeholder/400/500",
      petName: "Thunder",
      petType: "Horse",
      size: "24\" x 30\"",
      description: "A majestic portrait capturing the power and grace of this beautiful stallion."
    }
  ];

  const packages: Package[] = [
    {
      name: "Single Pet",
      price: "£1,200",
      size: "16\" x 20\"",
      timeline: "3-4 weeks",
      pets: "One beloved companion",
      features: [
        "Single pet portrait",
        "Premium graphite on archival paper",
        "2 revision rounds",
        "High-resolution digital scan",
        "Certificate of authenticity",
        "Protective packaging & shipping"
      ]
    },
    {
      name: "Pet Pair",
      price: "£1,800",
      size: "18\" x 24\"",
      timeline: "4-5 weeks",
      pets: "Two pets together",
      features: [
        "Two pets in one composition",
        "Premium graphite & charcoal blend",
        "3 revision rounds",
        "High-resolution digital scan",
        "Certificate of authenticity",
        "Custom background options",
        "Protective packaging & shipping"
      ],
      popular: true
    },
    {
      name: "Multi-Pet Family",
      price: "£2,400",
      size: "20\" x 30\"",
      timeline: "5-6 weeks",
      pets: "3+ pets or complex scene",
      features: [
        "Multiple pets or family scene",
        "Premium mixed media",
        "Unlimited revisions",
        "High-resolution digital scan",
        "Certificate of authenticity",
        "Custom composition design",
        "Progress updates throughout",
        "Premium framing consultation"
      ]
    }
  ];

  const memorialPackages: Package[] = [
    {
      name: "Memorial Portrait",
      price: "£1,000",
      size: "14\" x 18\"",
      timeline: "2-3 weeks",
      pets: "Beloved companion tribute",
      features: [
        "Sensitive memorial portrait",
        "Works with any photo quality",
        "Subtle rainbow bridge elements",
        "2 revision rounds",
        "High-resolution digital scan",
        "Memorial certificate",
        "Complimentary sympathy card"
      ]
    },
    {
      name: "Legacy Portrait",
      price: "£1,600",
      size: "18\" x 24\"",
      timeline: "3-4 weeks",
      pets: "Premium memorial tribute",
      features: [
        "Large memorial portrait",
        "Enhanced from old/damaged photos",
        "Custom memorial elements",
        "3 revision rounds",
        "High-resolution digital scan",
        "Personalized memorial plaque",
        "Memory book with process photos",
        "Complimentary sympathy arrangement"
      ]
    }
  ];

  const testimonials = [
    {
      name: "Sarah Mitchell",
      location: "London",
      petName: "Ruby",
      rating: 5,
      text: "Joshua captured Ruby's mischievous personality perfectly. Every whisker, every expression line - it's like she's looking right at me from the paper."
    },
    {
      name: "Tom Harrison",
      location: "Edinburgh",
      petName: "Bear",
      rating: 5,
      text: "We lost Bear suddenly, and Joshua created the most beautiful memorial portrait from an old phone photo. It brings us comfort every day.",
      isMemorial: true
    },
    {
      name: "Emma Davies",
      location: "Cardiff",
      petName: "Lily & Rose",
      rating: 5,
      text: "Having our two rescue cats immortalized was the best decision. The detail is incredible - you can see their unique bond in the portrait."
    }
  ];

  const photoTips = [
    {
      icon: <Camera className="w-6 h-6" />,
      title: "High Resolution",
      description: "Use the highest quality setting on your camera or phone for crisp details."
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Natural Expression",
      description: "Capture your pet in a relaxed, natural state showing their personality."
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Good Lighting",
      description: "Natural light works best - avoid harsh shadows or dim indoor lighting."
    },
    {
      icon: <PawPrint className="w-6 h-6" />,
      title: "Eye Level",
      description: "Get down to your pet's eye level for the most engaging perspective."
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

  const currentPackages = activeTab === 'memorial' ? memorialPackages : packages;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-32">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <PawPrint className="w-8 h-8 text-blue-600" />
              <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">Pet Portraits</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-6">
              Celebrate Your Best Friend
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Every pet has a unique personality that deserves to be preserved forever. I specialize in 
              capturing the spirit, character, and unconditional love that makes your companion so special.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2">
                <span>Commission Portrait</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium">
                Memorial Portraits
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
            <h2 className="text-4xl font-light text-gray-900 mb-4">Recent Pet Portraits</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From playful puppies to wise old souls, each portrait captures the unique character 
              that makes your pet irreplaceable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {petPortfolio.map((pet, index) => (
              <div
                key={pet.id}
                data-animate
                id={`pet-${pet.id}`}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
                  visibleElements.has(`pet-${pet.id}`)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-[4/5] bg-gray-200 relative overflow-hidden">
                  {pet.isMemorial && (
                    <div className="absolute top-4 right-4 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
                      Memorial
                    </div>
                  )}
                  <Image 
                    src={pet.image} 
                    alt={`${pet.petName} - ${pet.petType}`}
                    height={400}
                    width={400}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{pet.petName}</h3>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-600">{pet.petType}</span>
                  </div>
                  <div className="text-sm text-gray-500 mb-3">{pet.size}</div>
                  <p className="text-gray-600 text-sm leading-relaxed">{pet.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Tips Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div
            id="photo-tips"
            data-animate
            className={`text-center mb-16 transition-all duration-700 ${
              visibleElements.has('photo-tips')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">Getting the Perfect Photo</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Great portraits start with great reference photos. Here are some tips to help you 
              capture the perfect shot of your beloved companion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {photoTips.map((tip, index) => (
              <div
                key={index}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  {tip.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{tip.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{tip.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="bg-blue-50 rounded-2xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Can&apos;t Get the Perfect Shot?</h3>
              <p className="text-gray-600 mb-6">
                Don&apos;t worry! I can work with older photos, multiple reference images, or even slightly 
                blurry pictures. I specialize in bringing out the best in any photo you have.
              </p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Discuss Your Photos
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Tabs */}
      <section className="py-20 bg-gray-50">
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
            <h2 className="text-4xl font-light text-gray-900 mb-4">Pet Portrait Packages</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Choose from celebration portraits of living pets or memorial tributes for those who 
              have crossed the rainbow bridge.
            </p>

            {/* Tab Navigation */}
            <div className="flex justify-center">
              <div className="bg-white p-1 rounded-lg shadow-md">
                <button
                  onClick={() => setActiveTab('single')}
                  className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                    activeTab === 'single'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Celebration Portraits
                </button>
                <button
                  onClick={() => setActiveTab('memorial')}
                  className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                    activeTab === 'memorial'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Memorial Portraits
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPackages.map((pkg, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl shadow-lg p-8 relative transition-all duration-300 ${
                  pkg.popular ? 'ring-2 ring-blue-600 scale-105' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">{pkg.name}</h3>
                  <p className="text-gray-500 mb-4">{pkg.pets}</p>
                  <div className="text-4xl font-light text-gray-900 mb-2">{pkg.price}</div>
                  <div className="text-sm text-gray-500 mb-2">{pkg.size}</div>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{pkg.timeline}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'memorial'
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : pkg.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}>
                  Select {pkg.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Memorial Section */}
      <section className="py-20 bg-gradient-to-br from-purple-100 to-pink-100">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div
            id="memorial"
            data-animate
            className={`transition-all duration-700 ${
              visibleElements.has('memorial')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            <Heart className="w-16 h-16 text-purple-600 mx-auto mb-6" />
            <h2 className="text-4xl font-light text-gray-900 mb-6">Memorial Portraits</h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Losing a beloved pet is one of life&apos;s most difficult experiences. A memorial portrait 
              can help preserve their memory and celebrate the joy they brought to your life. 
              I approach each memorial commission with sensitivity and care, creating a lasting 
              tribute that honors your companion&apos;s legacy.
            </p>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Special Memorial Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Photo Restoration</h4>
                  <p className="text-gray-600 text-sm">I can enhance and restore old or damaged photos to create beautiful memorial portraits.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Rush Service</h4>
                  <p className="text-gray-600 text-sm">Memorial portraits can be completed in 1-2 weeks when needed for services or special occasions.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Multiple Copies</h4>
                  <p className="text-gray-600 text-sm">I can create multiple prints for family members who want to share the memory.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Sympathy Support</h4>
                  <p className="text-gray-600 text-sm">Complimentary grief resources and support throughout the portrait process.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
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
            <h2 className="text-4xl font-light text-gray-900 mb-4">What Pet Parents Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nothing brings me more joy than hearing how these portraits touch the hearts 
              of pet families around the world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl shadow-lg p-8 ${
                  testimonial.isMemorial ? 'border-l-4 border-purple-400' : 'border-l-4 border-blue-400'
                }`}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">`&quot;{testimonial.text}`&quot;</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.location}</div>
                  <div className="text-sm text-blue-600 font-medium">Pet: {testimonial.petName}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
          <PawPrint className="w-16 h-16 mx-auto mb-6 opacity-80" />
          <h2 className="text-4xl font-light mb-6">Ready to Immortalize Your Best Friend?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Whether celebrating a living companion or creating a memorial tribute, 
            let&apos;s work together to create something beautiful that captures their unique spirit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium flex items-center justify-center space-x-2">
              <Mail className="w-5 h-5" />
              <span>Start Your Pet Portrait</span>
            </button>
            <button className="border border-blue-300 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium">
              View More Examples
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PetPortraitsPage;