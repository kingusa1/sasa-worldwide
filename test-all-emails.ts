import { config } from 'dotenv';
config({ path: '.env.local' });

import { sendEmailSMTP } from './lib/email/smtp-client';
import { WelcomeEmail } from './emails/WelcomeEmail';
import { AccountApprovedEmail } from './emails/AccountApprovedEmail';
import { AccountRejectedEmail } from './emails/AccountRejectedEmail';
import { PasswordResetEmail } from './emails/PasswordResetEmail';
import { PasswordChangedEmail } from './emails/PasswordChangedEmail';

const TEST_EMAIL = 'mohamedhisham735@gmail.com';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function testAllEmails() {
  console.log('🚀 Starting email template tests...');
  console.log(`📧 Sending to: ${TEST_EMAIL}\n`);

  try {
    // 1. Welcome Email
    console.log('1️⃣  Sending Welcome Email...');
    await sendEmailSMTP({
      to: TEST_EMAIL,
      subject: '[TEST] Welcome to SASA Worldwide',
      template: WelcomeEmail({
        name: 'Mohamed Hisham',
        verificationUrl: `${APP_URL}/verify-email?token=test-token-123`,
      }),
    });
    console.log('✅ Welcome Email sent!\n');

    // Wait 2 seconds between emails
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 2. Account Approved Email
    console.log('2️⃣  Sending Account Approved Email...');
    await sendEmailSMTP({
      to: TEST_EMAIL,
      subject: '[TEST] Your SASA Account Has Been Approved!',
      template: AccountApprovedEmail({
        name: 'Mohamed Hisham',
        loginUrl: `${APP_URL}/login`,
      }),
    });
    console.log('✅ Account Approved Email sent!\n');

    await new Promise(resolve => setTimeout(resolve, 2000));

    // 3. Account Rejected Email
    console.log('3️⃣  Sending Account Rejected Email...');
    await sendEmailSMTP({
      to: TEST_EMAIL,
      subject: '[TEST] Update on Your SASA Account Application',
      template: AccountRejectedEmail({
        name: 'Mohamed Hisham',
        reason: 'This is a test rejection email. Employee ID could not be verified.',
      }),
    });
    console.log('✅ Account Rejected Email sent!\n');

    await new Promise(resolve => setTimeout(resolve, 2000));

    // 4. Password Reset Email
    console.log('4️⃣  Sending Password Reset Email...');
    await sendEmailSMTP({
      to: TEST_EMAIL,
      subject: '[TEST] Reset Your Password - SASA Worldwide',
      template: PasswordResetEmail({
        name: 'Mohamed Hisham',
        resetUrl: `${APP_URL}/reset-password?token=test-reset-token-456`,
      }),
    });
    console.log('✅ Password Reset Email sent!\n');

    await new Promise(resolve => setTimeout(resolve, 2000));

    // 5. Password Changed Email
    console.log('5️⃣  Sending Password Changed Email...');
    await sendEmailSMTP({
      to: TEST_EMAIL,
      subject: '[TEST] Password Changed - SASA Worldwide',
      template: PasswordChangedEmail({
        name: 'Mohamed Hisham',
        timestamp: new Date().toLocaleString('en-US', {
          dateStyle: 'full',
          timeStyle: 'long',
          timeZone: 'Asia/Dubai'
        }),
        supportUrl: `${process.env.NEXT_PUBLIC_APP_URL}/contact`,
      }),
    });
    console.log('✅ Password Changed Email sent!\n');

    console.log('🎉 All email templates sent successfully!');
    console.log(`📬 Check your inbox at: ${TEST_EMAIL}`);
    console.log('\n✨ Note: All emails are marked with [TEST] prefix\n');
  } catch (error) {
    console.error('❌ Error sending emails:', error);
    process.exit(1);
  }
}

// Run the test
testAllEmails()
  .then(() => {
    console.log('\n✅ Test complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  });
