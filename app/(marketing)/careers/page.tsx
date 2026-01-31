'use client';

import Link from 'next/link';

const careerPhases = [
  {
    phase: 1,
    title: 'Agent',
    subtitle: 'Foundation',
    duration: 'Month 1-2',
    description: 'Learn sales fundamentals, product knowledge, and field discipline. Build the core skills that drive success.',
    skills: ['Sales fundamentals', 'Product knowledge', 'Field discipline', 'Customer engagement'],
    color: 'bg-navy',
    kpis: [
      'Daily customer interactions: 40+ contacts',
      'Conversion rate target: 15-20%',
      'Product knowledge assessment: 85%+',
      'Attendance & punctuality: 95%+',
    ],
    training: [
      'SASA Academy onboarding (2 weeks intensive)',
      'Product certification modules',
      'Field shadowing with senior agents',
      'Weekly roleplay sessions',
    ],
    readiness: 'Advance when consistently hitting 100%+ of targets with zero compliance issues.',
  },
  {
    phase: 2,
    title: 'Account Manager',
    subtitle: 'Growth',
    duration: 'Month 3-4',
    description: 'Manage specific locations and clients. Handle basic reporting and develop relationship management skills.',
    skills: ['Client management', 'Location oversight', 'Basic reporting', 'Relationship building'],
    color: 'bg-navy/80',
    kpis: [
      'Location revenue targets: AED 50K+ monthly',
      'Client satisfaction score: 4.5+/5',
      'Report submission accuracy: 98%+',
      'Team coordination effectiveness',
    ],
    training: [
      'CRM mastery (Salesforce fundamentals)',
      'Client communication workshops',
      'Basic data analysis & reporting',
      'Conflict resolution training',
    ],
    readiness: 'Advance when managing 3+ locations successfully with demonstrated client relationship skills.',
  },
  {
    phase: 3,
    title: 'Crew Manager',
    subtitle: 'Leadership',
    duration: 'Month 5-7',
    description: 'Lead small teams and track daily performance. Develop leadership capabilities and team coordination.',
    skills: ['Team leadership', 'Performance tracking', 'Daily operations', 'Team motivation'],
    color: 'bg-navy/70',
    kpis: [
      'Team performance: 110%+ of collective targets',
      'Team retention rate: 85%+',
      'Daily briefing completion: 100%',
      'Coaching sessions per agent: 2+ weekly',
    ],
    training: [
      'Leadership development program',
      'Performance management certification',
      'Motivational techniques workshop',
      'HR fundamentals & compliance',
    ],
    readiness: 'Advance when team consistently ranks in top 20% and developed agents to Account Manager level.',
  },
  {
    phase: 4,
    title: 'Assistant Director',
    subtitle: 'Strategy',
    duration: 'Month 8-10',
    description: 'Oversee multiple locations and support strategic initiatives. Bridge operations with executive leadership.',
    skills: ['Multi-location oversight', 'Strategic support', 'Resource allocation', 'Process optimization'],
    color: 'bg-navy/60',
    kpis: [
      'Multi-location revenue: AED 500K+ monthly',
      'Operational efficiency improvement: 15%+',
      'Budget adherence: Within 5% variance',
      'Strategic project delivery: On-time completion',
    ],
    training: [
      'Executive leadership bootcamp',
      'Financial management & budgeting',
      'Strategic planning workshops',
      'Cross-functional project management',
    ],
    readiness: 'Advance when demonstrating P&L ownership capability and successful strategic initiatives.',
  },
  {
    phase: 5,
    title: 'Director',
    subtitle: 'Executive',
    duration: 'Month 11-12',
    description: 'Own campaign performance end-to-end. Lead managers and drive organizational success.',
    skills: ['Campaign ownership', 'Executive leadership', 'Business development', 'P&L responsibility'],
    color: 'bg-navy/50',
    kpis: [
      'Campaign P&L ownership: AED 2M+ quarterly',
      'Client portfolio growth: 25%+ annually',
      'Leadership pipeline: 3+ managers ready for promotion',
      'Strategic partnerships developed',
    ],
    training: [
      'C-suite executive coaching',
      'Business development masterclass',
      'Industry conference participation',
      'Board presentation skills',
    ],
    readiness: 'Continuous growth through new campaign acquisitions, market expansion, and organizational leadership.',
  },
];

