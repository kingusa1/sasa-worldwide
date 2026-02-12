'use client';

/**
 * VoucherUpload Component
 * Upload voucher codes from CSV file
 */

import { useState, useRef } from 'react';
import { Upload, Download, CheckCircle2, AlertCircle } from 'lucide-react';

interface VoucherUploadProps {
  projectId: string;
  onUploadComplete?: () => void;
}

export function VoucherUpload({ projectId, onUploadComplete }: VoucherUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [result, setResult] = useState<{
    imported: number;
    duplicates: number;
    total: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setSuccess('');
    setResult(null);
    setLoading(true);

    try {
      // Validate file type
      if (!file.name.endsWith('.csv')) {
        throw new Error('Please upload a CSV file');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File too large. Maximum size is 5MB');
      }

      // Upload file
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/admin/projects/${projectId}/vouchers/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload vouchers');
      }

      // Success
      setSuccess(data.message || 'Vouchers uploaded successfully');
      setResult({
        imported: data.imported,
        duplicates: data.duplicates,
        total: data.total,
      });

      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Call callback
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    // Create CSV template
    const csv = 'code,expires_at\nCAFU-2026-ABC123,2026-12-31\nCAFU-2026-DEF456,2026-12-31\nCAFU-2026-GHI789,2026-12-31';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'voucher-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-navy-500 transition-colors">
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Upload Voucher Codes
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Upload a CSV file with voucher codes. Maximum file size: 5MB
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

        <label
          htmlFor="voucher-upload"
          className="inline-flex items-center gap-2 px-6 py-3 bg-navy-600 text-white rounded-lg hover:bg-navy-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload className="h-5 w-5" />
          {loading ? 'Uploading...' : 'Select CSV File'}
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-900">Upload Failed</h4>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-green-900">Upload Successful</h4>
            <p className="text-sm text-green-700">{success}</p>
            {result && (
              <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-green-600 font-semibold">
                    {result.total}
                  </p>
                  <p className="text-green-700">Total Codes</p>
                </div>
                <div>
                  <p className="text-green-600 font-semibold">
                    {result.imported}
                  </p>
                  <p className="text-green-700">Imported</p>
                </div>
                <div>
                  <p className="text-orange-600 font-semibold">
                    {result.duplicates}
                  </p>
                  <p className="text-orange-700">Duplicates Skipped</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CSV Format Guide */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">CSV Format</h4>
        <p className="text-sm text-blue-700 mb-3">
          Your CSV file should have the following format:
        </p>
        <pre className="bg-white border border-blue-200 rounded p-3 text-sm font-mono text-gray-800 overflow-x-auto">
          {`code,expires_at
CAFU-2026-ABC123,2026-12-31
CAFU-2026-DEF456,2026-12-31
CAFU-2026-GHI789,`}
        </pre>
        <ul className="mt-3 text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>First row must be headers: <code className="bg-white px-1 rounded">code,expires_at</code></li>
          <li>The <code className="bg-white px-1 rounded">code</code> column is required</li>
          <li>The <code className="bg-white px-1 rounded">expires_at</code> column is optional (format: YYYY-MM-DD)</li>
          <li>Duplicate codes will be automatically skipped</li>
        </ul>

        <button
          type="button"
          onClick={downloadTemplate}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <Download className="h-4 w-4" />
          Download Template
        </button>
      </div>
    </div>
  );
}
