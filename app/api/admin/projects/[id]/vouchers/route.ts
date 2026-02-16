/**
 * Voucher Inventory API
 * GET: Get voucher inventory status or detailed list for a project
 */

import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getVoucherInventory } from '@/lib/supabase/projects';
import { supabaseAdmin } from '@/lib/supabase/server';

/**
 * GET /api/admin/projects/[id]/vouchers
 * ?view=list - returns detailed voucher list with customer/salesperson info
 * ?product_name=X - filter by product
 * ?status=X - filter by status
 * ?search=X - search by code
 * ?page=1&limit=50 - pagination
 */
export async function GET(
  req: NextRequest,
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

    const searchParams = req.nextUrl.searchParams;
    const view = searchParams.get('view');

    if (view === 'list') {
      const productName = searchParams.get('product_name');
      const status = searchParams.get('status');
      const search = searchParams.get('search');
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '50');
      const offset = (page - 1) * limit;

      let query = supabaseAdmin
        .from('voucher_codes')
        .select(`
          id, code, status, product_name, created_at, sold_at, expires_at,
          sales_transactions!voucher_code_id(
            id, created_at, amount,
            customers!inner(name, email, phone),
            users!salesperson_id(name)
          )
        `, { count: 'exact' })
        .eq('project_id', params.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (productName) {
        query = query.eq('product_name', productName);
      }
      if (status) {
        query = query.eq('status', status);
      }
      if (search) {
        query = query.ilike('code', `%${search}%`);
      }

      const { data: vouchers, error, count } = await query;

      if (error) {
        console.error('Voucher list error:', error);
        return NextResponse.json(
          { error: 'Failed to fetch voucher list' },
          { status: 500 }
        );
      }

      // Flatten the joined data
      const formattedVouchers = (vouchers || []).map((v: any) => {
        const tx = Array.isArray(v.sales_transactions) ? v.sales_transactions[0] : v.sales_transactions;
        return {
          id: v.id,
          code: v.code,
          status: v.status,
          product_name: v.product_name,
          created_at: v.created_at,
          sold_at: v.sold_at,
          expires_at: v.expires_at,
          customer_name: tx?.customers?.name || null,
          customer_email: tx?.customers?.email || null,
          customer_phone: tx?.customers?.phone || null,
          salesperson_name: tx?.users?.name || null,
          transaction_date: tx?.created_at || null,
          amount: tx?.amount || null,
        };
      });

      return NextResponse.json({
        success: true,
        vouchers: formattedVouchers,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      });
    }

    // Default: return inventory summary
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
