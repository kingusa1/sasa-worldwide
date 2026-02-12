import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { sendEmailSMTP } from '@/lib/email/smtp-client';
import { PasswordChangedEmail } from '@/emails/PasswordChangedEmail';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Find the reset token
    const { data: resetToken, error: tokenError } = await supabaseAdmin
      .from('verification_tokens')
      .select('*')
      .eq('token', token)
      .eq('type', 'password_reset')
      .is('used_at', null)
      .single();

    if (tokenError || !resetToken) {
      return NextResponse.json(
        { error: 'Invalid or expired reset link' },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (new Date(resetToken.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Reset link has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Get user
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id, email, name')
      .eq('id', resetToken.user_id)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 12);

    // Update password
    await supabaseAdmin
      .from('users')
      .update({ password_hash: passwordHash })
      .eq('id', user.id);

    // Mark token as used
    await supabaseAdmin
      .from('verification_tokens')
      .update({ used_at: new Date().toISOString() })
      .eq('id', resetToken.id);

    // Send confirmation email
    try {
      await sendEmailSMTP({
        to: user.email,
        subject: 'Password Changed - SASA Worldwide',
        template: PasswordChangedEmail({
          name: user.name,
          timestamp: new Date().toLocaleString('en-US', {
            dateStyle: 'full',
            timeStyle: 'long',
            timeZone: 'Asia/Dubai'
          }),
          supportUrl: `${process.env.NEXT_PUBLIC_APP_URL}/contact`,
        }),
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }

    // Log the password change
    await supabaseAdmin.from('audit_logs').insert({
      user_id: user.id,
      action: 'password_changed',
      metadata: {},
    });

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully! You can now log in with your new password.',
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Reset failed' }, { status: 500 });
  }
}
