import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = session.user.id;
    const { courseId } = await params;

    // Verify user is assigned to this course
    const { data: assignment } = await supabaseAdmin
      .from('course_assignments')
      .select('id')
      .eq('course_id', courseId)
      .eq('user_id', userId)
      .single();

    if (!assignment) return NextResponse.json({ error: 'You are not assigned to this course' }, { status: 403 });

    // Get course info
    const { data: course, error: courseError } = await supabaseAdmin
      .from('courses')
      .select('id, title, description, thumbnail_url')
      .eq('id', courseId)
      .single();

    if (courseError || !course) return NextResponse.json({ error: 'Course not found' }, { status: 404 });

    // Get modules with lessons
    const { data: modules } = await supabaseAdmin
      .from('course_modules')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index');

    const moduleIds = (modules || []).map((m: any) => m.id);

    let lessons: any[] = [];
    if (moduleIds.length > 0) {
      const { data: lessonsData } = await supabaseAdmin
        .from('course_lessons')
        .select('*')
        .in('module_id', moduleIds)
        .order('order_index');
      lessons = lessonsData || [];
    }

    // Get user's progress for all lessons in this course
    const lessonIds = lessons.map((l: any) => l.id);
    let progressRecords: any[] = [];
    if (lessonIds.length > 0) {
      const { data: progressData } = await supabaseAdmin
        .from('course_progress')
        .select('*')
        .eq('user_id', userId)
        .in('lesson_id', lessonIds);
      progressRecords = progressData || [];
    }

    // Build response grouped by module
    const modulesWithProgress = (modules || []).map((mod: any) => {
      const moduleLessons = lessons.filter((l: any) => l.module_id === mod.id);
      const lessonsWithProgress = moduleLessons.map((lesson: any) => {
        const progress = progressRecords.find((p: any) => p.lesson_id === lesson.id);
        return {
          ...lesson,
          completed: progress?.completed || false,
          completed_at: progress?.completed_at || null,
        };
      });

      const completedCount = lessonsWithProgress.filter((l: any) => l.completed).length;

      return {
        ...mod,
        lessons: lessonsWithProgress,
        completed_lessons: completedCount,
        total_lessons: lessonsWithProgress.length,
      };
    });

    const totalLessons = lessons.length;
    const totalCompleted = progressRecords.filter((p: any) => p.completed).length;
    const percentage = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

    return NextResponse.json({
      course,
      modules: modulesWithProgress,
      progress: {
        total_lessons: totalLessons,
        completed_lessons: totalCompleted,
        percentage,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
