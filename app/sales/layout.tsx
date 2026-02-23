/**
 * Sales Section Layout
 * Ensures only sales staff can access this section
 */

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { LogoutButton } from '@/components/auth/LogoutButton';

export default async function SalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  if (session.user.role === 'admin') {
    // Admins have full access
  } else if (session.user.role === 'affiliate') {
    // Affiliates are considered sales
  } else if (session.user.role === 'staff') {
    const { data: profile } = await supabaseAdmin
      .from('staff_profiles')
      .select('department')
      .eq('user_id', session.user.id)
      .single();

    if (profile?.department !== 'sales') {
      redirect('/staff/dashboard');
    }
  } else {
    redirect('/');
  }

  const navLinks = [
    { href: '/sales/dashboard', label: 'Dashboard' },
    { href: '/sales/my-projects', label: 'My Projects' },
    { href: '/crm/customers', label: 'Customers' },
    { href: '/staff/training', label: 'Training' },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <nav className="bg-navy sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/sales/dashboard" className="flex items-center">
                <Image
                  src="/images/logo/sasa-logo-color.png"
                  alt="SASA Worldwide"
                  width={120}
                  height={40}
                  className="h-8 w-auto brightness-0 invert"
                />
              </Link>
              <div className="hidden sm:flex items-center gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold">
                  {(session.user.name || 'S').charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-white/80 hidden sm:block">{session.user.name}</span>
              </div>
              <Link
                href={session.user.role === 'admin' ? '/admin' : session.user.role === 'affiliate' ? '/affiliate/dashboard' : '/staff/dashboard'}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                {session.user.role === 'admin' ? 'Admin' : 'Home'}
              </Link>
              <LogoutButton className="px-4 py-1.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors" />
            </div>
          </div>
        </div>
      </nav>

      <div className="sm:hidden bg-navy/95 border-t border-white/10">
        <div className="flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex-1 text-center py-3 text-xs text-white/70 hover:text-white hover:bg-white/10 transition-colors font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {children}
    </div>
  );
}
