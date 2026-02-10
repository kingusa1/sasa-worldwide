import { config } from 'dotenv';
config({ path: '.env.local' });

import { sendEmailSMTP } from './lib/email/smtp-client';
import { WelcomeEmail } from './emails/WelcomeEmail';

async function testSMTP() {
  console.log('📧 Testing SMTP Email Sending...\n');

  try {
    await sendEmailSMTP({
      to: 'it@sasa-worldwide.com',
      subject: 'Test Email - SASA Worldwide SMTP',
      template: WelcomeEmail({
        name: 'Test User',
        verificationUrl: 'https://sasa-worldwide.com/verify?token=test123',
      }),
    });

    console.log('\n✅ Email sent successfully via SMTP!');
    console.log('📬 Check your inbox at: it@sasa-worldwide.com');
  } catch (error: any) {
    console.error('\n❌ Failed to send email:', error.message);
    console.log('\n💡 Common issues:');
    console.log('   1. Incorrect SMTP credentials');
    console.log('   2. Need to enable "Less secure app access" (Gmail)');
    console.log('   3. Need to generate "App Password" (Gmail/Outlook)');
    console.log('   4. Incorrect SMTP host or port');
    console.log('   5. Firewall blocking SMTP port');
  }
}

testSMTP();
