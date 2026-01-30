'use client';

import Link from 'next/link';

const services = [
  {
    title: 'Showroom Advisors',
    description: 'Professional in-store representatives providing product expertise and sales support.',
  },
  {
    title: 'Retail Add-ons & Cross-sell',
    description: 'Strategic programs to increase basket value and customer lifetime value.',
  },
  {
    title: 'Dealer Activation Campaigns',
    description: 'Partner-focused initiatives driving traffic and conversions at dealer locations.',
  },
  {
    title: 'Point-of-Sale Support',
    description: 'Education and support at the moment of purchase decision.',
  },
];

const process = [
  { step: '01', title: 'Discovery', desc: 'Initial consultation to understand your retail partnership goals.' },
  { step: '02', title: 'Planning', desc: 'Custom program design for your specific partner network.' },
  { step: '03', title: 'Deployment', desc: 'Trained representatives placed at partner locations.' },
  { step: '04', title: 'Optimization', desc: 'Continuous improvement based on real-time performance data.' },
];

const sectors = [
  { name: 'Automotive', icon: '🚗', desc: 'Dealership and showroom activations' },
  { name: 'Electronics', icon: '📱', desc: 'Retail tech product demonstrations' },
  { name: 'Home & Garden', icon: '🏠', desc: 'Furniture and home improvement' },
  { name: 'Fashion', icon: '👔', desc: 'Premium retail brand support' },
  { name: 'Telecommunications', icon: '📡', desc: 'Carrier and device sales' },
  { name: 'Financial Services', icon: '💳', desc: 'In-store financial product sales' },
];

export default function B2B2CServicesPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-navy text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <span className="section-badge bg-white/10 border-white/20 text-white mb-6">B2B2C Services</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              B2B2C Automotive & Retail
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Specialized automotive showroom and retail partnership engagements,
              building trust with end consumers through strategic partner channels.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-navy">200+</div>
              <div className="text-gray-500 text-sm uppercase tracking-wider">Partner Locations</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-navy">50+</div>
              <div className="text-gray-500 text-sm uppercase tracking-wider">Retail Partners</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-navy">30%</div>
              <div className="text-gray-500 text-sm uppercase tracking-wider">Avg. Sales Lift</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-navy">4.9</div>
              <div className="text-gray-500 text-sm uppercase tracking-wider">Partner Rating</div>
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
                Partner Channel Activation
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our B2B2C model combines the best of both worlds—we work with your retail
                partners and distributors to reach end consumers effectively, creating
                seamless customer journeys from brand to sale.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Teams operate within partner environments while maintaining SASA&apos;s
                professional standards. Every interaction strengthens your brand while
                driving measurable results.
              </p>
              <Link href="/contact" className="btn-primary inline-flex">
                Start a B2B2C Campaign
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

      {/* Sectors */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="section-badge mb-4">Sectors We Serve</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy">
              Retail & Partner Expertise
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Our B2B2C teams specialize in high-value retail environments where
              customer experience drives purchase decisions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sectors.map((sector, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 hover:shadow-card transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl">{sector.icon}</span>
                  <h3 className="text-xl font-bold text-navy">{sector.name}</h3>
                </div>
                <p className="text-gray-600">{sector.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-white">
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

      {/* Partner Success */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-navy rounded-3xl p-10 md:p-16 text-white">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="section-badge bg-white/10 border-white/20 text-white mb-4">Partner Success</span>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Driving Results Together
                </h2>
                <p className="text-white/80 mb-6 leading-relaxed">
                  Our B2B2C programs create win-win scenarios for brands, retail partners,
                  and end consumers. We measure success by the value we create across the
                  entire channel.
                </p>
                <ul className="space-y-3">
                  {['Increased foot traffic', 'Higher conversion rates', 'Improved customer satisfaction', 'Stronger partner relationships'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-6 text-center">
                <div className="bg-white/10 rounded-2xl p-6">
                  <div className="text-4xl font-bold">30%</div>
                  <div className="text-white/60 text-sm">Avg. Sales Increase</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-6">
                  <div className="text-4xl font-bold">25%</div>
                  <div className="text-white/60 text-sm">Conversion Lift</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-6">
                  <div className="text-4xl font-bold">95%</div>
                  <div className="text-white/60 text-sm">Partner Satisfaction</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-6">
                  <div className="text-4xl font-bold">4.9</div>
                  <div className="text-white/60 text-sm">Customer Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
            Ready to Activate Your Partner Channels?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Let&apos;s discuss how our B2B2C activation services can strengthen your
            partner relationships and drive consumer engagement.
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
