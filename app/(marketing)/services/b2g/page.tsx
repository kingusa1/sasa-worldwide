'use client';

import Link from 'next/link';

const services = [
  {
    title: 'National Service Campaigns',
    description: 'Large-scale initiatives designed and executed for government implementation across all Emirates.',
  },
  {
    title: 'Public Awareness Programs',
    description: 'Community engagement and educational outreach for government initiatives.',
  },
  {
    title: 'Ministry & Municipal Activations',
    description: 'Direct partnerships with government entities at all levels.',
  },
  {
    title: 'Census & Survey Programs',
    description: 'Large-scale data collection and public service enrollment campaigns.',
  },
];

const process = [
  { step: '01', title: 'Consultation', desc: 'Initial meeting to understand government objectives and requirements.' },
  { step: '02', title: 'Compliance Review', desc: 'Ensure all activities meet regulatory and protocol requirements.' },
  { step: '03', title: 'Deployment', desc: 'Nationwide team mobilization with proper training and credentials.' },
  { step: '04', title: 'Reporting', desc: 'Transparent, detailed reporting meeting government standards.' },
];

const capabilities = [
  { title: 'National Reach', desc: 'Deploy across all 7 Emirates simultaneously', icon: '🇦🇪' },
  { title: 'Protocol Compliance', desc: 'Strict adherence to government standards', icon: '✅' },
  { title: 'Data Security', desc: 'Secure handling of sensitive information', icon: '🔒' },
  { title: 'Multilingual Teams', desc: 'Arabic and English proficiency', icon: '🗣️' },
  { title: 'Rapid Mobilization', desc: 'Quick deployment for urgent initiatives', icon: '⚡' },
  { title: 'Transparent Reporting', desc: 'Real-time dashboards and audit trails', icon: '📊' },
];

export default function B2GServicesPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-navy text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1577495508048-b635879837f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <span className="section-badge bg-white/10 border-white/20 text-white mb-6">B2G Services</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              B2G Government Activation
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Structured national activation programs for government initiatives and public
              sector engagements across all seven Emirates.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-navy">7</div>
              <div className="text-gray-500 text-sm uppercase tracking-wider">Emirates Coverage</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-navy">50+</div>
              <div className="text-gray-500 text-sm uppercase tracking-wider">Government Programs</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-navy">1M+</div>
              <div className="text-gray-500 text-sm uppercase tracking-wider">Citizens Reached</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-navy">100%</div>
              <div className="text-gray-500 text-sm uppercase tracking-wider">Compliance Rate</div>
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
                Public Sector Excellence
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We partner with government entities to deliver large-scale national campaigns,
                census programs, and public awareness initiatives. Our disciplined approach
                ensures compliance with all regulatory requirements.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                SASA operates with respect for government protocols, communication standards,
                and public trust. Every program is executed with the highest level of
                professionalism and accountability.
              </p>
              <Link href="/contact" className="btn-primary inline-flex">
                Discuss a Government Program
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

      {/* Capabilities */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="section-badge mb-4">Our Capabilities</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy">
              Why Government Entities Choose Us
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((cap, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 hover:shadow-card transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl">{cap.icon}</span>
                  <h3 className="text-xl font-bold text-navy">{cap.title}</h3>
                </div>
                <p className="text-gray-600">{cap.desc}</p>
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
              How We Work With Government
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

      {/* Trust Section */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-navy rounded-3xl p-10 md:p-16 text-white">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="section-badge bg-white/10 border-white/20 text-white mb-4">Trust & Compliance</span>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Built for Public Trust
                </h2>
                <p className="text-white/80 mb-6 leading-relaxed">
                  Government programs require the highest standards of integrity, security,
                  and accountability. SASA maintains rigorous protocols to protect public
                  trust and ensure program success.
                </p>
                <ul className="space-y-3">
                  {['Full regulatory compliance', 'Secure data handling', 'Background-verified personnel', 'Complete audit trails', 'Real-time oversight'].map((item, i) => (
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="text-2xl font-bold">Government Trusted</div>
                <p className="text-white/60">Proven track record with public sector</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
            Ready to Launch a Government Initiative?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Let&apos;s discuss how SASA can support your government program with
            nationwide reach and complete accountability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="btn-primary"
            >
              Schedule a Meeting
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
