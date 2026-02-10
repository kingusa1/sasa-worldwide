// Test email sending with Resend
import { sendEmail } from './lib/email/send';
import { WelcomeEmail } from './emails/WelcomeEmail';
import { AccountApprovedEmail } from './emails/AccountApprovedEmail';
import { PasswordResetEmail } from './emails/PasswordResetEmail';

async function testEmails() {
  console.log('📧 Testing email sending with Resend...\n');

  const testEmail = 'admin@sasa-worldwide.com'; // Change this to your email to receive test emails

  try {
    // Test 1: Welcome Email
    console.log('1️⃣ Sending Welcome Email...');
    await sendEmail({
      to: testEmail,
      subject: 'Welcome to SASA Worldwide - Verify Your Email',
      template: WelcomeEmail({
        name: 'John Doe',
        verificationUrl: 'http://localhost:3000/verify-email?token=test123',
      }),
    });
    console.log('✅ Welcome Email sent successfully!\n');

    // Test 2: Account Approved Email
    console.log('2️⃣ Sending Account Approved Email...');
    await sendEmail({
      to: testEmail,
      subject: 'Welcome to the Team! - SASA Worldwide',
      template: AccountApprovedEmail({
        name: 'John Doe',
        loginUrl: 'http://localhost:3000/login',
      }),
    });
    console.log('✅ Account Approved Email sent successfully!\n');

    // Test 3: Password Reset Email
    console.log('3️⃣ Sending Password Reset Email...');
    await sendEmail({
      to: testEmail,
      subject: 'Reset Your Password - SASA Worldwide',
      template: PasswordResetEmail({
        name: 'John Doe',
        resetUrl: 'http://localhost:3000/reset-password?token=reset123',
      }),
    });
    console.log('✅ Password Reset Email sent successfully!\n');

    console.log('🎉 All test emails sent successfully!');
    console.log(`\n📬 Check your inbox at: ${testEmail}`);
    console.log('   (Also check spam folder if you don\'t see them)\n');

  } catch (error) {
    console.error('❌ Error sending emails:', error);
    process.exit(1);
  }
}

testEmails();
