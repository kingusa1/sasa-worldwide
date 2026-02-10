// Test Supabase connection
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n');

  try {
    // Test 1: Check if we can connect
    console.log('📡 Connecting to:', supabaseUrl);

    // Test 2: Query users table
    const { data: users, error } = await supabase
      .from('users')
      .select('email, name, role, status')
      .limit(10);

    if (error) {
      console.error('❌ Error querying users:', error.message);
      process.exit(1);
    }

    console.log('✅ Connection successful!');
    console.log(`\n📊 Found ${users.length} users in database:\n`);

    users.forEach(user => {
      console.log(`  👤 ${user.name}`);
      console.log(`     Email: ${user.email}`);
      console.log(`     Role: ${user.role}`);
      console.log(`     Status: ${user.status}\n`);
    });

    // Test 3: Count tables
    const tables = ['users', 'staff_profiles', 'affiliate_profiles', 'signup_requests', 'verification_tokens', 'sessions', 'audit_logs'];
    console.log('📋 Verifying tables...');
    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (!error) {
        console.log(`  ✅ ${table}: ${count} records`);
      }
    }

    console.log('\n🎉 All tests passed! Database is ready!');
    console.log('\n💡 Test Login Credentials:');
    console.log('   Admin:');
    console.log('     Email: admin@sasa-worldwide.com');
    console.log('     Password: Admin@123');
    console.log('   Staff:');
    console.log('     Email: john.doe@sasa-worldwide.com');
    console.log('     Password: Staff@123');
    console.log('   Affiliate:');
    console.log('     Email: jane.smith@example.com');
    console.log('     Password: Affiliate@123');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testConnection();
