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

const accounts = [
  { email: 'admin@sasa-worldwide.com', password: 'admin123', role: 'Admin' },
  { email: 'staff@sasa-worldwide.com', password: 'staff123', role: 'Staff' },
  { email: 'affiliate@sasa-worldwide.com', password: 'affiliate123', role: 'Affiliate' },
];

async function testAccount(account) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🧪 Testing ${account.role} Account`);
  console.log(`${'='.repeat(60)}`);
  console.log(`📧 Email: ${account.email}`);
  console.log(`🔑 Password: ${account.password}\n`);

  // Query user
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', account.email.toLowerCase())
    .single();

  if (error) {
    console.error('❌ Database error:', error.message);
    return false;
  }

  if (!user) {
    console.error('❌ User not found');
    return false;
  }

  console.log('✅ User found in database');
  console.log(`   Role: ${user.role}`);
  console.log(`   Status: ${user.status}`);

  // Test password
  const isValid = await bcrypt.compare(account.password, user.password_hash);

  if (isValid) {
    console.log('✅ Password is correct!');
    if (user.status === 'active') {
      console.log('✅ Account is active');
      console.log(`\n🎉 ${account.role} login should work!`);
      return true;
    } else {
      console.log(`❌ Account status is: ${user.status} (must be "active")`);
      return false;
    }
  } else {
    console.log('❌ Password does NOT match');
    return false;
  }
}

async function testAll() {
  console.log('\n🔍 TESTING ALL LOGIN ACCOUNTS\n');

  let allPassed = true;
  for (const account of accounts) {
    const passed = await testAccount(account);
    if (!passed) allPassed = false;
  }

  console.log(`\n${'='.repeat(60)}`);
  if (allPassed) {
    console.log('✅ ALL ACCOUNTS PASSED - Ready to login!');
  } else {
    console.log('❌ SOME ACCOUNTS FAILED - See errors above');
  }
  console.log(`${'='.repeat(60)}\n`);
}

testAll();
