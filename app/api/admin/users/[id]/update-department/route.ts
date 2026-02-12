/**
 * Update User Department API
 * Admin can change department for any user
 */

import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

const VALID_DEPARTMENTS = [
  'sales',
  'marketing',
  'operations',
  'field-operations',
  'customer-service',
  'business-development',
  'finance',
  'human-resources',
  'it-technology',
  'management',
  'admin',
];

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can change departments
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { department } = body;

    // Validate department
    if (!department || !VALID_DEPARTMENTS.includes(department)) {
      return NextResponse.json(
        {
          error: `Invalid department. Must be one of: ${VALID_DEPARTMENTS.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Get user details
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, name, email, role')
      .eq('id', params.id)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if staff profile exists
    const { data: profile } = await supabaseAdmin
      .from('staff_profiles')
      .select('id, department')
      .eq('user_id', params.id)
      .single();

    const oldDepartment = profile?.department || null;

    if (profile) {
      // Update existing staff profile
      const { error: updateError } = await supabaseAdmin
        .from('staff_profiles')
        .update({ department })
        .eq('user_id', params.id);

      if (updateError) {
        console.error('Update department error:', updateError);
        return NextResponse.json(
          { error: `Failed to update department: ${updateError.message}` },
          { status: 500 }
        );
      }
    } else {
      // Create staff profile for this user (works for any role)
      const employeeId = `EMP-${Date.now().toString(36).toUpperCase()}`;
      const { error: createError } = await supabaseAdmin
        .from('staff_profiles')
        .insert({
          user_id: params.id,
          employee_id: employeeId,
          department,
        });

      if (createError) {
        console.error('Create staff profile error:', createError);
        return NextResponse.json(
          { error: `Failed to create department profile: ${createError.message}` },
          { status: 500 }
        );
      }
    }

    // Log to audit trail
    await supabaseAdmin.from('audit_logs').insert({
      user_id: session.user.id,
      action: 'user_department_changed',
      metadata: {
        target_user_id: params.id,
        target_user_name: user.name,
        old_department: oldDepartment,
        new_department: department,
      },
    });

    console.log(
      `Changed department for ${user.name}: ${oldDepartment || 'none'} → ${department}`
    );

    return NextResponse.json({
      success: true,
      message: 'Department updated successfully',
    });
  } catch (error: any) {
    console.error('Update department error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
