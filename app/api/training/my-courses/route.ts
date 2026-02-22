import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = session.user.id;

    // Get all course assignments for the current user
    const { data: assignments, error: assignError } = await supabaseAdmin
      .from('course_assignments')
      .select('*')
      .eq('user_id', userId)
      .order('assigned_at', { ascending: false });

    if (assignError) return NextResponse.json({ error: 'Failed to fetch assignments' }, { status: 500 });

    if (!assignments || assignments.length === 0) {
      return NextResponse.json({ courses: [] });
    }

    const courseIds = assignments.map((a: any) => a.course_id);

    // Fetch courses
    const { data: courses } = await supabaseAdmin
      .from('courses')
      .select('*')
      .in('id', courseIds);

    // For each course, calculate progress
    const coursesWithProgress = await Promise.all(assignments.map(async (assignment: any) => {
      const course = (courses || []).find((c: any) => c.id === assignment.course_id);
      if (!course) return null;

      // Get all modules for this course
      const { data: modules } = await supabaseAdmin
        .from('course_modules')
        .select('id')
        .eq('course_id', course.id);

      const moduleIds = (modules || []).map((m: any) => m.id);

      let totalLessons = 0;
      let completedLessons = 0;

      if (moduleIds.length > 0) {
        // Count total lessons
        const { count: lessonCount } = await supabaseAdmin
          .from('course_lessons')
          .select('*', { count: 'exact', head: true })
          .in('module_id', moduleIds);

        totalLessons = lessonCount || 0;

        // Count completed lessons for this user
        if (totalLessons > 0) {
          const { data: lessonIds } = await supabaseAdmin
            .from('course_lessons')
            .select('id')
            .in('module_id', moduleIds);

          const allLessonIds = (lessonIds || []).map((l: any) => l.id);

          if (allLessonIds.length > 0) {
            const { count: completedCount } = await supabaseAdmin
              .from('course_progress')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', userId)
              .in('lesson_id', allLessonIds)
              .eq('completed', true);

            completedLessons = completedCount || 0;
          }
        }
      }

      const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      return {
        assignment,
        course,
        progress: {
          total_lessons: totalLessons,
          completed_lessons: completedLessons,
          percentage,
        },
        due_date: assignment.due_date || null,
      };
    }));

    // Filter out nulls (courses that may have been deleted)
    const validCourses = coursesWithProgress.filter((c) => c !== null);

    return NextResponse.json({ courses: validCourses });
  } catch (error: any) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
