/**
 * My Projects Page
 * Salesperson views their assigned projects
 */

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getSalespersonProjects } from '@/lib/supabase/projects';
import { supabaseAdmin } from '@/lib/supabase/server';
import { Package, Download, QrCode, ExternalLink } from 'lucide-react';
import { CopyUrlButton } from '@/components/projects/CopyUrlButton';

export default async function MyProjectsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Sales staff, affiliates, and admins can access
  if (session.user.role !== 'staff' && session.user.role !== 'admin' && session.user.role !== 'affiliate') {
    redirect('/');
  }

  // If staff, check department
  if (session.user.role === 'staff') {
    const { data: profile } = await supabaseAdmin
      .from('staff_profiles')
      .select('department')
      .eq('user_id', session.user.id)
      .single();

    if (profile?.department !== 'sales') {
      redirect('/staff/dashboard');
    }
  }

  // Fetch assigned projects
  const { data: assignments, error: assignmentsError } = await getSalespersonProjects(session.user.id);

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
          <p className="text-gray-600 mt-1">
            View your assigned projects and download QR codes
          </p>
        </div>

        {/* Projects Grid */}
        {!assignments || assignments.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No projects assigned yet
            </h3>
            <p className="text-gray-600">
              Contact your admin to get assigned to projects
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment: any) => {
              const project = assignment.projects;

              return (
                <div
                  key={assignment.id}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                >
                  {/* Project Logo */}
                  {project?.logo_url && (
                    <img
                      src={project.logo_url}
                      alt={project.name}
                      className="h-16 object-contain mb-4"
                    />
                  )}

                  {/* Project Info */}
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {project?.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {project?.description || 'No description'}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                          project?.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : project?.status === 'draft'
                            ? 'bg-gray-100 text-gray-800'
                            : project?.status === 'paused'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {project?.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {project?.project_type}
                      </span>
                    </div>
                  </div>

                  {/* QR Code Preview */}
                  {assignment.qr_code_data && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4 text-center">
                      <img
                        src={assignment.qr_code_data}
                        alt={`QR Code for ${project?.name}`}
                        className="w-32 h-32 mx-auto"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Your unique QR code
                      </p>
                    </div>
                  )}

                  {/* Pricing */}
                  <div className="mb-4 py-3 border-t border-b border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-semibold">
                        AED {Number(project?.price).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-600">Your Commission:</span>
                      <span className="font-semibold text-green-600">
                        AED{' '}
                        {(
                          (Number(project?.price) *
                            Number(project?.commission_rate)) /
                          100
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Form URL */}
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Your Form URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={assignment.form_url}
                        readOnly
                        className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-300 rounded text-xs font-mono"
                      />
                      <CopyUrlButton formUrl={assignment.form_url} />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={assignment.qr_code_data}
                      download={`qr-${(project?.name || 'project').replace(/\s+/g, '-')}.png`}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-navy-600 text-white rounded-lg hover:bg-navy-700 transition-colors text-sm"
                    >
                      <Download className="h-4 w-4" />
                      Download QR
                    </a>
                    <a
                      href={assignment.form_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open Form
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
