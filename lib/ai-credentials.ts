// Backend storage for AI credentials
// Stores OpenRouter API key securely on the server

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import crypto from 'crypto';

// File path for storing credentials
const CREDENTIALS_FILE = join(process.cwd(), '.ai-credentials.json');

interface AICredentials {
  openrouter_api_key?: string;
  code_verifier?: string;
  connected_at?: string;
}

// Read credentials from file
function readCredentials(): AICredentials {
  try {
    if (existsSync(CREDENTIALS_FILE)) {
      const data = readFileSync(CREDENTIALS_FILE, 'utf-8');
      console.log('[AI Credentials] Read from file:', CREDENTIALS_FILE);
      return JSON.parse(data);
    }
    console.log('[AI Credentials] File does not exist:', CREDENTIALS_FILE);
  } catch (error) {
    console.error('[AI Credentials] Error reading:', error);
  }
  return {};
}

// Write credentials to file
function writeCredentials(credentials: AICredentials): void {
  try {
    writeFileSync(CREDENTIALS_FILE, JSON.stringify(credentials, null, 2), { flag: 'w' });
    console.log('[AI Credentials] Written to file:', CREDENTIALS_FILE, credentials);
  } catch (error) {
    console.error('[AI Credentials] Error writing:', error);
  }
}

// Get OpenRouter API key
export function getOpenRouterApiKey(): string | null {
  const credentials = readCredentials();
  return credentials.openrouter_api_key || null;
}

// Store OpenRouter API key
export function storeOpenRouterApiKey(apiKey: string): void {
  const credentials = readCredentials();
  credentials.openrouter_api_key = apiKey;
  credentials.connected_at = new Date().toISOString();
  writeCredentials(credentials);
}

// Store code verifier for OAuth flow
export function storeCodeVerifier(verifier: string): void {
  const credentials = readCredentials();
  credentials.code_verifier = verifier;
  writeCredentials(credentials);
}

// Get code verifier (don't clear it - will be cleared when API key is stored)
export function getCodeVerifier(): string | null {
  const credentials = readCredentials();
  const verifier = credentials.code_verifier || null;
  console.log('[AI Credentials] Getting verifier:', verifier ? 'found' : 'not found');
  return verifier;
}

// Clear code verifier after successful auth
export function clearCodeVerifier(): void {
  const credentials = readCredentials();
  delete credentials.code_verifier;
  writeCredentials(credentials);
  console.log('[AI Credentials] Cleared verifier');
}

// Check if AI is connected
export function isAIConnected(): boolean {
  return !!getOpenRouterApiKey();
}

// Disconnect AI (remove stored key)
export function disconnectAI(): void {
  writeCredentials({});
}

// Get connection status
export function getConnectionStatus(): { connected: boolean; connectedAt?: string } {
  const credentials = readCredentials();
  return {
    connected: !!credentials.openrouter_api_key,
    connectedAt: credentials.connected_at,
  };
}

// Generate a secure code verifier
export function generateCodeVerifier(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Generate SHA-256 code challenge
export function generateCodeChallenge(verifier: string): string {
  const hash = crypto.createHash('sha256').update(verifier).digest();
  // Base64 URL encode
  return hash.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
