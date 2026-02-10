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

async function createUsers() {
  console.log('👥 Creating test user accounts...\n');

  // Generate password hashes
  const staffHash = await bcrypt.hash('staff123', 12);
  const affiliateHash = await bcrypt.hash('affiliate123', 12);

  // Create staff user
  console.log('1️⃣  Creating staff user...');
  const { data: staff, error: staffError } = await supabase
    .from('users')
    .insert({
      email: 'staff@sasa-worldwide.com',
      password_hash: staffHash,
      name: 'John Staff',
      role: 'staff',
      status: 'active',
      email_verified: true,
    })
    .select()
    .single();

  if (staffError) {
    if (staffError.code === '23505') {
      console.log('   ⚠️  Staff user already exists, updating password...');
      await supabase
        .from('users')
        .update({ password_hash: staffHash, status: 'active' })
        .eq('email', 'staff@sasa-worldwide.com');
      console.log('   ✅ Staff password updated');
    } else {
      console.error('   ❌ Error:', staffError.message);
    }
  } else {
    console.log('   ✅ Staff user created');
  }

  // Create affiliate user
  console.log('\n2️⃣  Creating affiliate user...');
  const { data: affiliate, error: affiliateError } = await supabase
    .from('users')
    .insert({
      email: 'affiliate@sasa-worldwide.com',
      password_hash: affiliateHash,
      name: 'Jane Affiliate',
      role: 'affiliate',
      status: 'active',
      email_verified: true,
    })
    .select()
    .single();

  if (affiliateError) {
    if (affiliateError.code === '23505') {
      console.log('   ⚠️  Affiliate user already exists, updating password...');
      await supabase
        .from('users')
        .update({ password_hash: affiliateHash, status: 'active' })
        .eq('email', 'affiliate@sasa-worldwide.com');
      console.log('   ✅ Affiliate password updated');
    } else {
      console.error('   ❌ Error:', affiliateError.message);
    }
  } else {
    console.log('   ✅ Affiliate user created');
  }

  console.log('\n🎉 All test users are ready!');
  console.log('\n📝 Login Credentials:');
  console.log('   Admin:     admin@sasa-worldwide.com / admin123');
  console.log('   Staff:     staff@sasa-worldwide.com / staff123');
  console.log('   Affiliate: affiliate@sasa-worldwide.com / affiliate123');
}

createUsers();
