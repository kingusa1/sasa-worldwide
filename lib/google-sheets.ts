import { google } from 'googleapis';

// Default images for blog posts by category (Unsplash free images)
const DEFAULT_IMAGES: Record<string, string> = {
  'Sales Strategy': 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Field Operations': 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Technology': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Growth': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Innovation': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Leadership': 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Marketing': 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Business': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'default': 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
};

// Get default image based on category
function getDefaultImage(category: string): string {
  return DEFAULT_IMAGES[category] || DEFAULT_IMAGES['default'];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  sourceUrl: string;
  status: 'published' | 'draft';
}

// Initialize Google Sheets API
function getGoogleSheets() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const SHEET_NAME = 'posts';

// In-memory cache to prevent hitting Google Sheets API quota during builds
// During static generation, getAllPosts() is called once per blog post page
// (generateStaticParams + generateMetadata + render = 40+ calls for 19 posts)
// This cache ensures we only make 1 API call per 5-minute window
let postsCache: { data: BlogPost[]; timestamp: number } | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// Promise deduplication: if a fetch is already in-flight, reuse it
// This prevents concurrent calls during build from each making their own API request
let pendingFetch: Promise<BlogPost[]> | null = null;

// Get all blog posts from Google Sheets (with caching + deduplication)
export async function getAllPosts(): Promise<BlogPost[]> {
  // Return cached data if fresh
  if (postsCache && Date.now() - postsCache.timestamp < CACHE_TTL_MS) {
    return postsCache.data;
  }

  // If a fetch is already in-flight, wait for it instead of making another call
  if (pendingFetch) {
    return pendingFetch;
  }

  pendingFetch = fetchPostsFromSheets();

  try {
    const result = await pendingFetch;
    return result;
  } finally {
    pendingFetch = null;
  }
}

async function fetchPostsFromSheets(): Promise<BlogPost[]> {
  try {
    const sheets = getGoogleSheets();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A2:K`, // Skip header row
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      postsCache = { data: [], timestamp: Date.now() };
      return [];
    }

    const posts = rows
      .map((row) => {
        const category = row[4] || '';
        const image = row[5] || '';
        return {
          slug: row[0] || '',
          title: row[1] || '',
          excerpt: row[2] || '',
          content: row[3] || '',
          category,
          image: image || getDefaultImage(category), // Use default if no image provided
          author: row[6] || '',
          date: row[7] || '',
          readTime: row[8] || '',
          sourceUrl: row[9] || '',
          status: (row[10] || 'draft') as 'published' | 'draft',
        };
      })
      .filter((post) => post.status === 'published' && post.slug && post.title);

    // Sort by date (newest first) so latest article appears as featured
    const sorted = posts.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      // Handle invalid dates by putting them at the end
      if (isNaN(dateA) && isNaN(dateB)) return 0;
      if (isNaN(dateA)) return 1;
      if (isNaN(dateB)) return -1;
      return dateB - dateA; // Newest first
    });

    // Cache the result
    postsCache = { data: sorted, timestamp: Date.now() };
    return sorted;
  } catch (error) {
    console.error('Error fetching posts from Google Sheets:', error);
    // If we have stale cache, return it instead of empty
    if (postsCache) {
      console.log('Returning stale cached posts due to API error');
      return postsCache.data;
    }
    return [];
  }
}

// Get a single post by slug
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getAllPosts();
  return posts.find((post) => post.slug === slug) || null;
}

// Add a new blog post to Google Sheets
export async function addPost(post: Omit<BlogPost, 'status'> & { status?: string }): Promise<boolean> {
  try {
    const sheets = getGoogleSheets();

    const values = [
      [
        post.slug,
        post.title,
        post.excerpt,
        post.content,
        post.category,
        post.image,
        post.author,
        post.date,
        post.readTime,
        post.sourceUrl,
        post.status || 'published',
      ],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:K`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    console.log('Post added successfully:', post.title);
    return true;
  } catch (error) {
    console.error('Error adding post to Google Sheets:', error);
    return false;
  }
}

// Check if a post with the same slug already exists
export async function postExists(slug: string): Promise<boolean> {
  try {
    const sheets = getGoogleSheets();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:A`, // Just get slugs
    });

    const rows = response.data.values;

    if (!rows) {
      return false;
    }

    return rows.some((row) => row[0] === slug);
  } catch (error) {
    console.error('Error checking if post exists:', error);
    return false;
  }
}

// Get recent post slugs to avoid duplicates
export async function getRecentSlugs(limit: number = 100): Promise<string[]> {
  try {
    const sheets = getGoogleSheets();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A2:A`, // Just slugs, skip header
    });

    const rows = response.data.values;

    if (!rows) {
      return [];
    }

    return rows.slice(-limit).map((row) => row[0]).filter(Boolean);
  } catch (error) {
    console.error('Error getting recent slugs:', error);
    return [];
  }
}
