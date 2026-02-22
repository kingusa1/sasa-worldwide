import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (session.user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id: courseId } = await params;
    const body = await req.json();
    const { module_id, title, content_type, content, video_url, duration_minutes } = body;

    if (!module_id) return NextResponse.json({ error: 'module_id is required' }, { status: 400 });
    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

    // Verify module belongs to this course
    const { data: module, error: moduleError } = await supabaseAdmin
      .from('course_modules')
      .select('id')
      .eq('id', module_id)
      .eq('course_id', courseId)
      .single();

    if (moduleError || !module) return NextResponse.json({ error: 'Module not found in this course' }, { status: 404 });

    // Get max order_index for this module
    const { data: existingLessons } = await supabaseAdmin
      .from('course_lessons')
      .select('order_index')
      .eq('module_id', module_id)
      .order('order_index', { ascending: false })
      .limit(1);

    const nextOrderIndex = existingLessons && existingLessons.length > 0
      ? (existingLessons[0].order_index || 0) + 1
      : 0;

    const { data, error } = await supabaseAdmin
      .from('course_lessons')
      .insert({
        module_id,
        title,
        content_type: content_type || 'text',
        content: content || null,
        video_url: video_url || null,
        duration_minutes: duration_minutes || null,
        order_index: nextOrderIndex,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: 'Failed to create lesson' }, { status: 500 });

    return NextResponse.json({ lesson: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (session.user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id: courseId } = await params;
    const body = await req.json();
    const { id: lessonId, title, content_type, content, video_url, duration_minutes } = body;

    if (!lessonId) return NextResponse.json({ error: 'Lesson id is required' }, { status: 400 });

    // Verify lesson belongs to a module in this course
    const { data: lesson, error: lessonError } = await supabaseAdmin
      .from('course_lessons')
      .select('id, module_id')
      .eq('id', lessonId)
      .single();

    if (lessonError || !lesson) return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });

    const { data: module } = await supabaseAdmin
      .from('course_modules')
      .select('id')
      .eq('id', lesson.module_id)
      .eq('course_id', courseId)
      .single();

    if (!module) return NextResponse.json({ error: 'Lesson does not belong to this course' }, { status: 404 });

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (content_type !== undefined) updateData.content_type = content_type;
    if (content !== undefined) updateData.content = content;
    if (video_url !== undefined) updateData.video_url = video_url;
    if (duration_minutes !== undefined) updateData.duration_minutes = duration_minutes;

    const { data, error } = await supabaseAdmin
      .from('course_lessons')
      .update(updateData)
      .eq('id', lessonId)
      .select()
      .single();

    if (error) return NextResponse.json({ error: 'Failed to update lesson' }, { status: 500 });

    return NextResponse.json({ lesson: data });
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
    const lessonId = req.nextUrl.searchParams.get('lesson_id');

    if (!lessonId) return NextResponse.json({ error: 'lesson_id query parameter is required' }, { status: 400 });

    // Verify lesson belongs to a module in this course
    const { data: lesson } = await supabaseAdmin
      .from('course_lessons')
      .select('id, module_id')
      .eq('id', lessonId)
      .single();

    if (!lesson) return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });

    const { data: module } = await supabaseAdmin
      .from('course_modules')
      .select('id')
      .eq('id', lesson.module_id)
      .eq('course_id', courseId)
      .single();

    if (!module) return NextResponse.json({ error: 'Lesson does not belong to this course' }, { status: 404 });

    const { error } = await supabaseAdmin
      .from('course_lessons')
      .delete()
      .eq('id', lessonId);

    if (error) return NextResponse.json({ error: 'Failed to delete lesson' }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
