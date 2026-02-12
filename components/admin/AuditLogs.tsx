'use client';

import { useState, useEffect } from 'react';

interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  metadata?: Record<string, any>;
  created_at: string;
  user?: {
    name: string;
    email: string;
    role: string;
  };
}

export function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'signup' | 'login' | 'approval' | 'employee_id'>('all');
  const [limit, setLimit] = useState(50);

  useEffect(() => {
    fetchLogs();
  }, [limit]);

  const fetchLogs = async () => {
    try {
      setFetchError(null);
      const response = await fetch(`/api/admin/audit-logs?limit=${limit}`);
      const data = await response.json();
      if (!response.ok) {
        setFetchError(data.error || `API returned ${response.status}`);
        return;
      }
      if (data.logs) {
        setLogs(data.logs);
      } else {
        setFetchError('No logs data in response');
      }
    } catch (error: any) {
      console.error('Failed to fetch logs:', error);
      setFetchError(error.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (filter === 'all') return true;
    if (filter === 'signup') return log.action === 'signup';
    if (filter === 'login') return log.action === 'login';
    if (filter === 'approval') return log.action.includes('approval') || log.action.includes('rejection');
    if (filter === 'employee_id') return log.action.includes('employee_id');
    return true;
  });

  const getActionIcon = (action: string) => {
    if (action === 'login') {
      return '🔓';
    } else if (action === 'signup') {
      return '✍️';
    } else if (action.includes('approval')) {
      return '✅';
    } else if (action.includes('rejection')) {
      return '❌';
    } else if (action.includes('employee_id')) {
      return '🆔';
    } else if (action.includes('suspended')) {
      return '🚫';
    } else if (action.includes('deleted')) {
      return '🗑️';
    }
    return '📝';
  };

  const getActionColor = (action: string) => {
    if (action === 'login') return 'text-blue-600';
    if (action === 'signup') return 'text-green-600';
    if (action.includes('approval')) return 'text-green-600';
    if (action.includes('rejection')) return 'text-red-600';
    if (action.includes('suspended') || action.includes('deleted')) return 'text-red-600';
    if (action.includes('employee_id')) return 'text-purple-600';
    return 'text-gray-600';
  };

  const formatAction = (action: string) => {
    return action.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div>
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex gap-2 flex-wrap">
            {['all', 'signup', 'login', 'approval', 'employee_id'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                  filter === f
                    ? 'bg-navy text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f === 'employee_id' ? 'Employee IDs' : f}
              </button>
            ))}
          </div>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
          >
            <option value={50}>Last 50</option>
            <option value={100}>Last 100</option>
            <option value={250}>Last 250</option>
            <option value={500}>Last 500</option>
          </select>
        </div>
      </div>

      {fetchError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800 font-medium">Failed to load audit logs</p>
          <p className="text-xs text-red-600 mt-1 font-mono">{fetchError}</p>
          <button onClick={() => { setLoading(true); fetchLogs(); }} className="mt-2 text-xs text-red-700 underline hover:text-red-900">Retry</button>
        </div>
      )}

      {/* Logs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
            <p className="mt-4 text-gray-600">Loading logs...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No logs found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center gap-2 ${getActionColor(log.action)}`}>
                        <span>{getActionIcon(log.action)}</span>
                        <span className="font-medium">{formatAction(log.action)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {log.user ? (
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{log.user.name}</span>
                          <span className="text-xs text-gray-500">{log.user.email}</span>
                          <span className="text-xs text-gray-400 capitalize">{log.user.role}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">System</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {log.metadata && (
                        <div className="max-w-md overflow-x-auto">
                          <pre className="text-xs">{JSON.stringify(log.metadata, null, 2)}</pre>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-500 text-center">
        Showing {filteredLogs.length} logs
      </div>
    </div>
  );
}
