'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface UserItem { id: string; name: string; email: string; role: string; }
interface Assignment { id: string; user_id: string; assigned_at: string; due_date?: string; user?: UserItem; }

export default function AssignCoursePage() {
  const params = useParams();
  const courseId = params.id as string;

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [allUsers, setAllUsers] = useState<UserItem[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/training/courses/${courseId}/assign`).then(r => r.json()),
      fetch('/api/admin/users').then(r => r.json()),
      fetch(`/api/admin/training/courses/${courseId}`).then(r => r.json()),
    ]).then(([assignData, userData, courseData]) => {
      setAssignments(assignData.assignments || []);
      setAllUsers((userData.users || []).filter((u: UserItem) => u.role !== 'admin'));
      setCourseTitle(courseData.course?.title || 'Course');
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [courseId]);

  const assignedIds = assignments.map(a => a.user_id);
  const unassignedUsers = allUsers.filter(u => !assignedIds.includes(u.id));

  const handleAssign = async () => {
    if (selectedUsers.length === 0) return;
    setAssigning(true);
    await fetch(`/api/admin/training/courses/${courseId}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_ids: selectedUsers, due_date: dueDate || undefined }),
    });
    setSelectedUsers([]);
    setDueDate('');
    // Refetch
    const res = await fetch(`/api/admin/training/courses/${courseId}/assign`);
    const data = await res.json();
    setAssignments(data.assignments || []);
    setAssigning(false);
  };

  const handleUnassign = async (userId: string) => {
    if (!confirm('Remove this user from the course?')) return;
    await fetch(`/api/admin/training/courses/${courseId}/assign`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    });
    setAssignments(prev => prev.filter(a => a.user_id !== userId));
  };

  const toggleUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  return (
    <div>
      <div className="mb-6">
        <Link href={`/admin/training/${courseId}`} className="text-sm text-gray-500 hover:text-navy">&larr; Back to Course</Link>
        <h1 className="text-2xl font-bold text-navy mt-2">Assign: {courseTitle}</h1>
        <p className="text-gray-500 mt-1">{assignments.length} users currently assigned</p>
      </div>

      {/* Assign New Users */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-bold text-navy mb-4">Assign Users</h2>

        {unassignedUsers.length === 0 ? (
          <p className="text-gray-400 text-sm">All users are already assigned to this course.</p>
        ) : (
          <>
            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100 mb-4">
              {unassignedUsers.map(user => (
                <label key={user.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleUser(user.id)}
                    className="w-4 h-4 rounded border-gray-300 text-navy focus:ring-navy"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.email} &middot; {user.role}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Due Date (optional)</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <button
                onClick={handleAssign}
                disabled={assigning || selectedUsers.length === 0}
                className="px-4 py-2 bg-navy text-white rounded-lg text-sm hover:bg-navy/90 disabled:opacity-50 mt-auto"
              >
                {assigning ? 'Assigning...' : `Assign ${selectedUsers.length} User${selectedUsers.length !== 1 ? 's' : ''}`}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Current Assignments */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100">
          <h2 className="font-semibold text-navy">Assigned Users ({assignments.length})</h2>
        </div>
        {assignments.length === 0 ? (
          <div className="p-6 text-center text-gray-400 text-sm">No users assigned yet.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase border-b border-gray-100">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Assigned</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {assignments.map(a => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-700">{a.user?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-400">{a.user?.email}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(a.assigned_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {a.due_date ? new Date(a.due_date).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleUnassign(a.user_id)} className="text-xs text-red-500 hover:underline">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
