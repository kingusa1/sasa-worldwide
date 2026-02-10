import { auth } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { AdminSettings } from '@/components/admin/AdminSettings';

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'admin') {
    redirect('/login');
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          Configure system settings and preferences
        </p>
      </div>

      <AdminSettings />
    </div>
  );
}
