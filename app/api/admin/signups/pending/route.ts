import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const session = await auth();

  // Check if user is admin
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    // Get all pending signup requests with user details
    // Use !signup_requests_user_id_fkey to specify which foreign key relationship to follow
    const { data, error } = await supabaseAdmin
      .from('signup_requests')
      .select(`
        id,
        status,
        requested_at,
        user:users!signup_requests_user_id_fkey (
          id,
          email,
          name,
          role,
          email_verified,
          created_at,
          staff_profiles:staff_profiles!staff_profiles_user_id_fkey (
            employee_id,
            department,
            phone
          )
        )
      `)
      .eq('status', 'pending')
      .order('requested_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ signups: data });
  } catch (error: any) {
    console.error('Failed to fetch pending signups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch signups' },
      { status: 500 }
    );
  }
}
