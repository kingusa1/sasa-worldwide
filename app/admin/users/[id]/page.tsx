'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const DEPARTMENTS = [
  { value: 'sales', label: 'Sales' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'operations', label: 'Operations' },
  { value: 'field-operations', label: 'Field Operations' },
  { value: 'customer-service', label: 'Customer Service' },
  { value: 'business-development', label: 'Business Development' },
  { value: 'finance', label: 'Finance' },
  { value: 'human-resources', label: 'Human Resources' },
  { value: 'it-technology', label: 'IT & Technology' },
  { value: 'management', label: 'Management' },
  { value: 'admin', label: 'Administration' },
];

interface UserDetail {
  id: string;
  email: string;
  name: string;
  role: 'staff' | 'affiliate' | 'admin';
  status: 'pending' | 'active' | 'suspended' | 'rejected';
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  staff_profiles: Array<{
    id: string;
    employee_id: string;
    department: string;
    phone?: string;
    hire_date?: string;
    manager_id?: string;
  }>;
  affiliate_profiles: Array<{
    id: string;
    referral_code: string;
    phone?: string;
  }>;
}

interface AuditLog {
  id: string;
  action: string;
  metadata?: Record<string, any>;
  created_at: string;
}

interface SalesTransaction {
  id: string;
  amount: number;
  commission_amount: number;
  payment_status: string;
  fulfillment_status: string;
  created_at: string;
  projects?: { name: string };
  customers?: { name: string; email: string };
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [user, setUser] = useState<UserDetail | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [salesTransactions, setSalesTransactions] = useState<SalesTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Editable fields
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [editPhone, setEditPhone] = useState('');

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      setError(null);
      const response = await fetch(`/api/admin/users/${userId}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || `API returned ${response.status}`);
        return;
      }

      const u = data.user;
      setUser(u);
      setAuditLogs(data.audit_logs || []);
      setSalesTransactions(data.sales_transactions || []);

      // Set editable fields
      setEditName(u.name || '');
      setEditEmail(u.email || '');
      setEditRole(u.role || '');
      setEditStatus(u.status || '');
      setEditDepartment(u.staff_profiles?.[0]?.department || '');
      setEditPhone(u.staff_profiles?.[0]?.phone || u.affiliate_profiles?.[0]?.phone || '');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          email: editEmail,
          role: editRole,
          status: editStatus,
          department: editDepartment || undefined,
          phone: editPhone || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Failed to update user');
        return;
      }

      setSuccess('User updated successfully');
      await fetchUser();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleSuspend = async () => {
    if (!confirm('Are you sure you want to suspend this user?')) return;
    try {
      const response = await fetch(`/api/admin/users/${userId}/suspend`, { method: 'POST' });
      if (!response.ok) throw new Error('Failed to suspend user');
      setSuccess('User suspended');
      await fetchUser();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleActivate = async () => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/activate`, { method: 'POST' });
      if (!response.ok) throw new Error('Failed to activate user');
      setSuccess('User activated');
      await fetchUser();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
    const confirmText = prompt('Type "DELETE" to confirm:');
    if (confirmText !== 'DELETE') return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete user');
      router.push('/admin/users');
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
            <p className="mt-4 text-gray-600">Loading user details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="p-12 text-center">
            <p className="text-red-600 font-medium">{error || 'User not found'}</p>
            <Link href="/admin/users" className="mt-4 inline-block text-navy-600 hover:underline">
              Back to Users
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalSales = salesTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
  const totalCommission = salesTransactions.reduce((sum, t) => sum + Number(t.commission_amount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Users
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full capitalize ${
                user.status === 'active' ? 'bg-green-100 text-green-800' :
                user.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                user.status === 'suspended' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {user.status}
              </span>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full capitalize ${
                user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                user.role === 'staff' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800 font-medium">{error}</p>
            <button onClick={() => setError(null)} className="mt-1 text-xs text-red-600 underline">Dismiss</button>
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-medium">{success}</p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-500 uppercase">Member Since</p>
            <p className="text-lg font-bold text-gray-900">{new Date(user.created_at).toLocaleDateString()}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-500 uppercase">Email Verified</p>
            <p className={`text-lg font-bold ${user.email_verified ? 'text-green-600' : 'text-red-600'}`}>
              {user.email_verified ? 'Yes' : 'No'}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-500 uppercase">Total Sales</p>
            <p className="text-lg font-bold text-gray-900">AED {totalSales.toFixed(0)}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-500 uppercase">Commission Earned</p>
            <p className="text-lg font-bold text-gray-900">AED {totalCommission.toFixed(0)}</p>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit User Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
              >
                <option value="staff">Staff</option>
                <option value="affiliate">Affiliate</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                value={editDepartment}
                onChange={(e) => setEditDepartment(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
              >
                <option value="">No Department</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept.value} value={dept.value}>{dept.label}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Department can be assigned to any user type
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="+971 XX XXX XXXX"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
              />
            </div>
          </div>

          {/* Read-only info */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">User ID</label>
                <p className="text-sm font-mono text-gray-700 bg-gray-50 px-3 py-2 rounded">{user.id}</p>
              </div>
              {user.staff_profiles?.[0]?.employee_id && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Employee ID</label>
                  <p className="text-sm font-mono text-gray-700 bg-gray-50 px-3 py-2 rounded">
                    {user.staff_profiles[0].employee_id}
                  </p>
                </div>
              )}
              {user.affiliate_profiles?.[0]?.referral_code && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Referral Code</label>
                  <p className="text-sm font-mono text-gray-700 bg-gray-50 px-3 py-2 rounded">
                    {user.affiliate_profiles[0].referral_code}
                  </p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
                <p className="text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded">
                  {new Date(user.updated_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            {user.status === 'active' && (
              <button
                onClick={handleSuspend}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm"
              >
                Suspend User
              </button>
            )}
            {(user.status === 'suspended' || user.status === 'pending') && (
              <button
                onClick={handleActivate}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium text-sm"
              >
                Activate User
              </button>
            )}
            {user.role !== 'admin' && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
              >
                Delete User
              </button>
            )}
          </div>
        </div>

        {/* Sales Transactions */}
        {salesTransactions.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Sales Transactions ({salesTransactions.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fulfillment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {salesTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">
                        {tx.projects?.name || '-'}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {tx.customers?.name || '-'}
                      </td>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">
                        AED {Number(tx.amount).toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-sm text-green-600">
                        AED {Number(tx.commission_amount || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-2">
                        <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                          tx.payment_status === 'succeeded' ? 'bg-green-100 text-green-700' :
                          tx.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {tx.payment_status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                          tx.fulfillment_status === 'completed' ? 'bg-green-100 text-green-700' :
                          tx.fulfillment_status === 'email_sent' ? 'bg-blue-100 text-blue-700' :
                          tx.fulfillment_status === 'failed' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {tx.fulfillment_status || 'pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Audit Logs */}
        {auditLogs.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Activity Log ({auditLogs.length})
            </h2>
            <div className="space-y-3">
              {auditLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {log.action.replace(/_/g, ' ')}
                    </p>
                    {log.metadata && (
                      <pre className="text-xs text-gray-500 mt-1 whitespace-pre-wrap">
                        {JSON.stringify(log.metadata, null, 2)}
                      </pre>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
