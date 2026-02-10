require('dotenv').config({ path: '.env.local' });

console.log('🔍 SMTP Configuration Debug:\n');
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? '***' + process.env.SMTP_PASSWORD.slice(-4) : 'NOT SET');
console.log('SMTP_FROM:', process.env.SMTP_FROM);
console.log('\n');

// Test if credentials exist
if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
  console.error('❌ SMTP credentials are missing!');
  console.log('\n💡 Make sure .env.local has:');
  console.log('   SMTP_USER=it@sasa-worldwide.com');
  console.log('   SMTP_PASSWORD=Ayman@sasa2025');
} else {
  console.log('✅ SMTP credentials loaded successfully');
}
