/**
 * CRM Customers API
 * GET: List customers with filtering
 * POST: Create new customer manually
 */

import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

/**
 * GET /api/crm/customers
 * List all customers with filtering
 */
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins, sales staff, and affiliates can view customers
    if (session.user.role !== 'admin' && session.user.role !== 'staff' && session.user.role !== 'affiliate') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const project_id = searchParams.get('project_id');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = supabaseAdmin
      .from('customers')
      .select('*, sales_transactions(id, project_id, created_at)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply search filter
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    const { data: customers, error, count } = await query;

    if (error) {
      console.error('Get customers error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch customers' },
        { status: 500 }
      );
    }

    // Filter by project if specified
    let filteredCustomers = customers;
    if (project_id && customers) {
      filteredCustomers = customers.filter((customer: any) =>
        customer.sales_transactions?.some((t: any) => t.project_id === project_id)
      );
    }

    return NextResponse.json({
      success: true,
      customers: filteredCustomers,
      count: filteredCustomers?.length || 0,
      total: count,
    });
  } catch (error: any) {
    console.error('Get customers error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/crm/customers
 * Create new customer manually
 */
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins, sales staff, and affiliates can create customers
    if (session.user.role !== 'admin' && session.user.role !== 'staff' && session.user.role !== 'affiliate') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { email, name, phone, address, city, country, tags, notes } = body;

    // Validate required fields
    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if customer already exists
    const { data: existingCustomer } = await supabaseAdmin
      .from('customers')
      .select('id, email')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (existingCustomer) {
      return NextResponse.json(
        { error: 'A customer with this email already exists' },
        { status: 409 }
      );
    }

    // Create customer
    const { data: customer, error } = await supabaseAdmin
      .from('customers')
      .insert({
        email: email.toLowerCase().trim(),
        name: name.trim(),
        phone: phone?.trim() || null,
        address: address?.trim() || null,
        city: city?.trim() || null,
        country: country?.trim() || null,
        tags: tags || [],
        notes: notes?.trim() || null,
        source: 'manual_entry',
      })
      .select()
      .single();

    if (error) {
      console.error('Create customer error:', error);
      return NextResponse.json(
        { error: 'Failed to create customer' },
        { status: 500 }
      );
    }

    // Log to audit trail
    await supabaseAdmin.from('audit_logs').insert({
      user_id: session.user.id,
      action: 'customer_created',
      metadata: {
        customer_id: customer.id,
        customer_email: customer.email,
        customer_name: customer.name,
      },
    });

    console.log(`✅ Created customer: ${customer.name}`);

    return NextResponse.json({
      success: true,
      customer,
      message: 'Customer created successfully',
    });
  } catch (error: any) {
    console.error('Create customer error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
