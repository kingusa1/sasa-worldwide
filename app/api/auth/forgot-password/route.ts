import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { sendEmailSMTP } from '@/lib/email/smtp-client';
import { PasswordResetEmail } from '@/emails/PasswordResetEmail';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Find user
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id, email, name')
      .eq('email', email.toLowerCase())
      .single();

    // Always return success (don't reveal if email exists)
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists, a password reset link has been sent.',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1-hour expiry

    await supabaseAdmin.from('verification_tokens').insert({
      user_id: user.id,
      token: resetToken,
      type: 'password_reset',
      expires_at: expiresAt.toISOString(),
    });

    // Send reset email
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    try {
      await sendEmailSMTP({
        to: user.email,
        subject: 'Password Reset Request - SASA Worldwide',
        template: PasswordResetEmail({
          name: user.name,
          resetUrl,
        }),
      });
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError);
    }

    // Log the request
    await supabaseAdmin.from('audit_logs').insert({
      user_id: user.id,
      action: 'password_reset_requested',
      details: {},
    });

    return NextResponse.json({
      success: true,
      message: 'If an account exists, a password reset link has been sent.',
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}
