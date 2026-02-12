import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

const VALID_DEPARTMENTS = [
  'sales', 'marketing', 'operations', 'field-operations', 'customer-service',
  'business-development', 'finance', 'human-resources', 'it-technology',
  'management', 'admin',
];

// GET - Fetch single user with all details
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { id } = params;

    // Fetch user with profile joins - try full query first, fallback to basic
    let normalized: any = null;

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select(`
        *,
        staff_profiles(id, employee_id, department, phone),
        affiliate_profiles(id, referral_code, phone)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('[User Detail] Join query failed, trying basic:', error.message);
      // Fallback: fetch user without joins
      const { data: basicUser, error: basicError } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (basicError || !basicUser) {
        return NextResponse.json(
          { error: `User not found: ${(basicError || error).message}` },
          { status: 404 }
        );
      }

      normalized = { ...basicUser, staff_profiles: [], affiliate_profiles: [] };
    } else if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    } else {
      // Normalize profiles to arrays (Supabase returns objects for 1-to-1 joins)
      normalized = {
        ...user,
        staff_profiles: user.staff_profiles
          ? Array.isArray(user.staff_profiles) ? user.staff_profiles : [user.staff_profiles]
          : [],
        affiliate_profiles: user.affiliate_profiles
          ? Array.isArray(user.affiliate_profiles) ? user.affiliate_profiles : [user.affiliate_profiles]
          : [],
      };
    }

    // Fetch related data: audit logs and sales transactions
    const [auditResult, salesResult] = await Promise.all([
      supabaseAdmin
        .from('audit_logs')
        .select('id, action, metadata, created_at')
        .eq('user_id', id)
        .order('created_at', { ascending: false })
        .limit(20),
      supabaseAdmin
        .from('sales_transactions')
        .select('id, amount, commission_amount, payment_status, fulfillment_status, created_at, projects(name), customers(name, email)')
        .eq('salesperson_id', id)
        .order('created_at', { ascending: false })
        .limit(20),
    ]);

    return NextResponse.json({
      user: normalized,
      audit_logs: auditResult.data || [],
      sales_transactions: salesResult.data || [],
    });
  } catch (error: any) {
    console.error('Failed to fetch user:', error);
    return NextResponse.json(
      { error: `Failed to fetch user: ${error.message}` },
      { status: 500 }
    );
  }
}

// PUT - Update user fields
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { id } = params;
    const body = await request.json();
    const { name, email, role, status, department, phone } = body;

    // Fetch current user
    const { data: currentUser, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('id, name, email, role, status')
      .eq('id', id)
      .single();

    if (fetchError || !currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent self-demotion
    if (id === session.user.id && role && role !== 'admin') {
      return NextResponse.json(
        { error: 'You cannot change your own admin role' },
        { status: 400 }
      );
    }

    // Build user update data
    const userUpdate: Record<string, any> = {};
    if (name !== undefined && name !== currentUser.name) userUpdate.name = name;
    if (email !== undefined && email !== currentUser.email) userUpdate.email = email;
    if (role !== undefined && role !== currentUser.role) {
      const validRoles = ['staff', 'affiliate', 'admin'];
      if (!validRoles.includes(role)) {
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
      }
      userUpdate.role = role;
    }
    if (status !== undefined && status !== currentUser.status) {
      const validStatuses = ['pending', 'active', 'suspended', 'rejected'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      userUpdate.status = status;
    }

    // Update users table if there are changes
    if (Object.keys(userUpdate).length > 0) {
      const { error: updateError } = await supabaseAdmin
        .from('users')
        .update(userUpdate)
        .eq('id', id);

      if (updateError) {
        console.error('Update user error:', updateError);
        return NextResponse.json(
          { error: `Failed to update user: ${updateError.message}` },
          { status: 500 }
        );
      }
    }

    // Handle department update - works for any user role
    if (department !== undefined) {
      if (department && !VALID_DEPARTMENTS.includes(department)) {
        return NextResponse.json(
          { error: `Invalid department. Must be one of: ${VALID_DEPARTMENTS.join(', ')}` },
          { status: 400 }
        );
      }

      // Check if staff profile exists
      const { data: existingProfile } = await supabaseAdmin
        .from('staff_profiles')
        .select('id, department')
        .eq('user_id', id)
        .single();

      if (existingProfile) {
        // Update existing profile
        const { error: deptError } = await supabaseAdmin
          .from('staff_profiles')
          .update({ department, ...(phone !== undefined ? { phone } : {}) })
          .eq('user_id', id);

        if (deptError) {
          console.error('Update department error:', deptError);
          return NextResponse.json(
            { error: `Failed to update department: ${deptError.message}` },
            { status: 500 }
          );
        }
      } else if (department) {
        // Create staff profile for this user
        const employeeId = `EMP-${Date.now().toString(36).toUpperCase()}`;
        const { error: createError } = await supabaseAdmin
          .from('staff_profiles')
          .insert({
            user_id: id,
            employee_id: employeeId,
            department,
            phone: phone || null,
          });

        if (createError) {
          console.error('Create staff profile error:', createError);
          return NextResponse.json(
            { error: `Failed to create staff profile: ${createError.message}` },
            { status: 500 }
          );
        }
      }
    } else if (phone !== undefined) {
      // Update phone on existing profile if only phone changed
      const { data: existingProfile } = await supabaseAdmin
        .from('staff_profiles')
        .select('id')
        .eq('user_id', id)
        .single();

      if (existingProfile) {
        await supabaseAdmin
          .from('staff_profiles')
          .update({ phone })
          .eq('user_id', id);
      }
    }

    // Audit log
    const changes: Record<string, any> = {};
    if (userUpdate.name) changes.name = { from: currentUser.name, to: name };
    if (userUpdate.email) changes.email = { from: currentUser.email, to: email };
    if (userUpdate.role) changes.role = { from: currentUser.role, to: role };
    if (userUpdate.status) changes.status = { from: currentUser.status, to: status };
    if (department !== undefined) changes.department = department;
    if (phone !== undefined) changes.phone = phone;

    if (Object.keys(changes).length > 0) {
      await supabaseAdmin.from('audit_logs').insert({
        user_id: session.user.id,
        action: 'user_updated',
        metadata: {
          target_user_id: id,
          target_user_name: name || currentUser.name,
          changes,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
    });
  } catch (error: any) {
    console.error('Failed to update user:', error);
    return NextResponse.json(
      { error: `Failed to update user: ${error.message}` },
      { status: 500 }
    );
  }
}

// DELETE - Delete user
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

    // Check if user exists and is not admin
    const { data: user, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', id)
      .single();

    if (fetchError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.role === 'admin') {
      return NextResponse.json(
        { error: 'Cannot delete admin users' },
        { status: 400 }
      );
    }

    // Delete user (cascades will handle related records)
    const { error: deleteError } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    // Log audit
    await supabaseAdmin.from('audit_logs').insert({
      user_id: session.user.id,
      action: 'user_deleted',
      metadata: { deleted_user_id: id },
    });

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    console.error('Failed to delete user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
