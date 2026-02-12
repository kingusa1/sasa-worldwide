import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { supabaseAdmin } from '@/lib/supabase/server';
import { createOrUpdateStripeProduct } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (session.user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status');
    const project_type = searchParams.get('project_type');

    let query = supabaseAdmin.from('projects').select('*').order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);
    if (project_type) query = query.eq('project_type', project_type);

    const { data: projects, error } = await query;
    if (error) return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    return NextResponse.json({ projects });
  } catch (error: any) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (session.user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const { name, slug, project_type, description, logo_url, price, cost_of_goods, commission_rate, form_fields, status } = body;

    if (!name || !slug || !project_type || !price || !form_fields) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (price <= 0) return NextResponse.json({ error: 'Price must be greater than 0' }, { status: 400 });
    if (!Array.isArray(form_fields) || form_fields.length === 0) {
      return NextResponse.json({ error: 'form_fields must be a non-empty array' }, { status: 400 });
    }

    const { data: existingProject } = await supabaseAdmin.from('projects').select('id').eq('slug', slug).single();
    if (existingProject) return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });

    let stripe_product_id, stripe_price_id;
    try {
      const { productId, priceId } = await createOrUpdateStripeProduct('temp_id', name, price);
      stripe_product_id = productId;
      stripe_price_id = priceId;
    } catch (stripeError: any) {
      return NextResponse.json({ error: 'Failed to create Stripe product' }, { status: 500 });
    }

    const { data: project, error: projectError } = await supabaseAdmin.from('projects').insert({
      name, slug, project_type, description: description || null, logo_url: logo_url || null,
      price, cost_of_goods: cost_of_goods || 0, commission_rate: commission_rate || 10,
      status: status || 'draft', form_fields, stripe_product_id, stripe_price_id, created_by: session.user.id
    }).select().single();

    if (projectError) return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });

    await supabaseAdmin.from('audit_logs').insert({
      user_id: session.user.id, action: 'project_created',
      metadata: { project_id: project.id, project_name: name, project_type, price }
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
