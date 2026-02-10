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

async function fixPasswords() {
  console.log('🔧 Fixing admin passwords...\n');

  // Generate correct password hashes
  console.log('1️⃣  Generating password hashes...');
  const adminHash = await bcrypt.hash('admin123', 12);
  const staffHash = await bcrypt.hash('staff123', 12);
  const affiliateHash = await bcrypt.hash('affiliate123', 12);

  console.log('✅ Hashes generated\n');

  // Update admin password
  console.log('2️⃣  Updating admin password...');
  const { error: adminError } = await supabase
    .from('users')
    .update({ password_hash: adminHash })
    .eq('email', 'admin@sasa-worldwide.com');

  if (adminError) {
    console.error('❌ Failed to update admin:', adminError);
  } else {
    console.log('✅ Admin password updated');
  }

  // Update staff password
  console.log('3️⃣  Updating staff password...');
  const { error: staffError } = await supabase
    .from('users')
    .update({ password_hash: staffHash })
    .eq('email', 'staff@sasa-worldwide.com');

  if (staffError) {
    console.error('❌ Failed to update staff:', staffError);
  } else {
    console.log('✅ Staff password updated');
  }

  // Update affiliate password
  console.log('4️⃣  Updating affiliate password...');
  const { error: affiliateError } = await supabase
    .from('users')
    .update({ password_hash: affiliateHash })
    .eq('email', 'affiliate@sasa-worldwide.com');

  if (affiliateError) {
    console.error('❌ Failed to update affiliate:', affiliateError);
  } else {
    console.log('✅ Affiliate password updated');
  }

  console.log('\n🎉 All passwords have been fixed!');
  console.log('\n📝 Test credentials:');
  console.log('   Admin:     admin@sasa-worldwide.com / admin123');
  console.log('   Staff:     staff@sasa-worldwide.com / staff123');
  console.log('   Affiliate: affiliate@sasa-worldwide.com / affiliate123');
}

fixPasswords();
