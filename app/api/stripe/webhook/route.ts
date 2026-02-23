import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase/server';
import { getStripe, getWebhookSecret } from '@/lib/stripe';
import { sendVoucherEmail } from '@/lib/email';
import { sendEmailSMTP } from '@/lib/email/smtp-client';
import { logCoursePurchase } from '@/lib/google-sheets-payments';
import { CoursePurchaseEmail } from '@/emails/CoursePurchaseEmail';
import bcrypt from 'bcryptjs';

function generateTempPassword(length = 12): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event: Stripe.Event;
  try {
    const webhookSecret = await getWebhookSecret();
    if (!signature || !webhookSecret) {
      console.error('Missing signature or webhook secret');
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    const stripeClient = await getStripe();
    event = stripeClient.webhooks.constructEvent(body, signature, webhookSecret);
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
          customers!inner(id, email, name, phone)
        `)
        .eq('id', transaction_id)
        .single();

      if (transactionError || !transaction) {
        throw new Error(`Transaction not found: ${transaction_id}`);
      }

      // Get selected product name for per-product voucher claiming
      const selectedProduct = transaction.form_data?.selected_product || null;

      const { data: voucher, error: voucherError } = await supabaseAdmin.rpc(
        'claim_next_available_voucher',
        {
          p_project_id: transaction.project_id,
          p_product_name: selectedProduct,
        }
      );

      if (voucherError || !voucher || voucher.length === 0) {
        await supabaseAdmin
          .from('sales_transactions')
          .update({
            fulfillment_status: 'failed',
            fulfillment_completed_at: new Date().toISOString(),
          })
          .eq('id', transaction_id);

        console.error(`No vouchers available for project ${transaction.project_id}${selectedProduct ? ` product ${selectedProduct}` : ''}`);

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
          productName: selectedProduct || undefined,
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
          product_name: selectedProduct,
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

  // === Course Purchase Handler ===
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.metadata?.purchase_type === 'course_purchase') {
      try {
        const customerName = session.metadata.customer_name;
        const customerEmail = session.metadata.customer_email;
        const customerPhone = session.metadata.customer_phone || '';
        const courseName = session.metadata.course_name;

        // 1. Generate temporary password
        const tempPassword = generateTempPassword();
        const passwordHash = await bcrypt.hash(tempPassword, 12);

        // 2. Check if user already exists (idempotency for webhook retries)
        const { data: existingUser } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('email', customerEmail.toLowerCase())
          .single();

        let userId: string;

        if (existingUser) {
          userId = existingUser.id;
        } else {
          // 3. Create user with status: 'active' (auto-approved via payment)
          const { data: newUser, error: userError } = await supabaseAdmin
            .from('users')
            .insert({
              email: customerEmail.toLowerCase(),
              password_hash: passwordHash,
              name: customerName,
              role: 'affiliate',
              status: 'active',
              email_verified: true,
            })
            .select()
            .single();

          if (userError) throw new Error(`Failed to create user: ${userError.message}`);
          userId = newUser.id;

          // 4. Create affiliate profile
          const referralCode = `SASA-${userId.substring(0, 8).toUpperCase()}`;
          await supabaseAdmin.from('affiliate_profiles').insert({
            user_id: userId,
            phone: customerPhone || null,
            referral_code: referralCode,
          });

          // 5. Create signup_requests record (auto-approved)
          await supabaseAdmin.from('signup_requests').insert({
            user_id: userId,
            status: 'approved',
            approval_notes: 'Auto-approved: Course purchase payment verified',
            reviewed_at: new Date().toISOString(),
          });
        }

        // 6. Find the course
        const { data: course } = await supabaseAdmin
          .from('courses')
          .select('id')
          .eq('title', 'SASA Sales Foundation Program')
          .single();

        if (course) {
          // 7. Auto-assign course to user
          await supabaseAdmin
            .from('course_assignments')
            .upsert(
              {
                course_id: course.id,
                user_id: userId,
                assigned_by: userId,
                assigned_at: new Date().toISOString(),
              },
              { onConflict: 'course_id,user_id', ignoreDuplicates: true }
            );
        }

        // 8. Save purchase record (for success page credential retrieval)
        const { error: purchaseError } = await supabaseAdmin
          .from('course_purchases')
          .upsert(
            {
              user_id: userId,
              stripe_session_id: session.id,
              stripe_payment_intent_id: (session.payment_intent as string) || '',
              course_name: courseName,
              amount: (session.amount_total || 0) / 100,
              currency: session.currency || 'aed',
              customer_email: customerEmail,
              customer_name: customerName,
              customer_phone: customerPhone || null,
              temp_password: tempPassword,
              status: 'completed',
            },
            { onConflict: 'stripe_session_id', ignoreDuplicates: true }
          );

        if (purchaseError) {
          console.error('Failed to save purchase record:', purchaseError);
        }

        // 9. Log to Google Sheets (non-blocking)
        logCoursePurchase({
          date: new Date().toISOString(),
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          courseName,
          amount: (session.amount_total || 0) / 100,
          stripeSessionId: session.id,
          stripePaymentIntentId: (session.payment_intent as string) || '',
          userId,
          status: 'completed',
        }).catch((err) => console.error('Google Sheets log failed:', err));

        // 10. Send welcome email with credentials (non-blocking)
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.sasa-worldwide.com';
        sendEmailSMTP({
          to: customerEmail,
          subject: 'Welcome to SASA Training - Your Login Credentials',
          template: CoursePurchaseEmail({
            name: customerName,
            email: customerEmail,
            password: tempPassword,
            loginUrl: `${appUrl}/login`,
            courseName,
          }),
        }).catch((err) => console.error('Course purchase email failed:', err));

        // 11. Audit log
        await supabaseAdmin.from('audit_logs').insert({
          user_id: userId,
          action: 'course_purchased',
          metadata: {
            course_name: courseName,
            amount: (session.amount_total || 0) / 100,
            stripe_session_id: session.id,
          },
        });

        console.log(`Course purchase processed: ${customerEmail} -> ${courseName}`);
      } catch (error: any) {
        console.error('Course purchase webhook error:', error);
        return NextResponse.json({ received: true, error: error.message });
      }
    }
  }

  return NextResponse.json({ received: true });
}
