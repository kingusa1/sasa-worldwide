import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { supabaseAdmin } from '@/lib/supabase/server';

// POST - Suspend user
export async function POST(
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

    // Check if user exists
    const { data: user, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.role === 'admin') {
      return NextResponse.json(
        { error: 'Cannot suspend admin users' },
        { status: 400 }
      );
    }

    // Update status to suspended
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ status: 'suspended' })
      .eq('id', id);

    if (updateError) throw updateError;

    // Log audit
    await supabaseAdmin.from('audit_logs').insert({
      user_id: session.user.id,
      action: 'user_suspended',
      metadata: { suspended_user_id: id, user_email: user.email },
    });

    return NextResponse.json({
      success: true,
      message: 'User suspended successfully',
    });
  } catch (error: any) {
    console.error('Failed to suspend user:', error);
    return NextResponse.json(
      { error: 'Failed to suspend user' },
      { status: 500 }
    );
  }
}
