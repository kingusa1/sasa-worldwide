import Parser from 'rss-parser';

export interface RSSArticle {
  title: string;
  link: string;
  description: string;
  contentSnippet: string;
  pubDate: string;
  source: string;
}

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; SASABot/1.0)',
  },
});

// RSS feeds to monitor (from your n8n workflow)
const RSS_FEEDS = [
  { url: 'https://www.salesforce.com/blog/category/sales/rss/', source: 'Salesforce' },
  { url: 'https://www.saleshacker.com/feed/', source: 'Sales Hacker' },
  { url: 'https://www.axios.com/feeds/feed.rss', source: 'Axios' },
  { url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', source: 'The Verge' },
  { url: 'https://www.wired.com/feed/tag/ai/latest/rss', source: 'Wired' },
  { url: 'https://www.zdnet.com/topic/artificial-intelligence/rss.xml', source: 'ZDNet' },
  { url: 'https://techcrunch.com/category/artificial-intelligence/feed/', source: 'TechCrunch' },
];

// Fetch articles from a single RSS feed
async function fetchFeed(feedUrl: string, source: string): Promise<RSSArticle[]> {
  try {
    const feed = await parser.parseURL(feedUrl);

    return (feed.items || []).slice(0, 10).map((item) => ({
      title: item.title || '',
      link: item.link || '',
      description: item.contentSnippet || item.content || item.description || '',
      contentSnippet: item.contentSnippet || '',
      pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
      source,
    }));
  } catch (error) {
    console.error(`Error fetching RSS feed from ${source}:`, error);
    return [];
  }
}

// Fetch articles from all RSS feeds
export async function fetchAllFeeds(): Promise<RSSArticle[]> {
  const allArticles: RSSArticle[] = [];

  const feedPromises = RSS_FEEDS.map(({ url, source }) => fetchFeed(url, source));

  const results = await Promise.allSettled(feedPromises);

  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      allArticles.push(...result.value);
    }
  });

  console.log(`Fetched ${allArticles.length} articles from ${RSS_FEEDS.length} feeds`);

  return allArticles;
}

// Fetch full article content from URL
export async function fetchArticleContent(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SASABot/1.0)',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return '';
    }

    const html = await response.text();

    // Extract text content from HTML
    return extractTextFromHtml(html);
  } catch (error) {
    console.error(`Error fetching article content from ${url}:`, error);
    return '';
  }
}

// Simple HTML to text extraction
function extractTextFromHtml(html: string): string {
  // Remove script and style elements
  let text = html.replace(/<script[^>]*>.*?<\/script>/gis, '');
  text = text.replace(/<style[^>]*>.*?<\/style>/gis, '');
  text = text.replace(/<noscript[^>]*>.*?<\/noscript>/gis, '');

  // Try to extract article content
  const articleMatch = text.match(/<article[^>]*>(.*?)<\/article>/is);
  if (articleMatch) {
    text = articleMatch[1];
  }

  // Convert paragraph tags to newlines
  text = text.replace(/<\/p>/gi, '\n\n');
  text = text.replace(/<br[^>]*>/gi, '\n');

  // Remove all remaining HTML tags
  text = text.replace(/<[^>]+>/g, ' ');

  // Decode HTML entities
  text = text.replace(/&nbsp;/gi, ' ');
  text = text.replace(/&amp;/gi, '&');
  text = text.replace(/&lt;/gi, '<');
  text = text.replace(/&gt;/gi, '>');
  text = text.replace(/&quot;/gi, '"');
  text = text.replace(/&#39;/gi, "'");

  // Clean up whitespace
  text = text.replace(/\s+/g, ' ');
  text = text.trim();

  // Limit to 3000 characters
  if (text.length > 3000) {
    text = text.substring(0, 3000) + '...';
  }

  return text;
}
