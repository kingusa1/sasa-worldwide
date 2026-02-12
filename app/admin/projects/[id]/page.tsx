/**
 * Project Detail Page
 * Admin views project details, stats, and navigates to sub-sections
 */

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getProjectById, getVoucherInventory, getProjectAssignments } from '@/lib/supabase/projects';
import { supabaseAdmin } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'admin') {
    redirect('/login');
  }

  // Fetch project data in parallel
  const [projectResult, inventoryResult, assignmentsResult, transactionsResult] = await Promise.all([
    getProjectById(params.id),
    getVoucherInventory(params.id),
    getProjectAssignments(params.id),
    supabaseAdmin
      .from('sales_transactions')
      .select('amount, commission_amount, payment_status, fulfillment_status, created_at, customers(name, email), users!sales_transactions_salesperson_id_fkey(name)')
      .eq('project_id', params.id)
      .eq('payment_status', 'succeeded')
      .order('created_at', { ascending: false }),
  ]);

  const project = projectResult.data;

  if (!project) {
    redirect('/admin/projects');
  }

  const inventory = inventoryResult.data || { total: 0, available: 0, sold: 0, reserved: 0, expired: 0 };
  const assignments = assignmentsResult.data || [];
  const transactions = transactionsResult.data || [];
  const totalRevenue = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
  const totalCommissions = transactions.reduce((sum, t) => sum + Number(t.commission_amount || 0), 0);

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800',
    active: 'bg-green-100 text-green-800',
    paused: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-blue-100 text-blue-800',
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Projects
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
              <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${statusColors[project.status] || 'bg-gray-100 text-gray-800'}`}>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </span>
              <Link
                href={`/admin/projects/${params.id}/edit`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-navy border border-navy rounded-lg hover:bg-navy hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </Link>
            </div>
            <p className="text-gray-600 mt-1">{project.description || 'No description'}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span>Type: <strong className="text-gray-700">{project.project_type}</strong></span>
              <span>Slug: <code className="bg-gray-100 px-2 py-0.5 rounded">{project.slug}</code></span>
              <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          {project.logo_url && (
            <img src={project.logo_url} alt={project.name} className="h-16 object-contain" />
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-600">Revenue</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">AED {totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">{transactions.length} transactions</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-600">Commissions Paid</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">AED {totalCommissions.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">{project.commission_rate}% rate</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-600">Vouchers Available</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{inventory.available}</p>
          <p className="text-xs text-gray-500 mt-1">{inventory.sold} sold / {inventory.total} total</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-600">Salespeople</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{assignments.length}</p>
          <p className="text-xs text-gray-500 mt-1">assigned to this project</p>
        </div>
      </div>

      {/* Pricing Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-600">Unit Price</p>
            <p className="text-xl font-bold text-gray-900">AED {Number(project.price).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Cost of Goods</p>
            <p className="text-xl font-bold text-gray-900">AED {Number(project.cost_of_goods).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Commission Rate</p>
            <p className="text-xl font-bold text-gray-900">{project.commission_rate}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Profit per Sale</p>
            <p className="text-xl font-bold text-green-600">
              AED {(Number(project.price) - Number(project.cost_of_goods) - (Number(project.price) * Number(project.commission_rate) / 100)).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Form Fields ({project.form_fields?.length || 0})</h2>
        {project.form_fields && project.form_fields.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {project.form_fields.map((field: any, idx: number) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center text-navy text-xs font-bold">
                  {idx + 1}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{field.label}</p>
                  <p className="text-xs text-gray-500">
                    {field.type} {field.required ? '(required)' : '(optional)'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No form fields configured</p>
        )}
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href={`/admin/projects/${params.id}/assignments`}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-navy transition-colors">
              Assignments & QR Codes
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            Assign salespeople and generate QR codes. {assignments.length} salespeople assigned.
          </p>
        </Link>

        <Link
          href={`/admin/projects/${params.id}/vouchers`}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-navy transition-colors">
              Voucher Inventory
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            Upload and manage voucher codes. {inventory.available} available, {inventory.sold} sold.
          </p>
        </Link>

        <Link
          href="/crm/customers"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-navy transition-colors">
              View Customers
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            View customers from this project. {transactions.length} purchases completed.
          </p>
        </Link>
      </div>

      {/* Recent Transactions */}
      {transactions.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salesperson</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.slice(0, 20).map((t: any, idx: number) => {
                  const fulfillmentColors: Record<string, string> = {
                    completed: 'bg-green-100 text-green-800',
                    email_sent: 'bg-yellow-100 text-yellow-800',
                    failed: 'bg-red-100 text-red-800',
                    pending: 'bg-gray-100 text-gray-800',
                  };
                  return (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(t.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="text-gray-900">{t.customers?.name || '-'}</div>
                        <div className="text-gray-500 text-xs">{t.customers?.email || ''}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {t.users?.name || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        AED {Number(t.amount).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-orange-600">
                        AED {Number(t.commission_amount || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800">
                          {t.payment_status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${fulfillmentColors[t.fulfillment_status] || 'bg-gray-100 text-gray-800'}`}>
                          {(t.fulfillment_status || 'pending').replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
