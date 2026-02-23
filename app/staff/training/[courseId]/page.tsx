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
    if (u.hostname.includes('drive.google.com')) {
      const match = u.pathname.match(/\/file\/d\/([^/]+)/);
      if (match) return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
  } catch { /* ignore */ }
  return url;
}

function extractDriveFileId(url: string): string | null {
  try {
    const match = url.match(/\/file\/d\/([^/]+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

function getDownloadUrl(content: string): string | null {
  const urlMatch = content.match(/https:\/\/drive\.google\.com\/file\/d\/([^/]+)/);
  if (urlMatch) {
    return `https://drive.google.com/uc?export=download&id=${urlMatch[1]}`;
  }
  return null;
}

function getPreviewUrl(content: string): string | null {
  const urlMatch = content.match(/https:\/\/drive\.google\.com\/file\/d\/([^/]+)/);
  if (urlMatch) {
    return `https://drive.google.com/file/d/${urlMatch[1]}/preview`;
  }
  return null;
}

// Detect which foundation a module belongs to
function getFoundation(moduleTitle: string): string | null {
  if (moduleTitle.startsWith('F1.')) return 'Foundation 1';
  if (moduleTitle.startsWith('F2.')) return 'Foundation 2';
  if (moduleTitle.startsWith('F3.')) return 'Foundation 3';
  if (moduleTitle.startsWith('F4.')) return 'Foundation 4';
  return null;
}

function getFoundationInfo(foundation: string) {
  const info: Record<string, { title: string; subtitle: string; description: string }> = {
    'Foundation 1': {
      title: 'Foundation 1: The Law of Averages',
      subtitle: 'Understanding the Mathematics of Sales Success',
      description: 'Welcome to SASA\'s first foundation. In this section, you will learn the fundamental principles that drive sales success — the Law of Averages, the three Success Factors (Pitch, Pace, and Attitude), and how to build a consistent daily workflow. These principles form the bedrock of the SASA sales methodology and have been proven across thousands of sales professionals worldwide.',
    },
    'Foundation 2': {
      title: 'Foundation 2: The 5 Steps Blueprint',
      subtitle: 'Mastering the Art of the Sale',
      description: 'Welcome to SASA\'s second foundation. Here you will master the complete sales process — from making a powerful first impression to closing the deal. You\'ll learn the Conversation Blueprint, KISS Storytelling, the Art of Delivery, and how to protect your commission. This foundation transforms your approach from amateur to professional.',
    },
    'Foundation 3': {
      title: 'Foundation 3: The 6 Impulse Factors',
      subtitle: 'The Psychology Behind Every Sale',
      description: 'Welcome to SASA\'s third foundation. This is where you dive deep into sales psychology — the 6 Impulse Factors that drive every buying decision. You\'ll master Greed, Indifference, Fear of Loss, Urgency, Social Proof, and the Power of Suggestion. Understanding these factors will give you an unmatched edge in any sales situation.',
    },
    'Foundation 4': {
      title: 'Foundation 4: The 8 Sales Habits',
      subtitle: 'Building the Habits That Build Success',
      description: 'Welcome to SASA\'s fourth and final foundation. Success in sales isn\'t just about skill — it\'s about habits. You\'ll learn the 8 habits that separate top performers from the rest: Great Attitude, Punctuality, Preparation, Full-Day Work Ethic, Territory Management, Attitude Maintenance, Goal Setting, and Taking Control. Master these and success becomes automatic.',
    },
  };
  return info[foundation] || null;
}

export default function CourseViewerPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const [data, setData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [expandedFoundations, setExpandedFoundations] = useState<Record<string, boolean>>({});

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/training/progress/${courseId}`);
      const json = await res.json();
      setData(json);
      if (!activeLesson && json.modules) {
        const allLessons = json.modules.flatMap((m: Module) => m.lessons);
        const firstUncompleted = allLessons.find((l: Lesson) => !l.completed);
        const selected = firstUncompleted || allLessons[0] || null;
        setActiveLesson(selected);
        if (selected) {
          const parentMod = json.modules.find((m: Module) => m.lessons.some((l: Lesson) => l.id === selected.id));
          if (parentMod) {
            setActiveModuleId(parentMod.id);
            const f = getFoundation(parentMod.title);
            if (f) setExpandedFoundations(prev => ({ ...prev, [f]: true }));
          }
        }
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, [courseId, activeLesson]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const selectLesson = (lesson: Lesson, moduleId: string) => {
    setActiveLesson(lesson);
    setActiveModuleId(moduleId);
    setSidebarOpen(false);
  };

  const toggleComplete = async (lessonId: string, currentState: boolean) => {
    setToggling(true);
    await fetch('/api/training/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lesson_id: lessonId, completed: !currentState }),
    });
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

  const markAndGoNext = async () => {
    if (!activeLesson) return;
    if (!activeLesson.completed) {
      await toggleComplete(activeLesson.id, false);
    }
    if (nextLesson) {
      const parentMod = data?.modules.find(m => m.lessons.some(l => l.id === nextLesson.id));
      selectLesson(nextLesson, parentMod?.id || '');
      const f = parentMod ? getFoundation(parentMod.title) : null;
      if (f) setExpandedFoundations(prev => ({ ...prev, [f]: true }));
    }
  };

  const allLessons = data?.modules?.flatMap(m => m.lessons) || [];
  const currentIndex = activeLesson ? allLessons.findIndex(l => l.id === activeLesson.id) : -1;
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  // Group modules by foundation
  const groupModulesByFoundation = (modules: Module[]) => {
    const groups: { foundation: string; modules: Module[] }[] = [];
    let currentF = '';
    modules.forEach(m => {
      const f = getFoundation(m.title) || 'Other';
      if (f !== currentF) {
        groups.push({ foundation: f, modules: [m] });
        currentF = f;
      } else {
        groups[groups.length - 1].modules.push(m);
      }
    });
    return groups;
  };

  // Get current foundation info
  const currentModule = data?.modules.find(m => m.id === activeModuleId);
  const currentFoundation = currentModule ? getFoundation(currentModule.title) : null;
  const foundationInfo = currentFoundation ? getFoundationInfo(currentFoundation) : null;

  // Check if current lesson is the first lesson of first module in a foundation
  const isFoundationIntro = () => {
    if (!currentModule || !data) return false;
    const f = getFoundation(currentModule.title);
    if (!f) return false;
    const foundationModules = data.modules.filter(m => getFoundation(m.title) === f);
    if (foundationModules.length === 0) return false;
    const firstModule = foundationModules[0];
    return firstModule.id === currentModule.id && firstModule.lessons[0]?.id === activeLesson?.id;
  };

  if (loading) return (
    <div className="min-h-screen bg-[#1c1d1f] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/60">Loading course...</p>
      </div>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen bg-[#1c1d1f] flex items-center justify-center">
      <div className="text-center text-white">
        <p className="text-lg mb-4">Course not found or not assigned to you.</p>
        <Link href="/staff/training" className="text-purple-400 hover:underline">Back to My Courses</Link>
      </div>
    </div>
  );

  const foundationGroups = groupModulesByFoundation(data.modules);

  return (
    <div className="min-h-screen bg-[#1c1d1f] flex flex-col">
      {/* Top Bar - Udemy Style */}
      <div className="bg-[#1c1d1f] border-b border-gray-700 px-4 py-2.5 flex items-center justify-between z-20">
        <div className="flex items-center gap-4">
          <Link href="/staff/training" className="flex items-center gap-2 text-white/70 hover:text-white text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          <div className="hidden sm:block h-5 w-px bg-gray-700" />
          <h1 className="hidden sm:block text-sm font-medium text-white truncate max-w-[300px]">{data.course.title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-24 bg-gray-700 rounded-full h-1.5">
              <div className="bg-purple-500 rounded-full h-1.5 transition-all" style={{ width: `${data.progress.percentage}%` }} />
            </div>
            <span className="text-xs text-white/60">{data.progress.completed_lessons}/{data.progress.total_lessons}</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="hidden sm:inline">Course content</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          {activeLesson ? (
            <>
              {/* Video Area - Full Width, Dark Background */}
              {activeLesson.video_url && (activeLesson.content_type === 'video' || activeLesson.content_type === 'mixed') && (
                <div className="bg-black">
                  <div className="max-w-[1200px] mx-auto">
                    <div className="aspect-video">
                      <iframe
                        src={getEmbedUrl(activeLesson.video_url) || ''}
                        className="w-full h-full"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PDF/Slides Preview */}
              {activeLesson.content_type === 'pdf' && activeLesson.content && (
                <div className="bg-black">
                  <div className="max-w-[1200px] mx-auto">
                    {getPreviewUrl(activeLesson.content) && (
                      <div className="aspect-video">
                        <iframe
                          src={getPreviewUrl(activeLesson.content) || ''}
                          className="w-full h-full"
                          allowFullScreen
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Content Below Video */}
              <div className="bg-white">
                <div className="max-w-[1200px] mx-auto px-6 py-8">
                  {/* Foundation Intro Banner */}
                  {isFoundationIntro() && foundationInfo && (
                    <div className="mb-8 bg-gradient-to-r from-navy to-navy/80 rounded-2xl p-8 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <span className="text-white/70 text-sm font-medium">SASA WORLDWIDE</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-1">{foundationInfo.title}</h3>
                      <p className="text-white/70 text-sm mb-4">{foundationInfo.subtitle}</p>
                      <p className="text-white/90 leading-relaxed text-sm">{foundationInfo.description}</p>
                    </div>
                  )}

                  {/* Lesson Title & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          activeLesson.content_type === 'video' ? 'bg-blue-100 text-blue-700' :
                          activeLesson.content_type === 'pdf' ? 'bg-orange-100 text-orange-700' :
                          activeLesson.content_type === 'quiz' ? 'bg-purple-100 text-purple-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {activeLesson.content_type === 'pdf' ? 'Slides / PDF' : activeLesson.content_type}
                        </span>
                        {activeLesson.duration_minutes && (
                          <span className="text-xs text-gray-400">{activeLesson.duration_minutes} min</span>
                        )}
                        {activeLesson.completed && (
                          <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Completed
                          </span>
                        )}
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">{activeLesson.title}</h2>
                    </div>

                    {/* Download button for PDF/slides */}
                    {activeLesson.content_type === 'pdf' && activeLesson.content && getDownloadUrl(activeLesson.content) && (
                      <a
                        href={getDownloadUrl(activeLesson.content) || ''}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy text-white text-sm font-medium rounded-lg hover:bg-navy/90 transition-colors flex-shrink-0"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download Slides
                      </a>
                    )}
                  </div>

                  {/* Text Content */}
                  {activeLesson.content && activeLesson.content_type !== 'pdf' && (
                    <div className="prose max-w-none mb-8">
                      <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{activeLesson.content}</div>
                    </div>
                  )}

                  {/* Bottom Action Bar */}
                  <div className="border-t border-gray-200 pt-6 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {prevLesson && (
                        <button
                          onClick={() => {
                            const parentMod = data.modules.find(m => m.lessons.some(l => l.id === prevLesson.id));
                            selectLesson(prevLesson, parentMod?.id || '');
                          }}
                          className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                          Previous
                        </button>
                      )}
                      <button
                        onClick={() => toggleComplete(activeLesson.id, activeLesson.completed)}
                        disabled={toggling}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                          activeLesson.completed
                            ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {activeLesson.completed ? (
                          <>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Completed
                          </>
                        ) : (
                          <>
                            <div className="w-4 h-4 rounded-full border-2 border-gray-400" />
                            Mark Complete
                          </>
                        )}
                      </button>
                    </div>

                    {nextLesson && (
                      <button
                        onClick={markAndGoNext}
                        className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        {activeLesson.completed ? 'Next Lesson' : 'Complete & Next'}
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                    {!nextLesson && (
                      <div className="px-4 py-2.5 bg-green-50 text-green-700 text-sm font-medium rounded-lg border border-green-200">
                        You&apos;ve reached the end of the course!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-white/40">
              Select a lesson to begin
            </div>
          )}
        </div>

        {/* Sidebar - Course Content Panel (Udemy style, right side) */}
        <div className={`absolute right-0 top-0 bottom-0 w-full sm:w-96 bg-white border-l border-gray-200 overflow-y-auto transition-transform duration-300 z-10 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
            <h3 className="font-bold text-gray-900">Course content</h3>
            <button onClick={() => setSidebarOpen(false)} className="p-1 text-gray-500 hover:text-gray-700">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div>
            {foundationGroups.map(group => {
              const isExpanded = expandedFoundations[group.foundation] !== false;
              const totalLessons = group.modules.reduce((acc, m) => acc + m.lessons.length, 0);
              const completedLessons = group.modules.reduce((acc, m) => acc + m.lessons.filter(l => l.completed).length, 0);

              return (
                <div key={group.foundation} className="border-b border-gray-100">
                  {/* Foundation Header */}
                  <button
                    onClick={() => setExpandedFoundations(prev => ({ ...prev, [group.foundation]: !isExpanded }))}
                    className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                  >
                    <div>
                      <p className="text-sm font-bold text-gray-900">{group.foundation}</p>
                      <p className="text-xs text-gray-500">{completedLessons}/{totalLessons} lessons</p>
                    </div>
                    <svg className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Modules & Lessons */}
                  {isExpanded && group.modules.map(mod => (
                    <div key={mod.id}>
                      <div className="px-4 py-2 bg-gray-50/50">
                        <p className="text-xs font-semibold text-gray-500 truncate">{mod.title}</p>
                      </div>
                      {mod.lessons.map(lesson => {
                        const isActive = activeLesson?.id === lesson.id;
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => selectLesson(lesson, mod.id)}
                            className={`w-full flex items-start gap-3 px-4 py-2.5 text-left transition-colors ${
                              isActive ? 'bg-purple-50 border-l-4 border-purple-600' : 'hover:bg-gray-50 border-l-4 border-transparent'
                            }`}
                          >
                            {lesson.completed ? (
                              <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs leading-tight ${isActive ? 'text-purple-700 font-medium' : 'text-gray-700'}`}>
                                {lesson.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                {lesson.content_type === 'video' && (
                                  <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                  </svg>
                                )}
                                {lesson.content_type === 'pdf' && (
                                  <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                )}
                                {lesson.duration_minutes && (
                                  <span className="text-[10px] text-gray-400">{lesson.duration_minutes}min</span>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
