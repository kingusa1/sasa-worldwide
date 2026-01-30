'use client';

import Link from 'next/link';

const partnershipBenefits = [
  {
    title: 'Structured Operations',
    description: 'Systemized deployment with clear processes, governance, and accountability at every level.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'Fast National Mobilization',
    description: 'Deploy teams across all seven Emirates within days, not weeks.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: 'KPI-Driven Reporting',
    description: 'Real-time dashboards and transparent performance metrics you can trust.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: 'AI-Enabled Oversight',
    description: 'Advanced fraud detection, quality assurance, and performance optimization.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Trained Field Teams',
    description: 'Professional, disciplined agents trained through our AI Academy.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Unified Operating System',
    description: 'SASA OS integrates all activations into one transparent platform.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
      </svg>
    ),
  },
];

const partnerTypes = [
  { name: 'Corporate Enterprises', icon: '🏢' },
  { name: 'Automotive Dealerships', icon: '🚗' },
  { name: 'Retail Brands', icon: '🛍️' },
  { name: 'Government Entities', icon: '🏛️' },
  { name: 'Scale-ups', icon: '📈' },
  { name: 'Established Companies', icon: '🌐' },
];

export default function PartnershipsPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-navy text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <span className="section-badge bg-white/10 border-white/20 text-white mb-6">Partnerships</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Your Execution Partner, Not Just a Service Provider
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              We build long-term strategic partnerships that deliver consistent, measurable results
              through structured operations and transparent reporting.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Partnership - CAFU */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="section-badge mb-4">Featured Partnership</span>
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
                SASA × CAFU Fuel Subscription
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Managing national activation across multiple channels for CAFU&apos;s innovative fuel
                subscription service. Our teams drive customer acquisition through retail, residential,
                and corporate engagement channels.
              </p>
              <ul className="space-y-4 mb-8">
                {['Field teams across all Emirates', 'Kiosk activations in malls and retail centers', 'Residential and community outreach', 'Corporate and fleet engagement programs'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700">
                    <span className="w-6 h-6 rounded-full bg-navy/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-gray-600 leading-relaxed">
                Every customer interaction is logged and tracked through our proprietary SASA OS,
                providing complete transparency throughout the campaign lifecycle.
              </p>
            </div>
            <div className="bg-white rounded-3xl p-10 shadow-card">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-navy flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-navy mb-4">National Coverage</h3>
                <div className="grid grid-cols-2 gap-6 mt-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-navy">7</div>
                    <div className="text-gray-500 text-sm uppercase tracking-wider">Emirates</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-navy">50K+</div>
                    <div className="text-gray-500 text-sm uppercase tracking-wider">Daily Interactions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-navy">200+</div>
                    <div className="text-gray-500 text-sm uppercase tracking-wider">Retail Locations</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-navy">100%</div>
                    <div className="text-gray-500 text-sm uppercase tracking-wider">Transparency</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Benefits */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="section-badge mb-4">Why Partner With Us</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy">
              Partnership Benefits
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnershipBenefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-cream rounded-2xl p-8 hover:shadow-card transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-navy/10 flex items-center justify-center text-navy mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-navy mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Types */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="section-badge mb-4">Who We Partner With</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy">
              Our Partner Categories
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              We work with organizations across industries, from startups to enterprise corporations.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {partnerTypes.map((type, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 text-center hover:shadow-card transition-shadow"
              >
                <div className="text-4xl mb-3">{type.icon}</div>
                <h3 className="text-sm font-semibold text-navy">{type.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="section-badge mb-4">Our Process</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy">
              How Partnership Works
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Discovery', desc: '30-minute consultation to explore your objectives and organizational fit.' },
              { step: '02', title: 'Assessment', desc: 'In-depth analysis of your goals, market position, and campaign requirements.' },
              { step: '03', title: 'Planning', desc: 'Customized activation strategy aligned with your business objectives.' },
              { step: '04', title: 'Execution', desc: 'Full deployment with ongoing management and real-time reporting.' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-navy flex items-center justify-center">
                  <span className="text-xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold text-navy mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start a Partnership?
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Let&apos;s discuss how SASA can become your trusted execution partner
            and transform your sales operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-navy font-semibold rounded-full hover:bg-gray-100 transition-colors"
            >
              Schedule a Consultation
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-colors border border-white/20"
            >
              View Our Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
