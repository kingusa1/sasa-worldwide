'use client';

import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';

const cards = [
  {
    badge: 'VISION',
    title: 'To build the UAE\'s most reliable and effective sales execution engine.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    hasArrow: true,
  },
  {
    badge: 'MISSION',
    title: 'Driving profitable growth with AI-powered sales and marketing.',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    hasArrow: true,
    featured: true,
  },
  {
    badge: 'CORE VALUES',
    title: 'Focused on discipline, integrity, and results in everything we do.',
    image: 'https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    hasArrow: true,
  },
];

export default function About() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <ScrollReveal key={index} delay={index * 150}>
              <div
                className={`group relative ${card.featured ? 'md:-mt-12 md:mb-12' : ''}`}
              >
                {/* Card with Image */}
                {card.featured ? (
                  <div className="relative rounded-3xl overflow-hidden h-full min-h-[400px]">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url("${card.image}")` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/50 to-navy/30"></div>
                    </div>
                    <div className="relative z-10 p-8 flex flex-col justify-end h-full">
                      <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white mb-4 w-fit">
                        {card.badge}
                      </span>
                      <h3 className="text-2xl font-bold text-white mb-4">
                        {card.title}
                      </h3>
                      {card.hasArrow && (
                        <Link
                          href="/about"
                          className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-navy hover:scale-110 transition-transform"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
                          </svg>
                        </Link>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-card hover:shadow-card-hover transition-all duration-300 p-8 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                      <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                        {card.badge}
                      </span>
                      {card.hasArrow && (
                        <Link
                          href="/about"
                          className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-navy hover:text-white hover:border-navy transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
                          </svg>
                        </Link>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-navy mb-6 flex-grow">
                      {card.title}
                    </h3>
                    <div
                      className="w-full h-48 rounded-2xl bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.02]"
                      style={{ backgroundImage: `url("${card.image}")` }}
                    ></div>
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Who We Are Section */}
        <div className="mt-24 grid lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal direction="left">
            <div>
              <span className="section-badge mb-6">WHO WE ARE</span>
              <h2 className="text-4xl md:text-5xl font-bold text-navy mb-6">
                SASA Worldwide
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                SASA Worldwide Management Consultancies CO LLC is a UAE-based sales operations company
                delivering structured, scalable, and reliable national activation programs.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We specialise in designing, training, and deploying high performance sales teams across
                multi-sector environments.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We combine:
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-700">
                  <span className="w-2 h-2 bg-navy rounded-full"></span>
                  High-performance field teams
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <span className="w-2 h-2 bg-navy rounded-full"></span>
                  A unified sales operating system (SASA OS)
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <span className="w-2 h-2 bg-navy rounded-full"></span>
                  An AI-powered training and leadership pathway (SASA AI Academy)
                </li>
              </ul>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Our mission is to bring structure, professionalism, and measurable performance to every
                field operation we lead.
              </p>
              <Link
                href="/about"
                className="btn-primary"
              >
                Discover More
              </Link>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="right" delay={200}>
            <div className="relative">
              <div
                className="w-full h-[500px] rounded-3xl bg-cover bg-center image-reveal"
                style={{
                  backgroundImage: 'url("https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")',
                }}
              ></div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
