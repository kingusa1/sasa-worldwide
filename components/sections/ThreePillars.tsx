'use client';

import ScrollReveal from '@/components/ui/ScrollReveal';

const pillars = [
  {
    number: '1',
    title: 'SASA Field Force',
    description: 'Elite, trained field teams and kiosk operations executing door-to-door, residential, corporate, and retail campaigns with professionalism and clear daily targets.',
  },
  {
    number: '2',
    title: 'SASA OS',
    description: 'Our unified sales operating system. It centralises leads, sales, activations, commissions, performance, and reporting into one source of truth — giving partners complete visibility and control.',
  },
  {
    number: '3',
    title: 'SASA AI Academy',
    description: 'A structured five-phase leadership and talent development pathway that turns new recruits into world-class closers, managers, and directors, supported by AI-enhanced training tools.',
  },
];

const approach = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Structured sales systems',
    description: 'Clear processes that ensure consistent, repeatable performance.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Nationwide deployment',
    description: 'Scalable teams activated across all UAE regions.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
    title: 'AI-enabled reporting',
    description: 'Real-time insights that guide smarter decisions.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: 'Professional training',
    description: 'Skill development that elevates sales capability fast.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'KPI-driven execution',
    description: 'Targets tracked daily to deliver predictable results.',
  },
];

export default function ThreePillars() {
  return (
    <>
      {/* Our Three Core Pillars */}
      <section className="py-24 bg-navy text-white relative overflow-hidden">
        <div
          className="absolute right-0 top-0 bottom-0 w-1/2 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-navy to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <ScrollReveal>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-12">
                Our Three Core Pillars
              </h2>
            </ScrollReveal>

            <div className="space-y-8">
              {pillars.map((pillar, index) => (
                <ScrollReveal key={index} delay={index * 150}>
                  <div className="border-l-2 border-white/30 pl-6 hover:border-white/60 transition-colors">
                    <span className="text-sm text-white/60 font-medium">
                      {pillar.number}. {pillar.title}
                    </span>
                    <p className="text-white/80 mt-2 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="mb-12">
              <span className="section-badge">OUR APPROACH</span>
              <h2 className="text-2xl md:text-3xl font-bold text-navy mt-4 max-w-2xl">
                A disciplined, data-driven model built for consistent, scalable sales execution.
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {approach.map((item, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <div
                  className="bg-navy text-white rounded-2xl p-6 text-center hover:-translate-y-1 transition-transform duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold mb-2 text-sm">
                    {item.title}
                  </h3>
                  <p className="text-white/70 text-xs leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="relative py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="max-w-md">
              <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
                WHY US?
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
