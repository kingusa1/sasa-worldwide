import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { supabaseAdmin } from '@/lib/supabase/server';
import { sendEmailSMTP } from '@/lib/email/smtp-client';
import { EmployeeIdEmail } from '@/emails/EmployeeIdEmail';

// GET - List all employee IDs
export async function GET(request: Request) {
  const session = await auth();

  // Check if user is admin
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('employee_ids')
      .select(`
        *,
        created_by_user:users!employee_ids_created_by_fkey(name, email),
        used_by_user:users!employee_ids_used_by_fkey(name, email)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ employeeIds: data });
  } catch (error: any) {
    console.error('Failed to fetch employee IDs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employee IDs' },
      { status: 500 }
    );
  }
}

// POST - Create new employee ID
export async function POST(request: Request) {
  const session = await auth();

  // Check if user is admin
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { employeeId, email, notes, sendEmail } = body;

    // Validate required fields
    if (!employeeId || !email) {
      return NextResponse.json(
        { error: 'Employee ID and email are required' },
        { status: 400 }
      );
    }

    // Validate employee ID format (EMP-##### or SASA-#####)
    const idRegex = /^[A-Z]{2,6}-\d{4,6}$/;
    if (!idRegex.test(employeeId.toUpperCase())) {
      return NextResponse.json(
        { error: 'Invalid employee ID format. Use: EMP-12345 or SASA-12345' },
        { status: 400 }
      );
    }

    // Check if employee ID already exists
    const { data: existing } = await supabaseAdmin
      .from('employee_ids')
      .select('id')
      .eq('employee_id', employeeId.toUpperCase())
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'This employee ID already exists' },
        { status: 400 }
      );
    }

    // Create employee ID record
    const { data: newEmployeeId, error: createError } = await supabaseAdmin
      .from('employee_ids')
      .insert({
        employee_id: employeeId.toUpperCase(),
        email: email.toLowerCase(),
        status: 'unused',
        created_by: session.user.id,
        notes: notes || null,
      })
      .select()
      .single();

    if (createError) throw createError;

    // Send email if requested
    if (sendEmail) {
      try {
        await sendEmailSMTP({
          to: email,
          subject: 'Your SASA Worldwide Employee ID',
          template: EmployeeIdEmail({
            employeeId: employeeId.toUpperCase(),
            signupUrl: `${process.env.NEXT_PUBLIC_APP_URL}/signup/staff`,
          }),
        });
      } catch (emailError) {
        console.error('Failed to send employee ID email:', emailError);
        // Don't fail the whole operation if email fails
      }
    }

    // Log audit
    await supabaseAdmin.from('audit_logs').insert({
      user_id: session.user.id,
      action: 'employee_id_created',
      metadata: { employee_id: employeeId.toUpperCase(), email, sent_email: sendEmail },
    });

    return NextResponse.json({
      success: true,
      employeeId: newEmployeeId,
      message: sendEmail ? 'Employee ID created and email sent' : 'Employee ID created',
    });
  } catch (error: any) {
    console.error('Failed to create employee ID:', error);
    return NextResponse.json(
      { error: 'Failed to create employee ID' },
      { status: 500 }
    );
  }
}
