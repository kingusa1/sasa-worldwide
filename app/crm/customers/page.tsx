/**
 * CRM Customers Page
 * View and manage all customers
 */

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase/server';
import Link from 'next/link';
import { Users, Plus, Download } from 'lucide-react';
import { ServerError } from '@/components/ui/ErrorBanner';

export default async function CustomersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Admins, staff, and affiliates can view customers
  if (session.user.role !== 'admin' && session.user.role !== 'staff' && session.user.role !== 'affiliate') {
    redirect('/');
  }

  // Fetch customers - try with join, fallback to basic query
  let customers: any[] = [];
  let crmError: string | null = null;
  try {
    const { data, error } = await supabaseAdmin
      .from('customers')
      .select(`
        *,
        referrer:users!customers_referred_by_fkey(id, name, email),
        sales_transactions(id, amount, payment_status, created_at, salesperson_id, projects(name), users!sales_transactions_salesperson_id_fkey(name))
      `)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      crmError = `Join query failed: ${error.message} (using fallback)`;
      console.error('[SASA CRM] Join query failed, trying basic:', error.message);
      const { data: basicData, error: basicError } = await supabaseAdmin
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      if (basicError) crmError = `Customers query failed: ${basicError.message}`;
      customers = (basicData || []).map((c: any) => ({ ...c, sales_transactions: [] }));
    } else {
      customers = data || [];
    }
  } catch (err: any) {
    crmError = `Customers fetch error: ${err.message}`;
    console.error('[SASA CRM] Error fetching customers:', err.message);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
            <p className="text-gray-600 mt-1">
              Manage your customer database
            </p>
          </div>
          <div className="flex gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="h-5 w-5" />
              Export
            </button>
            <Link
              href="/crm/customers/new"
              className="flex items-center gap-2 px-6 py-3 bg-navy-600 text-white rounded-lg hover:bg-navy-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Customer
            </Link>
          </div>
        </div>

        {crmError && (
          <div className="mb-6">
            <ServerError title="CRM data loading error" message={crmError} />
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Total Customers</p>
            <p className="text-3xl font-bold text-gray-900">
              {customers?.length || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">This Month</p>
            <p className="text-3xl font-bold text-gray-900">
              {customers?.filter((c) => {
                const date = new Date(c.created_at);
                const now = new Date();
                return (
                  date.getMonth() === now.getMonth() &&
                  date.getFullYear() === now.getFullYear()
                );
              }).length || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">With Purchases</p>
            <p className="text-3xl font-bold text-gray-900">
              {customers?.filter((c: any) => c.sales_transactions?.some((t: any) => t.payment_status === 'succeeded')).length || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-gray-900">
              AED{' '}
              {customers
                ?.reduce((sum: number, c: any) => {
                  return (
                    sum +
                    (c.sales_transactions?.filter((t: any) => t.payment_status === 'succeeded').reduce(
                      (s: number, t: any) => s + Number(t.amount),
                      0
                    ) || 0)
                  );
                }, 0)
                .toFixed(0) || '0'}
            </p>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {!customers || customers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No customers yet
              </h3>
              <p className="text-gray-600 mb-6">
                Customers will appear here after their first purchase
              </p>
              <Link
                href="/crm/customers/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-navy-600 text-white rounded-lg hover:bg-navy-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Add Customer Manually
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Referred By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Purchases
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Spent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map((customer: any) => {
                    const succeededTx = customer.sales_transactions?.filter((t: any) => t.payment_status === 'succeeded') || [];
                    const totalSpent = succeededTx.reduce(
                      (sum: number, t: any) => sum + Number(t.amount),
                      0
                    ) || 0;

                    return (
                      <tr key={customer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {customer.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {customer.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            {customer.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {customer.city || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {customer.referrer?.name || customer.sales_transactions?.[0]?.users?.name || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {succeededTx.length}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            AED {totalSpent.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(customer.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
