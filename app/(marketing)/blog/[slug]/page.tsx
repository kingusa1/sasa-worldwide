import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ShareButtons from '@/components/ui/ShareButtons';
import { getPostBySlug, getAllPosts, BlogPost } from '@/lib/google-sheets';

// Revalidate every 60 seconds to fetch fresh posts from Google Sheets
export const revalidate = 60;

// Allow dynamic params for new posts not in generateStaticParams
export const dynamicParams = true;

// Fallback posts data (existing content)
const fallbackPosts: Record<string, {
  title: string;
  content: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
  author: string;
}> = {
  'outsourcing-sales-operations-transform-business': {
    title: 'How Outsourcing Sales Operations Can Transform Your Business',
    date: 'January 25, 2026',
    category: 'Sales Strategy',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    author: 'SASA Worldwide Team',
    content: `
      <p class="lead">In today's competitive UAE market, businesses are constantly seeking ways to optimize their operations and drive growth. One strategy that's gaining significant traction among leading companies is outsourcing sales operations.</p>
      <h2>The Rising Trend of Sales Outsourcing in the UAE</h2>
      <p>The UAE's dynamic business landscape presents unique challenges and opportunities. Companies that outsource their sales operations see an average of 23% improvement in sales performance within the first year.</p>
      <h2>Key Benefits of Outsourcing Sales Operations</h2>
      <h3>1. Immediate Access to Trained Talent</h3>
      <p>With SASA Worldwide, you gain immediate access to our pool of 500+ elite sales professionals who are already trained in UAE market dynamics.</p>
      <h3>2. Scalability Without the Risk</h3>
      <p>Outsourcing provides the flexibility to scale your sales force up or down without the long-term commitments and overhead costs.</p>
      <h2>Take the Next Step</h2>
      <p>Contact SASA Worldwide today to discuss how we can tailor a sales solution that fits your unique business needs.</p>
    `,
  },
  'power-of-field-sales-teams-uae': {
    title: 'The Power of Field Sales Teams in the UAE Market',
    date: 'January 20, 2026',
    category: 'Field Operations',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    author: 'SASA Worldwide Team',
    content: `
      <p class="lead">In an increasingly digital world, face-to-face sales still matter—especially in the UAE market.</p>
      <h2>The Unique Nature of the UAE Market</h2>
      <p>The UAE is a relationship-driven market built on trust, personal connections, and face-to-face interactions.</p>
      <h2>Why Field Sales Outperforms in the UAE</h2>
      <p>Field sales representatives build trust that no email or phone call can match.</p>
    `,
  },
  'data-driven-sales-strategies': {
    title: 'Why Data-Driven Sales Strategies Outperform Traditional Methods',
    date: 'January 15, 2026',
    category: 'Technology',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    author: 'SASA Worldwide Team',
    content: `
      <p class="lead">The difference between good and great sales performance often comes down to data.</p>
      <h2>The Data-Driven Advantage</h2>
      <p>Data-driven sales strategies transform every aspect of sales operations.</p>
    `,
  },
  'scaling-sales-team-inhouse-vs-outsourcing': {
    title: 'Scaling Your Sales Team: In-House vs Outsourcing',
    date: 'January 10, 2026',
    category: 'Growth',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    author: 'SASA Worldwide Team',
    content: `
      <p class="lead">When your business is ready to expand, you face a critical decision: build in-house or outsource?</p>
      <h2>Understanding Your Options</h2>
      <p>Each approach has distinct advantages depending on your business needs.</p>
    `,
  },
  'future-of-sales-operations-ai-analytics': {
    title: 'The Future of Sales: AI, Analytics, and the Human Touch',
    date: 'January 5, 2026',
    category: 'Innovation',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    author: 'SASA Worldwide Team',
    content: `
      <p class="lead">The future belongs to organizations that combine cutting-edge technology with elite human talent.</p>
      <h2>The AI Revolution in Sales</h2>
      <p>AI is reshaping every aspect of sales operations.</p>
    `,
  },
  'building-high-performance-sales-culture': {
    title: 'Building a High-Performance Sales Culture: Lessons from 600+ Campaigns',
    date: 'December 28, 2025',
    category: 'Leadership',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    author: 'SASA Worldwide Team',
    content: `
      <p class="lead">What separates good sales teams from great ones? It's not just individual talent—it's culture.</p>
      <h2>What is Sales Culture?</h2>
      <p>A strong sales culture attracts top talent and drives consistent performance.</p>
    `,
  },
};

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

