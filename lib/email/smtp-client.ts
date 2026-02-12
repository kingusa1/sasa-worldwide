import { config } from 'dotenv';
config({ path: '.env.local' });

import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import { ReactElement } from 'react';

// SMTP Configuration - Use port 465 with SSL (required for Vercel serverless)
const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE === 'false' ? false : true, // default true (SSL on 465)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
};

// Create transporter
const transporter = nodemailer.createTransport(SMTP_CONFIG);

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('[SMTP] Connection failed:', error.message);
  } else {
    console.log('[SMTP] Server is ready to send emails');
  }
});

export async function sendEmailSMTP({
  to,
  subject,
  template,
  from,
}: {
  to: string | string[];
  subject: string;
  template: ReactElement;
  from?: string;
}) {
  try {
    const html = await render(template);

    const fromEmail = from || process.env.SMTP_FROM || process.env.SMTP_USER;

    const info = await transporter.sendMail({
      from: fromEmail,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      html,
    });

    console.log('[SMTP] Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('[SMTP] Failed to send email:', error);
    throw error;
  }
}

// Export transporter for advanced use cases
export { transporter };
