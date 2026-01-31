import { RSSArticle } from './rss';

export interface ScoredArticle extends RSSArticle {
  score: number;
}

// Political keywords to filter out
const POLITICAL_KEYWORDS = [
  'politics',
  'political',
  'election',
  'government policy',
  'regulation',
  'congress',
  'senate',
  'president',
  'administration',
  'legislation',
  'democrat',
  'republican',
  'trump',
  'biden',
];

// Score articles for SALES/AI/LEADERSHIP relevance (ported from n8n workflow)
export function scoreArticle(article: RSSArticle): ScoredArticle {
  let score = 10;
  const title = (article.title || '').toLowerCase();
  const content = (article.description || article.contentSnippet || '').toLowerCase();

  // Negative scoring for political content
  for (const keyword of POLITICAL_KEYWORDS) {
    if (title.includes(keyword) || content.includes(keyword)) {
      score -= 50;
      break;
    }
  }

  // Sales keywords - HEAVILY PRIORITIZED
  if (title.includes('sales') || content.includes('sales')) score += 15;
  if (title.includes('crm') || content.includes('pipeline')) score += 10;
  if (title.includes('quota') || content.includes('outbound')) score += 8;
  if (title.includes('prospecting') || content.includes('lead generation')) score += 8;
  if (title.includes('revenue') || content.includes('revenue')) score += 5;
  if (title.includes('b2b') || content.includes('b2b')) score += 5;

  // AI keywords - MODERATE PRIORITY
  if (title.includes('ai') || content.includes('artificial intelligence')) score += 5;
  if (title.includes('automation') || content.includes('agent')) score += 3;
  if (title.includes('gpt') || content.includes('llm')) score += 4;
  if (title.includes('machine learning') || content.includes('chatbot')) score += 3;

  // AI+Sales combination - HIGHLY PRIORITIZED
  const hasSales = title.includes('sales') || content.includes('sales');
  const hasAI = title.includes('ai') || content.includes('artificial intelligence');
  if (hasSales && hasAI) score += 20;

  // Specific AI+Sales phrases
  if (title.includes('sales automation') || content.includes('sales automation')) score += 15;
  if (title.includes('sales ai') || content.includes('sales ai')) score += 15;
  if (title.includes('ai sales tools') || content.includes('ai sales tools')) score += 15;
  if (title.includes('ai for sales') || content.includes('ai for sales')) score += 15;

  // Leadership/business keywords
  if (title.includes('leadership') || content.includes('strategy')) score += 3;
  if (title.includes('growth') || content.includes('scale')) score += 3;
  if (title.includes('uae') || content.includes('dubai')) score += 5;
  if (title.includes('middle east') || content.includes('gcc')) score += 3;

  // Business/enterprise keywords
  if (title.includes('enterprise') || content.includes('enterprise')) score += 3;
  if (title.includes('startup') || content.includes('startup')) score += 2;
  if (title.includes('innovation') || content.includes('innovation')) score += 2;

  // Recency scoring
  const pubDate = new Date(article.pubDate || Date.now());
  const hoursOld = (Date.now() - pubDate.getTime()) / (1000 * 60 * 60);
  if (hoursOld < 6) score += 5;
  else if (hoursOld < 24) score += 3;
  else if (hoursOld < 48) score += 1;

  return { ...article, score };
}

// Score and sort all articles, return the best one
export function selectBestArticle(articles: RSSArticle[]): ScoredArticle | null {
  if (articles.length === 0) {
    return null;
  }

  const scoredArticles = articles.map(scoreArticle);

  // Sort by score descending
  scoredArticles.sort((a, b) => b.score - a.score);

  // Filter out articles with negative scores (too political)
  const validArticles = scoredArticles.filter((a) => a.score > 0);

  if (validArticles.length === 0) {
    // If all articles are filtered out, return the highest scored one anyway
    return scoredArticles[0];
  }

  console.log(`Best article: "${validArticles[0].title}" with score ${validArticles[0].score}`);

  return validArticles[0];
}

// Remove duplicate articles based on similar titles
export function removeDuplicates(articles: RSSArticle[], existingSlugs: string[]): RSSArticle[] {
  const seen = new Set<string>();
  const existingSet = new Set(existingSlugs);

  return articles.filter((article) => {
    // Create a simple slug from title
    const slug = generateSlug(article.title);

    // Skip if we already have this slug in the database
    if (existingSet.has(slug)) {
      return false;
    }

    // Skip if we've seen a similar title in this batch
    const normalizedTitle = article.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (seen.has(normalizedTitle)) {
      return false;
    }

    seen.add(normalizedTitle);
    return true;
  });
}

// Generate a URL-friendly slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 60)
    .replace(/-$/, '');
}
