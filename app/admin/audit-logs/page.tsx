import { auth } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { AuditLogs } from '@/components/admin/AuditLogs';

export default async function AuditLogsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'admin') {
    redirect('/login');
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
        <p className="text-gray-600 mt-2">
          Track all system activities and user actions
        </p>
      </div>

      <AuditLogs />
    </div>
  );
}
