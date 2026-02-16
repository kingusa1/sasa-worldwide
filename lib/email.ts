import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'mail.sasa-worldwide.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

interface VoucherEmailData {
  to: string;
  name: string;
  voucherCode: string;
  projectName: string;
  productName?: string;
  amount: number;
}

export async function sendVoucherEmail(data: VoucherEmailData): Promise<void> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.log('📧 SMTP not configured - skipping email');
    console.log(`   Would send voucher ${data.voucherCode} to ${data.to}`);
    return;
  }

  const fromEmail = process.env.SMTP_FROM || `SASA Worldwide <${process.env.SMTP_USER}>`;

  try {
    const info = await transporter.sendMail({
      from: fromEmail,
      to: data.to,
      subject: `Your ${data.productName || data.projectName} - Voucher Code`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Voucher Code</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #002E59 0%, #004080 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Payment Successful!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Thank you for your purchase</p>
          </div>

          <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
            <p style="font-size: 16px; margin-top: 0;">Hi ${data.name},</p>
            <p style="font-size: 16px;">Thank you for purchasing <strong>${data.productName || data.projectName}</strong>! Here are your details:</p>

            <div style="background: white; border: 2px solid #002E59; border-radius: 8px; padding: 20px; margin: 25px 0;">
              <p style="margin: 0; font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px;">Your Voucher Code</p>
              <p style="margin: 10px 0 0 0; font-size: 32px; font-weight: bold; color: #002E59; letter-spacing: 2px; font-family: 'Courier New', monospace;">${data.voucherCode}</p>
            </div>

            <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px;"><strong>Project:</strong> ${data.projectName}</p>
              ${data.productName ? `<p style="margin: 10px 0 0 0; font-size: 14px;"><strong>Product:</strong> ${data.productName}</p>` : ''}
              <p style="margin: 10px 0 0 0; font-size: 14px;"><strong>Amount Paid:</strong> AED ${data.amount.toFixed(2)}</p>
            </div>

            <h3 style="color: #002E59; margin-top: 30px;">How to Redeem:</h3>
            <ol style="font-size: 14px; line-height: 1.8;">
              <li>Save this voucher code in a safe place</li>
              <li>Follow the redemption instructions provided by your sales representative</li>
              <li>Present this code when redeeming your voucher</li>
            </ol>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="font-size: 14px; color: #6b7280; margin: 0;">Need help? Contact us at <a href="mailto:support@sasa-worldwide.com" style="color: #002E59;">support@sasa-worldwide.com</a></p>
            </div>
          </div>

          <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
            <p style="margin: 0; font-size: 12px; color: #6b7280;">&copy; 2026 SASA Worldwide. All rights reserved.</p>
            <p style="margin: 10px 0 0 0; font-size: 12px; color: #6b7280;">This email was sent to ${data.to}</p>
          </div>
        </body>
        </html>
      `,
    });

    console.log(`✅ Voucher email sent to ${data.to} via SMTP (${info.messageId})`);
  } catch (error: any) {
    console.error('Failed to send voucher email via SMTP:', error);
    throw new Error(`Email sending failed: ${error.message}`);
  }
}
