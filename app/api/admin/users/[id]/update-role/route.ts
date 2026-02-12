/**
 * Update User Role API
 * Admin can change user roles
 */

import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can change roles
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { role } = body;

    // Validate role
    const validRoles = ['staff', 'affiliate', 'admin'];
    if (!role || !validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be: staff, affiliate, or admin' },
        { status: 400 }
      );
    }

    // Prevent self-demotion from admin
    if (params.id === session.user.id && role !== 'admin') {
      return NextResponse.json(
        { error: 'You cannot change your own admin role' },
        { status: 400 }
      );
    }

    // Get user details before update
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, name, email, role')
      .eq('id', params.id)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update role
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ role })
      .eq('id', params.id);

    if (updateError) {
      console.error('Update role error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update role' },
        { status: 500 }
      );
    }

    // Log to audit trail
    await supabaseAdmin.from('audit_logs').insert({
      user_id: session.user.id,
      action: 'user_role_changed',
      metadata: {
        target_user_id: params.id,
        target_user_name: user.name,
        old_role: user.role,
        new_role: role,
      },
    });

    console.log(`✅ Changed role for ${user.name}: ${user.role} → ${role}`);

    return NextResponse.json({
      success: true,
      message: 'Role updated successfully',
    });
  } catch (error: any) {
    console.error('Update role error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
