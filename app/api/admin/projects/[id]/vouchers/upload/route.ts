import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';
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

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const productName = formData.get('product_name') as string | null;
    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    if (!file.name.endsWith('.csv')) return NextResponse.json({ error: 'File must be a CSV' }, { status: 400 });
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });

    const text = await file.text();
    if (!text || text.trim().length === 0) return NextResponse.json({ error: 'CSV file is empty' }, { status: 400 });

    let records: any[];
    try {
      records = parse(text, { columns: true, skip_empty_lines: true, trim: true });
    } catch (parseError: any) {
      return NextResponse.json({ error: `CSV parsing failed: ${parseError.message}` }, { status: 400 });
    }

    if (!Array.isArray(records) || records.length === 0) return NextResponse.json({ error: 'CSV file contains no data' }, { status: 400 });
    if (!records[0]?.code) return NextResponse.json({ error: 'CSV must have a "code" column' }, { status: 400 });

    const invalidCodes = records.filter((r: any) => !r.code || r.code.trim().length === 0);
    if (invalidCodes.length > 0) {
      return NextResponse.json({ error: `Found ${invalidCodes.length} rows with empty or invalid codes` }, { status: 400 });
    }

    const vouchers = records.map((record: any) => ({
      project_id, code: record.code.trim().toUpperCase(), status: 'available',
      product_name: productName || null,
      expires_at: record.expires_at ? new Date(record.expires_at).toISOString() : null
    }));

    const { data, error } = await supabaseAdmin.from('voucher_codes').upsert(vouchers, { onConflict: 'project_id,code', ignoreDuplicates: true }).select('id');
    if (error) return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 500 });

    const imported = data?.length || 0;
    const duplicates = vouchers.length - imported;

    await supabaseAdmin.from('audit_logs').insert({
      user_id: session.user.id, action: 'voucher_upload',
      metadata: { project_id, project_name: project.name, product_name: productName, total_codes: vouchers.length, imported, duplicates }
    });

    return NextResponse.json({
      success: true, imported, duplicates, total: vouchers.length,
      message: `Successfully imported ${imported} voucher codes${duplicates > 0 ? ` (${duplicates} duplicates skipped)` : ''}`
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'An unexpected error occurred during upload' }, { status: 500 });
  }
}
