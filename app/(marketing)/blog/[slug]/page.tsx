import Link from 'next/link';
import { notFound } from 'next/navigation';

// Sample blog posts data - in a real app, this would come from a CMS or database
const posts: Record<string, { title: string; content: string; date: string; category: string; readTime: string }> = {
  'understanding-market-volatility': {
    title: 'Understanding Market Volatility: A Guide for Investors',
    date: 'January 15, 2026',
    category: 'Investment',
    readTime: '5 min read',
    content: `
      <p>Market volatility can be intimidating for investors, but understanding it is key to making informed decisions. In this guide, we'll explore what causes market fluctuations and how you can navigate them effectively.</p>

      <h2>What Causes Market Volatility?</h2>
      <p>Market volatility is influenced by various factors including economic indicators, geopolitical events, corporate earnings reports, and investor sentiment. Understanding these drivers helps you anticipate and respond to market movements.</p>

      <h2>Strategies for Managing Volatility</h2>
      <p>Here are some proven strategies for managing market volatility:</p>
      <ul>
        <li><strong>Diversification:</strong> Spread your investments across different asset classes to reduce risk.</li>
        <li><strong>Long-term perspective:</strong> Focus on long-term goals rather than short-term fluctuations.</li>
        <li><strong>Regular rebalancing:</strong> Periodically adjust your portfolio to maintain your target allocation.</li>
        <li><strong>Dollar-cost averaging:</strong> Invest fixed amounts regularly regardless of market conditions.</li>
      </ul>

      <h2>When to Stay Calm</h2>
      <p>During periods of high volatility, it's crucial to avoid emotional decision-making. History shows that markets tend to recover over time, and panic selling often leads to missed opportunities.</p>

      <h2>Conclusion</h2>
      <p>While market volatility is inevitable, it doesn't have to derail your investment strategy. By understanding its causes and implementing sound risk management practices, you can navigate uncertain times with confidence.</p>
    `,
  },
  'retirement-planning-essentials': {
    title: '5 Essential Steps for Retirement Planning in 2026',
    date: 'January 10, 2026',
    category: 'Planning',
    readTime: '7 min read',
    content: `
      <p>Planning for retirement is one of the most important financial decisions you'll make. Here are five essential steps to help you prepare for a comfortable retirement.</p>

      <h2>1. Start Early</h2>
      <p>The power of compound interest means that starting early can significantly impact your retirement savings. Even small contributions made consistently over time can grow substantially.</p>

      <h2>2. Set Clear Goals</h2>
      <p>Determine what kind of lifestyle you want in retirement and calculate how much you'll need to support it. Consider factors like housing, healthcare, travel, and daily living expenses.</p>

      <h2>3. Maximize Tax-Advantaged Accounts</h2>
      <p>Take full advantage of retirement accounts like 401(k)s and IRAs. These accounts offer tax benefits that can help your money grow faster.</p>

      <h2>4. Diversify Your Investments</h2>
      <p>Don't put all your eggs in one basket. A diversified portfolio helps manage risk while still providing growth potential.</p>

      <h2>5. Review and Adjust Regularly</h2>
      <p>Your retirement plan should evolve with your life circumstances. Review your strategy annually and make adjustments as needed.</p>
    `,
  },
};

export async function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({
    slug: slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts[slug];

  if (!post) {
    return {
      title: 'Post Not Found - SASA Blog',
    };
  }

  return {
    title: `${post.title} - SASA Blog`,
    description: post.content.substring(0, 160).replace(/<[^>]*>/g, ''),
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts[slug];

  if (!post) {
    notFound();
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="text-blue-300 hover:text-blue-200 mb-4 inline-block">
            ← Back to Blog
          </Link>
          <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full font-medium">
              {post.category}
            </span>
            <span>{post.date}</span>
            <span>{post.readTime}</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">{post.title}</h1>
        </div>
      </section>

      {/* Content */}
      <article className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-gray-900"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this article</h3>
            <div className="flex gap-4">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                Twitter
              </button>
              <button className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
                LinkedIn
              </button>
              <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
