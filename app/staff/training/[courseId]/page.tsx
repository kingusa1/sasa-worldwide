'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Lesson {
  id: string;
  title: string;
  content_type: string;
  content?: string;
  video_url?: string;
  duration_minutes?: number;
  completed: boolean;
}

interface Module {
  id: string;
  title: string;
  order_index: number;
  lessons: Lesson[];
}

interface CourseData {
  course: { id: string; title: string; description?: string; };
  modules: Module[];
  progress: { total_lessons: number; completed_lessons: number; percentage: number; };
}

function getEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be')) {
      const videoId = u.hostname.includes('youtu.be') ? u.pathname.slice(1) : u.searchParams.get('v');
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
  } catch { /* ignore */ }
  return url;
}

export default function CourseViewerPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const [data, setData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toggling, setToggling] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/training/progress/${courseId}`);
      const json = await res.json();
      setData(json);
      // Auto-select first uncompleted lesson, or first lesson
      if (!activeLesson && json.modules) {
        const allLessons = json.modules.flatMap((m: Module) => m.lessons);
        const firstUncompleted = allLessons.find((l: Lesson) => !l.completed);
        setActiveLesson(firstUncompleted || allLessons[0] || null);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, [courseId, activeLesson]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const toggleComplete = async (lessonId: string, currentState: boolean) => {
    setToggling(true);
    await fetch('/api/training/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lesson_id: lessonId, completed: !currentState }),
    });
    // Update local state
    if (data) {
      const updated = { ...data };
      let completedCount = 0;
      let totalCount = 0;
      updated.modules = updated.modules.map(m => ({
        ...m,
        lessons: m.lessons.map(l => {
          const isCompleted = l.id === lessonId ? !currentState : l.completed;
          totalCount++;
          if (isCompleted) completedCount++;
          if (l.id === lessonId) {
            const updatedLesson = { ...l, completed: !currentState };
            setActiveLesson(updatedLesson);
            return updatedLesson;
          }
          return l;
        }),
      }));
      updated.progress = {
        total_lessons: totalCount,
        completed_lessons: completedCount,
        percentage: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
      };
      setData(updated);
    }
    setToggling(false);
  };

  const allLessons = data?.modules?.flatMap(m => m.lessons) || [];
  const currentIndex = activeLesson ? allLessons.findIndex(l => l.id === activeLesson.id) : -1;
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">Loading course...</div>;
  if (!data) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-500">Course not found or not assigned to you.</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/staff/training" className="text-sm text-gray-500 hover:text-navy">&larr; My Courses</Link>
          <h1 className="text-lg font-bold text-navy">{data.course.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{data.progress.completed_lessons}/{data.progress.total_lessons} lessons</span>
          <div className="w-32 bg-gray-200 rounded-full h-2">
            <div className="bg-navy rounded-full h-2 transition-all" style={{ width: `${data.progress.percentage}%` }} />
          </div>
          <span className="text-sm font-medium text-navy">{data.progress.percentage}%</span>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2 text-gray-500">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-80 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0`}>
          <div className="p-4">
            {data.modules.map((mod, idx) => (
              <div key={mod.id} className="mb-4">
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Module {idx + 1}: {mod.title}</p>
                <div className="space-y-1">
                  {mod.lessons.map(lesson => (
                    <button
                      key={lesson.id}
                      onClick={() => { setActiveLesson(lesson); setSidebarOpen(false); }}
                      className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeLesson?.id === lesson.id ? 'bg-navy text-white' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {lesson.completed ? (
                        <svg className={`w-4 h-4 flex-shrink-0 ${activeLesson?.id === lesson.id ? 'text-white' : 'text-green-500'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <div className={`w-4 h-4 flex-shrink-0 rounded-full border-2 ${
                          activeLesson?.id === lesson.id ? 'border-white' : 'border-gray-300'
                        }`} />
                      )}
                      <span className="line-clamp-1">{lesson.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {activeLesson ? (
            <div className="max-w-4xl mx-auto p-6 md:p-8">
              <div className="mb-6">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  activeLesson.content_type === 'video' ? 'bg-blue-100 text-blue-700' :
                  activeLesson.content_type === 'quiz' ? 'bg-purple-100 text-purple-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {activeLesson.content_type}
                </span>
                {activeLesson.duration_minutes && (
                  <span className="text-xs text-gray-400 ml-2">{activeLesson.duration_minutes} min</span>
                )}
              </div>

              <h2 className="text-2xl font-bold text-navy mb-6">{activeLesson.title}</h2>

              {/* Video */}
              {activeLesson.video_url && (activeLesson.content_type === 'video' || activeLesson.content_type === 'mixed') && (
                <div className="mb-6 aspect-video bg-black rounded-xl overflow-hidden">
                  <iframe
                    src={getEmbedUrl(activeLesson.video_url) || ''}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              )}

              {/* Text Content */}
              {activeLesson.content && (
                <div className="prose prose-navy max-w-none mb-8">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{activeLesson.content}</div>
                </div>
              )}

              {/* Mark Complete */}
              <div className="border-t border-gray-200 pt-6 mt-8">
                <button
                  onClick={() => toggleComplete(activeLesson.id, activeLesson.completed)}
                  disabled={toggling}
                  className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeLesson.completed
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-navy text-white hover:bg-navy/90'
                  } disabled:opacity-50`}
                >
                  {activeLesson.completed ? 'Completed - Click to Undo' : 'Mark as Complete'}
                </button>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-6">
                {prevLesson ? (
                  <button onClick={() => setActiveLesson(prevLesson)} className="text-sm text-navy hover:underline">
                    &larr; {prevLesson.title}
                  </button>
                ) : <div />}
                {nextLesson ? (
                  <button onClick={() => setActiveLesson(nextLesson)} className="text-sm text-navy hover:underline">
                    {nextLesson.title} &rarr;
                  </button>
                ) : <div />}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Select a lesson to begin
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
