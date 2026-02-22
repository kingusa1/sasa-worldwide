'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CourseItem {
  id: string;
  title: string;
  description?: string;
  status: string;
  created_at: string;
  module_count: number;
  assignment_count: number;
}

export default function AdminTrainingPage() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/training/courses')
      .then(res => res.json())
      .then(data => setCourses(data.courses || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total: courses.length,
    published: courses.filter(c => c.status === 'published').length,
    draft: courses.filter(c => c.status === 'draft').length,
    assignments: courses.reduce((sum, c) => sum + (c.assignment_count || 0), 0),
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      draft: 'bg-yellow-100 text-yellow-800',
      published: 'bg-green-100 text-green-800',
      archived: 'bg-gray-100 text-gray-800',
    };
    return styles[status] || styles.draft;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy">Training Courses</h1>
          <p className="text-gray-500 mt-1">Create and manage training courses for your team</p>
        </div>
        <Link
          href="/admin/training/new"
          className="px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors text-sm font-medium"
        >
          + Create Course
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Courses', value: stats.total, color: 'bg-blue-50 text-blue-700' },
          { label: 'Published', value: stats.published, color: 'bg-green-50 text-green-700' },
          { label: 'Drafts', value: stats.draft, color: 'bg-yellow-50 text-yellow-700' },
          { label: 'Total Assignments', value: stats.assignments, color: 'bg-purple-50 text-purple-700' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color.split(' ')[1]}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading courses...</div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p className="text-gray-500 mb-4">No courses yet</p>
          <Link href="/admin/training/new" className="px-4 py-2 bg-navy text-white rounded-lg text-sm">
            Create Your First Course
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <Link
              key={course.id}
              href={`/admin/training/${course.id}`}
              className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-bold text-navy line-clamp-2">{course.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge(course.status)}`}>
                  {course.status}
                </span>
              </div>
              {course.description && (
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{course.description}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>{course.module_count} modules</span>
                <span>{course.assignment_count} assigned</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
