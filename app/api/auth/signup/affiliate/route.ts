import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import bcrypt from 'bcryptjs';
import { sendEmailSMTP } from '@/lib/email/smtp-client';
import { WelcomeEmail } from '@/emails/WelcomeEmail';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, phone } = body;

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user - affiliates get instant approval
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        email: email.toLowerCase(),
        password_hash: passwordHash,
        name,
        role: 'affiliate',
        status: 'active', // Instant approval for affiliates
        email_verified: true, // Auto-verify for affiliates
      })
      .select()
      .single();

    if (userError) throw userError;

    // Create affiliate profile with referral code
    const referralCode = `SASA-${user.id.substring(0, 8).toUpperCase()}`;
    const { error: profileError } = await supabaseAdmin
      .from('affiliate_profiles')
      .insert({
        user_id: user.id,
        phone: phone || null,
        referral_code: referralCode,
      });

    if (profileError) {
      console.error('Failed to create affiliate profile:', profileError);
      // Don't fail the signup if profile creation fails
    }

    // Send welcome email
    try {
      await sendEmailSMTP({
        to: user.email,
        subject: 'Welcome to SASA Affiliate Program!',
        template: WelcomeEmail({
          name: user.name,
          verificationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/affiliate`,
        }),
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    // Log the signup
    await supabaseAdmin.from('audit_logs').insert({
      user_id: user.id,
      action: 'signup',
      metadata: { role: 'affiliate', phone: phone || null, referral_code: referralCode },
    });

    return NextResponse.json({
      success: true,
      message: 'Signup successful! You can now log in to your affiliate account.',
      userId: user.id,
    });
  } catch (error: any) {
    console.error('Affiliate signup error:', error);
    return NextResponse.json(
      { error: error.message || 'Signup failed' },
      { status: 500 }
    );
  }
}
