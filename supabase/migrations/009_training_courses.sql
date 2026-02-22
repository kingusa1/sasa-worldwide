-- ============================================
-- SASA Worldwide - Training & Course System
-- Migration: 009_training_courses
-- ============================================

-- TABLE: courses
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_created_by ON courses(created_by);

-- TABLE: course_modules
CREATE TABLE IF NOT EXISTS course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_course_modules_course ON course_modules(course_id);

-- TABLE: course_lessons
CREATE TABLE IF NOT EXISTS course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content_type TEXT CHECK (content_type IN ('text', 'video', 'quiz', 'pdf', 'mixed')) DEFAULT 'text',
  content TEXT,
  video_url TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  duration_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_course_lessons_module ON course_lessons(module_id);

-- TABLE: course_assignments
CREATE TABLE IF NOT EXISTS course_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  assigned_by UUID REFERENCES users(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  due_date TIMESTAMPTZ,
  UNIQUE(course_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_course_assignments_course ON course_assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_course_assignments_user ON course_assignments(user_id);

-- TABLE: course_progress
CREATE TABLE IF NOT EXISTS course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_course_progress_user ON course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_lesson ON course_progress(lesson_id);

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "Admin full access to courses" ON courses FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM users WHERE users.id = (select auth.uid()) AND users.role = 'admin'));

CREATE POLICY "Admin full access to course_modules" ON course_modules FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM users WHERE users.id = (select auth.uid()) AND users.role = 'admin'));

CREATE POLICY "Admin full access to course_lessons" ON course_lessons FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM users WHERE users.id = (select auth.uid()) AND users.role = 'admin'));

CREATE POLICY "Admin full access to course_assignments" ON course_assignments FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM users WHERE users.id = (select auth.uid()) AND users.role = 'admin'));

CREATE POLICY "Admin full access to course_progress" ON course_progress FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM users WHERE users.id = (select auth.uid()) AND users.role = 'admin'));

-- Users can view published courses they are assigned to
CREATE POLICY "Users view assigned courses" ON courses FOR SELECT TO authenticated
USING (status = 'published' AND EXISTS (
  SELECT 1 FROM course_assignments WHERE course_assignments.course_id = courses.id
  AND course_assignments.user_id = (select auth.uid())
));

-- Users can view modules/lessons of assigned courses
CREATE POLICY "Users view modules of assigned courses" ON course_modules FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM course_assignments ca
  WHERE ca.course_id = course_modules.course_id AND ca.user_id = (select auth.uid())
));

CREATE POLICY "Users view lessons of assigned courses" ON course_lessons FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM course_modules cm
  JOIN course_assignments ca ON ca.course_id = cm.course_id
  WHERE cm.id = course_lessons.module_id AND ca.user_id = (select auth.uid())
));

-- Users can view/manage their own assignments and progress
CREATE POLICY "Users view own assignments" ON course_assignments FOR SELECT TO authenticated
USING (user_id = (select auth.uid()));

CREATE POLICY "Users manage own progress" ON course_progress FOR ALL TO authenticated
USING (user_id = (select auth.uid()));

-- Service role full access
CREATE POLICY "Service role access courses" ON courses FOR ALL TO service_role USING (true);
CREATE POLICY "Service role access modules" ON course_modules FOR ALL TO service_role USING (true);
CREATE POLICY "Service role access lessons" ON course_lessons FOR ALL TO service_role USING (true);
CREATE POLICY "Service role access assignments" ON course_assignments FOR ALL TO service_role USING (true);
CREATE POLICY "Service role access progress" ON course_progress FOR ALL TO service_role USING (true);

-- Trigger for updated_at on courses
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
