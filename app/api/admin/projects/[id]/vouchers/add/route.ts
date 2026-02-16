import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (session.user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const project_id = params.id;
    const { data: project, error: projectError } = await supabaseAdmin.from('projects').select('id, name').eq('id', project_id).single();
    if (projectError || !project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    const body = await req.json();
    const { code, product_name, expires_at } = body;

    if (!code || code.trim().length === 0) {
      return NextResponse.json({ error: 'Voucher code is required' }, { status: 400 });
    }

    const normalizedCode = code.trim().toUpperCase();

    // Check for duplicate
    const { data: existing } = await supabaseAdmin.from('voucher_codes')
      .select('id').eq('project_id', project_id).eq('code', normalizedCode).single();

    if (existing) {
      return NextResponse.json({ error: 'This voucher code already exists for this project' }, { status: 409 });
    }

    const { data: voucher, error: insertError } = await supabaseAdmin.from('voucher_codes').insert({
      project_id,
      code: normalizedCode,
      status: 'available',
      product_name: product_name || null,
      expires_at: expires_at ? new Date(expires_at).toISOString() : null,
    }).select().single();

    if (insertError) {
      return NextResponse.json({ error: `Failed to add voucher: ${insertError.message}` }, { status: 500 });
    }

    await supabaseAdmin.from('audit_logs').insert({
      user_id: session.user.id, action: 'voucher_manual_add',
      metadata: { project_id, project_name: project.name, code: normalizedCode, product_name }
    });

    return NextResponse.json({ success: true, voucher });
  } catch (error: any) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
