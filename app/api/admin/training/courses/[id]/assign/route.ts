import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (session.user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id: courseId } = await params;

    const { data: assignments, error } = await supabaseAdmin
      .from('course_assignments')
      .select('*')
      .eq('course_id', courseId)
      .order('assigned_at', { ascending: false });

    if (error) return NextResponse.json({ error: 'Failed to fetch assignments' }, { status: 500 });

    // Join with users table to get name and email
    const userIds = (assignments || []).map((a: any) => a.user_id);
    let users: any[] = [];
    if (userIds.length > 0) {
      const { data: usersData } = await supabaseAdmin
        .from('users')
        .select('id, name, email')
        .in('id', userIds);
      users = usersData || [];
    }

    const assignmentsWithUsers = (assignments || []).map((assignment: any) => {
      const user = users.find((u: any) => u.id === assignment.user_id);
      return {
        ...assignment,
        user: user || null,
      };
    });

    return NextResponse.json({ assignments: assignmentsWithUsers });
  } catch (error: any) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (session.user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id: courseId } = await params;
    const body = await req.json();
    const { user_ids, due_date } = body;

    if (!user_ids || !Array.isArray(user_ids) || user_ids.length === 0) {
      return NextResponse.json({ error: 'user_ids array is required' }, { status: 400 });
    }

    // Verify course exists
    const { data: course, error: courseError } = await supabaseAdmin
      .from('courses')
      .select('id')
      .eq('id', courseId)
      .single();

    if (courseError || !course) return NextResponse.json({ error: 'Course not found' }, { status: 404 });

    const assignmentRows = user_ids.map((userId: string) => ({
      course_id: courseId,
      user_id: userId,
      assigned_by: session.user.id,
      due_date: due_date || null,
      assigned_at: new Date().toISOString(),
    }));

    const { data, error } = await supabaseAdmin
      .from('course_assignments')
      .upsert(assignmentRows, { onConflict: 'course_id,user_id', ignoreDuplicates: true })
      .select();

    if (error) return NextResponse.json({ error: 'Failed to assign users' }, { status: 500 });

    await supabaseAdmin.from('audit_logs').insert({
      user_id: session.user.id,
      action: 'course_assigned',
      metadata: { course_id: courseId, user_ids, due_date: due_date || null },
    });

    return NextResponse.json({ assignments: data || [] }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (session.user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id: courseId } = await params;
    const body = await req.json();
    const { user_id } = body;

    if (!user_id) return NextResponse.json({ error: 'user_id is required' }, { status: 400 });

    const { error } = await supabaseAdmin
      .from('course_assignments')
      .delete()
      .eq('course_id', courseId)
      .eq('user_id', user_id);

    if (error) return NextResponse.json({ error: 'Failed to remove assignment' }, { status: 500 });

    await supabaseAdmin.from('audit_logs').insert({
      user_id: session.user.id,
      action: 'course_unassigned',
      metadata: { course_id: courseId, unassigned_user_id: user_id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
