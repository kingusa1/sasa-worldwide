'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface MyCourse {
  course_id: string;
  course: { id: string; title: string; description?: string; };
  progress: { total_lessons: number; completed_lessons: number; percentage: number; };
  due_date?: string;
}

export default function StaffTrainingPage() {
  const [courses, setCourses] = useState<MyCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/training/my-courses')
      .then(r => r.json())
      .then(data => setCourses(data.courses || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">Loading your courses...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-navy">My Training Courses</h1>
          <p className="text-gray-500 mt-1">Continue learning and track your progress</p>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-gray-500 mb-2">No courses assigned to you yet</p>
            <p className="text-gray-400 text-sm">Your training courses will appear here once assigned by an admin.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(item => (
              <Link
                key={item.course.id}
                href={`/staff/training/${item.course.id}`}
                className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <h3 className="text-lg font-bold text-navy mb-2">{item.course.title}</h3>
                {item.course.description && (
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{item.course.description}</p>
                )}

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-500">{item.progress.completed_lessons} of {item.progress.total_lessons} lessons</span>
                    <span className="font-medium text-navy">{item.progress.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-navy rounded-full h-2 transition-all duration-300"
                      style={{ width: `${item.progress.percentage}%` }}
                    />
                  </div>
                </div>

                {item.due_date && (
                  <p className="text-xs text-gray-400">
                    Due: {new Date(item.due_date).toLocaleDateString()}
                  </p>
                )}

                <div className="mt-4 text-sm font-medium text-navy">
                  {item.progress.percentage === 100 ? 'Review Course' : item.progress.percentage > 0 ? 'Continue Learning' : 'Start Course'} &rarr;
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
