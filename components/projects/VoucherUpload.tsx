'use client';

import { useState, useRef } from 'react';
import { Upload, Download, CheckCircle2, AlertCircle, Plus, TestTube } from 'lucide-react';

interface ProductItem {
  name: string;
  price: number;
}

interface VoucherUploadProps {
  projectId: string;
  products?: ProductItem[];
  onUploadComplete?: () => void;
}

export function VoucherUpload({ projectId, products, onUploadComplete }: VoucherUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [result, setResult] = useState<{ imported: number; duplicates: number; total: number } | null>(null);
  const [selectedProduct, setSelectedProduct] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manual add state
  const [manualCode, setManualCode] = useState('');
  const [manualProduct, setManualProduct] = useState('');
  const [manualExpiry, setManualExpiry] = useState('');
  const [manualLoading, setManualLoading] = useState(false);
  const [manualMessage, setManualMessage] = useState('');

  // Test codes state
  const [testLoading, setTestLoading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setSuccess('');
    setResult(null);
    setLoading(true);

    try {
      if (!file.name.endsWith('.csv')) throw new Error('Please upload a CSV file');
      if (file.size > 5 * 1024 * 1024) throw new Error('File too large. Maximum size is 5MB');

      const formData = new FormData();
      formData.append('file', file);
      if (selectedProduct) {
        formData.append('product_name', selectedProduct);
      }

      const response = await fetch(`/api/admin/projects/${projectId}/vouchers/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to upload vouchers');

      setSuccess(data.message || 'Vouchers uploaded successfully');
      setResult({ imported: data.imported, duplicates: data.duplicates, total: data.total });
      if (fileInputRef.current) fileInputRef.current.value = '';
      onUploadComplete?.();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleManualAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;

    setManualLoading(true);
    setManualMessage('');

    try {
      const res = await fetch(`/api/admin/projects/${projectId}/vouchers/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: manualCode.trim(),
          product_name: manualProduct || null,
          expires_at: manualExpiry || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add voucher');

      setManualMessage(`Added voucher: ${manualCode.trim().toUpperCase()}`);
      setManualCode('');
      onUploadComplete?.();
    } catch (err: any) {
      setManualMessage(`Error: ${err.message}`);
    } finally {
      setManualLoading(false);
    }
  };

  const addTestCodes = async () => {
    setTestLoading(true);
    setManualMessage('');

    const productList = products && products.length > 0 ? products : [{ name: 'Default' }];
    let added = 0;
    let errors = 0;

    for (const product of productList) {
      for (let i = 1; i <= 3; i++) {
        const code = `TEST-${product.name.toUpperCase().replace(/[^A-Z0-9]+/g, '')}-${String(i).padStart(3, '0')}`;
        try {
          const res = await fetch(`/api/admin/projects/${projectId}/vouchers/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, product_name: product.name }),
          });
          if (res.ok) added++;
          else errors++;
        } catch {
          errors++;
        }
      }
    }

    setManualMessage(`Added ${added} test codes${errors > 0 ? ` (${errors} duplicates skipped)` : ''}`);
    setTestLoading(false);
    onUploadComplete?.();
  };

  const downloadTemplate = () => {
    const csv = 'code,expires_at\nVOUCHER-001,2026-12-31\nVOUCHER-002,2026-12-31\nVOUCHER-003,';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'voucher-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const hasProducts = products && products.length > 0;

  return (
    <div className="space-y-6">
      {/* CSV Upload Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Upload from CSV</h3>

        {/* Product Selector for Upload */}
        {hasProducts && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assign to Product
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">-- Select Product --</option>
              {products!.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name} (AED {p.price})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-navy-500 transition-colors">
          <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-3">
            Upload a CSV file with voucher codes{selectedProduct ? ` for ${selectedProduct}` : ''}. Max 5MB.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            disabled={loading}
            className="hidden"
            id="voucher-upload"
          />

          <div className="flex items-center justify-center gap-3">
            <label
              htmlFor="voucher-upload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-navy-600 text-white rounded-lg hover:bg-navy-700 transition-colors cursor-pointer text-sm"
            >
              <Upload className="h-4 w-4" />
              {loading ? 'Uploading...' : 'Select CSV File'}
            </label>
            <button
              type="button"
              onClick={downloadTemplate}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
            >
              <Download className="h-4 w-4" />
              Template
            </button>
          </div>
        </div>

        {/* Error / Success */}
        {error && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        {success && (
          <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-green-700">{success}</p>
              {result && (
                <div className="mt-2 flex gap-4 text-xs">
                  <span className="text-green-600">{result.imported} imported</span>
                  {result.duplicates > 0 && <span className="text-orange-600">{result.duplicates} duplicates</span>}
                </div>
              )}
            </div>
          </div>
        )}

        {/* CSV Format */}
        <div className="mt-3 text-xs text-gray-500">
          CSV must have a <code className="bg-gray-100 px-1 rounded">code</code> column. Optional: <code className="bg-gray-100 px-1 rounded">expires_at</code> (YYYY-MM-DD).
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-200" />

      {/* Manual Add Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Add Voucher Manually</h3>
        <form onSubmit={handleManualAdd} className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs text-gray-500 mb-1">Voucher Code</label>
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="e.g. CAFU-2026-ABC123"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              required
            />
          </div>

          {hasProducts && (
            <div className="w-48">
              <label className="block text-xs text-gray-500 mb-1">Product</label>
              <select
                value={manualProduct}
                onChange={(e) => setManualProduct(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">-- Select --</option>
                {products!.map((p) => (
                  <option key={p.name} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="w-40">
            <label className="block text-xs text-gray-500 mb-1">Expiry (optional)</label>
            <input
              type="date"
              value={manualExpiry}
              onChange={(e) => setManualExpiry(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={manualLoading || !manualCode.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm disabled:opacity-50 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {manualLoading ? 'Adding...' : 'Add Code'}
          </button>
        </form>

        {manualMessage && (
          <p className={`mt-2 text-sm ${manualMessage.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
            {manualMessage}
          </p>
        )}
      </div>

      {/* Divider */}
      <hr className="border-gray-200" />

      {/* Test Codes */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Test Codes</h3>
        <p className="text-sm text-gray-600 mb-3">
          Add 3 dummy voucher codes{hasProducts ? ' per product' : ''} for testing purposes.
        </p>
        <button
          onClick={addTestCodes}
          disabled={testLoading}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm disabled:opacity-50 flex items-center gap-2"
        >
          <TestTube className="h-4 w-4" />
          {testLoading ? 'Adding Test Codes...' : 'Add Test Codes'}
        </button>
      </div>
    </div>
  );
}
