'use client';

import Link from 'next/link';

const coreValues = [
  {
    title: 'Discipline',
    description: 'Structured operations and consistent execution drive our success.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'Integrity',
    description: 'Honesty and transparency in every interaction and report.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Results',
    description: 'Every action measured against clear, accountable KPIs.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: 'Innovation',
    description: 'Continuous improvement through AI and technology adoption.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
];

export default function MissionPage() {
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
            <span className="section-badge bg-white/10 border-white/20 text-white mb-6">Mission & Vision</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Our Purpose & Direction
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Driven by a clear mission and guided by an ambitious vision for the future
              of sales operations in the UAE and beyond.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="section-badge mb-4">Our Mission</span>
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
                Driving Profitable Growth
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                To deliver consistent, measurable sales performance through systematic
                processes, disciplined trained teams, nationwide presence, and continuous
                AI-enabled improvement.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We exist to transform sales operations from guesswork to science. By combining
                field excellence with cutting-edge technology, we help businesses achieve
                predictable, scalable growth across the UAE market.
              </p>
            </div>
            <div className="bg-white rounded-3xl p-10 shadow-card">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-navy flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <blockquote className="text-center text-xl text-navy font-medium italic">
                &ldquo;Sales must be measurable, not guesswork.&rdquo;
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 bg-cream rounded-3xl p-10">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-navy flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <blockquote className="text-center text-xl text-navy font-medium italic">
                &ldquo;Setting regional benchmarks for Sales as a Service.&rdquo;
              </blockquote>
            </div>
            <div className="order-1 lg:order-2">
              <span className="section-badge mb-4">Our Vision</span>
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
                The UAE&apos;s Sales Execution Engine
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                To build the UAE&apos;s most reliable, effective, and respected sales execution
                engine, setting regional benchmarks for Sales as a Service.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We envision a future where every business in the UAE has access to world-class
                sales capabilities—where performance is predictable, teams are empowered, and
                growth is inevitable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="section-badge mb-4">What Guides Us</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy">
              Core Values
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Focused on discipline, integrity, and results in everything we do.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 hover:shadow-card transition-shadow text-center"
              >
                <div className="w-14 h-14 mx-auto rounded-xl bg-navy/10 flex items-center justify-center text-navy mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-navy mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Our Mission
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Whether as a partner or team member, be part of transforming
            sales operations across the UAE.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/partnerships"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-navy font-semibold rounded-full hover:bg-gray-100 transition-colors"
            >
              Partner With Us
            </Link>
            <Link
              href="/careers"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-colors border border-white/20"
            >
              Join Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
