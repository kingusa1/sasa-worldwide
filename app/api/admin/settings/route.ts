/**
 * Admin Settings API
 * GET: Return all app settings
 * PUT: Update a setting
 */

import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { invalidateStripeModeCache } from '@/lib/stripe';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from('app_settings')
      .select('*');

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }

    // Convert array to key-value object
    const settings: Record<string, string> = {};
    data?.forEach((row: any) => {
      settings[row.key] = row.value;
    });

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ error: 'key and value are required' }, { status: 400 });
    }

    // Validate allowed keys
    const allowedKeys = ['stripe_mode'];
    if (!allowedKeys.includes(key)) {
      return NextResponse.json({ error: 'Invalid setting key' }, { status: 400 });
    }

    // Validate values
    if (key === 'stripe_mode' && !['test', 'live'].includes(value)) {
      return NextResponse.json({ error: 'stripe_mode must be "test" or "live"' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('app_settings')
      .upsert({
        key,
        value,
        updated_at: new Date().toISOString(),
        updated_by: session.user.id,
      });

    if (error) {
      console.error('Settings update error:', error);
      return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
    }

    // Invalidate cache if stripe mode changed
    if (key === 'stripe_mode') {
      invalidateStripeModeCache();
    }

    // Audit log
    await supabaseAdmin.from('audit_logs').insert({
      user_id: session.user.id,
      action: 'setting_updated',
      metadata: { key, value },
    });

    return NextResponse.json({ success: true, key, value });
  } catch (error: any) {
    console.error('Settings PUT error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