const benefits = [
  {
    title: 'Merit-Based Advancement',
    description: 'Your growth is determined by your performance, not tenure. Excel and advance faster.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    title: 'Continuous Learning',
    description: 'Access to AI-powered training through SASA Academy. Never stop growing your skills.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    title: 'Team Collaboration',
    description: 'We value collaboration over competition. Succeed together with supportive colleagues.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Professional Mentorship',
    description: 'Learn from experienced leaders who are invested in your success and development.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
      </svg>
    ),
  },
];

const culture = [
  { stat: 'Great Place to Work', label: 'Certified' },
  { stat: '4.9', label: 'Google Rating' },
  { stat: '90%', label: 'Employee Retention' },
  { stat: '1 Year', label: 'To Director' },
];

export default function CareersPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-navy text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <span className="section-badge bg-white/10 border-white/20 text-white mb-6">Career Path</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Building Leaders, Growing Careers
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              At SASA, we believe in developing talent from within. Our 5-phase leadership pathway
              provides clear advancement opportunities based on merit and performance.
            </p>
          </div>
        </div>
      </section>

      {/* Culture Stats */}
      <section className="py-12 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {culture.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-navy">{item.stat}</div>
                <div className="text-gray-500 text-sm uppercase tracking-wider">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5-Phase Leadership Pathway */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="section-badge mb-4">Our Framework</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy">
              5-Phase Leadership Pathway
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Each phase includes capability building, performance KPIs, leadership development, and deployment readiness.
            </p>
          </div>

          <div className="space-y-8">
            {careerPhases.map((phase, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-6 items-start"
              >
                <div className="flex-shrink-0 flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl ${phase.color} flex items-center justify-center`}>
                    <span className="text-2xl font-bold text-white">{phase.phase}</span>
                  </div>
                  {index < careerPhases.length - 1 && (
                    <div className="hidden md:block w-8 h-0.5 bg-gray-300"></div>
                  )}
                </div>
                <div className="flex-1 bg-cream rounded-2xl p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-navy">{phase.title}</h3>
                      <span className="text-navy/60 text-sm font-medium uppercase tracking-wider">{phase.subtitle}</span>
                    </div>
                    <span className="px-4 py-2 bg-navy text-white text-sm font-medium rounded-full">
                      {phase.duration}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-6">{phase.description}</p>

                  {/* Core Skills */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {phase.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-white text-navy text-sm rounded-full border border-navy/10"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Detailed Sections Grid */}
                  <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                    {/* Performance KPIs */}
                    <div>
                      <h4 className="font-semibold text-navy mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-navy/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Performance KPIs
                      </h4>
                      <ul className="space-y-2">
                        {phase.kpis.map((kpi, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-navy/40 rounded-full mt-1.5 flex-shrink-0"></span>
                            {kpi}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Training & Development */}
                    <div>
                      <h4 className="font-semibold text-navy mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-navy/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Training Included
                      </h4>
                      <ul className="space-y-2">
                        {phase.training.map((item, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-navy/40 rounded-full mt-1.5 flex-shrink-0"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Deployment Readiness */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-navy mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Advancement Criteria
                    </h4>
                    <p className="text-sm text-gray-600 bg-white rounded-lg p-3 border border-green-100">
                      {phase.readiness}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="section-badge mb-4">Why Join Us</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy">
              What We Offer
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 hover:shadow-card transition-shadow"
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

      {/* Culture Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="section-badge mb-4">Our Culture</span>
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
                Collaboration Over Competition
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We&apos;re not your typical commission-driven sales environment. At SASA, we value
                lifelong learning, mentorship, and professional growth. Our collegial atmosphere
                encourages teamwork and continuous improvement.
              </p>
              <ul className="space-y-4">
                {['Supportive team environment', 'Continuous training programs', 'Clear career progression', 'Work-life balance', 'Performance recognition'].map((item, i) => (
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
            </div>
            <div className="bg-cream rounded-3xl p-10">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-navy flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-navy mb-2">Great Place to Work</h3>
                <p className="text-gray-600">Certified Workplace</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Join SASA and build a career with clear progression, continuous learning,
            and limitless potential.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/recruitment"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-navy font-semibold rounded-full hover:bg-gray-100 transition-colors"
            >
              View Open Positions
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-colors border border-white/20"
            >
              Contact HR
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
