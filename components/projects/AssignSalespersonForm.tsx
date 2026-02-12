'use client';

/**
 * AssignSalespersonForm Component
 * Form to assign a salesperson to a project
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus } from 'lucide-react';

interface AssignSalespersonFormProps {
  projectId: string;
  salesStaff: Array<{ id: string; name: string; email: string }>;
  existingAssignments: Array<{ salesperson_id: string }>;
}

export function AssignSalespersonForm({
  projectId,
  salesStaff,
  existingAssignments,
}: AssignSalespersonFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedSalesperson, setSelectedSalesperson] = useState('');

  // Filter out already assigned salespeople
  const assignedIds = new Set(existingAssignments.map((a) => a.salesperson_id));
  const availableSalesStaff = salesStaff.filter(
    (staff) => !assignedIds.has(staff.id)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!selectedSalesperson) {
        throw new Error('Please select a salesperson');
      }

      const response = await fetch(`/api/admin/projects/${projectId}/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ salesperson_id: selectedSalesperson }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to assign salesperson');
      }

      setSuccess('Salesperson assigned successfully! QR code generated.');
      setSelectedSalesperson('');

      // Refresh the page to show the new assignment
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (availableSalesStaff.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        <p>All sales staff members have been assigned to this project.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          {success}
        </div>
      )}

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Salesperson
          </label>
          <select
            value={selectedSalesperson}
            onChange={(e) => setSelectedSalesperson(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
          >
            <option value="">Choose a salesperson...</option>
            {availableSalesStaff.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.name} ({staff.email})
              </option>
            ))}
          </select>
        </div>

        <div className="pt-7">
          <button
            type="submit"
            disabled={loading || !selectedSalesperson}
            className="flex items-center gap-2 px-6 py-2 bg-navy-600 text-white rounded-lg hover:bg-navy-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-[42px]"
          >
            {loading ? (
              'Assigning...'
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Assign
              </>
            )}
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-600">
        Assigning a salesperson will automatically generate a unique QR code and form URL for them.
      </p>
    </form>
  );
}
