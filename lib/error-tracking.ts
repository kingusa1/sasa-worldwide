/**
 * SASA Error Tracking System
 * Centralized error logging, tracking, and diagnostics
 *
 * Usage:
 *   import { errorTracker } from '@/lib/error-tracking';
 *   errorTracker.capture(error, { section: 'admin', action: 'fetch_users' });
 */

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export type ErrorSection =
  | 'admin'
  | 'sales'
  | 'crm'
  | 'staff'
  | 'affiliate'
  | 'auth'
  | 'api'
  | 'form'
  | 'stripe'
  | 'email'
  | 'database'
  | 'unknown';

export interface ErrorContext {
  section?: ErrorSection;
  action?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
  severity?: ErrorSeverity;
  url?: string;
  component?: string;
}

export interface TrackedError {
  id: string;
  timestamp: string;
  message: string;
  stack?: string;
  section: ErrorSection;
  action?: string;
  severity: ErrorSeverity;
  userId?: string;
  url?: string;
  component?: string;
  metadata?: Record<string, unknown>;
  resolved: boolean;
}

// In-memory error store (last 100 errors) for the health check endpoint
const errorStore: TrackedError[] = [];
const MAX_STORED_ERRORS = 100;

function generateErrorId(): string {
  return `err_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

function classifySeverity(error: unknown, context: ErrorContext): ErrorSeverity {
  if (context.severity) return context.severity;

  const message = error instanceof Error ? error.message : String(error);
  const section = context.section || 'unknown';

  // Critical: payment, auth, database failures
  if (section === 'stripe' || section === 'database') return 'critical';
  if (message.includes('payment') || message.includes('webhook')) return 'critical';
  if (message.includes('CSRF') || message.includes('Unauthorized')) return 'high';

  // High: auth failures, API errors
  if (section === 'auth') return 'high';
  if (message.includes('500') || message.includes('Internal Server Error')) return 'high';

  // Medium: data fetch failures, form errors
  if (message.includes('fetch') || message.includes('Failed to')) return 'medium';
  if (section === 'api') return 'medium';

  return 'low';
}

function formatError(error: unknown): { message: string; stack?: string } {
  if (error instanceof Error) {
    return { message: error.message, stack: error.stack };
  }
  if (typeof error === 'string') {
    return { message: error };
  }
  return { message: JSON.stringify(error) };
}

export const errorTracker = {
  /**
   * Capture and log an error with context
   */
  capture(error: unknown, context: ErrorContext = {}): TrackedError {
    const { message, stack } = formatError(error);
    const severity = classifySeverity(error, context);

    const tracked: TrackedError = {
      id: generateErrorId(),
      timestamp: new Date().toISOString(),
      message,
      stack,
      section: context.section || 'unknown',
      action: context.action,
      severity,
      userId: context.userId,
      url: context.url || (typeof window !== 'undefined' ? window.location.href : undefined),
      component: context.component,
      metadata: context.metadata,
      resolved: false,
    };

    // Store in memory
    errorStore.unshift(tracked);
    if (errorStore.length > MAX_STORED_ERRORS) {
      errorStore.pop();
    }

    // Log with severity-based formatting
    const prefix = `[SASA ${severity.toUpperCase()}] [${tracked.section}]`;
    const details = context.action ? ` (${context.action})` : '';

    if (severity === 'critical' || severity === 'high') {
      console.error(`${prefix}${details}:`, message);
      if (stack) console.error('Stack:', stack);
      if (context.metadata) console.error('Context:', JSON.stringify(context.metadata, null, 2));
    } else if (severity === 'medium') {
      console.warn(`${prefix}${details}:`, message);
    } else {
      console.log(`${prefix}${details}:`, message);
    }

    return tracked;
  },

  /**
   * Get recent errors (for health check / admin dashboard)
   */
  getRecentErrors(limit: number = 20): TrackedError[] {
    return errorStore.slice(0, limit);
  },

  /**
   * Get errors by section
   */
  getErrorsBySection(section: ErrorSection): TrackedError[] {
    return errorStore.filter(e => e.section === section);
  },

  /**
   * Get error counts by severity
   */
  getErrorSummary(): Record<ErrorSeverity, number> {
    const summary: Record<ErrorSeverity, number> = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    };
    for (const error of errorStore) {
      if (!error.resolved) {
        summary[error.severity]++;
      }
    }
    return summary;
  },

  /**
   * Mark an error as resolved
   */
  resolve(errorId: string): boolean {
    const error = errorStore.find(e => e.id === errorId);
    if (error) {
      error.resolved = true;
      return true;
    }
    return false;
  },

  /**
   * Clear all tracked errors
   */
  clear(): void {
    errorStore.length = 0;
  },

  /**
   * Get health status based on recent errors
   */
  getHealthStatus(): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    details: string;
    recentCritical: number;
    recentHigh: number;
    totalUnresolved: number;
  } {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const recentErrors = errorStore.filter(e => e.timestamp > fiveMinutesAgo && !e.resolved);

    const recentCritical = recentErrors.filter(e => e.severity === 'critical').length;
    const recentHigh = recentErrors.filter(e => e.severity === 'high').length;
    const totalUnresolved = errorStore.filter(e => !e.resolved).length;

    let status: 'healthy' | 'degraded' | 'unhealthy';
    let details: string;

    if (recentCritical > 0) {
      status = 'unhealthy';
      details = `${recentCritical} critical error(s) in the last 5 minutes`;
    } else if (recentHigh > 2) {
      status = 'degraded';
      details = `${recentHigh} high-severity errors in the last 5 minutes`;
    } else if (recentErrors.length > 10) {
      status = 'degraded';
      details = `${recentErrors.length} errors in the last 5 minutes`;
    } else {
      status = 'healthy';
      details = 'All systems operational';
    }

    return { status, details, recentCritical, recentHigh, totalUnresolved };
  },
};

/**
 * Helper to wrap async operations with error tracking
 * Use this in API routes and server actions
 */
export async function withErrorTracking<T>(
  fn: () => Promise<T>,
  context: ErrorContext
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    errorTracker.capture(error, context);
    throw error;
  }
}

/**
 * Helper to create a section-scoped error tracker
 * Use in components: const tracker = createSectionTracker('admin');
 */
export function createSectionTracker(section: ErrorSection) {
  return {
    capture(error: unknown, action?: string, metadata?: Record<string, unknown>) {
      return errorTracker.capture(error, { section, action, metadata });
    },
    async wrap<T>(fn: () => Promise<T>, action: string): Promise<T> {
      return withErrorTracking(fn, { section, action });
    },
  };
}
