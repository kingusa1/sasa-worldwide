import { google } from 'googleapis';

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

// Get all blog posts from Google Sheets
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const sheets = getGoogleSheets();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A2:K`, // Skip header row
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return [];
    }

    return rows
      .map((row) => ({
        slug: row[0] || '',
        title: row[1] || '',
        excerpt: row[2] || '',
        content: row[3] || '',
        category: row[4] || '',
        image: row[5] || '',
        author: row[6] || '',
        date: row[7] || '',
        readTime: row[8] || '',
        sourceUrl: row[9] || '',
        status: (row[10] || 'draft') as 'published' | 'draft',
      }))
      .filter((post) => post.status === 'published' && post.slug && post.title);
  } catch (error) {
    console.error('Error fetching posts from Google Sheets:', error);
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
