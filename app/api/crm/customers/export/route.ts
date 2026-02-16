/**
 * Customer Export API
 * POST: Export customers to CSV for a specific project
 */

import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

// Helper function to escape CSV fields
function escapeCSV(value: any): string {
  if (value === null || value === undefined) return '';

  const str = String(value);

  // If contains comma, quotes, or newline, wrap in quotes and escape quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

export async function POST(req: Request) {
  try {
    // 1. Check authentication and authorization
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins, sales staff, and affiliates can export customer data
    if (session.user.role !== 'admin' && session.user.role !== 'staff' && session.user.role !== 'affiliate') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { project_id, date_from, date_to } = body;

    // 2. Validate inputs
    if (!project_id) {
      return NextResponse.json(
        { error: 'project_id is required' },
        { status: 400 }
      );
    }

    // Validate dates
    let fromDate: Date | null = null;
    let toDate: Date | null = null;

    if (date_from) {
      fromDate = new Date(date_from);
      if (isNaN(fromDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid date_from' },
          { status: 400 }
        );
      }
    }

    if (date_to) {
      toDate = new Date(date_to);
      if (isNaN(toDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid date_to' },
          { status: 400 }
        );
      }
    }

    // 3. Verify project exists
    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .select('id, name')
      .eq('id', project_id)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // 4. Query customers with transactions for project
    let query = supabaseAdmin
      .from('sales_transactions')
      .select(`
        created_at,
        amount,
        payment_status,
        fulfillment_status,
        commission_amount,
        customers!inner(name, email, phone, address, city),
        users!salesperson_id(name),
        voucher_codes(code)
      `)
      .eq('project_id', project_id)
      .eq('payment_status', 'succeeded'); // Only export successful transactions

    if (fromDate) {
      query = query.gte('created_at', fromDate.toISOString());
    }

    if (toDate) {
      query = query.lte('created_at', toDate.toISOString());
    }

    const { data: transactions, error: queryError } = await query.order(
      'created_at',
      { ascending: false }
    );

    if (queryError) {
      console.error('Export query error:', queryError);
      return NextResponse.json(
        { error: 'Failed to fetch transactions' },
        { status: 500 }
      );
    }

    if (!transactions || transactions.length === 0) {
      return NextResponse.json(
        { error: 'No transactions found for the specified criteria' },
        { status: 404 }
      );
    }

    // 5. Format as CSV with proper escaping
    const headers = [
      'Date',
      'Customer Name',
      'Email',
      'Phone',
      'Address',
      'City',
      'Amount',
      'Commission',
      'Salesperson',
      'Voucher Code',
      'Payment Status',
      'Fulfillment Status',
    ];

    const csvRows = [
      headers.join(','),
      ...transactions.map((t: any) =>
        [
          escapeCSV(new Date(t.created_at).toLocaleString()),
          escapeCSV(t.customers?.name),
          escapeCSV(t.customers?.email),
          escapeCSV(t.customers?.phone),
          escapeCSV(t.customers?.address),
          escapeCSV(t.customers?.city),
          escapeCSV(t.amount),
          escapeCSV(t.commission_amount),
          escapeCSV(t.users?.name),
          escapeCSV(t.voucher_codes?.code || 'N/A'),
          escapeCSV(t.payment_status),
          escapeCSV(t.fulfillment_status),
        ].join(',')
      ),
    ];

    const csv = csvRows.join('\n');

    // 6. Log export to audit trail
    await supabaseAdmin.from('audit_logs').insert({
      user_id: session.user.id,
      action: 'customer_export',
      metadata: {
        project_id,
        project_name: project.name,
        record_count: transactions.length,
        date_from: fromDate?.toISOString(),
        date_to: toDate?.toISOString(),
      },
    });

    console.log(
      `✅ Exported ${transactions.length} customers for project ${project.name}`
    );

    // 7. Return CSV file
    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="customers-${project.name.replace(/[^a-z0-9]/gi, '-')}-${Date.now()}.csv"`,
      },
    });
  } catch (error: any) {
    console.error('Customer export error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during export' },
      { status: 500 }
    );
  }
}
