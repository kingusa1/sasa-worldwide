// Test Resend API key with direct HTTP request
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.RESEND_API_KEY;

console.log('🔍 Testing Resend API Key...\n');
console.log('📋 API Key:', apiKey ? `${apiKey.substring(0, 15)}...` : 'NOT FOUND');
console.log('📏 Length:', apiKey?.length || 0);
console.log('✅ Format:', apiKey?.startsWith('re_') ? 'Valid' : 'Invalid');
console.log('');

// Test with fetch to get more detailed error
async function testKey() {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: 'admin@sasa-worldwide.com',
        subject: 'Test',
        html: '<p>Test email</p>',
      }),
    });

    const data = await response.json();

    console.log('📡 Response Status:', response.status);
    console.log('📨 Response:', JSON.stringify(data, null, 2));

    if (response.status === 401) {
      console.log('\n⚠️  API key authentication failed!');
      console.log('💡 Possible reasons:');
      console.log('   1. API key was not activated in Resend dashboard');
      console.log('   2. API key was revoked or deleted');
      console.log('   3. Resend account needs email verification');
      console.log('   4. API key is for a different environment (test vs production)');
      console.log('\n🔗 Check your Resend dashboard: https://resend.com/api-keys');
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

testKey();
