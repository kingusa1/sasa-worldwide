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
    const { name, slug, project_type, description, logo_url, products: productsInput, form_fields, status } = body;

    // Support both legacy single-product and new multi-product format
    let products = productsInput;
    if (!products || !Array.isArray(products) || products.length === 0) {
      // Fallback to legacy single product fields
      const { price, cost_of_goods, commission_rate } = body;
      if (!price || price <= 0) {
        return NextResponse.json({ error: 'At least one product with a valid price is required' }, { status: 400 });
      }
      products = [{ name: name, price, cost_of_goods: cost_of_goods || 0, commission_rate: commission_rate || 10 }];
    }

    if (!name || !slug || !project_type || !form_fields) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!Array.isArray(form_fields) || form_fields.length === 0) {
      return NextResponse.json({ error: 'form_fields must be a non-empty array' }, { status: 400 });
    }

    // Validate all products
    for (const p of products) {
      if (!p.name || !p.price || p.price <= 0) {
        return NextResponse.json({ error: `Product "${p.name || 'unnamed'}" must have a name and positive price` }, { status: 400 });
      }
    }

    const { data: existingProject } = await supabaseAdmin.from('projects').select('id').eq('slug', slug).single();
    if (existingProject) return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });

    // Create Stripe products for each product
    const stripeProducts = [];
    let stripeWarning = null;

    for (const product of products) {
      try {
        const { productId, priceId } = await createOrUpdateStripeProduct('temp_id', product.name, product.price);
        stripeProducts.push({
          ...product,
          stripe_product_id: productId,
          stripe_price_id: priceId,
        });
      } catch (stripeError: any) {
        console.error(`Stripe product creation failed for "${product.name}":`, stripeError);
        stripeWarning = `Stripe setup partially failed: ${stripeError.message}. You can configure Stripe later.`;
        stripeProducts.push({
          ...product,
          stripe_product_id: null,
          stripe_price_id: null,
        });
      }
    }

    // Use the first product's data for the legacy single-product columns
    const primaryProduct = stripeProducts[0];

    const insertData: any = {
      name, slug, project_type,
      description: description || null,
      logo_url: logo_url || null,
      price: primaryProduct.price,
      cost_of_goods: primaryProduct.cost_of_goods || 0,
      commission_rate: primaryProduct.commission_rate || 10,
      status: status || 'draft',
      form_fields,
      products: stripeProducts,
      stripe_product_id: primaryProduct.stripe_product_id,
      stripe_price_id: primaryProduct.stripe_price_id,
      created_by: session.user.id
    };

    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .insert(insertData)
      .select()
      .single();

    if (projectError) {
      console.error('Project insert error:', projectError);
      return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }

    await supabaseAdmin.from('audit_logs').insert({
      user_id: session.user.id, action: 'project_created',
      metadata: { project_id: project.id, project_name: name, project_type, products_count: stripeProducts.length }
    });

    return NextResponse.json({
      project,
      ...(stripeWarning ? { warning: stripeWarning } : {}),
    }, { status: 201 });
  } catch (error: any) {
    console.error('Project creation error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
