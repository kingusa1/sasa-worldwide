'use client';

import Link from 'next/link';

const services = [
  {
    title: 'Community Canvassing',
    description: 'Direct engagement within residential areas, building relationships and trust with potential customers.',
  },
  {
    title: 'Door-to-Door Programs',
    description: 'Personal household visits conducted by professional, trained sales agents.',
  },
  {
    title: 'Kiosk Engagements',
    description: 'Interactive stations in malls and community hubs for high-visibility brand presence.',
  },
  {
    title: 'Welcome & Awareness Campaigns',
    description: 'Educational outreach initiatives to introduce products and services to new communities.',
  },
];

const process = [
  { step: '01', title: 'Discovery', desc: '30-minute consultation to explore your objectives and target audience.' },
  { step: '02', title: 'Strategy', desc: 'Custom campaign design based on your goals and market positioning.' },
  { step: '03', title: 'Deployment', desc: 'Trained field teams deployed across target residential areas.' },
  { step: '04', title: 'Reporting', desc: 'Real-time tracking and transparent performance metrics via SASA OS.' },
];

export default function B2CServicesPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-navy text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <span className="section-badge bg-white/10 border-white/20 text-white mb-6">B2C Services</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              B2C Residential Activation
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Connect with consumers directly in their communities. Our elite field teams
              execute door-to-door, residential, and retail campaigns with professionalism
              and clear daily targets across all seven Emirates.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-navy">50K+</div>
              <div className="text-gray-500 text-sm uppercase tracking-wider">Daily Interactions</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-navy">7</div>
              <div className="text-gray-500 text-sm uppercase tracking-wider">Emirates Coverage</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-navy">200+</div>
              <div className="text-gray-500 text-sm uppercase tracking-wider">Communities Served</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-navy">100%</div>
              <div className="text-gray-500 text-sm uppercase tracking-wider">Activity Tracked</div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Overview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="section-badge mb-4">What We Offer</span>
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
                Direct Consumer Engagement
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our B2C division deploys highly trained field agents who engage directly with
                consumers at their doorsteps, in malls, and at events. Every interaction is
                tracked, measured, and optimized through our proprietary SASA OS platform.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We don&apos;t just generate leads—we build relationships that convert. Our teams
                are trained to represent your brand professionally while achieving measurable
                sales targets.
              </p>
              <Link href="/contact" className="btn-primary inline-flex">
                Start a B2C Campaign
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {services.map((service, i) => (
                <div key={i} className="bg-cream rounded-2xl p-6">
                  <h3 className="font-bold text-navy mb-2">{service.title}</h3>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="section-badge mb-4">Our Process</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy">
              How We Work
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {process.map((item, index) => (
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

      {/* Technology */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-navy rounded-3xl p-10 md:p-16 text-white">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="section-badge bg-white/10 border-white/20 text-white mb-4">Powered by Technology</span>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  SASA OS Integration
                </h2>
                <p className="text-white/80 mb-6 leading-relaxed">
                  All B2C activities are supported by SASA OS for lead tracking, activation status,
                  and performance reporting. Our platform enables real-time visibility into every
                  customer interaction.
                </p>
                <ul className="space-y-3">
                  {['Real-time lead tracking', 'GPS-verified field visits', 'Instant performance dashboards', 'AI-powered fraud detection'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="text-2xl font-bold">100% Transparency</div>
                <p className="text-white/60">Every interaction logged and verified</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
            Ready to Reach More Customers?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Let&apos;s discuss how our B2C residential activation services can help you
            connect with customers across the UAE.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="btn-primary"
            >
              Get a Free Consultation
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-navy font-semibold rounded-full hover:bg-gray-50 transition-colors border border-gray-200"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
