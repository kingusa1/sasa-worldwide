import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { ContactFormData, ContactResponse } from '@/types/contact';

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
const SHEET_NAME = 'Contact Submissions';

export async function POST(request: NextRequest): Promise<NextResponse<ContactResponse>> {
  try {
    const body: ContactFormData = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Get Google Sheets instance
    const sheets = getGoogleSheets();

    // Create timestamp
    const timestamp = new Date().toLocaleString('en-GB', {
      timeZone: 'Asia/Dubai',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    // Prepare row data
    const rowData = [
      timestamp,
      body.name,
      body.email,
      body.phone || '',
      body.company || '',
      body.service || '',
      body.message,
    ];

    // Append to Google Sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:G`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [rowData],
      },
    });

    console.log('Contact form submission saved:', body.name, body.email);

    return NextResponse.json({
      success: true,
      message: 'Thank you for reaching out. We will get back to you soon!',
    });
  } catch (error) {
    console.error('Error saving contact form:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit form. Please try again.' },
      { status: 500 }
    );
  }
}
