import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase/server';
import DynamicForm from '@/components/form/DynamicForm';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { projectSlug: string; salespersonSlug: string };
  searchParams: { cancelled?: string };
}

export default async function FormPage({ params, searchParams }: PageProps) {
  const { projectSlug, salespersonSlug } = params;
  const { data: project, error: projectError } = await supabaseAdmin.from('projects').select('*').eq('slug', projectSlug).eq('status', 'active').single();
  if (projectError || !project) notFound();

  const { data: assignments, error: assignmentError } = await supabaseAdmin.from('project_assignments')
    .select('id, salesperson_id, form_url, status, users!salesperson_id(id, name, email)')
    .eq('project_id', project.id).eq('status', 'active');
  if (assignmentError || !assignments || assignments.length === 0) notFound();

  const assignment = assignments.find((a: any) => {
    const user = Array.isArray(a.users) ? a.users[0] : a.users;
    const slug = user.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return slug === salespersonSlug;
  });
  if (!assignment) notFound();

  const assignedUser = Array.isArray(assignment.users) ? assignment.users[0] : assignment.users;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          {project.logo_url && <img src={project.logo_url} alt={project.name} className="h-20 mx-auto mb-4" />}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
          {project.description && <p className="text-lg text-gray-600">{project.description}</p>}
          <p className="text-2xl font-bold text-navy mt-4">AED {project.price.toFixed(2)}</p>
        </div>
        {searchParams.cancelled && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-center">Payment was cancelled. You can try again below.</p>
          </div>
        )}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <DynamicForm
            projectId={project.id}
            salespersonId={assignment.salesperson_id}
            formFields={project.form_fields}
            projectName={project.name}
            price={project.price}
            logoUrl={project.logo_url}
          />
        </div>
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Powered by SASA Worldwide</p>
          <p className="mt-2">Questions? Contact your sales representative: {assignedUser.name}</p>
        </div>
      </div>
    </div>
  );
}
