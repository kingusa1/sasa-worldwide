import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { supabaseAdmin } from '@/lib/supabase/server';
import { generateQRCodeForAssignment } from '@/lib/qr-code';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (session.user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const project_id = params.id;
    const { data: assignments, error } = await supabaseAdmin.from('project_assignments')
      .select('id, form_url, qr_code_url, qr_code_data, status, assigned_at, users!salesperson_id(id, name, email)')
      .eq('project_id', project_id).order('assigned_at', { ascending: false });

    if (error) return NextResponse.json({ error: 'Failed to fetch assignments' }, { status: 500 });
    return NextResponse.json({ assignments });
  } catch (error: any) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (session.user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const project_id = params.id;
    const body = await req.json();
    const { salesperson_id } = body;

    if (!salesperson_id) return NextResponse.json({ error: 'salesperson_id is required' }, { status: 400 });

    const [projectResult, salespersonResult, profileResult] = await Promise.all([
      supabaseAdmin.from('projects').select('id, slug, name, status').eq('id', project_id).single(),
      supabaseAdmin.from('users').select('id, name, email, role').eq('id', salesperson_id).single(),
      supabaseAdmin.from('staff_profiles').select('department').eq('user_id', salesperson_id).single()
    ]);

    const { data: project, error: projectError } = projectResult;
    const { data: salesperson, error: salespersonError } = salespersonResult;
    const { data: profile, error: profileError } = profileResult;

    if (projectError || !project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    if (salespersonError || !salesperson) return NextResponse.json({ error: 'Salesperson not found' }, { status: 404 });
    // Allow staff (sales department) and affiliates to be assigned
    const isAffiliate = salesperson.role === 'affiliate';
    const isSalesStaff = salesperson.role === 'staff' && profile?.department === 'sales';
    if (!isAffiliate && !isSalesStaff) {
      return NextResponse.json({ error: 'Only sales staff or affiliates can be assigned' }, { status: 400 });
    }

    const { data: existingAssignment } = await supabaseAdmin.from('project_assignments')
      .select('id').eq('project_id', project_id).eq('salesperson_id', salesperson_id).single();

    if (existingAssignment) return NextResponse.json({ error: 'Already assigned' }, { status: 409 });

    const salespersonSlug = salesperson.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const qrData = await generateQRCodeForAssignment(project.slug, salespersonSlug, salesperson.name);

    const { data: assignment, error: assignmentError } = await supabaseAdmin.from('project_assignments').insert({
      project_id, salesperson_id, form_url: qrData.form_url,
      qr_code_url: qrData.qr_code_url, qr_code_data: qrData.qr_code_data, status: 'active'
    }).select().single();

    if (assignmentError) return NextResponse.json({ error: 'Failed to create assignment' }, { status: 500 });

    await supabaseAdmin.from('audit_logs').insert({
      user_id: session.user.id, action: 'salesperson_assigned',
      metadata: { project_id, project_name: project.name, salesperson_id, salesperson_name: salesperson.name, form_url: qrData.form_url }
    });

    return NextResponse.json({ success: true, assignment, qr_code_url: qrData.qr_code_url, form_url: qrData.form_url }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
