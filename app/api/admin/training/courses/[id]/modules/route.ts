import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (session.user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id: courseId } = await params;

    const { data: modules, error } = await supabaseAdmin
      .from('course_modules')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index');

    if (error) return NextResponse.json({ error: 'Failed to fetch modules' }, { status: 500 });

    return NextResponse.json({ modules: modules || [] });
  } catch (error: any) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (session.user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id: courseId } = await params;
    const body = await req.json();
    const { title } = body;

    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

    // Verify course exists
    const { data: course, error: courseError } = await supabaseAdmin
      .from('courses')
      .select('id')
      .eq('id', courseId)
      .single();

    if (courseError || !course) return NextResponse.json({ error: 'Course not found' }, { status: 404 });

    // Get max order_index for this course
    const { data: existingModules } = await supabaseAdmin
      .from('course_modules')
      .select('order_index')
      .eq('course_id', courseId)
      .order('order_index', { ascending: false })
      .limit(1);

    const nextOrderIndex = existingModules && existingModules.length > 0
      ? (existingModules[0].order_index || 0) + 1
      : 0;

    const { data, error } = await supabaseAdmin
      .from('course_modules')
      .insert({
        course_id: courseId,
        title,
        order_index: nextOrderIndex,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: 'Failed to create module' }, { status: 500 });

    return NextResponse.json({ module: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (session.user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id: courseId } = await params;
    const body = await req.json();

    // Reorder modules: { modules: [{ id, order_index }] }
    if (body.modules && Array.isArray(body.modules)) {
      const updates = body.modules.map((mod: { id: string; order_index: number }) =>
        supabaseAdmin
          .from('course_modules')
          .update({ order_index: mod.order_index })
          .eq('id', mod.id)
          .eq('course_id', courseId)
      );

      const results = await Promise.all(updates);
      const hasError = results.some((r) => r.error);
      if (hasError) return NextResponse.json({ error: 'Failed to reorder modules' }, { status: 500 });

      // Fetch updated modules
      const { data: updatedModules } = await supabaseAdmin
        .from('course_modules')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index');

      return NextResponse.json({ modules: updatedModules || [] });
    }

    // Rename module: { id, title }
    if (body.id && body.title) {
      const { data, error } = await supabaseAdmin
        .from('course_modules')
        .update({ title: body.title })
        .eq('id', body.id)
        .eq('course_id', courseId)
        .select()
        .single();

      if (error) return NextResponse.json({ error: 'Failed to update module' }, { status: 500 });

      return NextResponse.json({ module: data });
    }

    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (session.user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id: courseId } = await params;
    const moduleId = req.nextUrl.searchParams.get('module_id');

    if (!moduleId) return NextResponse.json({ error: 'module_id query parameter is required' }, { status: 400 });

    // Delete lessons belonging to this module first
    await supabaseAdmin
      .from('course_lessons')
      .delete()
      .eq('module_id', moduleId);

    // Delete the module
    const { error } = await supabaseAdmin
      .from('course_modules')
      .delete()
      .eq('id', moduleId)
      .eq('course_id', courseId);

    if (error) return NextResponse.json({ error: 'Failed to delete module' }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
