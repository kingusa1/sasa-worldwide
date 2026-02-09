'use client';

import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';

const portalFeatures = [
  {
    title: 'Structured Learning Paths',
    description: 'Follow guided courses designed to build your skills step by step.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    title: 'Community Support',
    description: 'Connect with peers, mentors, and team leads for guidance and collaboration.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Progress Tracking',
    description: 'Monitor your learning journey with clear milestones and achievement badges.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: '24/7 Access',
    description: 'Learn and connect anytime, anywhere with full mobile and desktop support.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Expert Resources',
    description: 'Access curated materials from industry experts and SASA leadership.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: 'Regular Updates',
    description: 'Stay current with new content, features, and announcements added regularly.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
];

export default function ClientPortalPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-navy text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <span className="section-badge bg-white/10 border-white/20 text-white mb-6">Client Portal</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Your Gateway to SASA Resources
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Access educational content, connect with the SASA community, and take your
              performance to the next level through our dedicated portals.
            </p>
          </div>
        </div>
      </section>

      {/* Training Portal Card */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <ScrollReveal>
              <span className="section-badge mb-4">SASA Academy</span>
              <h2 className="text-3xl md:text-4xl font-bold text-navy">
                Your Complete Training & Community Hub
              </h2>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                Access everything you need in one place - from courses and training materials
                to community discussions and support resources.
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={100}>
            <div className="max-w-4xl mx-auto">
              <div className="bg-cream rounded-3xl p-12 hover:shadow-xl transition-all duration-300">
                <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-navy flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                </div>

                <h3 className="text-3xl font-bold text-navy mb-4 text-center">
                  SASA Academy Portal
                </h3>
                <p className="text-gray-600 text-center mb-10 leading-relaxed text-lg">
                  Access comprehensive training, community support, and all the resources
                  you need to excel with SASA - all in one unified platform.
                </p>

                <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 mb-10">
                  {[
                    'Interactive courses & modules',
                    'Onboarding tutorials',
                    'Skills assessments & quizzes',
                    'Training certificates',
                    'Community discussions & forums',
                    'Direct support access',
                    'Latest news & announcements',
                    'Resource library & downloads'
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-700">
                      <span className="w-6 h-6 rounded-full bg-navy/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <a
                  href="https://sasa-worldwide.app.clientclub.net/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full text-center justify-center text-lg py-4"
                >
                  Access SASA Academy Portal
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <ScrollReveal>
              <span className="section-badge mb-4">What You Get</span>
              <h2 className="text-3xl md:text-4xl font-bold text-navy">
                Everything You Need to Succeed
              </h2>
            </ScrollReveal>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portalFeatures.map((feature, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <div className="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow h-full">
                  <div className="w-12 h-12 rounded-xl bg-navy/10 flex items-center justify-center text-navy mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Need Help Getting Started?
            </h2>
            <p className="text-xl text-white/80 mb-10">
              Our team is here to help you navigate the portals and make the most
              of your SASA experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-navy font-semibold rounded-full hover:bg-gray-100 transition-colors"
              >
                Contact Support
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <a
                href="https://sasa-worldwide.app.clientclub.net/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-colors border border-white/20"
              >
                Go to Portal
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
