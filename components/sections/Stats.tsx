'use client';

import AnimatedCounter from '@/components/ui/AnimatedCounter';
import ScrollReveal from '@/components/ui/ScrollReveal';

const stats = [
  { value: 600, suffix: '+', label: 'Satisfied Clients' },
  { value: 5, prefix: '$', suffix: 'B', label: 'Saved for Clients Annually' },
  { value: 80, suffix: '%', label: 'Worked with Global 500' },
  { value: 90, prefix: '>', suffix: '%', label: 'Repeat Clients or Referrals' },
];

export default function Stats() {
  return (
    <section className="py-16 bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <ScrollReveal key={index} delay={index * 100}>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  <AnimatedCounter
                    end={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    duration={2000}
                  />
                </div>
                <div className="text-white/60 text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
