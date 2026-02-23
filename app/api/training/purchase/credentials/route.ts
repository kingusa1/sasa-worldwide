import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id');
  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
  }

  try {
    const stripeClient = await getStripe();
    const session = await stripeClient.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }

    if (session.metadata?.purchase_type !== 'course_purchase') {
      return NextResponse.json({ error: 'Invalid session type' }, { status: 400 });
    }

    // Look up purchase record created by webhook
    const { data: purchase } = await supabaseAdmin
      .from('course_purchases')
      .select('temp_password, user_id')
      .eq('stripe_session_id', sessionId)
      .single();

    if (!purchase) {
      // Webhook may not have fired yet
      return NextResponse.json(
        { error: 'Purchase is being processed. Please wait a moment and refresh.' },
        { status: 202 }
      );
    }

    const { data: user } = await supabaseAdmin
      .from('users')
      .select('email, name')
      .eq('id', purchase.user_id)
      .single();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.sasa-worldwide.com';

    return NextResponse.json({
      email: user?.email || session.metadata.customer_email,
      name: user?.name || session.metadata.customer_name,
      password: purchase.temp_password,
      loginUrl: `${appUrl}/login`,
    });
  } catch (error: any) {
    console.error('Credentials retrieval error:', error);
    return NextResponse.json({ error: 'Failed to retrieve credentials' }, { status: 500 });
  }
}
