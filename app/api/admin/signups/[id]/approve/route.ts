import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { supabaseAdmin } from '@/lib/supabase/server';
import { sendEmailSMTP } from '@/lib/email/smtp-client';
import { AccountApprovedEmail } from '@/emails/AccountApprovedEmail';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { approvalNotes } = await request.json();
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
        status: 'approved',
        approved_by: session.user.id,
        approval_notes: approvalNotes,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', requestId);

    // Update user status to active
    await supabaseAdmin
      .from('users')
      .update({ status: 'active' })
      .eq('id', signupRequest.user_id);

    // Send approval email
    try {
      await sendEmailSMTP({
        to: signupRequest.user.email,
        subject: 'Your SASA Account Has Been Approved!',
        template: AccountApprovedEmail({
          name: signupRequest.user.name,
          loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
        }),
      });
    } catch (emailError) {
      console.error('Failed to send approval email:', emailError);
    }

    // Log the approval
    await supabaseAdmin.from('audit_logs').insert({
      user_id: session.user.id,
      action: 'approve_signup',
      details: { approved_user_id: signupRequest.user_id, notes: approvalNotes },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Approval error:', error);
    return NextResponse.json({ error: 'Approval failed' }, { status: 500 });
  }
}
