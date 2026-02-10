import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { supabaseAdmin } from '@/lib/supabase/server';
import { sendEmailSMTP } from '@/lib/email/smtp-client';
import { AccountRejectedEmail } from '@/emails/AccountRejectedEmail';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { reason } = await request.json();
    const requestId = params.id;

    // Get the signup request
    const { data: signupRequest, error: requestError } = await supabaseAdmin
      .from('signup_requests')
      .select('*, user:users(*)')
      .eq('id', requestId)
      .single();

    if (requestError || !signupRequest) {
      return NextResponse.json({ error: 'Signup request not found' }, { status: 404 });
    }

    // Update signup request
    await supabaseAdmin
      .from('signup_requests')
      .update({
        status: 'rejected',
        approved_by: session.user.id,
        approval_notes: reason,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', requestId);

    // Update user status to rejected
    await supabaseAdmin
      .from('users')
      .update({ status: 'rejected' })
      .eq('id', signupRequest.user_id);

    // Send rejection email
    try {
      await sendEmailSMTP({
        to: signupRequest.user.email,
        subject: 'Update on Your SASA Account Application',
        template: AccountRejectedEmail({
          name: signupRequest.user.name,
          reason: reason || undefined,
          contactEmail: process.env.ADMIN_EMAIL || 'it@sasa-worldwide.com',
        }),
      });
    } catch (emailError) {
      console.error('Failed to send rejection email:', emailError);
    }

    // Log the rejection
    await supabaseAdmin.from('audit_logs').insert({
      user_id: session.user.id,
      action: 'reject_signup',
      details: { rejected_user_id: signupRequest.user_id, reason },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Rejection error:', error);
    return NextResponse.json({ error: 'Rejection failed' }, { status: 500 });
  }
}
