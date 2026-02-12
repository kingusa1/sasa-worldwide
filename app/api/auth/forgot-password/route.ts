import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { sendEmailSMTP } from '@/lib/email/smtp-client';
import crypto from 'crypto';

function buildResetEmailHtml(name: string, resetUrl: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f6f9fc;">
  <div style="background-color: #002E59; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
    <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #ffffff;">SASA Worldwide</h1>
  </div>
  <div style="background-color: #ffffff; padding: 32px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
    <h2 style="font-size: 24px; font-weight: bold; color: #002E59; margin: 0 0 24px 0;">Reset Your Password</h2>
    <p style="font-size: 16px; line-height: 26px; color: #333; margin: 16px 0;">Hello ${name},</p>
    <p style="font-size: 16px; line-height: 26px; color: #333; margin: 16px 0;">We received a request to reset your password for your SASA Worldwide account. Click the button below to create a new password:</p>
    <div style="padding: 24px 0; text-align: center;">
      <a href="${resetUrl}" style="background-color: #002E59; border-radius: 8px; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; display: inline-block; padding: 14px 32px;">Reset Password</a>
    </div>
    <p style="font-size: 14px; color: #dc2626; text-align: center;">This link will expire in <strong>1 hour</strong> for security reasons.</p>
    <hr style="border-color: #e5e7eb; margin: 24px 0;" />
    <p style="font-size: 14px; color: #6b7280; background-color: #fffbeb; padding: 12px; border-radius: 6px; border-left: 4px solid #f59e0b;">
      If you didn't request this password reset, please ignore this email. Your password will not be changed.
    </p>
    <hr style="border-color: #e5e7eb; margin: 24px 0;" />
    <p style="font-size: 14px; color: #6b7280; text-align: center;">
      If the button doesn't work, copy and paste this link:<br/>
      <a href="${resetUrl}" style="color: #002E59; word-break: break-all;">${resetUrl}</a>
    </p>
  </div>
  <div style="margin-top: 24px; text-align: center;">
    <p style="font-size: 12px; color: #9ca3af;">&copy; ${new Date().getFullYear()} SASA Worldwide. All rights reserved.</p>
  </div>
</body>
</html>`;
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    console.log('[Forgot Password] Request received for:', email);

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Find user
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, email, name')
      .eq('email', email.toLowerCase())
      .single();

    if (userError) {
      console.log('[Forgot Password] User lookup:', userError.message);
    }

    // Always return success (don't reveal if email exists)
    if (!user) {
      console.log('[Forgot Password] No user found for:', email);
      return NextResponse.json({
        success: true,
        message: 'If an account exists, a password reset link has been sent.',
      });
    }

    console.log('[Forgot Password] User found:', user.id, user.email);

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const { error: insertError } = await supabaseAdmin.from('verification_tokens').insert({
      user_id: user.id,
      token: resetToken,
      type: 'password_reset',
      expires_at: expiresAt.toISOString(),
    });

    if (insertError) {
      console.error('[Forgot Password] Token insert failed:', insertError);
      return NextResponse.json({ error: 'Request failed' }, { status: 500 });
    }

    console.log('[Forgot Password] Reset token created, sending email...');

    // Send reset email via SMTP using inline HTML (no react-email dependency)
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.sasa-worldwide.com'}/reset-password?token=${resetToken}`;
    const html = buildResetEmailHtml(user.name || 'User', resetUrl);

    try {
      await sendEmailSMTP({
        to: user.email,
        subject: 'Password Reset Request - SASA Worldwide',
        html,
      });
      console.log('[Forgot Password] Email sent successfully to:', user.email);
    } catch (emailError: any) {
      console.error('[Forgot Password] Email send failed:', emailError.message || emailError);
      // Don't return error to user - token was created, they just won't get the email
    }

    // Log the request (non-blocking)
    try {
      await supabaseAdmin.from('audit_logs').insert({
        user_id: user.id,
        action: 'password_reset_requested',
        details: {},
      });
    } catch (_) {}

    return NextResponse.json({
      success: true,
      message: 'If an account exists, a password reset link has been sent.',
    });
  } catch (error: any) {
    console.error('[Forgot Password] Unhandled error:', error.message || error);
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}
