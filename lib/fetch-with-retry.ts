/**
 * SASA Self-Healing Fetch
 *
 * Client-side fetch wrapper with:
 * - Automatic retries with exponential backoff
 * - Network error recovery
 * - Request timeout handling
 * - Error tracking integration
 *
 * Usage:
 *   import { fetchWithRetry } from '@/lib/fetch-with-retry';
 *
 *   const data = await fetchWithRetry('/api/admin/users', {
 *     retries: 3,
 *     section: 'admin',
 *   });
 */

interface FetchOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
  timeout?: number;
  section?: string;
  action?: string;
}

interface FetchResult<T = unknown> {
  data: T | null;
  error: string | null;
  status: number;
  ok: boolean;
  retried: number;
}

export async function fetchWithRetry<T = unknown>(
  url: string,
  options: FetchOptions = {}
): Promise<FetchResult<T>> {
  const {
    retries = 2,
    retryDelay = 1000,
    timeout = 30000,
    section = 'unknown',
    action = 'fetch',
    ...fetchOptions
  } = options;

  let lastError: string | null = null;
  let retried = 0;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Parse response
      let data: T | null = null;
      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        const json = await response.json();
        if (!response.ok) {
          throw new Error(json.error || json.message || `Request failed with status ${response.status}`);
        }
        data = json;
      } else if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Request failed with status ${response.status}`);
      }

      return {
        data,
        error: null,
        status: response.status,
        ok: response.ok,
        retried,
      };
    } catch (error: any) {
      lastError = error.message || 'Unknown error';
      retried = attempt;

      // Don't retry on auth errors or client errors (4xx)
      if (error.message?.includes('401') || error.message?.includes('403')) {
        break;
      }

      // Don't retry on abort (user cancelled)
      if (error.name === 'AbortError') {
        lastError = 'Request timed out';
        break;
      }

      // Retry on network errors and server errors
      const isRetryable =
        error.name === 'TypeError' || // network error
        error.message?.includes('fetch') ||
        error.message?.includes('network') ||
        error.message?.includes('500') ||
        error.message?.includes('502') ||
        error.message?.includes('503');

      if (isRetryable && attempt < retries) {
        const delay = retryDelay * Math.pow(2, attempt);
        console.warn(
          `[SASA RETRY] [${section}] ${action}: attempt ${attempt + 2}/${retries + 1} in ${delay}ms`
        );
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // Log non-retryable or final error
      console.error(`[SASA ${section.toUpperCase()}] ${action} failed:`, lastError);
      break;
    }
  }

  return {
    data: null,
    error: lastError,
    status: 0,
    ok: false,
    retried,
  };
}

/**
 * Convenience wrappers for common HTTP methods
 */
export const api = {
  get<T = unknown>(url: string, options?: Omit<FetchOptions, 'method' | 'body'>) {
    return fetchWithRetry<T>(url, { ...options, method: 'GET' });
  },

  post<T = unknown>(url: string, body: unknown, options?: Omit<FetchOptions, 'method' | 'body'>) {
    return fetchWithRetry<T>(url, {
      ...options,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      body: JSON.stringify(body),
    });
  },

  put<T = unknown>(url: string, body: unknown, options?: Omit<FetchOptions, 'method' | 'body'>) {
    return fetchWithRetry<T>(url, {
      ...options,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      body: JSON.stringify(body),
    });
  },

  delete<T = unknown>(url: string, options?: Omit<FetchOptions, 'method' | 'body'>) {
    return fetchWithRetry<T>(url, { ...options, method: 'DELETE' });
  },
};
