require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testLogin() {
  console.log('🧪 Testing Login Credentials...\n');

  const testEmail = 'admin@sasa-worldwide.com';
  const testPassword = 'admin123';

  console.log(`📧 Testing email: ${testEmail}`);
  console.log(`🔑 Testing password: ${testPassword}\n`);

  // Query user from database
  console.log('1️⃣  Querying user from database...');
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', testEmail.toLowerCase())
    .single();

  if (error) {
    console.error('❌ Database error:', error);
    return;
  }

  if (!user) {
    console.error('❌ User not found in database');
    return;
  }

  console.log('✅ User found:');
  console.log('   - ID:', user.id);
  console.log('   - Email:', user.email);
  console.log('   - Name:', user.name);
  console.log('   - Role:', user.role);
  console.log('   - Status:', user.status);
  console.log('   - Email Verified:', user.email_verified);
  console.log('   - Password Hash:', user.password_hash.substring(0, 20) + '...');

  // Test password comparison
  console.log('\n2️⃣  Testing password comparison...');
  const isValidPassword = await bcrypt.compare(testPassword, user.password_hash);

  if (isValidPassword) {
    console.log('✅ Password matches!');
    console.log('\n🎉 Login test successful! The credentials are correct.');
  } else {
    console.log('❌ Password does NOT match!');
    console.log('\n⚠️  The password hash in the database does not match the test password.');
    console.log('   This might mean the seed data needs to be re-run.');
  }

  // Check account status
  console.log('\n3️⃣  Checking account status...');
  if (user.status === 'active') {
    console.log('✅ Account is active');
  } else {
    console.log(`❌ Account status is: ${user.status}`);
    console.log('   Account must be "active" to log in.');
  }
}

testLogin();
