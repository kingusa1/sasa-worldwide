/**
 * Project Assignments Page
 * Admin assigns salespeople to projects and views QR codes
 */

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getProjectById, getProjectAssignments } from '@/lib/supabase/projects';
import { supabaseAdmin } from '@/lib/supabase/server';
import { ArrowLeft, QrCode, Download, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { AssignSalespersonForm } from '@/components/projects/AssignSalespersonForm';
import { CopyUrlButton } from '@/components/projects/CopyUrlButton';
import { RemoveAssignmentButton } from '@/components/projects/RemoveAssignmentButton';
import { ServerError } from '@/components/ui/ErrorBanner';

export default async function ProjectAssignmentsPage({
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

  // Fetch project, assignments, sales staff, and affiliates
  const errors: string[] = [];
  const [projectResult, assignmentsResult, salesStaff, affiliates] = await Promise.all([
    getProjectById(params.id),
    getProjectAssignments(params.id),
    // Get sales department staff for assignment
    supabaseAdmin
      .from('staff_profiles')
      .select('user_id, users!staff_profiles_user_id_fkey(id, name, email)')
      .eq('department', 'sales'),
    // Get all affiliates (they are also considered sales)
    supabaseAdmin
      .from('users')
      .select('id, name, email')
      .eq('role', 'affiliate')
      .eq('status', 'active'),
  ]);

  if (projectResult.error) errors.push(`Project: ${projectResult.error.message}`);
  if (assignmentsResult.error) errors.push(`Assignments: ${assignmentsResult.error.message}`);
  if (salesStaff.error) errors.push(`Sales staff: ${salesStaff.error.message}`);
  if (affiliates.error) errors.push(`Affiliates: ${affiliates.error.message}`);

  const project = projectResult.data;
  const assignments = (assignmentsResult.data || []).filter((a: any) => a.status === 'active');

  if (!project) {
    redirect('/admin/projects');
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
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
              <p className="text-gray-600 mt-1">Salesperson Assignments</p>
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

        {errors.length > 0 && (
          <div className="mb-6">
            <ServerError title="Data loading error" message={errors.join(' | ')} />
          </div>
        )}

        {/* Assign New Salesperson */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <UserPlus className="h-6 w-6 text-navy-600" />
            <h2 className="text-xl font-semibold">Assign Salesperson</h2>
          </div>
          <AssignSalespersonForm
            projectId={params.id}
            salesStaff={[
              ...(salesStaff.data?.map((s: any) => s.users) || []),
              ...(affiliates.data || []),
            ].filter(Boolean)}
            existingAssignments={assignments.map((a: any) => ({ salesperson_id: a.salesperson_id }))}
          />
        </div>

        {/* Current Assignments */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">
            Current Assignments ({assignments.length})
          </h2>

          {assignments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <UserPlus className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p>No salespeople assigned yet</p>
              <p className="text-sm">Assign salespeople to generate their QR codes and forms</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assignments.map((assignment: any) => (
                <div
                  key={assignment.id}
                  className="border border-gray-200 rounded-lg p-6"
                >
                  {/* Salesperson Info */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {assignment.users?.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {assignment.users?.email}
                      </p>
                    </div>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                        assignment.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {assignment.status}
                    </span>
                  </div>

                  {/* QR Code */}
                  {assignment.qr_code_data && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4 text-center">
                      <img
                        src={assignment.qr_code_data}
                        alt={`QR Code for ${assignment.users?.name}`}
                        className="w-48 h-48 mx-auto"
                      />
                    </div>
                  )}

                  {/* Form URL */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Form URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={assignment.form_url}
                        readOnly
                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-mono"
                      />
                      <CopyUrlButton formUrl={assignment.form_url} />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <a
                      href={assignment.qr_code_data}
                      download={`qr-${(assignment.users?.name || 'salesperson').replace(/\s+/g, '-')}.png`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-navy-600 text-white rounded-lg hover:bg-navy-700 transition-colors text-sm"
                    >
                      <Download className="h-4 w-4" />
                      Download QR
                    </a>
                    <a
                      href={assignment.form_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      Preview Form
                    </a>
                    <RemoveAssignmentButton
                      projectId={params.id}
                      assignmentId={assignment.id}
                      salespersonName={assignment.users?.name || 'Salesperson'}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
