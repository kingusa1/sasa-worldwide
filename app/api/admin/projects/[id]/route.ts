/**
 * Single Project Management API
 * GET: Get project by ID
 * PUT: Update project
 * DELETE: Delete project
 */

import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { getProjectById, updateProject, deleteProject } from '@/lib/supabase/projects';
import { supabaseAdmin } from '@/lib/supabase/server';
import { createOrUpdateStripeProduct } from '@/lib/stripe';

/**
 * GET /api/admin/projects/[id]
 * Get single project by ID
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

    const { data: project, error } = await getProjectById(params.id);

    if (error || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    console.error('Get project error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/projects/[id]
 * Update project
 */
export async function PUT(
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

    const body = await req.json();
    const {
      name,
      slug,
      project_type,
      description,
      logo_url,
      price,
      cost_of_goods,
      commission_rate,
      form_fields,
      status,
    } = body;

    // Validate slug format if provided
    if (slug) {
      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      if (!slugRegex.test(slug)) {
        return NextResponse.json(
          { error: 'Invalid slug format' },
          { status: 400 }
        );
      }
    }

    // Validate price if provided
    if (price !== undefined) {
      const priceNum = Number(price);
      if (isNaN(priceNum) || priceNum <= 0) {
        return NextResponse.json(
          { error: 'Price must be a positive number' },
          { status: 400 }
        );
      }
    }

    // Validate form_fields if provided
    if (form_fields) {
      if (!Array.isArray(form_fields)) {
        return NextResponse.json(
          { error: 'form_fields must be an array' },
          { status: 400 }
        );
      }

      for (const field of form_fields) {
        if (!field.name || !field.type || !field.label) {
          return NextResponse.json(
            { error: 'Each form field must have name, type, and label' },
            { status: 400 }
          );
        }
      }
    }

    // Update project
    const updateData: any = {};
    if (name) updateData.name = name.trim();
    if (slug) updateData.slug = slug.trim().toLowerCase();
    if (project_type) updateData.project_type = project_type.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (logo_url !== undefined) updateData.logo_url = logo_url?.trim() || null;
    if (price !== undefined) updateData.price = Number(price);
    if (cost_of_goods !== undefined) updateData.cost_of_goods = Number(cost_of_goods);
    if (commission_rate !== undefined) updateData.commission_rate = Number(commission_rate);
    if (form_fields) updateData.form_fields = form_fields;
    if (status) updateData.status = status;

    // Sync Stripe product/price if price or name changed
    const { data: currentProject } = await getProjectById(params.id);
    if (currentProject) {
      const priceChanged = updateData.price !== undefined && Number(updateData.price) !== Number(currentProject.price);
      const nameChanged = updateData.name !== undefined && updateData.name !== currentProject.name;

      if (priceChanged || nameChanged) {
        try {
          const { productId, priceId } = await createOrUpdateStripeProduct(
            params.id,
            updateData.name || currentProject.name,
            updateData.price !== undefined ? Number(updateData.price) : Number(currentProject.price),
            currentProject.stripe_product_id || undefined,
            currentProject.stripe_price_id || undefined
          );
          updateData.stripe_product_id = productId;
          updateData.stripe_price_id = priceId;
          console.log(`✅ Stripe synced: product=${productId}, price=${priceId}`);
        } catch (stripeError: any) {
          console.error('Stripe sync failed:', stripeError);
          return NextResponse.json(
            { error: `Stripe update failed: ${stripeError.message}. Database was NOT updated.` },
            { status: 500 }
          );
        }
      }
    }

    const project = await updateProject(params.id, updateData);

    // Log to audit trail
    await supabaseAdmin.from('audit_logs').insert({
      user_id: session.user.id,
      action: 'project_updated',
      metadata: {
        project_id: project.id,
        project_name: project.name,
        updated_fields: Object.keys(updateData),
      },
    });

    console.log(`✅ Updated project: ${project.name}`);

    return NextResponse.json({
      success: true,
      project,
      message: 'Project updated successfully',
    });
  } catch (error: any) {
    console.error('Update project error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update project' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/projects/[id]
 * Delete project (and all related data via CASCADE)
 */
export async function DELETE(
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

    // Get project details before deletion for audit log
    const { data: project, error: fetchError } = await getProjectById(params.id);
    if (fetchError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Delete project (CASCADE will delete assignments, vouchers, etc.)
    await deleteProject(params.id);

    // Log to audit trail
    await supabaseAdmin.from('audit_logs').insert({
      user_id: session.user.id,
      action: 'project_deleted',
      metadata: {
        project_id: params.id,
        project_name: project.name,
        project_type: project.project_type,
      },
    });

    console.log(`✅ Deleted project: ${project.name}`);

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete project error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete project' },
      { status: 500 }
    );
  }
}
