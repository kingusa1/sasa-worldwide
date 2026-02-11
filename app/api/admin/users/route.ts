import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

// GET - List all users
export async function GET(request: Request) {
  const session = await auth();

  // Check if user is admin
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select(`
        *,
        staff_profiles:staff_profiles!staff_profiles_user_id_fkey(employee_id, department, phone),
        affiliate_profiles:affiliate_profiles!affiliate_profiles_user_id_fkey(referral_code, phone)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ users: data });
  } catch (error: any) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
