import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (session.user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const status = req.nextUrl.searchParams.get('status');
    let query = supabaseAdmin.from('courses').select('*').order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });

    // Get counts for each course
    const coursesWithCounts = await Promise.all((data || []).map(async (course: any) => {
      const { count: moduleCount } = await supabaseAdmin.from('course_modules').select('*', { count: 'exact', head: true }).eq('course_id', course.id);
      const { count: assignmentCount } = await supabaseAdmin.from('course_assignments').select('*', { count: 'exact', head: true }).eq('course_id', course.id);
      return { ...course, module_count: moduleCount || 0, assignment_count: assignmentCount || 0 };
    }));

    return NextResponse.json({ courses: coursesWithCounts });
  } catch (error: any) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (session.user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const { title, description, thumbnail_url, status } = body;
    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

    const { data, error } = await supabaseAdmin.from('courses').insert({
      title, description: description || null, thumbnail_url: thumbnail_url || null,
      status: status || 'draft', created_by: session.user.id,
    }).select().single();

    if (error) return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });

    await supabaseAdmin.from('audit_logs').insert({
      user_id: session.user.id, action: 'course_created',
      metadata: { course_id: data.id, course_title: title },
    });

    return NextResponse.json({ course: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
