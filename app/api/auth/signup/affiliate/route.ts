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

    // Create user - affiliates require admin approval (same as staff)
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        email: email.toLowerCase(),
        password_hash: passwordHash,
        name,
        role: 'affiliate',
        status: 'pending',
        email_verified: false,
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
    }

    // Create signup_requests record for admin approval
    const { error: signupRequestError } = await supabaseAdmin
      .from('signup_requests')
      .insert({
        user_id: user.id,
        status: 'pending',
      });

    if (signupRequestError) {
      console.error('Failed to create signup request:', signupRequestError);
    }

    // Send confirmation email to affiliate
    try {
      await sendEmailSMTP({
        to: user.email,
        subject: 'SASA Affiliate Signup - Pending Approval',
        template: WelcomeEmail({
          name: user.name,
          verificationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
        }),
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }

    // Send admin notification
    try {
      await sendEmailSMTP({
        to: 'it@sasa-worldwide.com',
        subject: `New Affiliate Signup - ${user.name} (Pending Approval)`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
          <h2 style="color:#002E59;">New Affiliate Signup Request</h2>
          <p>A new affiliate has signed up and requires your approval:</p>
          <ul>
            <li><strong>Name:</strong> ${user.name}</li>
            <li><strong>Email:</strong> ${user.email}</li>
            <li><strong>Phone:</strong> ${phone || 'Not provided'}</li>
            <li><strong>Referral Code:</strong> ${referralCode}</li>
          </ul>
          <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/signups" style="display:inline-block;padding:10px 20px;background-color:#002E59;color:white;text-decoration:none;border-radius:8px;">Review Signup</a></p>
        </div>`,
      });
    } catch (emailError) {
      console.error('Failed to send admin notification:', emailError);
    }

    // Log the signup
    await supabaseAdmin.from('audit_logs').insert({
      user_id: user.id,
      action: 'signup',
      metadata: { role: 'affiliate', phone: phone || null, referral_code: referralCode },
    });

    return NextResponse.json({
      success: true,
      message: 'Signup submitted! Your account is pending admin approval.',
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
