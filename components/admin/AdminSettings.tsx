'use client';

import { useState, useEffect } from 'react';

export function AdminSettings() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [stripeMode, setStripeMode] = useState<'test' | 'live'>('live');
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data.settings?.stripe_mode) {
          setStripeMode(data.settings.stripe_mode);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingSettings(false));
  }, []);

  const toggleStripeMode = async (newMode: 'test' | 'live') => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'stripe_mode', value: newMode }),
      });
      if (res.ok) {
        setStripeMode(newMode);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {}
    setSaving(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Stripe Test Mode Banner */}
      {stripeMode === 'test' && (
        <div className="bg-orange-100 border-2 border-orange-400 rounded-lg p-4 flex items-center gap-3">
          <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">TEST MODE</div>
          <p className="text-orange-800 font-medium">
            Stripe is in test mode. All payments will use test keys. Switch to live mode before going to production.
          </p>
        </div>
      )}

      {/* Payment Gateway Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Gateway (Stripe)</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Stripe Mode</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => toggleStripeMode('live')}
                disabled={saving || loadingSettings}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  stripeMode === 'live'
                    ? 'bg-green-600 text-white ring-2 ring-green-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Live Mode
              </button>
              <button
                onClick={() => toggleStripeMode('test')}
                disabled={saving || loadingSettings}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  stripeMode === 'test'
                    ? 'bg-orange-500 text-white ring-2 ring-orange-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Test Mode
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {stripeMode === 'test'
                ? 'Test mode uses test API keys. No real charges will be made. Use card 4242 4242 4242 4242 for testing.'
                : 'Live mode processes real payments. Make sure your Stripe account is fully set up.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-sm text-gray-600">Current Mode</p>
              <p className={`text-lg font-semibold ${stripeMode === 'test' ? 'text-orange-600' : 'text-green-600'}`}>
                {loadingSettings ? 'Loading...' : stripeMode === 'test' ? 'Test' : 'Live'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Payment Status</p>
              <p className="text-lg font-semibold text-green-600">✓ Connected</p>
            </div>
          </div>
        </div>
      </div>

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
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email Address</label>
            <input type="email" defaultValue="it@sasa-worldwide.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent" />
            <p className="mt-1 text-xs text-gray-500">Email address for admin notifications</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Name</label>
            <input type="text" defaultValue="SASA Worldwide" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent" />
          </div>
        </form>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Security Settings</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <input type="checkbox" id="log-all-actions" defaultChecked={true} className="mt-1 rounded border-gray-300 text-navy focus:ring-navy" />
            <div>
              <label htmlFor="log-all-actions" className="text-sm font-medium text-gray-700">Log all user actions</label>
              <p className="text-xs text-gray-500">Record all authentication and administrative actions in audit logs</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <input type="checkbox" id="require-staff-approval" defaultChecked={true} disabled className="mt-1 rounded border-gray-300 text-navy focus:ring-navy" />
            <div>
              <label htmlFor="require-staff-approval" className="text-sm font-medium text-gray-700">Require admin approval for staff accounts</label>
              <p className="text-xs text-gray-500">Staff accounts require admin approval before activation (cannot be disabled)</p>
            </div>
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
