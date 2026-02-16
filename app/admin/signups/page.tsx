'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface SignupRequest {
  id: string;
  user_id: string;
  status: string;
  requested_at: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    email_verified: boolean;
    created_at: string;
    staff_profiles?: Array<{
      employee_id: string;
      department: string;
      phone: string;
    }>;
    affiliate_profiles?: Array<{
      phone: string;
      referral_code: string;
    }>;
  };
}

export default function AdminSignupsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [signups, setSignups] = useState<SignupRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [selectedSignup, setSelectedSignup] = useState<SignupRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session?.user?.role !== 'admin') {
      router.push('/');
    }
  }, [session, status, router]);

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchPendingSignups();
    }
  }, [session]);

  const fetchPendingSignups = async () => {
    try {
      const response = await fetch('/api/admin/signups/pending');
      const data = await response.json();

      if (response.ok) {
        setSignups(data.signups || []);
      } else {
        setError(data.error || 'Failed to load signups');
      }
    } catch (error) {
      setError('Failed to load pending signups');
      console.error('Error fetching signups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (signupId: string) => {
    if (!confirm('Are you sure you want to approve this signup?')) {
      return;
    }

    setActionLoading(signupId);
    try {
      const response = await fetch(`/api/admin/signups/${signupId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvalNotes: 'Approved by admin' }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Signup approved successfully! User has been notified via email.');
        fetchPendingSignups(); // Refresh list
        setSelectedSignup(null);
      } else {
        alert(data.error || 'Failed to approve signup');
      }
    } catch (error) {
      alert('Failed to approve signup');
      console.error('Approval error:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (signupId: string) => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    if (!confirm('Are you sure you want to reject this signup?')) {
      return;
    }

    setActionLoading(signupId);
    try {
      const response = await fetch(`/api/admin/signups/${signupId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejectionReason: rejectReason }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Signup rejected. User has been notified via email.');
        fetchPendingSignups(); // Refresh list
        setSelectedSignup(null);
        setRejectReason('');
      } else {
        alert(data.error || 'Failed to reject signup');
      }
    } catch (error) {
      alert('Failed to reject signup');
      console.error('Rejection error:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center gap-2">
            <svg className="animate-spin h-8 w-8 text-navy" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="mt-4 text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (session?.user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/logo/sasa-logo-color.png"
                alt="SASA Worldwide"
                width={150}
                height={50}
                className="h-10 w-auto"
              />
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Admin: {session?.user?.name}
              </span>
              <Link
                href="/"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-navy"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">
            Pending Signups
          </h1>
          <p className="text-gray-600">
            Review and approve staff and affiliate registration requests
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {signups.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Pending Signups
            </h3>
            <p className="text-gray-600">
              All registration requests have been processed.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requested At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email Verified
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {signups.map((signup) => (
                  <tr key={signup.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {signup.user.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {signup.user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        signup.user.role === 'affiliate'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {signup.user.role === 'affiliate' ? 'Affiliate' : 'Staff'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {signup.user.role === 'affiliate' ? (
                        <div className="text-sm text-gray-900">
                          {signup.user.affiliate_profiles?.[0]?.referral_code || 'N/A'}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-900">
                          <span className="font-mono">{signup.user.staff_profiles?.[0]?.employee_id || 'N/A'}</span>
                          {' - '}
                          {signup.user.staff_profiles?.[0]?.department || 'N/A'}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDate(signup.requested_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {signup.user.email_verified ? (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedSignup(signup)}
                        className="text-navy hover:text-navy/80 font-medium mr-4"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedSignup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-navy">
                  Review Signup Request
                </h2>
                <button
                  onClick={() => {
                    setSelectedSignup(null);
                    setRejectReason('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <p className="text-gray-900">{selectedSignup.user.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <p className="text-gray-900">{selectedSignup.user.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  selectedSignup.user.role === 'affiliate'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {selectedSignup.user.role === 'affiliate' ? 'Affiliate' : 'Staff'}
                </span>
              </div>

              {selectedSignup.user.role === 'affiliate' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Referral Code
                    </label>
                    <p className="text-gray-900 font-mono">
                      {selectedSignup.user.affiliate_profiles?.[0]?.referral_code || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <p className="text-gray-900">
                      {selectedSignup.user.affiliate_profiles?.[0]?.phone || 'Not provided'}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Employee ID
                      </label>
                      <p className="text-gray-900 font-mono">
                        {selectedSignup.user.staff_profiles?.[0]?.employee_id || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Department
                      </label>
                      <p className="text-gray-900">
                        {selectedSignup.user.staff_profiles?.[0]?.department || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <p className="text-gray-900">
                      {selectedSignup.user.staff_profiles?.[0]?.phone || 'Not provided'}
                    </p>
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Verified
                  </label>
                  <p className="text-gray-900">
                    {selectedSignup.user.email_verified ? (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        No
                      </span>
                    )}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Requested At
                  </label>
                  <p className="text-gray-900 text-sm">
                    {formatDate(selectedSignup.requested_at)}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason (optional)
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Provide a reason if rejecting this signup..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => handleReject(selectedSignup.id)}
                disabled={actionLoading === selectedSignup.id}
                className="flex-1 px-6 py-3 border border-red-600 text-red-600 rounded-xl hover:bg-red-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading === selectedSignup.id ? 'Processing...' : 'Reject'}
              </button>
              <button
                onClick={() => handleApprove(selectedSignup.id)}
                disabled={actionLoading === selectedSignup.id}
                className="flex-1 px-6 py-3 bg-navy text-white rounded-xl hover:bg-navy/90 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading === selectedSignup.id ? 'Processing...' : 'Approve'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
