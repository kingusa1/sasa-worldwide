import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { UserManagement } from '@/components/admin/UserManagement';

export default async function AdminUsersPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'admin') {
    redirect('/login');
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-2">
          View and manage all users in the system
        </p>
      </div>

      <UserManagement />
    </div>
  );
}
