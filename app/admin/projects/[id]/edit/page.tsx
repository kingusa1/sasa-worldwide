/**
 * Project Edit Page
 * Admin can edit project details (name, price, description, etc.)
 */

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getProjectById } from '@/lib/supabase/projects';
import Link from 'next/link';
import ProjectForm from '@/components/projects/ProjectForm';

export default async function ProjectEditPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'admin') {
    redirect('/login');
  }

  const { data: project } = await getProjectById(params.id);

  if (!project) {
    redirect('/admin/projects');
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href={`/admin/projects/${params.id}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Project
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Project</h1>
        <p className="text-gray-600 mt-1">Update {project.name}</p>
      </div>

      <ProjectForm
        initialData={{
          name: project.name,
          slug: project.slug,
          project_type: project.project_type,
          description: project.description,
          price: project.price,
          cost_of_goods: project.cost_of_goods,
          commission_rate: project.commission_rate,
          status: project.status,
          form_fields: project.form_fields || [],
          products: project.products || [],
        }}
        projectId={params.id}
      />
    </div>
  );
}
