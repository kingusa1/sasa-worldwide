/**
 * Project Voucher Management Page
 * Upload and manage voucher codes for a project
 */

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getProjectById, getVoucherInventory } from '@/lib/supabase/projects';
import { VoucherUpload } from '@/components/projects/VoucherUpload';
import { ArrowLeft, Package } from 'lucide-react';
import Link from 'next/link';

export default async function ProjectVouchersPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  if (session.user.role !== 'admin') {
    redirect('/');
  }

  // Fetch project and voucher inventory
  const [projectResult, inventoryResult] = await Promise.all([
    getProjectById(params.id),
    getVoucherInventory(params.id),
  ]);

  const project = projectResult.data;
  const inventory = inventoryResult.data || { total: 0, available: 0, sold: 0, reserved: 0, expired: 0 };

  if (!project) {
    redirect('/admin/projects');
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {project.name}
              </h1>
              <p className="text-gray-600 mt-1">Voucher Code Management</p>
            </div>
            {project.logo_url && (
              <img
                src={project.logo_url}
                alt={project.name}
                className="h-16 object-contain"
              />
            )}
          </div>
        </div>

        {/* Inventory Overview */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Package className="h-6 w-6 text-navy-600" />
            <h2 className="text-xl font-semibold">Voucher Inventory</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total Vouchers */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Total Vouchers</p>
              <p className="text-3xl font-bold text-gray-900">
                {inventory.total}
              </p>
            </div>

            {/* Available */}
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600 mb-1">Available</p>
              <p className="text-3xl font-bold text-green-700">
                {inventory.available}
              </p>
            </div>

            {/* Sold */}
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600 mb-1">Sold</p>
              <p className="text-3xl font-bold text-blue-700">
                {inventory.sold}
              </p>
            </div>

            {/* Reserved */}
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-sm text-yellow-600 mb-1">Reserved</p>
              <p className="text-3xl font-bold text-yellow-700">
                {inventory.reserved}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Inventory Status</span>
              <span>
                {inventory.total > 0
                  ? Math.round((inventory.sold / inventory.total) * 100)
                  : 0}
                % sold
              </span>
            </div>
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500"
                style={{
                  width: `${inventory.total > 0 ? (inventory.sold / inventory.total) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          {/* Low Stock Warning */}
          {inventory.available < 10 && inventory.available > 0 && (
            <div className="mt-4 bg-orange-50 border border-orange-200 text-orange-700 px-4 py-3 rounded-lg">
              <p className="font-semibold">⚠️ Low Stock Alert</p>
              <p className="text-sm">
                Only {inventory.available} voucher{inventory.available !== 1 ? 's' : ''} remaining. Consider uploading more codes.
              </p>
            </div>
          )}

          {/* Out of Stock Warning */}
          {inventory.available === 0 && inventory.total > 0 && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="font-semibold">❌ Out of Stock</p>
              <p className="text-sm">
                All vouchers have been sold. Upload more codes to continue selling.
              </p>
            </div>
          )}
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Voucher Codes</h2>
          <VoucherUpload projectId={params.id} />
        </div>
      </div>
    </div>
  );
}
