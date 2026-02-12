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
        staff_profiles(employee_id, department, phone),
        affiliate_profiles(referral_code, phone)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Normalize: Supabase returns one-to-one joins as single objects (because
    // user_id is UNIQUE in both profile tables). The frontend expects arrays,
    // so wrap single objects in arrays for consistent access via [0].
    const normalized = (data || []).map((user: any) => ({
      ...user,
      staff_profiles: user.staff_profiles
        ? Array.isArray(user.staff_profiles)
          ? user.staff_profiles
          : [user.staff_profiles]
        : [],
      affiliate_profiles: user.affiliate_profiles
        ? Array.isArray(user.affiliate_profiles)
          ? user.affiliate_profiles
          : [user.affiliate_profiles]
        : [],
    }));

    return NextResponse.json({ users: normalized });
  } catch (error: any) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
