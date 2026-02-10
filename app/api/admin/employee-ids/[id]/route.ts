import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { supabaseAdmin } from '@/lib/supabase/server';

// DELETE - Revoke employee ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  // Check if user is admin
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { id } = params;

    // Get employee ID details
    const { data: employeeId, error: fetchError } = await supabaseAdmin
      .from('employee_ids')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !employeeId) {
      return NextResponse.json({ error: 'Employee ID not found' }, { status: 404 });
    }

    // Check if already used
    if (employeeId.status === 'used') {
      return NextResponse.json(
        { error: 'Cannot revoke: This employee ID has already been used' },
        { status: 400 }
      );
    }

    // Update status to revoked
    const { error: updateError } = await supabaseAdmin
      .from('employee_ids')
      .update({ status: 'revoked' })
      .eq('id', id);

    if (updateError) throw updateError;

    // Log audit
    await supabaseAdmin.from('audit_logs').insert({
      user_id: session.user.id,
      action: 'employee_id_revoked',
      metadata: { employee_id: employeeId.employee_id, email: employeeId.email },
    });

    return NextResponse.json({
      success: true,
      message: 'Employee ID revoked successfully',
    });
  } catch (error: any) {
    console.error('Failed to revoke employee ID:', error);
    return NextResponse.json(
      { error: 'Failed to revoke employee ID' },
      { status: 500 }
    );
  }
}
