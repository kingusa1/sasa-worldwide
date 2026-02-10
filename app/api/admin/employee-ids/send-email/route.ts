import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { supabaseAdmin } from '@/lib/supabase/server';
import { sendEmailSMTP } from '@/lib/email/smtp-client';
import { EmployeeIdEmail } from '@/emails/EmployeeIdEmail';

// POST - Send employee ID email
export async function POST(request: Request) {
  const session = await auth();

  // Check if user is admin
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { employeeIdRecordId } = body;

    if (!employeeIdRecordId) {
      return NextResponse.json(
        { error: 'Employee ID record ID is required' },
        { status: 400 }
      );
    }

    // Get employee ID details
    const { data: employeeId, error: fetchError } = await supabaseAdmin
      .from('employee_ids')
      .select('*')
      .eq('id', employeeIdRecordId)
      .single();

    if (fetchError || !employeeId) {
      return NextResponse.json({ error: 'Employee ID not found' }, { status: 404 });
    }

    // Check if revoked
    if (employeeId.status === 'revoked') {
      return NextResponse.json(
        { error: 'Cannot send email: This employee ID has been revoked' },
        { status: 400 }
      );
    }

    // Send email
    await sendEmailSMTP({
      to: employeeId.email,
      subject: 'Your SASA Worldwide Employee ID',
      template: EmployeeIdEmail({
        employeeId: employeeId.employee_id,
        signupUrl: `${process.env.NEXT_PUBLIC_APP_URL}/signup/staff`,
      }),
    });

    // Log audit
    await supabaseAdmin.from('audit_logs').insert({
      user_id: session.user.id,
      action: 'employee_id_email_sent',
      metadata: { employee_id: employeeId.employee_id, email: employeeId.email },
    });

    return NextResponse.json({
      success: true,
      message: 'Employee ID email sent successfully',
    });
  } catch (error: any) {
    console.error('Failed to send employee ID email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
