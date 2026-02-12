/**
 * Voucher Inventory API
 * GET: Get voucher inventory status for a project
 */

import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { getVoucherInventory } from '@/lib/supabase/projects';

/**
 * GET /api/admin/projects/[id]/vouchers
 * Get voucher inventory status
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const inventory = await getVoucherInventory(params.id);

    return NextResponse.json({
      success: true,
      inventory,
    });
  } catch (error: any) {
    console.error('Get voucher inventory error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch voucher inventory' },
      { status: 500 }
    );
  }
}
