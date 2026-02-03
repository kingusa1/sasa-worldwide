// API Route: Check AI connection status
// GET /api/auth/openrouter/status

import { NextResponse } from 'next/server';
import { getConnectionStatus } from '@/lib/ai-credentials';

export async function GET() {
  try {
    const status = getConnectionStatus();
    return NextResponse.json(status);
  } catch (error) {
    console.error('Error checking status:', error);
    return NextResponse.json(
      { connected: false, error: 'Failed to check status' },
      { status: 500 }
    );
  }
}
