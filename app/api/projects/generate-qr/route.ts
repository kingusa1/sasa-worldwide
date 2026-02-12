/**
 * QR Code Generation API
 * POST: Generate a QR code for a project assignment
 * GET: Download QR code as PNG for a specific assignment
 */

import { auth } from '@/auth';
import { supabaseAdmin } from '@/lib/supabase/server';
import { generateQRCodeDataURL, generateQRCodeBuffer } from '@/lib/qr-code';

export const dynamic = 'force-dynamic';

/**
 * POST - Generate QR code data URL for an assignment
 */
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { assignment_id } = body;

    if (!assignment_id) {
      return Response.json({ error: 'assignment_id is required' }, { status: 400 });
    }

    // Get assignment with form URL
    const { data: assignment, error: assignmentError } = await supabaseAdmin
      .from('project_assignments')
      .select('id, form_url, qr_code_data, salesperson_id')
      .eq('id', assignment_id)
      .single();

    if (assignmentError || !assignment) {
      return Response.json({ error: 'Assignment not found' }, { status: 404 });
    }

    // Only the assigned salesperson or admin can generate
    if (session.user.role !== 'admin' && assignment.salesperson_id !== session.user.id) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // If we already have QR code data, return it
    if (assignment.qr_code_data) {
      return Response.json({
        success: true,
        qr_code_data: assignment.qr_code_data,
        form_url: assignment.form_url,
      });
    }

    // Generate fresh QR code
    const qrDataURL = await generateQRCodeDataURL(assignment.form_url);

    // Store for future use
    await supabaseAdmin
      .from('project_assignments')
      .update({ qr_code_data: qrDataURL, qr_code_url: qrDataURL })
      .eq('id', assignment_id);

    return Response.json({
      success: true,
      qr_code_data: qrDataURL,
      form_url: assignment.form_url,
    });
  } catch (error: any) {
    console.error('[SASA] QR generation error:', error);
    return Response.json({ error: 'Failed to generate QR code' }, { status: 500 });
  }
}

/**
 * GET - Download QR code as PNG image
 */
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const assignmentId = searchParams.get('assignment_id');

    if (!assignmentId) {
      return Response.json({ error: 'assignment_id query param required' }, { status: 400 });
    }

    // Get assignment
    const { data: assignment, error: assignmentError } = await supabaseAdmin
      .from('project_assignments')
      .select('id, form_url, salesperson_id')
      .eq('id', assignmentId)
      .single();

    if (assignmentError || !assignment) {
      return Response.json({ error: 'Assignment not found' }, { status: 404 });
    }

    // Only the assigned salesperson or admin can download
    if (session.user.role !== 'admin' && assignment.salesperson_id !== session.user.id) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Generate QR code as PNG buffer
    const pngBuffer = await generateQRCodeBuffer(assignment.form_url);
    const uint8Array = new Uint8Array(pngBuffer);

    return new Response(uint8Array, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="qr-code-${assignmentId}.png"`,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error: any) {
    console.error('[SASA] QR download error:', error);
    return Response.json({ error: 'Failed to download QR code' }, { status: 500 });
  }
}
