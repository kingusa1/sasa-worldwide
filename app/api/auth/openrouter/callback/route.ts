// API Route: OpenRouter OAuth callback
// GET /api/auth/openrouter/callback?code=xxx

import { NextResponse } from 'next/server';
import { getCodeVerifier, storeOpenRouterApiKey, clearCodeVerifier } from '@/lib/ai-credentials';

export const dynamic = 'force-dynamic';

const OPENROUTER_KEY_EXCHANGE_URL = 'https://openrouter.ai/api/v1/auth/keys';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');

    console.log('[OAuth Callback] Received code:', code?.substring(0, 10) + '...');

    if (!code) {
      console.error('[OAuth Callback] No code provided');
      return NextResponse.redirect(`${url.origin}/?ai_error=no_code`);
    }

    // Get the stored code verifier
    const codeVerifier = getCodeVerifier();
    console.log('[OAuth Callback] Code verifier:', codeVerifier ? 'found' : 'NOT FOUND');

    if (!codeVerifier) {
      console.error('[OAuth Callback] No code verifier found');
      return NextResponse.redirect(`${url.origin}/?ai_error=no_verifier`);
    }

    // Exchange code for API key
    console.log('[OAuth Callback] Exchanging code for API key...');
    const response = await fetch(OPENROUTER_KEY_EXCHANGE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        code_verifier: codeVerifier,
        code_challenge_method: 'S256',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[OAuth Callback] Exchange failed:', errorText);
      return NextResponse.redirect(`${url.origin}/?ai_error=exchange_failed`);
    }

    const data = await response.json();
    const apiKey = data.key;

    if (!apiKey) {
      console.error('[OAuth Callback] No API key in response');
      return NextResponse.redirect(`${url.origin}/?ai_error=no_key`);
    }

    // Store the API key and clear the verifier
    console.log('[OAuth Callback] Storing API key...');
    storeOpenRouterApiKey(apiKey);
    clearCodeVerifier();

    console.log('[OAuth Callback] SUCCESS! AI connected.');
    // Redirect to success page
    return NextResponse.redirect(`${url.origin}/?ai_connected=true`);
  } catch (error) {
    console.error('[OAuth Callback] Error:', error);
    const url = new URL(request.url);
    return NextResponse.redirect(`${url.origin}/?ai_error=callback_failed`);
  }
}
