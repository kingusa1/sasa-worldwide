// API Route: Start OpenRouter OAuth flow
// GET /api/auth/openrouter/connect

import { NextResponse } from 'next/server';
import { generateCodeVerifier, generateCodeChallenge, storeCodeVerifier } from '@/lib/ai-credentials';

export const dynamic = 'force-dynamic';

const OPENROUTER_AUTH_URL = 'https://openrouter.ai/auth';

export async function GET(request: Request) {
  try {
    // Generate code verifier and challenge
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);

    // Store verifier for later exchange
    storeCodeVerifier(codeVerifier);

    // Build callback URL
    const url = new URL(request.url);
    const callbackUrl = `${url.origin}/api/auth/openrouter/callback`;

    // Build OpenRouter auth URL
    const authUrl = new URL(OPENROUTER_AUTH_URL);
    authUrl.searchParams.set('callback_url', callbackUrl);
    authUrl.searchParams.set('code_challenge', codeChallenge);
    authUrl.searchParams.set('code_challenge_method', 'S256');

    // Redirect to OpenRouter
    return NextResponse.redirect(authUrl.toString());
  } catch (error) {
    console.error('Error starting OAuth:', error);
    return NextResponse.json(
      { error: 'Failed to start authentication' },
      { status: 500 }
    );
  }
}
