'use client';

import Link from 'next/link';

const services = [
  {
    title: 'Employee Benefit Programs',
    description: 'Integrated campaigns designed to enhance workforce satisfaction and engagement.',
  },
  {
    title: 'Corporate Sales Engagements',
    description: 'Strategic B2B sales teams connecting companies with their target business audiences.',
  },
  {
    title: 'Workplace Activations',
    description: 'On-site educational sessions and product demonstrations embedded in organizational structures.',
  },
  {
    title: 'Key Account Management',
    description: 'Dedicated account managers for enterprise clients requiring ongoing support.',
  },
];

const process = [
  { step: '01', title: 'Discovery', desc: '30-minute consultation to explore your corporate objectives and organizational fit.' },
  { step: '02', title: 'Assessment', desc: 'In-depth analysis gathering financial data, goals, and specific requirements.' },
  { step: '03', title: 'Planning', desc: 'Personalized corporate activation strategy aligned with your evolving needs.' },
  { step: '04', title: 'Execution', desc: 'Full implementation with ongoing management and transparent reporting.' },
];

const industries = [
  'Financial Services',
  'Technology',
  'Healthcare',
  'Real Estate',
  'Manufacturing',
  'Telecommunications',
  'Retail',
  'Hospitality',
];

export default function B2BServicesPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-navy text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <span className="section-badge bg-white/10 border-white/20 text-white mb-6">B2B Services</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              B2B Corporate Activation
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              High-performance corporate activation programs designed for the UAE market,
              focusing on discipline, structured outreach, and measurable results for
              enterprise clients.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-navy">600+</div>
              <div className="text-gray-500 text-sm uppercase tracking-wider">Corporate Clients</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-navy">80%</div>
              <div className="text-gray-500 text-sm uppercase tracking-wider">Global 500 Experience</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-navy">90%</div>
              <div className="text-gray-500 text-sm uppercase tracking-wider">Client Retention</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-navy">$5B</div>
              <div className="text-gray-500 text-sm uppercase tracking-wider">Client Savings</div>
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
                Enterprise Sales Solutions
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our B2B teams specialize in corporate sales, building relationships with
                decision-makers across industries. We deploy account managers who understand
                the complexities of enterprise sales cycles.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We design campaigns specifically integrated into HR departments, staff benefits
                structures, and internal communication channels, positioning B2B activation
                as a strategic workplace tool.
              </p>
              <Link href="/contact" className="btn-primary inline-flex">
                Start a B2B Campaign
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

      {/* Industries */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="section-badge mb-4">Industries We Serve</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy">
              Cross-Industry Expertise
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Our B2B teams have experience across diverse sectors, understanding the unique
              challenges and opportunities of each industry.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {industries.map((industry, i) => (
              <div key={i} className="bg-white rounded-xl p-6 text-center hover:shadow-card transition-shadow">
                <span className="text-navy font-semibold">{industry}</span>
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

      {/* Testimonial */}
      <section className="py-24 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-10 md:p-16 shadow-card text-center">
            <div className="flex justify-center mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <blockquote className="text-xl text-gray-700 mb-6 leading-relaxed">
              &ldquo;SASA&apos;s B2B team transformed our corporate sales approach. Their structured
              methodology and transparent reporting gave us confidence in every campaign.&rdquo;
            </blockquote>
            <div className="text-navy font-semibold">CEO, Regional Enterprise</div>
            <div className="text-gray-500 text-sm">Dubai, UAE</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Scale Your Corporate Sales?
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Let&apos;s discuss how our B2B corporate activation services can help you
            reach decision-makers and grow your enterprise client base.
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
              View All Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
