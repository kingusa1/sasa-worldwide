/**
 * SASA Self-Healing API Handler
 *
 * Wraps API route handlers with:
 * - Automatic error tracking and logging
 * - Consistent error responses
 * - Request validation helpers
 * - Retry logic for transient failures
 *
 * Usage:
 *   import { apiHandler } from '@/lib/api-handler';
 *
 *   export const GET = apiHandler('admin', 'list_users', async (req) => {
 *     // your logic here
 *     return Response.json({ data });
 *   });
 */

import { auth } from '@/auth';
import { errorTracker, ErrorSection } from '@/lib/error-tracking';

type ApiHandlerFn = (
  req: Request,
  context?: { params?: Record<string, string> }
) => Promise<Response>;

/**
 * Wrap an API handler with error tracking, auth checking, and consistent responses
 */
export function apiHandler(
  section: ErrorSection,
  action: string,
  handler: ApiHandlerFn,
  options?: {
    requireAuth?: boolean;
    requireRole?: ('admin' | 'staff' | 'affiliate')[];
    retries?: number;
  }
): ApiHandlerFn {
  const { requireAuth = true, requireRole, retries = 0 } = options || {};

  return async (req: Request, context?: { params?: Record<string, string> }) => {
    const startTime = Date.now();

    try {
      // Auth check
      if (requireAuth) {
        const session = await auth();
        if (!session?.user) {
          return Response.json(
            { error: 'Unauthorized', code: 'AUTH_REQUIRED' },
            { status: 401 }
          );
        }

        if (requireRole && !requireRole.includes(session.user.role)) {
          return Response.json(
            { error: 'Forbidden', code: 'INSUFFICIENT_ROLE' },
            { status: 403 }
          );
        }
      }

      // Execute handler with optional retry
      let lastError: unknown;
      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          const response = await handler(req, context);

          // Log slow requests
          const duration = Date.now() - startTime;
          if (duration > 5000) {
            console.warn(`[SASA SLOW] [${section}] ${action} took ${duration}ms`);
          }

          return response;
        } catch (err) {
          lastError = err;
          if (attempt < retries) {
            // Wait before retry with exponential backoff
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
            console.warn(`[SASA RETRY] [${section}] ${action} attempt ${attempt + 2}/${retries + 1}`);
          }
        }
      }

      // All retries exhausted
      throw lastError;
    } catch (error: any) {
      // Track the error
      const tracked = errorTracker.capture(error, {
        section,
        action,
        url: req.url,
        metadata: {
          method: req.method,
          duration: Date.now() - startTime,
        },
      });

      // Return consistent error response
      const statusCode = error.statusCode || error.status || 500;
      const isProduction = process.env.NODE_ENV === 'production';

      return Response.json(
        {
          error: isProduction ? 'An unexpected error occurred' : error.message,
          code: 'INTERNAL_ERROR',
          errorId: tracked.id,
          section,
          action,
          ...(isProduction ? {} : { stack: error.stack }),
        },
        { status: statusCode }
      );
    }
  };
}

/**
 * Helper to validate required fields in request body
 */
export function validateRequired(
  body: Record<string, unknown>,
  fields: string[]
): { valid: boolean; missing: string[] } {
  const missing = fields.filter(
    field => body[field] === undefined || body[field] === null || body[field] === ''
  );
  return { valid: missing.length === 0, missing };
}

/**
 * Helper to create a standardized success response
 */
export function successResponse(data: unknown, status: number = 200) {
  return Response.json({ success: true, ...( typeof data === 'object' ? data : { data }) }, { status });
}

/**
 * Helper to create a standardized error response
 */
export function errorResponse(message: string, status: number = 400, code?: string) {
  return Response.json({ error: message, code: code || 'BAD_REQUEST' }, { status });
}
