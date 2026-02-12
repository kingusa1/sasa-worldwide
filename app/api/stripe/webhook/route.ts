import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';
import { sendVoucherEmail } from '@/lib/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event: Stripe.Event;
  try {
    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('Missing signature or webhook secret');
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const { transaction_id } = paymentIntent.metadata;

    if (!transaction_id) {
      console.error('No transaction_id in payment intent metadata');
      return NextResponse.json(
        { error: 'Missing transaction_id' },
        { status: 400 }
      );
    }

    try {
      const { error: updateError } = await supabaseAdmin
        .from('sales_transactions')
        .update({
          payment_status: 'succeeded',
          payment_completed_at: new Date().toISOString(),
        })
        .eq('id', transaction_id);

      if (updateError) {
        throw new Error(`Failed to update transaction: ${updateError.message}`);
      }

      const { data: transaction, error: transactionError } = await supabaseAdmin
        .from('sales_transactions')
        .select(`
          *,
          projects!inner(id, name, slug),
          customers!inner(id, email, name)
        `)
        .eq('id', transaction_id)
        .single();

      if (transactionError || !transaction) {
        throw new Error(`Transaction not found: ${transaction_id}`);
      }

      const { data: voucher, error: voucherError } = await supabaseAdmin.rpc(
        'claim_next_available_voucher',
        { p_project_id: transaction.project_id }
      );

      if (voucherError || !voucher || voucher.length === 0) {
        await supabaseAdmin
          .from('sales_transactions')
          .update({
            fulfillment_status: 'failed',
            fulfillment_completed_at: new Date().toISOString(),
          })
          .eq('id', transaction_id);

        console.error(`No vouchers available for project ${transaction.project_id}`);

        return NextResponse.json({
          received: true,
          error: 'No vouchers available',
        });
      }

      const claimedVoucher = Array.isArray(voucher) ? voucher[0] : voucher;

      await supabaseAdmin
        .from('sales_transactions')
        .update({ voucher_code_id: claimedVoucher.id })
        .eq('id', transaction_id);

      try {
        await sendVoucherEmail({
          to: transaction.customers.email,
          name: transaction.customers.name,
          voucherCode: claimedVoucher.code,
          projectName: transaction.projects.name,
          amount: transaction.amount,
        });

        await supabaseAdmin
          .from('sales_transactions')
          .update({
            fulfillment_status: 'completed',
            fulfillment_completed_at: new Date().toISOString(),
          })
          .eq('id', transaction_id);

      } catch (emailError: any) {
        console.error('Email send failed:', emailError);

        await supabaseAdmin
          .from('sales_transactions')
          .update({
            fulfillment_status: 'email_sent',
            fulfillment_completed_at: new Date().toISOString(),
          })
          .eq('id', transaction_id);
      }

      await supabaseAdmin.from('audit_logs').insert({
        user_id: transaction.salesperson_id,
        action: 'voucher_sold',
        metadata: {
          transaction_id,
          voucher_id: claimedVoucher.id,
          voucher_code: claimedVoucher.code,
          project_id: transaction.project_id,
          project_name: transaction.projects.name,
          customer_id: transaction.customer_id,
          customer_email: transaction.customers.email,
          amount: transaction.amount,
        },
      });

      console.log(`✅ Webhook processed successfully for transaction ${transaction_id}`);
      console.log(`   Voucher code: ${claimedVoucher.code}`);
      console.log(`   Customer: ${transaction.customers.email}`);

    } catch (error: any) {
      console.error('Webhook processing error:', error);

      await supabaseAdmin
        .from('sales_transactions')
        .update({
          fulfillment_status: 'failed',
          fulfillment_completed_at: new Date().toISOString(),
        })
        .eq('id', transaction_id);

      return NextResponse.json({
        received: true,
        error: error.message,
      });
    }
  }

  return NextResponse.json({ received: true });
}
