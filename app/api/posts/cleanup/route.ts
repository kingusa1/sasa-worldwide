import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { reformatContent } from '@/lib/pollinations';

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

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  const force = request.nextUrl.searchParams.get('force') === 'true';

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const sheets = getGoogleSheets();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    // Get all posts
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'posts!A2:K',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return NextResponse.json({ message: 'No posts found' });
    }

    let updatedCount = 0;

    // Process each row and reformat content
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const content = row[3]; // Column D is content

      // With force=true, reformat all posts. Otherwise, only reformat if needed.
      const needsReformat = force || (content && (content.includes('Pollinations') || !content.includes('<p>') || content.includes('**') || content.includes('## ')));

      if (content && needsReformat) {
        const reformattedContent = reformatContent(content);

        // Only update if content actually changed
        if (reformattedContent !== content) {
          await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `posts!D${i + 2}`, // +2 because row 1 is header
            valueInputOption: 'RAW',
            requestBody: {
              values: [[reformattedContent]],
            },
          });

          updatedCount++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Reformatted ${updatedCount} posts with proper HTML`,
      totalPosts: rows.length,
    });
  } catch (error) {
    console.error('Error cleaning posts:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
