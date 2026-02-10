// OpenRouter OAuth Authentication
// Allows users to connect AI via browser authorization (like Claude.ai)

const OPENROUTER_AUTH_URL = 'https://openrouter.ai/auth';
const OPENROUTER_KEY_EXCHANGE_URL = 'https://openrouter.ai/api/v1/auth/keys';

// Storage key for the API key
const STORAGE_KEY = 'openrouter_api_key';
const VERIFIER_KEY = 'openrouter_code_verifier';

// Generate a random code verifier
function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

// Generate SHA-256 code challenge from verifier
async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hashArray = new Uint8Array(hash);
  // Base64 URL encode
  const base64 = btoa(String.fromCharCode(...hashArray))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return base64;
}

// Start the OAuth flow - opens OpenRouter auth in a new window/tab
export async function startOpenRouterAuth(callbackUrl: string): Promise<void> {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  // Store the verifier for later exchange
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(VERIFIER_KEY, codeVerifier);
  }

  // Build the auth URL
  const authUrl = new URL(OPENROUTER_AUTH_URL);
  authUrl.searchParams.set('callback_url', callbackUrl);
  authUrl.searchParams.set('code_challenge', codeChallenge);
  authUrl.searchParams.set('code_challenge_method', 'S256');

  // Redirect to OpenRouter auth
  window.location.href = authUrl.toString();
}

// Exchange the authorization code for an API key
export async function exchangeCodeForKey(code: string): Promise<string | null> {
  try {
    const codeVerifier = sessionStorage.getItem(VERIFIER_KEY);

    if (!codeVerifier) {
      throw new Error('Code verifier not found');
    }

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
      throw new Error(`Failed to exchange code: ${response.status}`);
    }

    const data = await response.json();
    const apiKey = data.key;

    // Store the API key
    if (apiKey) {
      localStorage.setItem(STORAGE_KEY, apiKey);
      sessionStorage.removeItem(VERIFIER_KEY);
    }

    return apiKey;
  } catch (error) {
    console.error('Failed to exchange code for API key:', error);
    return null;
  }
}

// Get the stored API key
export function getStoredApiKey(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY);
}

// Check if user is connected
export function isConnected(): boolean {
  return !!getStoredApiKey();
}

// Disconnect (remove stored key)
export function disconnect(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}

// Get the callback URL for the current site
export function getCallbackUrl(): string {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}/api/auth/openrouter/callback`;
}
