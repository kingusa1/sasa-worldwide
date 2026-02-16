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
    <>
      {searchParams.cancelled && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
          <p className="text-yellow-800 text-center text-sm">Payment was cancelled. You can try again below.</p>
        </div>
      )}
      <DynamicForm
        projectId={project.id}
        salespersonId={assignment.salesperson_id}
        formFields={project.form_fields}
        projectName={project.name}
        projectDescription={project.description || undefined}
        price={project.price}
        logoUrl={project.logo_url || undefined}
        products={project.products && project.products.length > 0 ? project.products : undefined}
        salespersonName={(assignedUser as any).name}
      />
    </>
  );
}
