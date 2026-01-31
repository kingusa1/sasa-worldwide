import { NextRequest, NextResponse } from 'next/server';
import { fetchAllFeeds, fetchArticleContent } from '@/lib/rss';
import { selectBestArticle, removeDuplicates, generateSlug } from '@/lib/scoring';
import { generateBlogPost, generateFallbackPost } from '@/lib/pollinations';
import { addPost, getRecentSlugs, postExists } from '@/lib/google-sheets';

// Verify the cron secret for security
function verifySecret(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const secret = request.nextUrl.searchParams.get('secret');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.warn('CRON_SECRET not configured');
    return true; // Allow in development
  }

  return authHeader === `Bearer ${cronSecret}` || secret === cronSecret;
}

// Generate an image URL for the blog post
function getImageUrl(category: string): string {
  const images: Record<string, string> = {
    'AI Sales': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop',
    'Sales Strategy': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop',
    'Business Growth': 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&auto=format&fit=crop',
    'Technology': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop',
    'Leadership': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop',
  };

  return images[category] || images['Technology'];
}

// Estimate reading time based on content length
function estimateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

export async function GET(request: NextRequest) {
  console.log('RSS Cron Job Started');

  // Verify authorization
  if (!verifySecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Step 1: Fetch all RSS feeds
    console.log('Step 1: Fetching RSS feeds...');
    const articles = await fetchAllFeeds();

    if (articles.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No articles found from RSS feeds',
      });
    }

    // Step 2: Get existing slugs to avoid duplicates
    console.log('Step 2: Checking for existing posts...');
    const existingSlugs = await getRecentSlugs(500);

    // Step 3: Remove duplicates
    console.log('Step 3: Removing duplicates...');
    const uniqueArticles = removeDuplicates(articles, existingSlugs);

    if (uniqueArticles.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'All articles already exist in the database',
      });
    }

    // Step 4: Score and select the best article
    console.log('Step 4: Scoring articles...');
    const bestArticle = selectBestArticle(uniqueArticles);

    if (!bestArticle) {
      return NextResponse.json({
        success: false,
        message: 'No suitable article found after scoring',
      });
    }

    // Step 5: Generate slug and check if it exists
    const slug = generateSlug(bestArticle.title);
    const alreadyExists = await postExists(slug);

    if (alreadyExists) {
      return NextResponse.json({
        success: false,
        message: `Post with slug "${slug}" already exists`,
      });
    }

    // Step 6: Fetch full article content
    console.log('Step 5: Fetching full article content...');
    const articleContent = await fetchArticleContent(bestArticle.link);

    // Step 7: Generate blog post using AI
    console.log('Step 6: Generating blog post with AI...');
    let blogContent = await generateBlogPost(bestArticle, articleContent);

    // Use fallback if AI fails
    if (!blogContent) {
      console.log('AI generation failed, using fallback...');
      blogContent = generateFallbackPost(bestArticle);
    }

    // Step 8: Prepare the post data
    const postData = {
      slug,
      title: blogContent.title,
      excerpt: blogContent.excerpt,
      content: blogContent.content,
      category: blogContent.category,
      image: getImageUrl(blogContent.category),
      author: 'SASA Editorial',
      date: new Date().toISOString().split('T')[0],
      readTime: estimateReadTime(blogContent.content),
      sourceUrl: bestArticle.link,
      status: 'published' as const,
    };

    // Step 9: Save to Google Sheets
    console.log('Step 7: Saving to Google Sheets...');
    const saved = await addPost(postData);

    if (!saved) {
      return NextResponse.json({
        success: false,
        message: 'Failed to save post to Google Sheets',
      });
    }

    console.log('RSS Cron Job Completed Successfully');

    return NextResponse.json({
      success: true,
      message: 'Blog post created successfully',
      post: {
        slug: postData.slug,
        title: postData.title,
        category: postData.category,
        sourceUrl: postData.sourceUrl,
        score: bestArticle.score,
      },
    });
  } catch (error) {
    console.error('Error in RSS cron job:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Also support POST for Vercel cron
export async function POST(request: NextRequest) {
  return GET(request);
}
