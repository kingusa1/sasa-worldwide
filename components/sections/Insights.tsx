'use client';

import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';

const insights = [
  {
    title: 'The Scaling Blueprint: Helping Regional Banks Prepare for the Future',
    category: 'Strategy',
    date: 'Jan 2026',
    excerpt: 'How financial institutions can leverage outsourced sales operations to accelerate growth.',
  },
  {
    title: 'Healthcare Private Equity Market 2024: Year in Review and Outlook',
    category: 'Industry',
    date: 'Dec 2025',
    excerpt: 'Key trends and opportunities in healthcare sector sales and distribution.',
  },
  {
    title: 'AI-Enabled Sales: The Future of Field Operations',
    category: 'Technology',
    date: 'Nov 2025',
    excerpt: 'How artificial intelligence is transforming on-ground sales execution.',
  },
];

export default function Insights() {
  return (
    <section className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <span className="section-badge mb-4">Knowledge Hub</span>
              <h2 className="text-3xl md:text-4xl font-bold text-navy">
                Our Latest Insights
              </h2>
              <p className="text-gray-600 mt-4 max-w-xl">
                Proprietary data, expert analysis and bold thinking for leaders
                who want to achieve the extraordinary.
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-navy font-semibold hover:underline whitespace-nowrap"
            >
              More Insights
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {insights.map((insight, index) => (
            <ScrollReveal key={index} delay={index * 150}>
              <article
                className="bg-white rounded-2xl overflow-hidden hover:shadow-card hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="h-48 bg-navy/10 flex items-center justify-center">
                  <svg className="w-16 h-16 text-navy/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-2 py-1 bg-navy/10 text-navy text-xs font-medium rounded">
                      {insight.category}
                    </span>
                    <span className="text-gray-400 text-xs">{insight.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-2 group-hover:text-navy/80 transition-colors">
                    {insight.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {insight.excerpt}
                  </p>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
