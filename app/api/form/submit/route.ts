import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { createCheckoutSession } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.json();
    const { project_id, salesperson_id, customer_data, selected_product_index } = formData;

    if (!project_id || !salesperson_id || !customer_data?.email || !customer_data?.name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [projectResult, assignmentResult] = await Promise.all([
      supabaseAdmin.from('projects').select('*').eq('id', project_id).eq('status', 'active').single(),
      supabaseAdmin.from('project_assignments').select('form_url').eq('project_id', project_id).eq('salesperson_id', salesperson_id).eq('status', 'active').single()
    ]);

    const { data: project, error: projectError } = projectResult;
    const { data: assignment, error: assignmentError } = assignmentResult;

    if (projectError || !project) return NextResponse.json({ error: 'Project not found or inactive' }, { status: 404 });
    if (assignmentError || !assignment) return NextResponse.json({ error: 'Invalid salesperson assignment' }, { status: 404 });

    // Determine which product/price to use
    let priceId = project.stripe_price_id;
    let amount = project.price;
    let commissionRate = project.commission_rate;
    let selectedProductName = project.name;

    if (project.products && project.products.length > 0) {
      const productIndex = typeof selected_product_index === 'number' ? selected_product_index : 0;
      const selectedProduct = project.products[productIndex] || project.products[0];
      if (selectedProduct.stripe_price_id) {
        priceId = selectedProduct.stripe_price_id;
      }
      amount = selectedProduct.price || project.price;
      commissionRate = selectedProduct.commission_rate || project.commission_rate;
      selectedProductName = selectedProduct.name || project.name;
    }

    if (!priceId) return NextResponse.json({ error: 'Project payment not configured' }, { status: 400 });

    const { data: customer, error: customerError } = await supabaseAdmin.from('customers').upsert({
      email: customer_data.email.toLowerCase().trim(), name: customer_data.name.trim(),
      phone: customer_data.phone?.trim() || null, address: customer_data.address?.trim() || null,
      city: customer_data.city?.trim() || null, country: customer_data.country?.trim() || null,
      additional_info: customer_data, source: 'form_submission', updated_at: new Date().toISOString()
    }, { onConflict: 'email' }).select().single();

    if (customerError || !customer) return NextResponse.json({ error: 'Failed to create customer record' }, { status: 500 });

    const { count: availableVouchers } = await supabaseAdmin.from('voucher_codes').select('id', { count: 'exact', head: true })
      .eq('project_id', project_id).eq('status', 'available');

    if (!availableVouchers || availableVouchers === 0) {
      return NextResponse.json({ error: 'Sorry, this product is currently out of stock. Please contact support.' }, { status: 400 });
    }

    const { data: transaction, error: transactionError } = await supabaseAdmin.from('sales_transactions').insert({
      project_id, salesperson_id, customer_id: customer.id, voucher_code_id: null,
      amount, commission_rate: commissionRate,
      payment_status: 'pending', fulfillment_status: 'pending',
      form_data: { ...customer_data, selected_product: selectedProductName }
    }).select().single();

    if (transactionError || !transaction) return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });

    const formUrlPath = assignment.form_url.startsWith('/') ? assignment.form_url : `/${assignment.form_url}`;

    const checkoutUrl = await createCheckoutSession(
      priceId, customer.email,
      { transaction_id: transaction.id, project_id: project_id, salesperson_id: salesperson_id },
      `${process.env.NEXT_PUBLIC_BASE_URL}/form/success?session_id={CHECKOUT_SESSION_ID}`,
      `${process.env.NEXT_PUBLIC_BASE_URL}${formUrlPath}?cancelled=true`
    );

    return NextResponse.json({ checkout_url: checkoutUrl, transaction_id: transaction.id });
  } catch (error: any) {
    console.error('Form submit error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred. Please try again.' }, { status: 500 });
  }
}
