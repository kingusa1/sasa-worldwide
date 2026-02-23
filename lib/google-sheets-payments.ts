import { google } from 'googleapis';

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const SHEET_NAME = 'course_purchases';

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

async function ensureCoursesPurchasesSheet(): Promise<void> {
  const sheets = getGoogleSheets();
  try {
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });
    const sheetExists = spreadsheet.data.sheets?.some(
      (s) => s.properties?.title === SHEET_NAME
    );
    if (!sheetExists) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: { title: SHEET_NAME },
              },
            },
          ],
        },
      });
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A1:J1`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[
            'Date', 'Name', 'Email', 'Phone', 'Course',
            'Amount (AED)', 'Stripe Session ID', 'Stripe Payment Intent',
            'User ID', 'Status'
          ]],
        },
      });
    }
  } catch (error) {
    console.error('Error ensuring course_purchases sheet:', error);
  }
}

export async function logCoursePurchase(data: {
  date: string;
  name: string;
  email: string;
  phone: string;
  courseName: string;
  amount: number;
  stripeSessionId: string;
  stripePaymentIntentId: string;
  userId: string;
  status: string;
}): Promise<boolean> {
  try {
    await ensureCoursesPurchasesSheet();

    const sheets = getGoogleSheets();
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:J`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          data.date,
          data.name,
          data.email,
          data.phone,
          data.courseName,
          data.amount,
          data.stripeSessionId,
          data.stripePaymentIntentId,
          data.userId,
          data.status,
        ]],
      },
    });
    return true;
  } catch (error) {
    console.error('Error logging course purchase to Google Sheets:', error);
    return false;
  }
}
