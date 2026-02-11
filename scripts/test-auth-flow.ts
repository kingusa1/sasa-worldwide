/**
 * Test the complete authentication flow
 * Run with: npx tsx scripts/test-auth-flow.ts
 */

import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testAuthFlow() {
  console.log('🧪 Testing Complete Auth Flow...\n');

  const testEmail = 'admin@sasa-worldwide.com';
  const testPassword = 'Admin@123';

  try {
    console.log('📧 Testing with credentials:');
    console.log('   Email:', testEmail);
    console.log('   Password:', testPassword);
    console.log();

    // Step 1: Simulate authorize function logic
    console.log('1️⃣ Step 1: Query user from database...');
    const emailToQuery = testEmail.toLowerCase();
    console.log('   Querying email:', emailToQuery);

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', emailToQuery)
      .single();

    if (userError) {
      console.error('❌ Database error:', userError.message);
      console.error('   Error details:', userError);
      return;
    }

    if (!user) {
      console.error('❌ User not found with email:', emailToQuery);
      return;
    }

    console.log('✅ User found:');
    console.log('   ID:', user.id);
    console.log('   Email:', user.email);
    console.log('   Name:', user.name);
    console.log('   Role:', user.role);
    console.log('   Status:', user.status);
    console.log();

    // Step 2: Verify password
    console.log('2️⃣ Step 2: Verify password...');
    console.log('   Stored hash:', user.password_hash.substring(0, 30) + '...');

    const isValidPassword = await bcrypt.compare(testPassword, user.password_hash);
    console.log('   bcrypt.compare result:', isValidPassword);

    if (!isValidPassword) {
      console.error('❌ Password verification FAILED');
      return;
    }
    console.log('✅ Password verified');
    console.log();

    // Step 3: Check user status
    console.log('3️⃣ Step 3: Check user status...');

    if (user.status === 'suspended') {
      console.error('❌ User is suspended');
      return;
    }
    if (user.status === 'rejected') {
      console.error('❌ User is rejected');
      return;
    }
    if (user.status === 'pending') {
      console.error('❌ User is pending approval');
      return;
    }
    if (user.status !== 'active') {
      console.error('❌ Unknown status:', user.status);
      return;
    }

    console.log('✅ User status is active');
    console.log();

    // Step 4: Create user object (what authorize returns)
    console.log('4️⃣ Step 4: Create user object for session...');
    const userObject = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
      emailVerified: user.email_verified,
    };
    console.log('✅ User object created:', JSON.stringify(userObject, null, 2));
    console.log();

    // Step 5: Test audit log (optional)
    console.log('5️⃣ Step 5: Test audit log insertion...');
    const { error: auditError } = await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'test_login',
      details: { email: user.email, test: true },
    });

    if (auditError) {
      console.warn('⚠️  Audit log failed:', auditError.message);
    } else {
      console.log('✅ Audit log inserted');
    }
    console.log();

    // Summary
    console.log('🎉 SUCCESS: All authentication steps passed!');
    console.log('📋 The authorize function should work correctly with these credentials.');
    console.log();
    console.log('🔍 If login still fails, the issue may be:');
    console.log('   1. NextAuth configuration issue');
    console.log('   2. Environment variable not loaded correctly in NextAuth context');
    console.log('   3. Browser/client-side issue');
    console.log('   4. Session storage issue');

  } catch (error: any) {
    console.error('❌ Unexpected error:', error.message);
    console.error(error);
  }
}

testAuthFlow();
