'use client';

import { useState } from 'react';

export function AdminSettings() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* System Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">System Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Application Version</p>
            <p className="text-lg font-semibold text-gray-900">1.0.0</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Environment</p>
            <p className="text-lg font-semibold text-gray-900">
              {process.env.NODE_ENV === 'production' ? 'Production' : 'Development'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Database Status</p>
            <p className="text-lg font-semibold text-green-600">✓ Connected</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email Service</p>
            <p className="text-lg font-semibold text-green-600">✓ Configured</p>
          </div>
        </div>
      </div>

      {/* Email Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Email Settings</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admin Email Address
            </label>
            <input
              type="email"
              defaultValue="it@sasa-worldwide.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">
              Email address for admin notifications (new signups, system alerts)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Name
            </label>
            <input
              type="text"
              defaultValue="SASA Worldwide"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reply-To Email
            </label>
            <input
              type="email"
              defaultValue="noreply@sasa-worldwide.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
            />
          </div>
        </form>
      </div>

      {/* Authentication Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Authentication Settings</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Session Duration (days)
            </label>
            <input
              type="number"
              defaultValue={30}
              min={1}
              max={90}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Verification Token Expiry (hours)
            </label>
            <input
              type="number"
              defaultValue={24}
              min={1}
              max={168}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password Reset Token Expiry (hours)
            </label>
            <input
              type="number"
              defaultValue={1}
              min={1}
              max={24}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
            />
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="require-email-verification"
              defaultChecked={true}
              className="mt-1 rounded border-gray-300 text-navy focus:ring-navy"
            />
            <div>
              <label htmlFor="require-email-verification" className="text-sm font-medium text-gray-700">
                Require email verification for new accounts
              </label>
              <p className="text-xs text-gray-500">
                Users must verify their email before their account can be approved
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="auto-approve-affiliates"
              defaultChecked={true}
              className="mt-1 rounded border-gray-300 text-navy focus:ring-navy"
            />
            <div>
              <label htmlFor="auto-approve-affiliates" className="text-sm font-medium text-gray-700">
                Auto-approve affiliate accounts
              </label>
              <p className="text-xs text-gray-500">
                Affiliate accounts get instant access without admin approval
              </p>
            </div>
          </div>
        </form>
      </div>

      {/* Staff Registration Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Staff Registration Settings</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Allowed Email Domain
            </label>
            <input
              type="text"
              defaultValue="sasa-worldwide.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">
              Only emails from this domain can register as staff
            </p>
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="require-employee-id"
              defaultChecked={true}
              disabled
              className="mt-1 rounded border-gray-300 text-navy focus:ring-navy"
            />
            <div>
              <label htmlFor="require-employee-id" className="text-sm font-medium text-gray-700">
                Require admin-provided employee ID for staff registration
              </label>
              <p className="text-xs text-gray-500">
                Staff members must use an employee ID created by admin (cannot be disabled)
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="require-staff-approval"
              defaultChecked={true}
              disabled
              className="mt-1 rounded border-gray-300 text-navy focus:ring-navy"
            />
            <div>
              <label htmlFor="require-staff-approval" className="text-sm font-medium text-gray-700">
                Require admin approval for staff accounts
              </label>
              <p className="text-xs text-gray-500">
                Staff accounts require admin approval before activation (cannot be disabled)
              </p>
            </div>
          </div>
        </form>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Security Settings</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="log-all-actions"
              defaultChecked={true}
              className="mt-1 rounded border-gray-300 text-navy focus:ring-navy"
            />
            <div>
              <label htmlFor="log-all-actions" className="text-sm font-medium text-gray-700">
                Log all user actions
              </label>
              <p className="text-xs text-gray-500">
                Record all authentication and administrative actions in audit logs
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password Minimum Length
            </label>
            <input
              type="number"
              defaultValue={8}
              min={8}
              max={32}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
            />
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="require-strong-password"
              defaultChecked={true}
              className="mt-1 rounded border-gray-300 text-navy focus:ring-navy"
            />
            <div>
              <label htmlFor="require-strong-password" className="text-sm font-medium text-gray-700">
                Require strong passwords
              </label>
              <p className="text-xs text-gray-500">
                Passwords must contain uppercase, lowercase, and numbers
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-lg shadow-sm border-2 border-red-200 p-6">
        <h2 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-900">Clear All Audit Logs</h3>
              <p className="text-sm text-gray-600">
                Permanently delete all audit logs from the system
              </p>
            </div>
            <button
              type="button"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
            >
              Clear Logs
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-900">Reset System Configuration</h3>
              <p className="text-sm text-gray-600">
                Reset all settings to default values
              </p>
            </div>
            <button
              type="button"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {saved ? (
              <span className="text-green-600 font-medium">✓ Settings saved successfully</span>
            ) : (
              'Make changes above and click Save Settings'
            )}
          </p>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-navy text-white rounded-lg hover:bg-navy/90 font-medium transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
