import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { getStripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone } = await req.json();

    if (!email || !name) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // Check if email already registered
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please login instead.' },
        { status: 400 }
      );
    }

    const stripeClient = await getStripe();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.sasa-worldwide.com';

    const session = await stripeClient.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'aed',
            unit_amount: 100000, // 1000 AED in fils
            product_data: {
              name: 'SASA Sales Foundation Program',
              description: 'Complete sales training: 4 foundations, 46 modules, 92 video & slide lessons.',
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        purchase_type: 'course_purchase',
        course_name: 'SASA Sales Foundation Program',
        customer_name: name,
        customer_phone: phone || '',
        customer_email: email,
      },
      success_url: `${appUrl}/training/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/training?cancelled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Purchase checkout error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
