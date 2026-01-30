'use client';

import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';

const insights = [
  {
    slug: 'outsourcing-sales-operations-transform-business',
    title: 'How Outsourcing Sales Operations Can Transform Your Business',
    category: 'Sales Strategy',
    date: 'Jan 2026',
    excerpt: 'Discover why leading companies in the UAE are choosing to outsource their sales operations and the measurable impact it has on growth.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'power-of-field-sales-teams-uae',
    title: 'The Power of Field Sales Teams in the UAE Market',
    category: 'Field Operations',
    date: 'Jan 2026',
    excerpt: 'Learn how face-to-face sales interactions continue to drive exceptional results in the UAE\'s unique business environment.',
    image: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'data-driven-sales-strategies',
    title: 'Why Data-Driven Sales Strategies Outperform Traditional Methods',
    category: 'Technology',
    date: 'Jan 2026',
    excerpt: 'Explore how SASA OS and real-time analytics are revolutionizing sales performance across all seven Emirates.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
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
                Expert perspectives on field sales, growth strategies, and operational excellence in the UAE market.
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-navy font-semibold hover:underline whitespace-nowrap"
            >
              View All Articles
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {insights.map((insight, index) => (
            <ScrollReveal key={index} delay={index * 150}>
              <Link href={`/blog/${insight.slug}`} className="block group">
                <article
                  className="bg-white rounded-2xl overflow-hidden hover:shadow-card hover:-translate-y-1 transition-all duration-300 h-full"
                >
                  <div className="h-48 relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                      style={{ backgroundImage: `url("${insight.image}")` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <span className="absolute bottom-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-navy text-xs font-medium rounded-full">
                      {insight.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-gray-400 text-xs">{insight.date}</span>
                    </div>
                    <h3 className="text-lg font-bold text-navy mb-2 group-hover:text-navy/80 transition-colors line-clamp-2">
                      {insight.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {insight.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-2 text-navy font-medium text-sm mt-4 group-hover:gap-3 transition-all">
                      Read more
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </article>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
