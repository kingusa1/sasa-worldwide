import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Find the verification token
    const { data: verificationToken, error: tokenError } = await supabaseAdmin
      .from('verification_tokens')
      .select('*')
      .eq('token', token)
      .eq('type', 'email_verification')
      .is('used_at', null)
      .single();

    if (tokenError || !verificationToken) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (new Date(verificationToken.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Token has expired. Please request a new verification email.' },
        { status: 400 }
      );
    }

    // Mark token as used
    await supabaseAdmin
      .from('verification_tokens')
      .update({ used_at: new Date().toISOString() })
      .eq('id', verificationToken.id);

    // Update user's email_verified status
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ email_verified: true })
      .eq('id', verificationToken.user_id);

    if (updateError) throw updateError;

    // Log the verification
    await supabaseAdmin.from('audit_logs').insert({
      user_id: verificationToken.user_id,
      action: 'email_verified',
      details: {},
    });

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully! Your account is now pending admin approval.',
    });
  } catch (error: any) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: error.message || 'Verification failed' },
      { status: 500 }
    );
  }
}
