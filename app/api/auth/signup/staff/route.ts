import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import bcrypt from 'bcryptjs';
import { sendEmailSMTP } from '@/lib/email/smtp-client';
import { WelcomeEmail } from '@/emails/WelcomeEmail';
import { NewSignupNotification } from '@/emails/NewSignupNotification';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, department, employeeId, phone } = body;

    // Validate required fields
    if (!email || !password || !name || !department || !employeeId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // VALIDATION 1: Email domain must be @sasa-worldwide.com
    const emailDomain = email.toLowerCase().split('@')[1];
    if (emailDomain !== 'sasa-worldwide.com') {
      return NextResponse.json(
        { error: 'Only @sasa-worldwide.com email addresses are allowed for staff registration' },
        { status: 400 }
      );
    }

    // VALIDATION 2: Employee ID must exist and be unused
    const { data: employeeIdRecord, error: employeeIdError } = await supabaseAdmin
      .from('employee_ids')
      .select('*')
      .eq('employee_id', employeeId.toUpperCase())
      .single();

    if (employeeIdError || !employeeIdRecord) {
      return NextResponse.json(
        { error: 'Invalid employee ID. Please contact your administrator.' },
        { status: 400 }
      );
    }

    // Check if employee ID is already used
    if (employeeIdRecord.status === 'used') {
      return NextResponse.json(
        { error: 'This employee ID has already been used' },
        { status: 400 }
      );
    }

    // Check if employee ID is revoked
    if (employeeIdRecord.status === 'revoked') {
      return NextResponse.json(
        { error: 'This employee ID has been revoked. Please contact your administrator.' },
        { status: 400 }
      );
    }

    // VALIDATION 3: Email must match the employee ID's assigned email
    if (employeeIdRecord.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json(
        { error: 'This employee ID is not assigned to your email address' },
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

    // Create user
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        email: email.toLowerCase(),
        password_hash: passwordHash,
        name,
        role: 'staff',
        status: 'pending', // Requires admin approval
        email_verified: false,
      })
      .select()
      .single();

    if (userError) throw userError;

    // Create staff profile
    const { error: profileError } = await supabaseAdmin
      .from('staff_profiles')
      .insert({
        user_id: user.id,
        employee_id: employeeId,
        department,
        phone,
      });

    if (profileError) throw profileError;

    // Create signup request
    const { error: requestError } = await supabaseAdmin
      .from('signup_requests')
      .insert({
        user_id: user.id,
        status: 'pending',
      });

    if (requestError) throw requestError;

    // Mark employee ID as used
    const { error: employeeIdUpdateError } = await supabaseAdmin
      .from('employee_ids')
      .update({
        status: 'used',
        used_by: user.id,
        used_at: new Date().toISOString(),
      })
      .eq('employee_id', employeeId.toUpperCase());

    if (employeeIdUpdateError) {
      console.error('Failed to mark employee ID as used:', employeeIdUpdateError);
      // Don't fail the signup if this update fails
    }

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24-hour expiry

    const { error: tokenError } = await supabaseAdmin
      .from('verification_tokens')
      .insert({
        user_id: user.id,
        token: verificationToken,
        type: 'email_verification',
        expires_at: expiresAt.toISOString(),
      });

    if (tokenError) throw tokenError;

    // Send welcome email with verification link
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`;

    try {
      await sendEmailSMTP({
        to: user.email,
        subject: 'Welcome to SASA Worldwide - Verify Your Email',
        template: WelcomeEmail({
          name: user.name,
          verificationUrl,
        }),
      });

      // Send notification to admin
      const adminEmail = process.env.ADMIN_EMAIL || 'it@sasa-worldwide.com';
      await sendEmailSMTP({
        to: adminEmail,
        subject: 'New Staff Signup - Pending Approval',
        template: NewSignupNotification({
          name: user.name,
          email: user.email,
          role: 'Staff',
          department,
          employeeId,
          reviewUrl: `${process.env.NEXT_PUBLIC_APP_URL}/admin/signups`,
        }),
      });
    } catch (emailError) {
      console.error('Failed to send emails:', emailError);
      // Don't fail the signup if email fails
    }

    // Log the signup
    await supabaseAdmin.from('audit_logs').insert({
      user_id: user.id,
      action: 'signup',
      details: { role: 'staff', department, employeeId },
    });

    return NextResponse.json({
      success: true,
      message: 'Signup successful! Please check your email to verify your account.',
      userId: user.id,
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error.message || 'Signup failed' },
      { status: 500 }
    );
  }
}
