import Link from 'next/link';
import { getAllPosts, BlogPost } from '@/lib/google-sheets';

export const metadata = {
  title: 'Insights & Blog | SASA Worldwide',
  description: 'Expert insights on sales operations, field sales management, AI in sales, and growth strategies for businesses in the UAE.',
};

// Revalidate every 60 seconds to fetch fresh posts from Google Sheets
export const revalidate = 60;

// Fallback posts (existing content)
const fallbackPosts = [
  {
    slug: 'outsourcing-sales-operations-transform-business',
    title: 'How Outsourcing Sales Operations Can Transform Your Business',
    excerpt: 'Discover why leading companies in the UAE are choosing to outsource their sales operations and the measurable impact it has on growth.',
    date: 'January 25, 2026',
    category: 'Sales Strategy',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'power-of-field-sales-teams-uae',
    title: 'The Power of Field Sales Teams in the UAE Market',
    excerpt: 'Learn how face-to-face sales interactions continue to drive exceptional results in the UAE\'s unique business environment.',
    date: 'January 20, 2026',
    category: 'Field Operations',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'data-driven-sales-strategies',
    title: 'Why Data-Driven Sales Strategies Outperform Traditional Methods',
    excerpt: 'Explore how SASA OS and real-time analytics are revolutionizing sales performance across all seven Emirates.',
    date: 'January 15, 2026',
    category: 'Technology',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'scaling-sales-team-inhouse-vs-outsourcing',
    title: 'Scaling Your Sales Team: In-House vs Outsourcing',
    excerpt: 'A comprehensive comparison to help you decide the best approach for your business growth in the competitive UAE market.',
    date: 'January 10, 2026',
    category: 'Growth',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'future-of-sales-operations-ai-analytics',
    title: 'The Future of Sales: AI, Analytics, and the Human Touch',
    excerpt: 'How SASA Worldwide combines cutting-edge technology with elite human talent to deliver unmatched sales results.',
    date: 'January 5, 2026',
    category: 'Innovation',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'building-high-performance-sales-culture',
    title: 'Building a High-Performance Sales Culture: Lessons from 600+ Campaigns',
    excerpt: 'Key insights from SASA Academy on training, motivation, and retention strategies that create winning sales teams.',
    date: 'December 28, 2025',
    category: 'Leadership',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
];

// Format date for display
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

// Convert Google Sheets post to display format
function convertPost(post: BlogPost) {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: formatDate(post.date),
    category: post.category,
    readTime: post.readTime,
    image: post.image,
  };
}

export default async function BlogPage() {
  // Fetch posts from Google Sheets
  let sheetsPosts: BlogPost[] = [];
  try {
    sheetsPosts = await getAllPosts();
  } catch (error) {
    console.error('Error fetching posts from Google Sheets:', error);
  }

  // Convert and combine posts (Google Sheets posts first, then fallback)
  const googlePosts = sheetsPosts.map(convertPost);

  // Get slugs from Google Sheets to avoid duplicates
  const sheetSlugs = new Set(googlePosts.map(p => p.slug));

  // Filter fallback posts to exclude any that exist in Google Sheets
  const uniqueFallbackPosts = fallbackPosts.filter(p => !sheetSlugs.has(p.slug));

  // Combine: Google Sheets posts first (newest), then fallback posts
  const posts = [...googlePosts, ...uniqueFallbackPosts];

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-navy/80"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium tracking-wider mb-6">
            INSIGHTS
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Sales Operations Insights
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Expert perspectives on field sales, AI in sales, growth strategies, and operational excellence in the UAE market.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      {posts.length > 0 && (
        <section className="py-16 bg-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="section-badge text-navy mb-8 block">FEATURED ARTICLE</span>

            <Link href={`/blog/${posts[0].slug}`} className="block group">
              <div className="grid lg:grid-cols-2 gap-8 bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300">
                <div className="relative h-64 lg:h-auto min-h-[300px]">
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url("${posts[0].image}")` }}
                  />
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-4 text-sm mb-4">
                    <span className="bg-navy/10 text-navy px-3 py-1 rounded-full font-medium">
                      {posts[0].category}
                    </span>
                    <span className="text-gray-500">{posts[0].readTime}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4 group-hover:text-navy/80 transition-colors">
                    {posts[0].title}
                  </h2>
                  <p className="text-gray-600 mb-6">{posts[0].excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">{posts[0].date}</span>
                    <span className="text-navy font-medium group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
                      Read Article
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="section-badge text-navy mb-8 block">ALL ARTICLES</span>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.slice(1).map((post) => (
              <article key={post.slug} className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-gray-100">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url("${post.image}")` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-navy px-3 py-1 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h2 className="text-lg font-bold text-navy mb-3 group-hover:text-navy/80 transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-navy font-medium text-sm hover:gap-3 transition-all"
                  >
                    Read more
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Sales?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Join 600+ companies that have partnered with SASA Worldwide to achieve measurable growth across the UAE.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-navy px-8 py-4 rounded-full font-semibold hover:bg-cream transition-colors"
          >
            Get Started Today
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
