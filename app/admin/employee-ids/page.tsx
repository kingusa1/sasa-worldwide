import { auth } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { EmployeeIdManager } from '@/components/admin/EmployeeIdManager';

export default async function EmployeeIdsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'admin') {
    redirect('/login');
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Employee ID Management</h1>
        <p className="text-gray-600 mt-2">
          Create and manage employee IDs for staff registration
        </p>
      </div>

      <EmployeeIdManager />
    </div>
  );
}
