/**
 * Debug admin user authentication
 * Run with: npx tsx scripts/debug-admin.ts
 */

import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugAdmin() {
  console.log('🔍 Debugging Admin User Authentication...\n');

  const adminEmail = 'admin@sasa-worldwide.com';
  const testPassword = 'Admin@123';

  try {
    // 1. Check if admin exists
    console.log('1️⃣ Checking if admin user exists...');
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', adminEmail.toLowerCase())
      .single();

    if (userError) {
      console.error('❌ Error querying user:', userError.message);
      console.error('   Details:', userError);
      return;
    }

    if (!user) {
      console.error('❌ Admin user NOT FOUND in database');
      console.log('   Email searched:', adminEmail.toLowerCase());
      return;
    }

    console.log('✅ Admin user found in database:');
    console.log('   ID:', user.id);
    console.log('   Email:', user.email);
    console.log('   Name:', user.name);
    console.log('   Role:', user.role);
    console.log('   Status:', user.status);
    console.log('   Email Verified:', user.email_verified);
    console.log('   Password Hash (first 20 chars):', user.password_hash?.substring(0, 20) + '...');
    console.log('   Password Hash Length:', user.password_hash?.length);

    // 2. Test password verification
    console.log('\n2️⃣ Testing password verification...');
    console.log('   Test Password:', testPassword);

    if (!user.password_hash) {
      console.error('❌ No password hash stored in database!');
      return;
    }

    const isValid = await bcrypt.compare(testPassword, user.password_hash);
    console.log('   bcrypt.compare result:', isValid);

    if (!isValid) {
      console.error('❌ Password does NOT match stored hash!');
      console.log('\n3️⃣ Generating new hash for comparison...');
      const newHash = await bcrypt.hash(testPassword, 12);
      console.log('   New hash (first 20 chars):', newHash.substring(0, 20) + '...');
      console.log('   Stored hash (first 20 chars):', user.password_hash.substring(0, 20) + '...');
      console.log('   Hashes match:', newHash === user.password_hash);

      // Test if new hash would work
      const wouldWork = await bcrypt.compare(testPassword, newHash);
      console.log('   New hash verification test:', wouldWork);
    } else {
      console.log('✅ Password verification SUCCESS!');
    }

    // 3. Check user status
    console.log('\n3️⃣ Checking user status...');
    if (user.status === 'suspended') {
      console.error('❌ User is SUSPENDED');
    } else if (user.status === 'rejected') {
      console.error('❌ User is REJECTED');
    } else if (user.status === 'pending') {
      console.error('❌ User is PENDING approval');
    } else if (user.status === 'active') {
      console.log('✅ User status is ACTIVE');
    } else {
      console.error('❌ Unknown status:', user.status);
    }

    // 4. Environment check
    console.log('\n4️⃣ Checking environment variables...');
    console.log('   NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing');
    console.log('   SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing');
    console.log('   NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Missing');

    // 5. Summary
    console.log('\n📋 SUMMARY:');
    if (user && user.status === 'active' && isValid) {
      console.log('✅ Admin user is correctly configured and should be able to login');
      console.log('✅ Credentials: admin@sasa-worldwide.com / Admin@123');
    } else {
      console.log('❌ Issues found:');
      if (!user) console.log('   - Admin user does not exist');
      if (user && user.status !== 'active') console.log('   - User status is not active:', user.status);
      if (user && !isValid) console.log('   - Password hash does not match');
    }

  } catch (error: any) {
    console.error('❌ Unexpected error:', error.message);
    console.error(error);
  }
}

debugAdmin();
