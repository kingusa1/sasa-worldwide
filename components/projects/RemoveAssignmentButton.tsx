'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

interface RemoveAssignmentButtonProps {
  projectId: string;
  assignmentId: string;
  salespersonName: string;
}

export function RemoveAssignmentButton({
  projectId,
  assignmentId,
  salespersonName,
}: RemoveAssignmentButtonProps) {
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      const response = await fetch(
        `/api/admin/projects/${projectId}/assignments?assignment_id=${assignmentId}`,
        { method: 'DELETE' }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      if (data.warning) alert(data.warning);
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Failed to remove assignment');
    } finally {
      setIsRemoving(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-red-600">Remove {salespersonName}?</span>
        <button
          onClick={handleRemove}
          disabled={isRemoving}
          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
        >
          {isRemoving ? 'Removing...' : 'Confirm'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="flex items-center gap-1 px-3 py-1.5 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-sm"
    >
      <Trash2 className="h-3.5 w-3.5" />
      Remove
    </button>
  );
}
