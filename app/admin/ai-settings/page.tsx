'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ConnectionStatus {
  connected: boolean;
  connectedAt?: string;
}

export default function AISettingsPage() {
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [disconnecting, setDisconnecting] = useState(false);

  // Check connection status on load
  useEffect(() => {
    checkStatus();
  }, []);

  // Check URL params for connection result
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('ai_connected') === 'true') {
      checkStatus();
      // Clean up URL
      window.history.replaceState({}, '', '/admin/ai-settings');
    }
    if (params.get('ai_error')) {
      alert('Failed to connect AI: ' + params.get('ai_error'));
      window.history.replaceState({}, '', '/admin/ai-settings');
    }
  }, []);

  async function checkStatus() {
    try {
      const response = await fetch('/api/auth/openrouter/status');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Failed to check status:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDisconnect() {
    setDisconnecting(true);
    try {
      await fetch('/api/auth/openrouter/disconnect', { method: 'POST' });
      await checkStatus();
    } catch (error) {
      console.error('Failed to disconnect:', error);
    } finally {
      setDisconnecting(false);
    }
  }

  function handleConnect() {
    // Redirect to OAuth flow
    window.location.href = '/api/auth/openrouter/connect';
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-navy mb-2">AI Settings</h1>
          <p className="text-gray-600 mb-8">
            Connect your AI provider to enable the SASA AI Assistant chat.
          </p>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Connection Status */}
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">OpenRouter</h3>
                    <p className="text-sm text-gray-500">
                      Access 400+ AI models including GPT-4, Claude, Gemini, and more
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {status?.connected ? (
                      <span className="flex items-center gap-2 text-green-600">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Connected
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-gray-400">
                        <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                        Not connected
                      </span>
                    )}
                  </div>
                </div>

                {status?.connectedAt && (
                  <p className="text-xs text-gray-400 mt-2">
                    Connected on {new Date(status.connectedAt).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                {status?.connected ? (
                  <button
                    onClick={handleDisconnect}
                    disabled={disconnecting}
                    className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {disconnecting ? 'Disconnecting...' : 'Disconnect'}
                  </button>
                ) : (
                  <button
                    onClick={handleConnect}
                    className="px-6 py-3 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors"
                  >
                    Connect with OpenRouter
                  </button>
                )}
              </div>

              {/* Info */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">How it works</h4>
                <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                  <li>Click "Connect with OpenRouter" to open the authorization page</li>
                  <li>Log in or create a free OpenRouter account</li>
                  <li>Authorize SASA to use your AI credits</li>
                  <li>You&apos;ll be redirected back here once connected</li>
                </ol>
                <p className="text-xs text-blue-600 mt-3">
                  OpenRouter offers free credits to get started. Your API key is stored securely on the server.
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link href="/" className="text-navy hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
