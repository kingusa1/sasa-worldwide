'use client';

import ScrollReveal from '@/components/ui/ScrollReveal';

const stories = [
  {
    title: 'Salesforce Integration Generates H&N Success in Healthcare',
    stat: '1.6x',
    statLabel: 'Net synergies realized above the initial target in the first year',
    category: 'Healthcare',
  },
  {
    title: 'Achieving 70% Increase in Real-Time Visibility with a PPM Solution',
    stat: '60%',
    statLabel: 'Reduction in time spent on reporting',
    category: 'Technology',
  },
  {
    title: 'Boosting Efficiency by Streamlining Acquisition Management',
    stat: '90%',
    statLabel: 'Reduction in errors through automation',
    category: 'Operations',
  },
];

export default function SuccessStories() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="section-badge mb-4">Case Studies</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy">
              Success Stories
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Real results from real partnerships. See how we&apos;ve helped businesses
              transform their sales operations.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {stories.map((story, index) => (
            <ScrollReveal key={index} delay={index * 150}>
              <div
                className="bg-cream rounded-2xl p-8 hover:shadow-card hover:-translate-y-1 transition-all duration-300"
              >
                <span className="inline-block px-3 py-1 bg-navy/10 text-navy text-xs font-medium rounded-full mb-4">
                  {story.category}
                </span>
                <h3 className="text-lg font-bold text-navy mb-6 min-h-[3.5rem]">
                  {story.title}
                </h3>
                <div className="pt-6 border-t border-gray-200">
                  <div className="text-4xl font-bold text-navy mb-1">{story.stat}</div>
                  <p className="text-gray-600 text-sm">{story.statLabel}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
