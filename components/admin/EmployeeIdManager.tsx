'use client';

import { useState, useEffect } from 'react';

interface EmployeeId {
  id: string;
  employee_id: string;
  email: string;
  status: 'unused' | 'used' | 'revoked';
  created_at: string;
  used_at?: string;
  notes?: string;
  created_by_user?: { name: string; email: string };
  used_by_user?: { name: string; email: string };
}

export function EmployeeIdManager() {
  const [employeeIds, setEmployeeIds] = useState<EmployeeId[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unused' | 'used' | 'revoked'>('all');

  // Create form state
  const [createForm, setCreateForm] = useState({
    employeeId: '',
    email: '',
    notes: '',
    sendEmail: true,
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  useEffect(() => {
    fetchEmployeeIds();
  }, []);

  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchEmployeeIds = async () => {
    try {
      setFetchError(null);
      const response = await fetch('/api/admin/employee-ids');
      const data = await response.json();
      if (!response.ok) {
        setFetchError(data.error || `API returned ${response.status}`);
        return;
      }
      if (data.employeeIds) {
        setEmployeeIds(data.employeeIds);
      } else {
        setFetchError('No employee IDs data in response');
      }
    } catch (error: any) {
      console.error('Failed to fetch employee IDs:', error);
      setFetchError(error.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    setCreating(true);

    try {
      const response = await fetch('/api/admin/employee-ids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create employee ID');
      }

      // Success! Refresh list and close modal
      await fetchEmployeeIds();
      setShowCreateModal(false);
      setCreateForm({ employeeId: '', email: '', notes: '', sendEmail: true });
    } catch (error: any) {
      setCreateError(error.message);
    } finally {
      setCreating(false);
    }
  };

  const handleSendEmail = async (id: string) => {
    try {
      const response = await fetch('/api/admin/employee-ids/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeIdRecordId: id }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send email');
      }

      alert('Email sent successfully!');
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this employee ID? This cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/employee-ids/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to revoke employee ID');
      }

      // Refresh list
      await fetchEmployeeIds();
      alert('Employee ID revoked successfully');
    } catch (error: any) {
      alert(error.message);
    }
  };

  const filteredIds = employeeIds.filter((id) => {
    if (filter === 'all') return true;
    return id.status === filter;
  });

  const stats = {
    total: employeeIds.length,
    unused: employeeIds.filter((id) => id.status === 'unused').length,
    used: employeeIds.filter((id) => id.status === 'used').length,
    revoked: employeeIds.filter((id) => id.status === 'revoked').length,
  };

  return (
    <div>
      {fetchError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800 font-medium">Failed to load employee IDs</p>
          <p className="text-xs text-red-600 mt-1 font-mono">{fetchError}</p>
          <button onClick={() => { setLoading(true); fetchEmployeeIds(); }} className="mt-2 text-xs text-red-700 underline hover:text-red-900">Retry</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Unused</p>
          <p className="text-2xl font-bold text-green-600">{stats.unused}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Used</p>
          <p className="text-2xl font-bold text-blue-600">{stats.used}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Revoked</p>
          <p className="text-2xl font-bold text-red-600">{stats.revoked}</p>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-navy text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unused')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'unused'
                  ? 'bg-navy text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Unused
            </button>
            <button
              onClick={() => setFilter('used')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'used'
                  ? 'bg-navy text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Used
            </button>
            <button
              onClick={() => setFilter('revoked')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'revoked'
                  ? 'bg-navy text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Revoked
            </button>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy/90 font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Employee ID
          </button>
        </div>
      </div>

      {/* Employee IDs Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
            <p className="mt-4 text-gray-600">Loading employee IDs...</p>
          </div>
        ) : filteredIds.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No employee IDs found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new employee ID.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredIds.map((id) => (
                  <tr key={id.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono font-semibold text-gray-900">{id.employee_id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {id.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          id.status === 'unused'
                            ? 'bg-green-100 text-green-800'
                            : id.status === 'used'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {id.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(id.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        {id.status === 'unused' && (
                          <>
                            <button
                              onClick={() => handleSendEmail(id.id)}
                              className="text-blue-600 hover:text-blue-800 font-medium"
                              title="Send email"
                            >
                              📧 Send
                            </button>
                            <button
                              onClick={() => handleRevoke(id.id)}
                              className="text-red-600 hover:text-red-800 font-medium"
                              title="Revoke"
                            >
                              🚫 Revoke
                            </button>
                          </>
                        )}
                        {id.status === 'used' && (
                          <span className="text-gray-400">Used by {id.used_by_user?.name}</span>
                        )}
                        {id.status === 'revoked' && (
                          <span className="text-gray-400">Revoked</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Employee ID</h2>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee ID *
                </label>
                <input
                  type="text"
                  required
                  value={createForm.employeeId}
                  onChange={(e) => setCreateForm({ ...createForm, employeeId: e.target.value })}
                  placeholder="EMP-12345"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">Format: EMP-12345 or SASA-12345</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  placeholder="staff@sasa-worldwide.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={createForm.notes}
                  onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })}
                  placeholder="Internal notes about this employee..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="sendEmail"
                  checked={createForm.sendEmail}
                  onChange={(e) => setCreateForm({ ...createForm, sendEmail: e.target.checked })}
                  className="rounded border-gray-300 text-navy focus:ring-navy"
                />
                <label htmlFor="sendEmail" className="text-sm text-gray-700">
                  Send employee ID email immediately
                </label>
              </div>

              {createError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{createError}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 bg-navy text-white py-2 px-4 rounded-lg hover:bg-navy/90 font-medium disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Employee ID'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setCreateError('');
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
