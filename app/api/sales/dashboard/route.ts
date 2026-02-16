/**
 * Sales Dashboard API
 * GET: Get salesperson dashboard KPIs and metrics
 */

import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only sales staff and affiliates can view their dashboard
    if (session.user.role !== 'staff' && session.user.role !== 'admin' && session.user.role !== 'affiliate') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const salesperson_id = session.user.id;

    // Get date range from query params (default: this month)
    const { searchParams } = new URL(req.url);
    const from = searchParams.get('from') || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
    const to = searchParams.get('to') || new Date().toISOString();

    // Fetch all transactions for this salesperson
    const { data: allTransactions, error: allError } = await supabaseAdmin
      .from('sales_transactions')
      .select('*')
      .eq('salesperson_id', salesperson_id)
      .eq('payment_status', 'succeeded');

    if (allError) {
      console.error('Dashboard query error:', allError);
      return NextResponse.json(
        { error: 'Failed to fetch dashboard data' },
        { status: 500 }
      );
    }

    // Fetch transactions for date range
    const { data: periodTransactions, error: periodError } = await supabaseAdmin
      .from('sales_transactions')
      .select('*')
      .eq('salesperson_id', salesperson_id)
      .eq('payment_status', 'succeeded')
      .gte('created_at', from)
      .lte('created_at', to);

    if (periodError) {
      console.error('Period query error:', periodError);
      return NextResponse.json(
        { error: 'Failed to fetch period data' },
        { status: 500 }
      );
    }

    // Calculate KPIs
    const totalSales = allTransactions?.length || 0;
    const totalRevenue = allTransactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
    const totalCommission = allTransactions?.reduce((sum, t) => sum + Number(t.commission_amount), 0) || 0;

    const periodSales = periodTransactions?.length || 0;
    const periodRevenue = periodTransactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
    const periodCommission = periodTransactions?.reduce((sum, t) => sum + Number(t.commission_amount), 0) || 0;

    // Get active projects count
    const { count: activeProjects } = await supabaseAdmin
      .from('project_assignments')
      .select('id', { count: 'exact', head: true })
      .eq('salesperson_id', salesperson_id)
      .eq('status', 'active');

    // Calculate conversion rate (assuming form submissions create pending transactions)
    const { count: totalSubmissions } = await supabaseAdmin
      .from('sales_transactions')
      .select('id', { count: 'exact', head: true })
      .eq('salesperson_id', salesperson_id)
      .gte('created_at', from)
      .lte('created_at', to);

    const conversionRate = totalSubmissions && totalSubmissions > 0
      ? (periodSales / totalSubmissions) * 100
      : 0;

    // Get recent transactions for chart
    const { data: recentTransactions, error: recentError } = await supabaseAdmin
      .from('sales_transactions')
      .select('created_at, amount, projects(name)')
      .eq('salesperson_id', salesperson_id)
      .eq('payment_status', 'succeeded')
      .gte('created_at', from)
      .lte('created_at', to)
      .order('created_at', { ascending: true });

    if (recentError) {
      console.error('Recent transactions error:', recentError);
    }

    // Get sales by project
    const { data: projectSales, error: projectError } = await supabaseAdmin
      .from('sales_transactions')
      .select('project_id, amount, projects(name)')
      .eq('salesperson_id', salesperson_id)
      .eq('payment_status', 'succeeded')
      .gte('created_at', from)
      .lte('created_at', to);

    if (projectError) {
      console.error('Project sales error:', projectError);
    }

    // Group sales by project
    const salesByProject: Record<string, { name: string; revenue: number; count: number }> = {};
    projectSales?.forEach((sale: any) => {
      const projectName = sale.projects?.name || 'Unknown';
      if (!salesByProject[projectName]) {
        salesByProject[projectName] = { name: projectName, revenue: 0, count: 0 };
      }
      salesByProject[projectName].revenue += Number(sale.amount);
      salesByProject[projectName].count += 1;
    });

    return NextResponse.json({
      success: true,
      kpis: {
        total_sales: totalSales,
        total_revenue: totalRevenue,
        total_commission: totalCommission,
        period_sales: periodSales,
        period_revenue: periodRevenue,
        period_commission: periodCommission,
        active_projects: activeProjects || 0,
        conversion_rate: conversionRate,
      },
      charts: {
        revenue_timeline: recentTransactions || [],
        sales_by_project: Object.values(salesByProject),
      },
    });
  } catch (error: any) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
