import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { AdminNav } from '@/components/admin/AdminNav';
import { LogoutButton } from '@/components/auth/LogoutButton';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'admin') {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* Admin Header */}
      <header className="bg-navy sticky top-0 z-10">
        <div className="px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="flex items-center gap-3">
                <Image
                  src="/images/logo/sasa-logo-color.png"
                  alt="SASA Worldwide"
                  width={120}
                  height={40}
                  className="h-8 w-auto brightness-0 invert"
                />
              </Link>
              <div className="h-6 w-px bg-white/20"></div>
              <span className="px-3 py-1 bg-white/10 text-white/90 text-xs font-semibold rounded-full tracking-wide">
                Admin Panel
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold">
                  {(session.user.name || 'A').charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-white/80 hidden sm:block">
                  {session.user.name || session.user.email}
                </span>
              </div>
              <LogoutButton className="px-4 py-1.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white min-h-[calc(100vh-64px)] border-r border-gray-200 shadow-sm flex-shrink-0">
          <AdminNav />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
