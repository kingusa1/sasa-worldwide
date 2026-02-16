'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface VoucherItem {
  id: string;
  code: string;
  status: string;
  product_name: string | null;
  created_at: string;
  sold_at: string | null;
  expires_at: string | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  salesperson_name: string | null;
  transaction_date: string | null;
  amount: number | null;
}

interface ProductItem {
  name: string;
}

interface VoucherListProps {
  projectId: string;
  products?: ProductItem[];
}

export function VoucherList({ projectId, products }: VoucherListProps) {
  const [vouchers, setVouchers] = useState<VoucherItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchVouchers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        view: 'list',
        page: page.toString(),
        limit: '50',
      });
      if (statusFilter) params.set('status', statusFilter);
      if (productFilter) params.set('product_name', productFilter);
      if (search) params.set('search', search);

      const res = await fetch(`/api/admin/projects/${projectId}/vouchers?${params}`);
      const data = await res.json();
      if (data.success) {
        setVouchers(data.vouchers);
        setTotalPages(data.pagination.totalPages);
        setTotal(data.pagination.total);
      }
    } catch {}
    setLoading(false);
  }, [projectId, page, statusFilter, productFilter, search]);

  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      available: 'bg-green-100 text-green-800',
      sold: 'bg-blue-100 text-blue-800',
      reserved: 'bg-yellow-100 text-yellow-800',
      expired: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">All Statuses</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="reserved">Reserved</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        {products && products.length > 0 && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">Product</label>
            <select
              value={productFilter}
              onChange={(e) => { setProductFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All Products</option>
              {products.map((p) => (
                <option key={p.name} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>
        )}

        <form onSubmit={handleSearch} className="flex gap-2">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Search Code</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search voucher code..."
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-48"
              />
              <button type="submit" className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>
        </form>

        <div className="ml-auto text-sm text-gray-500">
          {total} voucher{total !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Voucher Code</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Product</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Client Name</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Client Phone</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Client Email</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Sales Person</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Date Assigned</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">Loading...</td>
              </tr>
            ) : vouchers.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">No vouchers found</td>
              </tr>
            ) : (
              vouchers.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono font-medium text-gray-900">{v.code}</td>
                  <td className="px-4 py-3 text-gray-600">{v.product_name || '-'}</td>
                  <td className="px-4 py-3">{statusBadge(v.status)}</td>
                  <td className="px-4 py-3 text-gray-900">{v.customer_name || '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{v.customer_phone || '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{v.customer_email || '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{v.salesperson_name || '-'}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {v.sold_at ? new Date(v.sold_at).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
