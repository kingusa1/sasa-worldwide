export interface Course {
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  status: 'draft' | 'published' | 'archived';
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  order_index: number;
  created_at: string;
}

export interface CourseLesson {
  id: string;
  module_id: string;
  title: string;
  content_type: 'text' | 'video' | 'quiz' | 'pdf' | 'mixed';
  content?: string;
  video_url?: string;
  order_index: number;
  duration_minutes?: number;
  created_at: string;
}

export interface CourseAssignment {
  id: string;
  course_id: string;
  user_id: string;
  assigned_by?: string;
  assigned_at: string;
  due_date?: string;
  course?: Course;
  user?: { id: string; name: string; email: string };
}

export interface CourseProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  completed_at?: string;
  created_at: string;
}

export interface CourseWithModules extends Course {
  modules: (CourseModule & { lessons: CourseLesson[] })[];
}

export interface CourseProgressSummary {
  course_id: string;
  total_lessons: number;
  completed_lessons: number;
  percentage: number;
}
