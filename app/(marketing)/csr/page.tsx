'use client';

import Link from 'next/link';

const initiatives = [
  {
    title: 'Youth Employment Program',
    category: 'Community',
    description: 'Providing career opportunities and training for young UAE nationals and residents, helping them build professional skills and launch their careers.',
    impact: '500+ youth employed annually',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    title: 'Sustainable Operations',
    category: 'Environment',
    description: 'Implementing eco-friendly practices across our operations, from paperless reporting to optimized field routes that reduce carbon emissions.',
    impact: '40% reduction in paper usage',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Skills Development Initiative',
    category: 'Education',
    description: 'Free training workshops and mentorship programs for community members interested in developing sales and professional skills.',
    impact: '1,000+ trained annually',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    title: 'Community Outreach',
    category: 'Social Impact',
    description: 'Supporting local communities through charity drives, volunteer programs, and partnerships with non-profit organizations.',
    impact: '50+ community events yearly',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    title: 'Emiratization Support',
    category: 'National Development',
    description: 'Active participation in UAE national initiatives to increase Emirati workforce participation in the private sector.',
    impact: '30% Emirati workforce target',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
      </svg>
    ),
  },
  {
    title: 'Digital Inclusion',
    category: 'Technology',
    description: 'Providing digital literacy programs and technology access to underserved communities across the UAE.',
    impact: '200+ digital workshops',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const values = [
  { title: 'Integrity', desc: 'Ethical practices in all operations' },
  { title: 'Community', desc: 'Giving back to society' },
  { title: 'Sustainability', desc: 'Environmental responsibility' },
  { title: 'Development', desc: 'Investing in people' },
];

const stats = [
  { value: '500+', label: 'Youth Employed' },
  { value: '1,000+', label: 'People Trained' },
  { value: '50+', label: 'Community Events' },
  { value: '7', label: 'Emirates Reached' },
];

export default function CSRPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-navy text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <span className="section-badge bg-white/10 border-white/20 text-white mb-6">Corporate Social Responsibility</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Making a Positive Impact
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              At SASA Worldwide, we believe business success and social responsibility go hand in hand.
              We&apos;re committed to creating lasting positive change in our communities.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl md:text-4xl font-bold text-navy">{stat.value}</div>
                <div className="text-gray-500 text-sm uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Commitment */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="section-badge mb-4">Our Commitment</span>
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
                Building a Better Future Together
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We recognize that our success is intertwined with the well-being of our communities.
                Through targeted initiatives and partnerships, we&apos;re working to create opportunities,
                protect our environment, and support the UAE&apos;s vision for sustainable development.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Our CSR strategy focuses on four key pillars: community empowerment, environmental
                sustainability, education and skills development, and national development initiatives.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {values.map((value, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-navy/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-navy">{value.title}</div>
                      <div className="text-sm text-gray-500">{value.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-cream rounded-3xl p-10">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-navy flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-navy mb-2">UAE Vision 2031</h3>
                <p className="text-gray-600">Aligned with national sustainability goals</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Initiatives */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="section-badge mb-4">What We Do</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy">
              Our Initiatives
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Programs and initiatives that create meaningful impact in our communities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initiatives.map((initiative, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 hover:shadow-card transition-shadow"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-xl bg-navy/10 flex items-center justify-center text-navy">
                    {initiative.icon}
                  </div>
                  <span className="px-3 py-1 bg-navy/10 text-navy text-xs font-medium rounded-full">
                    {initiative.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-navy mb-3">
                  {initiative.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {initiative.description}
                </p>
                <div className="pt-4 border-t border-gray-100">
                  <div className="text-sm text-navy font-semibold">{initiative.impact}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner With Us */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="section-badge mb-4">Get Involved</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy">
              Partner With Us
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Join us in making a difference. We welcome partnerships with organizations
              that share our commitment to social responsibility.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Corporate Partners',
                desc: 'Collaborate on community initiatives and co-branded CSR programs.',
                icon: '🏢',
              },
              {
                title: 'Non-Profits',
                desc: 'Partner with us to amplify your impact and reach more communities.',
                icon: '🤝',
              },
              {
                title: 'Government Entities',
                desc: 'Support national development initiatives and public awareness campaigns.',
                icon: '🏛️',
              },
            ].map((item, i) => (
              <div key={i} className="bg-cream rounded-2xl p-8 text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
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
            Let&apos;s Create Impact Together
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Whether you&apos;re interested in partnering on CSR initiatives or learning more
            about our programs, we&apos;d love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-navy font-semibold rounded-full hover:bg-gray-100 transition-colors"
            >
              Contact Us
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-colors border border-white/20"
            >
              Learn About SASA
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