// Get post from Google Sheets or fallback
async function getPost(slug: string) {
  try {
    const sheetsPost = await getPostBySlug(slug);
    if (sheetsPost) {
      return {
        title: sheetsPost.title,
        content: sheetsPost.content,
        date: formatDate(sheetsPost.date),
        category: sheetsPost.category,
        readTime: sheetsPost.readTime,
        image: sheetsPost.image,
        author: sheetsPost.author || 'SASA Editorial',
        fromSheets: true,
      };
    }
  } catch (error) {
    console.error('Error fetching from Google Sheets:', error);
  }

  const fallbackPost = fallbackPosts[slug];
  if (fallbackPost) {
    return { ...fallbackPost, fromSheets: false };
  }

  return null;
}

async function getAllSlugs(): Promise<string[]> {
  const fallbackSlugs = Object.keys(fallbackPosts);

  try {
    const sheetsPosts = await getAllPosts();
    const sheetsSlugs = sheetsPosts.map((p: BlogPost) => p.slug);
    return [...new Set([...sheetsSlugs, ...fallbackSlugs])];
  } catch {
    return fallbackSlugs;
  }
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: 'Post Not Found | SASA Worldwide' };
  }

  return {
    title: `${post.title} | SASA Worldwide`,
    description: post.content.substring(0, 160).replace(/<[^>]*>/g, ''),
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-end">
        <div className="absolute inset-0">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-transparent"></div>
        </div>

        <div className="relative z-10 w-full">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            {/* Back Button */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Back to Insights
            </Link>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="bg-white text-navy px-4 py-1.5 rounded-full text-sm font-semibold">
                {post.category}
              </span>
              <span className="text-white/70 text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {post.date}
              </span>
              <span className="text-white/70 text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {post.readTime}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {post.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Author Bar */}
      <div className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-navy to-navy/80 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-bold">SW</span>
              </div>
              <div>
                <p className="font-semibold text-navy">{post.author}</p>
                <p className="text-gray-500 text-sm">SASA Worldwide</p>
              </div>
            </div>
            <ShareButtons title={post.title} slug={slug} />
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="prose prose-lg max-w-none
              prose-headings:text-navy prose-headings:font-bold prose-headings:tracking-tight
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-100
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
              prose-li:text-gray-700 prose-li:leading-relaxed
              prose-strong:text-navy prose-strong:font-semibold
              prose-a:text-navy prose-a:font-medium prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-navy/70
              prose-ul:my-6 prose-ul:space-y-2
              prose-ol:my-6 prose-ol:space-y-2
              prose-blockquote:border-l-4 prose-blockquote:border-navy prose-blockquote:bg-cream/50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
              [&_.lead]:text-xl [&_.lead]:text-gray-600 [&_.lead]:leading-relaxed [&_.lead]:mb-8 [&_.lead]:font-normal"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>

      {/* Tags & Share Section */}
      <div className="border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-gray-500 text-sm">Topics:</span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                {post.category}
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                Sales
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                UAE Business
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm mr-2">Share:</span>
              <ShareButtons title={post.title} slug={slug} />
            </div>
          </div>
        </div>
      </div>

      {/* Author Bio Section */}
      <div className="bg-cream/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-navy to-navy/80 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-white text-2xl font-bold">SW</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-navy mb-2">About {post.author}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  SASA Worldwide is the UAE&apos;s leading sales operations company, delivering structured, scalable, and high-performance activation programs across all seven Emirates. With 600+ successful campaigns and 500+ elite sales professionals, we help businesses achieve measurable growth.
                </p>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-navy font-medium hover:gap-3 transition-all"
                >
                  Learn more about SASA
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Sales?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Join 600+ companies that have partnered with SASA Worldwide to achieve measurable growth across the UAE.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-navy px-8 py-4 rounded-full font-semibold hover:bg-cream transition-colors shadow-lg"
            >
              Get Started Today
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/90 hover:text-white px-6 py-4 font-medium transition-colors"
            >
              Read More Insights
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
