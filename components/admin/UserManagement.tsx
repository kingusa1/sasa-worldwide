'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'staff' | 'affiliate' | 'admin';
  status: 'pending' | 'active' | 'suspended' | 'rejected';
  email_verified: boolean;
  created_at: string;
  staff_profiles?: Array<{
    employee_id: string;
    department: string;
    phone?: string;
  }>;
  affiliate_profiles?: Array<{
    referral_code: string;
    phone?: string;
  }>;
}

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

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'staff' | 'affiliate' | 'admin'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'suspended' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingDepartment, setEditingDepartment] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setFetchError(null);
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      if (!response.ok) {
        setFetchError(data.error || `API returned ${response.status}`);
        return;
      }
      if (data.users) {
        setUsers(data.users);
      } else {
        setFetchError('No users data in response');
      }
    } catch (error: any) {
      console.error('Failed to fetch users:', error);
      setFetchError(error.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async (userId: string) => {
    if (!confirm('Are you sure you want to suspend this user?')) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}/suspend`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to suspend user');

      await fetchUsers();
      alert('User suspended successfully');
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleActivate = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/activate`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to activate user');

      await fetchUsers();
      alert('User activated successfully');
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    const confirmText = prompt('Type "DELETE" to confirm:');
    if (confirmText !== 'DELETE') {
      alert('Deletion cancelled');
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete user');

      await fetchUsers();
      alert('User deleted successfully');
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleChangeDepartment = async (userId: string, department: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/update-department`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ department }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update department');

      setEditingDepartment(null);
      await fetchUsers();
      alert('Department updated successfully');
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleChangeRole = async (userId: string, role: string) => {
    if (!confirm(`Are you sure you want to change this user's role to "${role}"?`)) {
      setEditingRole(null);
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}/update-role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update role');

      setEditingRole(null);
      await fetchUsers();
      alert('Role updated successfully');
    } catch (error: any) {
      alert(error.message);
    }
  };

  const filteredUsers = users.filter((user) => {
    if (filter !== 'all' && user.role !== filter) return false;
    if (statusFilter !== 'all' && user.status !== statusFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.staff_profiles?.[0]?.employee_id?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const stats = {
    total: users.length,
    staff: users.filter((u) => u.role === 'staff').length,
    affiliates: users.filter((u) => u.role === 'affiliate').length,
    admins: users.filter((u) => u.role === 'admin').length,
    active: users.filter((u) => u.status === 'active').length,
    pending: users.filter((u) => u.status === 'pending').length,
    suspended: users.filter((u) => u.status === 'suspended').length,
  };

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Users</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Suspended</p>
          <p className="text-2xl font-bold text-red-600">{stats.suspended}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div>
            <input
              type="text"
              placeholder="Search by name, email, or employee ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
            />
          </div>

          {/* Role Filter */}
          <div className="flex gap-2">
            <span className="text-sm font-medium text-gray-700 self-center">Role:</span>
            {['all', 'staff', 'affiliate', 'admin'].map((role) => (
              <button
                key={role}
                onClick={() => setFilter(role as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                  filter === role
                    ? 'bg-navy text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {role} {role !== 'all' && `(${role === 'staff' ? stats.staff : role === 'affiliate' ? stats.affiliates : stats.admins})`}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <span className="text-sm font-medium text-gray-700 self-center">Status:</span>
            {['all', 'active', 'pending', 'suspended', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                  statusFilter === status
                    ? 'bg-navy text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {fetchError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800 font-medium">Failed to load users</p>
          <p className="text-xs text-red-600 mt-1">{fetchError}</p>
          <button onClick={() => { setLoading(true); fetchUsers(); }} className="mt-2 text-xs text-red-700 underline hover:text-red-900">Retry</button>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => {
                  const staffDept = user.staff_profiles?.[0]?.department;
                  const deptLabel = staffDept
                    ? DEPARTMENTS.find(d => d.value === staffDept)?.label || staffDept
                    : null;

                  return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{user.name}</span>
                        <span className="text-sm text-gray-500">{user.email}</span>
                        {user.email_verified && (
                          <span className="text-xs text-green-600 mt-1">&#10003; Email verified</span>
                        )}
                      </div>
                    </td>
                    {/* Type: Staff / Affiliate / Admin - clickable to change */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingRole === user.id ? (
                        <div className="flex items-center gap-1">
                          <select
                            defaultValue={user.role}
                            onChange={(e) => handleChangeRole(user.id, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-navy"
                            autoFocus
                          >
                            <option value="staff">Staff</option>
                            <option value="affiliate">Affiliate</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button
                            onClick={() => setEditingRole(null)}
                            className="text-gray-400 hover:text-gray-600 text-xs"
                          >
                            &#10005;
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingRole(user.id)}
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full capitalize cursor-pointer hover:opacity-80 ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : user.role === 'staff'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                          title="Click to change role"
                        >
                          {user.role}
                        </button>
                      )}
                    </td>
                    {/* Department - dedicated column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.role === 'staff' && user.staff_profiles?.[0] ? (
                        editingDepartment === user.id ? (
                          <div className="flex items-center gap-1">
                            <select
                              defaultValue={staffDept || ''}
                              onChange={(e) => handleChangeDepartment(user.id, e.target.value)}
                              className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-navy"
                              autoFocus
                            >
                              {DEPARTMENTS.map((dept) => (
                                <option key={dept.value} value={dept.value}>
                                  {dept.label}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => setEditingDepartment(null)}
                              className="text-gray-400 hover:text-gray-600 text-xs"
                            >
                              &#10005;
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setEditingDepartment(user.id)}
                            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-indigo-50 text-indigo-700 cursor-pointer hover:bg-indigo-100 transition-colors"
                            title="Click to change department"
                          >
                            {deptLabel || 'Not set'}
                            <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                        )
                      ) : user.role === 'staff' && !user.staff_profiles?.[0] ? (
                        <span className="text-xs text-orange-500 italic">No profile</span>
                      ) : user.role === 'affiliate' ? (
                        <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700">
                          External
                        </span>
                      ) : user.role === 'admin' ? (
                        <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-purple-50 text-purple-700">
                          Administration
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : user.status === 'pending'
                            ? 'bg-orange-100 text-orange-800'
                            : user.status === 'suspended'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    {/* Details: Employee ID / Referral Code */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.role === 'staff' && user.staff_profiles?.[0] && (
                        <span className="text-xs">ID: {user.staff_profiles[0].employee_id}</span>
                      )}
                      {user.role === 'affiliate' && user.affiliate_profiles?.[0] && (
                        <span className="text-xs">Ref: {user.affiliate_profiles[0].referral_code}</span>
                      )}
                      {user.role === 'admin' && (
                        <span className="text-xs text-gray-400">System admin</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        {user.status === 'active' && (
                          <button
                            onClick={() => handleSuspend(user.id)}
                            className="text-red-600 hover:text-red-800 font-medium"
                            title="Suspend user"
                          >
                            Suspend
                          </button>
                        )}
                        {user.status === 'suspended' && (
                          <button
                            onClick={() => handleActivate(user.id)}
                            className="text-green-600 hover:text-green-800 font-medium"
                            title="Activate user"
                          >
                            Activate
                          </button>
                        )}
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-800 font-medium"
                            title="Delete user"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-500 text-center">
        Showing {filteredUsers.length} of {users.length} users
      </div>
    </div>
  );
}
