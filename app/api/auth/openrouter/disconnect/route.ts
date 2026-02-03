// API Route: Disconnect AI
// POST /api/auth/openrouter/disconnect

import { NextResponse } from 'next/server';
import { disconnectAI } from '@/lib/ai-credentials';

export async function POST() {
  try {
    disconnectAI();
    return NextResponse.json({ success: true, message: 'AI disconnected' });
  } catch (error) {
    console.error('Error disconnecting:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to disconnect' },
      { status: 500 }
    );
  }
}
