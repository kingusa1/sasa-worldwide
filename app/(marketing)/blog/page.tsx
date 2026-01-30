import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Blog - SASA Financial Consulting',
  description: 'Stay informed with the latest financial insights, tips, and news from SASA.',
};

const posts = [
  {
    slug: 'understanding-market-volatility',
    title: 'Understanding Market Volatility: A Guide for Investors',
    excerpt: 'Learn how to navigate market ups and downs with confidence and make informed investment decisions.',
    date: 'January 15, 2026',
    category: 'Investment',
    readTime: '5 min read',
  },
  {
    slug: 'retirement-planning-essentials',
    title: '5 Essential Steps for Retirement Planning in 2026',
    excerpt: 'Start planning your retirement early with these fundamental strategies for long-term financial security.',
    date: 'January 10, 2026',
    category: 'Planning',
    readTime: '7 min read',
  },
  {
    slug: 'tax-optimization-strategies',
    title: 'Tax Optimization Strategies for Small Business Owners',
    excerpt: 'Discover legal ways to minimize your tax burden and maximize your business profits.',
    date: 'January 5, 2026',
    category: 'Tax',
    readTime: '6 min read',
  },
  {
    slug: 'diversification-importance',
    title: 'Why Diversification Matters More Than Ever',
    excerpt: 'Explore the benefits of portfolio diversification and how it can protect your investments.',
    date: 'December 28, 2025',
    category: 'Investment',
    readTime: '4 min read',
  },
  {
    slug: 'emergency-fund-guide',
    title: 'Building Your Emergency Fund: How Much is Enough?',
    excerpt: 'A comprehensive guide to creating and maintaining an emergency fund for financial security.',
    date: 'December 20, 2025',
    category: 'Planning',
    readTime: '5 min read',
  },
  {
    slug: 'crypto-investment-basics',
    title: 'Cryptocurrency Investment: Risks and Opportunities',
    excerpt: 'An overview of cryptocurrency investments and what you need to know before getting started.',
    date: 'December 15, 2025',
    category: 'Investment',
    readTime: '8 min read',
  },
];

export default function BlogPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Blog</h1>
            <p className="text-xl text-gray-300">
              Insights, tips, and news to help you make smarter financial decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.slug} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                {/* Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                  <span className="text-gray-400">[Image]</span>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
                      {post.category}
                    </span>
                    <span>{post.readTime}</span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>

                  <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">{post.date}</span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
                    >
                      Read more →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
