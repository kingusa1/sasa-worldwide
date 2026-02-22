import { supabaseAdmin } from './server';
import type { Course, CourseWithModules, CourseProgressSummary } from '@/types/training';

export async function getCourses(filters?: { status?: string }) {
  try {
    let query = supabaseAdmin.from('courses').select('*').order('created_at', { ascending: false });
    if (filters?.status) query = query.eq('status', filters.status);
    const { data, error } = await query;
    if (error) {
      console.error('Error fetching courses:', error);
      return { data: null, error };
    }
    return { data: data as Course[], error: null };
  } catch (error: any) {
    console.error('Unexpected error fetching courses:', error);
    return { data: null, error };
  }
}

export async function getCourseById(id: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      console.error('Error fetching course:', error);
      return { data: null, error };
    }
    return { data: data as Course, error: null };
  } catch (error: any) {
    console.error('Unexpected error fetching course:', error);
    return { data: null, error };
  }
}

export async function getCourseWithModules(id: string): Promise<{ data: CourseWithModules | null; error: any }> {
  try {
    const { data: course, error: courseError } = await supabaseAdmin
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();
    if (courseError) return { data: null, error: courseError };

    const { data: modules, error: modulesError } = await supabaseAdmin
      .from('course_modules')
      .select('*')
      .eq('course_id', id)
      .order('order_index', { ascending: true });
    if (modulesError) return { data: null, error: modulesError };

    const moduleIds = modules.map((m: any) => m.id);
    let lessons: any[] = [];
    if (moduleIds.length > 0) {
      const { data: lessonsData, error: lessonsError } = await supabaseAdmin
        .from('course_lessons')
        .select('*')
        .in('module_id', moduleIds)
        .order('order_index', { ascending: true });
      if (lessonsError) return { data: null, error: lessonsError };
      lessons = lessonsData || [];
    }

    const modulesWithLessons = modules.map((mod: any) => ({
      ...mod,
      lessons: lessons.filter((l: any) => l.module_id === mod.id),
    }));

    return {
      data: { ...course, modules: modulesWithLessons } as CourseWithModules,
      error: null,
    };
  } catch (error: any) {
    console.error('Unexpected error fetching course with modules:', error);
    return { data: null, error };
  }
}

export async function getAssignedCourses(userId: string) {
  try {
    const { data: assignments, error: assignError } = await supabaseAdmin
      .from('course_assignments')
      .select('*, course:courses(*)')
      .eq('user_id', userId)
      .order('assigned_at', { ascending: false });
    if (assignError) return { data: null, error: assignError };

    const result = [];
    for (const assignment of assignments || []) {
      const course = (assignment as any).course as Course;
      if (!course || course.status !== 'published') continue;

      const progress = await calculateCourseProgress(userId, course.id);
      result.push({
        ...assignment,
        course,
        progress,
      });
    }

    return { data: result, error: null };
  } catch (error: any) {
    console.error('Unexpected error fetching assigned courses:', error);
    return { data: null, error };
  }
}

export async function calculateCourseProgress(userId: string, courseId: string): Promise<CourseProgressSummary> {
  // Get all lessons for this course
  const { data: modules } = await supabaseAdmin
    .from('course_modules')
    .select('id')
    .eq('course_id', courseId);

  const moduleIds = (modules || []).map((m: any) => m.id);
  if (moduleIds.length === 0) {
    return { course_id: courseId, total_lessons: 0, completed_lessons: 0, percentage: 0 };
  }

  const { data: lessons } = await supabaseAdmin
    .from('course_lessons')
    .select('id')
    .in('module_id', moduleIds);

  const totalLessons = (lessons || []).length;
  if (totalLessons === 0) {
    return { course_id: courseId, total_lessons: 0, completed_lessons: 0, percentage: 0 };
  }

  const lessonIds = lessons!.map((l: any) => l.id);
  const { data: progress } = await supabaseAdmin
    .from('course_progress')
    .select('id')
    .eq('user_id', userId)
    .in('lesson_id', lessonIds)
    .eq('completed', true);

  const completedLessons = (progress || []).length;
  return {
    course_id: courseId,
    total_lessons: totalLessons,
    completed_lessons: completedLessons,
    percentage: Math.round((completedLessons / totalLessons) * 100),
  };
}

export async function getCourseAssignmentCount(courseId: string): Promise<number> {
  const { count } = await supabaseAdmin
    .from('course_assignments')
    .select('*', { count: 'exact', head: true })
    .eq('course_id', courseId);
  return count || 0;
}

export async function getCourseModuleCount(courseId: string): Promise<number> {
  const { count } = await supabaseAdmin
    .from('course_modules')
    .select('*', { count: 'exact', head: true })
    .eq('course_id', courseId);
  return count || 0;
}

export async function getCourseLessonCount(courseId: string): Promise<number> {
  const { data: modules } = await supabaseAdmin
    .from('course_modules')
    .select('id')
    .eq('course_id', courseId);
  const moduleIds = (modules || []).map((m: any) => m.id);
  if (moduleIds.length === 0) return 0;

  const { count } = await supabaseAdmin
    .from('course_lessons')
    .select('*', { count: 'exact', head: true })
    .in('module_id', moduleIds);
  return count || 0;
}
