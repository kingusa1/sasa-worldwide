import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = session.user.id;
    const body = await req.json();
    const { lesson_id, completed } = body;

    if (!lesson_id) return NextResponse.json({ error: 'lesson_id is required' }, { status: 400 });
    if (typeof completed !== 'boolean') return NextResponse.json({ error: 'completed must be a boolean' }, { status: 400 });

    // Verify lesson exists
    const { data: lesson, error: lessonError } = await supabaseAdmin
      .from('course_lessons')
      .select('id, module_id')
      .eq('id', lesson_id)
      .single();

    if (lessonError || !lesson) return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });

    // Verify user is assigned to the course that contains this lesson
    const { data: module } = await supabaseAdmin
      .from('course_modules')
      .select('course_id')
      .eq('id', lesson.module_id)
      .single();

    if (!module) return NextResponse.json({ error: 'Module not found' }, { status: 404 });

    const { data: assignment } = await supabaseAdmin
      .from('course_assignments')
      .select('id')
      .eq('course_id', module.course_id)
      .eq('user_id', userId)
      .single();

    if (!assignment) return NextResponse.json({ error: 'You are not assigned to this course' }, { status: 403 });

    // Upsert progress
    const progressData: any = {
      user_id: userId,
      lesson_id,
      completed,
      completed_at: completed ? new Date().toISOString() : null,
    };

    const { data, error } = await supabaseAdmin
      .from('course_progress')
      .upsert(progressData, { onConflict: 'user_id,lesson_id' })
      .select()
      .single();

    if (error) return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });

    return NextResponse.json({ progress: data });
  } catch (error: any) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
