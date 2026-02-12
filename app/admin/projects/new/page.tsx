/**
 * Create New Project Page
 */

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import ProjectForm from '@/components/projects/ProjectForm';

export const dynamic = 'force-dynamic';

export default async function NewProjectPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  if (session.user.role !== 'admin') {
    redirect('/staff/dashboard');
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
        <p className="mt-2 text-sm text-gray-600">
          Set up a new sales project with custom forms and payment integration
        </p>
      </div>

      {/* Form */}
      <ProjectForm />
    </div>
  );
}
