'use client';

import Link from 'next/link';

const services = [
  {
    id: 'b2c',
    title: 'B2C Residential',
    subtitle: 'Consumer Direct Sales',
    description: 'Elite field teams executing door-to-door, residential, and retail campaigns with professionalism and clear daily targets across all seven Emirates.',
    longDescription: 'Our B2C division deploys highly trained field agents who engage directly with consumers at their doorsteps, in malls, and at events. Every interaction is tracked, measured, and optimized through our proprietary OS platform.',
    features: [
      'Door-to-door residential campaigns',
      'Kiosk and mall activations',
      'Event and exhibition sales',
      'Mystery shopping programs',
      'Customer feedback collection',
      'Lead generation & qualification',
    ],
    stats: { value: '50K+', label: 'Daily Customer Interactions' },
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: 'b2b',
    title: 'B2B Corporate',
    subtitle: 'Enterprise Solutions',
    description: 'High-performance corporate activation programs designed for the UAE market, focusing on discipline, structured outreach, and measurable results.',
    longDescription: 'Our B2B teams specialize in corporate sales, building relationships with decision-makers across industries. We deploy account managers who understand the complexities of enterprise sales cycles.',
    features: [
      'Corporate sales teams deployment',
      'Key account management',
      'B2B lead generation',
      'Trade show & conference activations',
      'Corporate partnership development',
      'Enterprise solution selling',
    ],
    stats: { value: '600+', label: 'Corporate Client Partnerships' },
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    id: 'b2b2c',
    title: 'B2B2C Hybrid',
    subtitle: 'Automotive & Retail Partnerships',
    description: 'Specialized automotive showroom and retail partnership engagements, building trust with end consumers through strategic partner channels.',
    longDescription: 'Our B2B2C model combines the best of both worlds - we work with your retail partners and distributors to reach end consumers effectively, creating seamless customer journeys from brand to sale.',
    features: [
      'Automotive showroom sales',
      'Retail partner integrations',
      'Channel marketing programs',
      'Product launch activations',
      'Brand ambassador programs',
      'In-store promoter deployment',
    ],
    stats: { value: '200+', label: 'Partner Retail Locations' },
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: 'b2g',
    title: 'B2G Government',
    subtitle: 'National & Public Sector Programs',
    description: 'Structured national activation programs for government initiatives and public sector engagements across all seven Emirates.',
    longDescription: 'We partner with government entities to deliver large-scale national campaigns, census programs, and public awareness initiatives. Our disciplined approach ensures compliance with all regulatory requirements.',
    features: [
      'National census & survey programs',
      'Public awareness campaigns',
      'Community outreach initiatives',
      'Government service enrollment',
      'Smart city initiatives support',
      'Emirate-wide activations',
    ],
    stats: { value: '7', label: 'Emirates Coverage' },
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
      </svg>
    ),
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-navy text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1556745757-8d76bdb6984b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <span className="section-badge bg-white/10 border-white/20 text-white mb-6">Our Services</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Sales Solutions That Deliver
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              From residential door-to-door campaigns to large-scale government programs,
              we deploy elite sales teams tailored to every market segment.
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {services.map((service, index) => (
              <div
                key={service.id}
                id={service.id}
                className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                {/* Content */}
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <span className="section-badge mb-4">{service.subtitle}</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
                    {service.title}
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.longDescription}
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-gray-700">
                        <span className="w-2 h-2 rounded-full bg-navy"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className="btn-primary"
                  >
                    Start a {service.title} Campaign
                  </Link>
                </div>

                {/* Visual Card */}
                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="bg-white rounded-3xl p-10 shadow-card">
                    <div className="w-16 h-16 rounded-2xl bg-navy flex items-center justify-center text-white mb-8">
                      {service.icon}
                    </div>
                    <div className="mb-6">
                      <div className="text-5xl font-bold text-navy mb-2">
                        {service.stats.value}
                      </div>
                      <div className="text-gray-500 uppercase tracking-wider text-sm">
                        {service.stats.label}
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Scale Your Sales?
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Let&apos;s discuss how our services can transform your sales operations
            and deliver measurable results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-navy font-semibold rounded-full hover:bg-gray-100 transition-colors"
            >
              Start a Partnership
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-colors border border-white/20"
            >
              Learn About Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
