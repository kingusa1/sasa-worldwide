// Test email sending with Resend
const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  console.log('📧 Testing email sending with Resend...\n');

  // Debug: Check if API key is loaded
  const apiKey = process.env.RESEND_API_KEY;
  console.log('🔑 API Key loaded:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT FOUND');
  console.log('🔑 API Key length:', apiKey?.length || 0);

  try {
    const { data, error } = await resend.emails.send({
      from: 'SASA Worldwide <onboarding@resend.dev>',
      to: ['it@sasa-worldwide.com'], // Your verified Resend account email
      subject: 'Test Email - SASA Worldwide',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #002E59; padding: 24px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; text-align: center; margin: 0;">SASA Worldwide</h1>
          </div>
          <div style="background-color: white; padding: 32px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
            <h2 style="color: #002E59;">🎉 Email System Test</h2>
            <p style="font-size: 16px; line-height: 26px; color: #333;">
              Congratulations! Your Resend email integration is working perfectly.
            </p>
            <p style="font-size: 16px; line-height: 26px; color: #333;">
              This is a test email from your SASA Worldwide authentication system.
            </p>
            <div style="background-color: #ecfdf5; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #065f46;">
                ✓ Resend API Key: Configured<br/>
                ✓ Email Client: Connected<br/>
                ✓ Email Templates: Ready<br/>
                ✓ System Status: Operational
              </p>
            </div>
            <p style="font-size: 14px; color: #6b7280; margin-top: 24px;">
              Generated at: ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log('✅ Test email sent successfully!');
    console.log('📬 Email ID:', data.id);
    console.log('\n💡 Check your inbox (and spam folder) for the test email!');
    console.log('   Sent to: admin@sasa-worldwide.com\n');

  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
  }
}

testEmail();
