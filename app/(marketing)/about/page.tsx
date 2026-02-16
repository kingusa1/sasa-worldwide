'use client';

import Link from 'next/link';

const timeline = [
  { year: '2010', title: 'Foundation', description: 'SASA Worldwide was established in Dubai with a vision to revolutionize sales operations in the UAE.' },
  { year: '2014', title: 'Expansion', description: 'Extended operations across all seven Emirates, building the largest field force network in the region.' },
  { year: '2018', title: 'Technology Integration', description: 'Launched proprietary SASA OS platform for real-time performance tracking and analytics.' },
  { year: '2021', title: 'AI Academy', description: 'Introduced AI-powered training platform to continuously upskill our workforce.' },
  { year: '2024', title: 'Market Leader', description: 'Recognized as UAE\'s leading sales operations company with 600+ active clients.' },
];

const leadership = [
  {
    name: 'Adam Qureshi',
    role: 'Co-Founder & Executive Director',
    description: 'Strategic partner building SASA into the UAE\'s leading sales operations company.',
  },
  {
    name: 'Salah Elgemiabby',
    role: 'Co-Founder & Executive Director',
    description: 'Visionary leader driving SASA\'s mission to revolutionize sales operations across the UAE.',
  },
  {
    name: 'Ahmed Abdulmutal',
    role: 'Chief Operations Officer',
    description: 'Expert in field operations management with a track record of scaling high-performance teams.',
  },
  {
    name: 'Lujain Karim',
    role: 'Chief Financial Officer',
    description: 'Financial strategist ensuring sustainable growth and operational excellence.',
  },
  {
    name: 'Omnia Eltaib',
    role: 'Chief Technology Officer',
    description: 'Technology innovator driving AI integration and digital transformation initiatives.',
  },
  {
    name: 'Dr. Malaz Elgemiabby',
    role: 'Chief Strategic Operations Partner',
    description: 'Strategic advisor guiding long-term vision and business development initiatives.',
  },
  {
    name: 'Mazen',
    role: 'Sales Director',
    description: 'Leads high-performing sales teams, driving revenue growth across key territories.',
  },
  {
    name: 'Masnun Taher',
    role: 'Sales Director',
    description: 'Brings strategic sales expertise and operational discipline to field operations.',
  },
  {
    name: 'Joseph McCauley',
    role: 'Sales Director',
    description: 'Directs sales operations with a focus on client engagement and market expansion.',
  },
  {
    name: 'Jonathan Bulmer',
    role: 'Sales Director',
    description: 'Oversees strategic sales initiatives and drives performance across campaign verticals.',
  },
];

const values = [
  {
    title: 'Excellence',
    description: 'We pursue the highest standards in everything we do, from recruitment to execution.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
  {
    title: 'Integrity',
    description: 'We build trust through transparency, honesty, and ethical business practices.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Innovation',
    description: 'We continuously evolve our methods, technologies, and approaches to stay ahead.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: 'Partnership',
    description: 'We believe in collaborative relationships that create mutual success and growth.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-navy text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <span className="section-badge bg-white/10 border-white/20 text-white mb-6">About SASA Worldwide</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              The Performance Growth Engine
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              We are UAE&apos;s leading sales operations company, transforming how businesses
              connect with their customers through elite field teams, cutting-edge technology,
              and unmatched operational discipline.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-white rounded-3xl p-10 shadow-card">
              <div className="w-14 h-14 rounded-2xl bg-navy flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-navy mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                To deliver structured, scalable, and high-performance activation programs that
                drive measurable results for our clients. We combine discipline, innovation,
                and AI-enabled systems to transform sales operations across the UAE.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-3xl p-10 shadow-card">
              <div className="w-14 h-14 rounded-2xl bg-navy flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-navy mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                To be the definitive partner for sales operations excellence in the Middle East,
                setting new standards for performance, professionalism, and innovation in
                field sales and customer engagement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="section-badge mb-4">Our Foundation</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy">
              Core Values
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-cream rounded-2xl p-8 hover:shadow-card transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-navy/10 flex items-center justify-center text-navy mb-6">
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

      {/* Timeline */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="section-badge mb-4">Our Journey</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy">
              Building Excellence
            </h2>
          </div>

          <div className="space-y-8">
            {timeline.map((item, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-6 items-start"
              >
                <div className="flex-shrink-0 w-24 text-3xl font-bold text-navy">
                  {item.year}
                </div>
                <div className="flex-1 bg-white rounded-2xl p-6 shadow-card">
                  <h3 className="text-xl font-bold text-navy mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="section-badge mb-4">Our Team</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy">
              Leadership Team
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Experienced leaders driving our vision forward.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {leadership.map((person, index) => (
              <div
                key={index}
                className="bg-cream rounded-2xl p-6 text-center hover:shadow-card transition-shadow"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-navy flex items-center justify-center">
                  <span className="text-xl font-bold text-white">
                    {person.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-base font-bold text-navy mb-1">
                  {person.name}
                </h3>
                <div className="text-navy/70 text-xs font-medium mb-3">{person.role}</div>
                <p className="text-gray-600 text-xs leading-relaxed">
                  {person.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Partner with Us?
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Let&apos;s discuss how SASA Worldwide can transform your sales operations.
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
              href="/services"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-colors border border-white/20"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
