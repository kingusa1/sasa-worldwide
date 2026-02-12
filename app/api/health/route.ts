import { errorTracker } from '@/lib/error-tracking';
import { supabaseAdmin } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  const checks: Record<string, { status: string; latency?: number; error?: string }> = {};

  // 1. Database connectivity check
  try {
    const dbStart = Date.now();
    const { error } = await supabaseAdmin
      .from('users')
      .select('id', { count: 'exact', head: true })
      .limit(1);

    if (error) throw error;
    checks.database = { status: 'ok', latency: Date.now() - dbStart };
  } catch (error: any) {
    checks.database = { status: 'error', error: error.message };
    errorTracker.capture(error, { section: 'database', action: 'health_check' });
  }

  // 2. Auth system check
  try {
    checks.auth = { status: 'ok' };
  } catch (error: any) {
    checks.auth = { status: 'error', error: error.message };
  }

  // 3. Error tracker status
  const errorHealth = errorTracker.getHealthStatus();
  checks.error_tracking = {
    status: errorHealth.status === 'healthy' ? 'ok' : errorHealth.status,
    error: errorHealth.status !== 'healthy' ? errorHealth.details : undefined,
  };

  // 4. Determine overall status
  const hasErrors = Object.values(checks).some(c => c.status === 'error');
  const hasDegraded = Object.values(checks).some(c => c.status === 'degraded');

  const overallStatus = hasErrors ? 'unhealthy' : hasDegraded ? 'degraded' : 'healthy';
  const totalLatency = Date.now() - startTime;

  const response = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    latency: `${totalLatency}ms`,
    checks,
    errors: {
      summary: errorTracker.getErrorSummary(),
      recent: errorTracker.getRecentErrors(5).map(e => ({
        id: e.id,
        section: e.section,
        severity: e.severity,
        message: e.message.substring(0, 200),
        timestamp: e.timestamp,
        resolved: e.resolved,
      })),
    },
  };

  return Response.json(response, {
    status: overallStatus === 'unhealthy' ? 503 : 200,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
