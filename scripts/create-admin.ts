/**
 * Create or reset admin user
 * Run with: npx tsx scripts/create-admin.ts
 */

import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdmin() {
  console.log('🔧 Creating/Resetting Admin User...\n');

  const adminEmail = 'admin@sasa-worldwide.com';
  const adminPassword = 'Admin@123';
  const adminName = 'Admin User';

  try {
    // Check if admin exists
    const { data: existingAdmin, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('email', adminEmail)
      .single();

    // Hash password
    const passwordHash = await bcrypt.hash(adminPassword, 12);

    if (existingAdmin) {
      console.log('✏️  Admin user exists, updating password...');

      // Update existing admin
      const { error: updateError } = await supabase
        .from('users')
        .update({
          password_hash: passwordHash,
          name: adminName,
          role: 'admin',
          status: 'active',
          email_verified: true,
        })
        .eq('email', adminEmail);

      if (updateError) throw updateError;

      console.log('✅ Admin user updated successfully!\n');
    } else {
      console.log('➕ Creating new admin user...');

      // Create new admin
      const { error: createError } = await supabase
        .from('users')
        .insert({
          email: adminEmail,
          password_hash: passwordHash,
          name: adminName,
          role: 'admin',
          status: 'active',
          email_verified: true,
        });

      if (createError) throw createError;

      console.log('✅ Admin user created successfully!\n');
    }

    console.log('📋 Admin Credentials:');
    console.log('   Email: admin@sasa-worldwide.com');
    console.log('   Password: Admin@123');
    console.log('\n✅ You can now login at: http://localhost:3000/login');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();
