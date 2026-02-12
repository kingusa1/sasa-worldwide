import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import { ReactElement } from 'react';

// Lazy transporter - created on first use, not at module load
let _transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!_transporter) {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '465');
    const secure = port === 465 ? true : process.env.SMTP_SECURE === 'true';

    console.log(`[SMTP] Creating transporter: ${host}:${port} (secure=${secure})`);

    _transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 10000, // 10s to connect
      socketTimeout: 15000,     // 15s socket timeout
      greetingTimeout: 10000,   // 10s greeting timeout
    });
  }
  return _transporter;
}

export async function sendEmailSMTP({
  to,
  subject,
  template,
  html: rawHtml,
  from,
}: {
  to: string | string[];
  subject: string;
  template?: ReactElement;
  html?: string;
  from?: string;
}) {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD;
  const smtpHost = process.env.SMTP_HOST;

  if (!smtpUser || !smtpPass || !smtpHost) {
    console.error('[SMTP] Missing config:', {
      host: !!smtpHost,
      user: !!smtpUser,
      pass: !!smtpPass,
    });
    throw new Error('SMTP not configured: missing SMTP_HOST, SMTP_USER, or SMTP_PASSWORD');
  }

  // Render React email template to HTML, or use raw HTML
  let html: string;
  if (rawHtml) {
    html = rawHtml;
  } else if (template) {
    try {
      html = await render(template);
    } catch (renderError) {
      console.error('[SMTP] React email render failed:', renderError);
      throw new Error(`Email template render failed: ${renderError}`);
    }
  } else {
    throw new Error('Either template or html must be provided');
  }

  const fromEmail = from || process.env.SMTP_FROM || smtpUser;
  const toAddress = Array.isArray(to) ? to.join(', ') : to;

  // Retry up to 2 times
  let lastError: Error | null = null;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      console.log(`[SMTP] Sending email (attempt ${attempt}): to=${toAddress}, subject="${subject}"`);

      const transporter = getTransporter();
      const info = await transporter.sendMail({
        from: fromEmail,
        to: toAddress,
        subject,
        html,
      });

      console.log(`[SMTP] Email sent successfully: messageId=${info.messageId}`);
      return info;
    } catch (error: any) {
      lastError = error;
      console.error(`[SMTP] Attempt ${attempt} failed:`, error.message || error);

      // Reset transporter on failure so next attempt creates a fresh connection
      _transporter = null;

      if (attempt < 2) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1s delay before retry
      }
    }
  }

  throw lastError || new Error('Email sending failed after retries');
}

export { getTransporter as transporter };
