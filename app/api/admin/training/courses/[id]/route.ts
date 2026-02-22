import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (session.user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    const { data: course, error } = await supabaseAdmin.from('courses').select('*').eq('id', id).single();
    if (error) return NextResponse.json({ error: 'Course not found' }, { status: 404 });

    const { data: modules } = await supabaseAdmin.from('course_modules').select('*').eq('course_id', id).order('order_index');
    const moduleIds = (modules || []).map((m: any) => m.id);

    let lessons: any[] = [];
    if (moduleIds.length > 0) {
      const { data: lessonsData } = await supabaseAdmin.from('course_lessons').select('*').in('module_id', moduleIds).order('order_index');
      lessons = lessonsData || [];
    }

    const modulesWithLessons = (modules || []).map((mod: any) => ({
      ...mod,
      lessons: lessons.filter((l: any) => l.module_id === mod.id),
    }));

    const { count: assignmentCount } = await supabaseAdmin.from('course_assignments').select('*', { count: 'exact', head: true }).eq('course_id', id);

    return NextResponse.json({ course: { ...course, modules: modulesWithLessons, assignment_count: assignmentCount || 0 } });
  } catch (error: any) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (session.user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    const body = await req.json();
    const { title, description, thumbnail_url, status } = body;

    const updateData: any = { updated_at: new Date().toISOString() };
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (thumbnail_url !== undefined) updateData.thumbnail_url = thumbnail_url;
    if (status !== undefined) updateData.status = status;

    const { data, error } = await supabaseAdmin.from('courses').update(updateData).eq('id', id).select().single();
    if (error) return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });

    return NextResponse.json({ course: data });
  } catch (error: any) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (session.user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    const { error } = await supabaseAdmin.from('courses').delete().eq('id', id);
    if (error) return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });

    await supabaseAdmin.from('audit_logs').insert({
      user_id: session.user.id, action: 'course_deleted',
      metadata: { course_id: id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
