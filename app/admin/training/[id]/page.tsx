'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Lesson {
  id: string;
  module_id: string;
  title: string;
  content_type: string;
  content?: string;
  video_url?: string;
  order_index: number;
  duration_minutes?: number;
}

interface Module {
  id: string;
  course_id: string;
  title: string;
  order_index: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  description?: string;
  status: string;
  modules: Module[];
  assignment_count: number;
  updated_at: string;
}

export default function CourseEditorPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [addingLessonToModule, setAddingLessonToModule] = useState<string | null>(null);
  const [lessonForm, setLessonForm] = useState({ title: '', content_type: 'text', content: '', video_url: '', duration_minutes: '' });

  const fetchCourse = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/training/courses/${courseId}`);
      const data = await res.json();
      if (data.course) {
        setCourse(data.course);
        setEditTitle(data.course.title);
        setEditDesc(data.course.description || '');
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, [courseId]);

  useEffect(() => { fetchCourse(); }, [fetchCourse]);

  const saveCourseDetails = async () => {
    setSaving(true);
    await fetch(`/api/admin/training/courses/${courseId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editTitle, description: editDesc }),
    });
    setSaving(false);
    fetchCourse();
  };

  const toggleStatus = async () => {
    if (!course) return;
    const newStatus = course.status === 'published' ? 'draft' : 'published';
    await fetch(`/api/admin/training/courses/${courseId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchCourse();
  };

  const addModule = async () => {
    if (!newModuleTitle.trim()) return;
    await fetch(`/api/admin/training/courses/${courseId}/modules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newModuleTitle }),
    });
    setNewModuleTitle('');
    fetchCourse();
  };

  const deleteModule = async (moduleId: string) => {
    if (!confirm('Delete this module and all its lessons?')) return;
    await fetch(`/api/admin/training/courses/${courseId}/modules?module_id=${moduleId}`, { method: 'DELETE' });
    fetchCourse();
  };

  const saveLesson = async () => {
    const body: any = {
      title: lessonForm.title,
      content_type: lessonForm.content_type,
      content: lessonForm.content || null,
      video_url: lessonForm.video_url || null,
      duration_minutes: lessonForm.duration_minutes ? parseInt(lessonForm.duration_minutes) : null,
    };

    if (editingLesson) {
      body.id = editingLesson.id;
      await fetch(`/api/admin/training/courses/${courseId}/lessons`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } else {
      body.module_id = addingLessonToModule;
      await fetch(`/api/admin/training/courses/${courseId}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    }
    setEditingLesson(null);
    setAddingLessonToModule(null);
    setLessonForm({ title: '', content_type: 'text', content: '', video_url: '', duration_minutes: '' });
    fetchCourse();
  };

  const deleteLesson = async (lessonId: string) => {
    if (!confirm('Delete this lesson?')) return;
    await fetch(`/api/admin/training/courses/${courseId}/lessons?lesson_id=${lessonId}`, { method: 'DELETE' });
    fetchCourse();
  };

  const deleteCourse = async () => {
    if (!confirm('Delete this entire course? This cannot be undone.')) return;
    await fetch(`/api/admin/training/courses/${courseId}`, { method: 'DELETE' });
    router.push('/admin/training');
  };

  const openEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setAddingLessonToModule(null);
    setLessonForm({
      title: lesson.title,
      content_type: lesson.content_type,
      content: lesson.content || '',
      video_url: lesson.video_url || '',
      duration_minutes: lesson.duration_minutes?.toString() || '',
    });
  };

  const openAddLesson = (moduleId: string) => {
    setAddingLessonToModule(moduleId);
    setEditingLesson(null);
    setLessonForm({ title: '', content_type: 'text', content: '', video_url: '', duration_minutes: '' });
  };

  const totalLessons = course?.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0;
  const statusBadge = course?.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';

  if (loading) return <div className="text-center py-20 text-gray-400">Loading course...</div>;
  if (!course) return <div className="text-center py-20 text-red-500">Course not found</div>;

  const showLessonForm = editingLesson || addingLessonToModule;

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/training" className="text-sm text-gray-500 hover:text-navy">&larr; Back to Courses</Link>
      </div>

      {/* Course Header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 mr-4">
            <input
              type="text"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              className="text-2xl font-bold text-navy w-full border-b border-transparent hover:border-gray-200 focus:border-navy focus:outline-none pb-1"
            />
            <textarea
              value={editDesc}
              onChange={e => setEditDesc(e.target.value)}
              placeholder="Add a description..."
              rows={2}
              className="w-full text-gray-500 mt-2 border-b border-transparent hover:border-gray-200 focus:border-navy focus:outline-none text-sm resize-none"
            />
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge}`}>{course.status}</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={saveCourseDetails} disabled={saving} className="px-4 py-2 bg-navy text-white rounded-lg text-sm hover:bg-navy/90 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Details'}
          </button>
          <button onClick={toggleStatus} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
            {course.status === 'published' ? 'Unpublish' : 'Publish'}
          </button>
          <Link href={`/admin/training/${courseId}/assign`} className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm hover:bg-purple-100">
            Assign Users ({course.assignment_count})
          </Link>
          <button onClick={deleteCourse} className="px-4 py-2 bg-red-50 text-red-700 rounded-lg text-sm hover:bg-red-100 ml-auto">
            Delete Course
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Modules</p>
          <p className="text-2xl font-bold text-navy">{course.modules?.length || 0}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Lessons</p>
          <p className="text-2xl font-bold text-navy">{totalLessons}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Assigned Users</p>
          <p className="text-2xl font-bold text-purple-700">{course.assignment_count}</p>
        </div>
      </div>

      {/* Add Module */}
      <div className="flex items-center gap-3 mb-6">
        <input
          type="text"
          value={newModuleTitle}
          onChange={e => setNewModuleTitle(e.target.value)}
          placeholder="New module title..."
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-navy focus:border-navy text-sm"
          onKeyDown={e => e.key === 'Enter' && addModule()}
        />
        <button onClick={addModule} className="px-4 py-2 bg-navy text-white rounded-lg text-sm hover:bg-navy/90">
          Add Module
        </button>
      </div>

      {/* Modules & Lessons */}
      <div className="space-y-4">
        {(course.modules || []).map((mod, idx) => (
          <div key={mod.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-400">MODULE {idx + 1}</span>
                <h3 className="font-semibold text-navy">{mod.title}</h3>
                <span className="text-xs text-gray-400">{mod.lessons?.length || 0} lessons</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openAddLesson(mod.id)} className="px-3 py-1 bg-navy/10 text-navy rounded text-xs hover:bg-navy/20">
                  + Lesson
                </button>
                <button onClick={() => deleteModule(mod.id)} className="px-3 py-1 bg-red-50 text-red-600 rounded text-xs hover:bg-red-100">
                  Delete
                </button>
              </div>
            </div>

            {(mod.lessons || []).length > 0 && (
              <div className="divide-y divide-gray-50">
                {mod.lessons.map(lesson => (
                  <div key={lesson.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        lesson.content_type === 'video' ? 'bg-blue-100 text-blue-700' :
                        lesson.content_type === 'quiz' ? 'bg-purple-100 text-purple-700' :
                        lesson.content_type === 'pdf' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {lesson.content_type}
                      </span>
                      <span className="text-sm text-gray-700">{lesson.title}</span>
                      {lesson.duration_minutes && (
                        <span className="text-xs text-gray-400">{lesson.duration_minutes} min</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEditLesson(lesson)} className="text-xs text-navy hover:underline">Edit</button>
                      <button onClick={() => deleteLesson(lesson.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {(mod.lessons || []).length === 0 && (
              <div className="p-6 text-center text-gray-400 text-sm">
                No lessons yet. Click &ldquo;+ Lesson&rdquo; to add one.
              </div>
            )}
          </div>
        ))}
      </div>

      {(course.modules || []).length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-400 mb-2">No modules yet</p>
          <p className="text-gray-400 text-sm">Add a module above to start building your course.</p>
        </div>
      )}

      {/* Lesson Form Modal */}
      {showLessonForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <h3 className="text-lg font-bold text-navy mb-4">
              {editingLesson ? 'Edit Lesson' : 'Add Lesson'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={lessonForm.title}
                  onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-navy"
                  placeholder="Lesson title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={lessonForm.content_type}
                  onChange={e => setLessonForm({ ...lessonForm, content_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-navy"
                >
                  <option value="text">Text</option>
                  <option value="video">Video</option>
                  <option value="quiz">Quiz</option>
                  <option value="pdf">PDF</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
              {(lessonForm.content_type === 'video' || lessonForm.content_type === 'mixed') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                  <input
                    type="url"
                    value={lessonForm.video_url}
                    onChange={e => setLessonForm({ ...lessonForm, video_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-navy"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  value={lessonForm.content}
                  onChange={e => setLessonForm({ ...lessonForm, content: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-navy"
                  placeholder="Lesson content..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  value={lessonForm.duration_minutes}
                  onChange={e => setLessonForm({ ...lessonForm, duration_minutes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-navy"
                  placeholder="15"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={saveLesson} className="px-4 py-2 bg-navy text-white rounded-lg text-sm hover:bg-navy/90">
                {editingLesson ? 'Save Changes' : 'Add Lesson'}
              </button>
              <button
                onClick={() => { setEditingLesson(null); setAddingLessonToModule(null); }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
