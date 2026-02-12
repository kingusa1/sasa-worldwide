import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { ReactElement } from 'react';

// ============================================
// Unified Email Sender
// Primary: Resend (HTTP API - works on Vercel)
// Fallback: SMTP (works on local dev only)
// ============================================

let _transporter: nodemailer.Transporter | null = null;

function getSmtpTransporter(): nodemailer.Transporter {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: parseInt(process.env.SMTP_PORT || '465') === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: { rejectUnauthorized: false },
      connectionTimeout: 10000,
      socketTimeout: 15000,
      greetingTimeout: 10000,
    });
  }
  return _transporter;
}

async function sendViaResend(to: string, subject: string, html: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY not configured');

  const resend = new Resend(apiKey);
  const fromEmail = process.env.SMTP_FROM || 'SASA Worldwide <onboarding@resend.dev>';

  console.log(`[Email/Resend] Sending to=${to}, subject="${subject}"`);

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to,
    subject,
    html,
  });

  if (error) {
    console.error('[Email/Resend] API error:', JSON.stringify(error));
    throw new Error(`Resend API error: ${JSON.stringify(error)}`);
  }

  console.log(`[Email/Resend] Sent successfully: id=${data?.id}`);
}

async function sendViaSMTP(to: string, subject: string, html: string): Promise<void> {
  const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER || '';
  console.log(`[Email/SMTP] Sending to=${to}, subject="${subject}"`);

  const transporter = getSmtpTransporter();
  const info = await transporter.sendMail({ from: fromEmail, to, subject, html });

  console.log(`[Email/SMTP] Sent successfully: messageId=${info.messageId}`);
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
  // Build HTML from template or use raw HTML
  let html: string;
  if (rawHtml) {
    html = rawHtml;
  } else if (template) {
    html = await render(template);
  } else {
    throw new Error('Either template or html must be provided');
  }

  const toAddress = Array.isArray(to) ? to.join(', ') : to;

  // Strategy: Try Resend first (works on Vercel), fall back to SMTP (works locally)
  if (process.env.RESEND_API_KEY) {
    try {
      await sendViaResend(toAddress, subject, html);
      return;
    } catch (resendError: any) {
      console.error('[Email] Resend failed:', resendError.message);
    }
  }

  // Fallback: Try SMTP (works on local dev, blocked on Vercel)
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
    try {
      await sendViaSMTP(toAddress, subject, html);
      return;
    } catch (smtpError: any) {
      console.error('[Email] SMTP failed:', smtpError.message);
      _transporter = null;
    }
  }

  throw new Error('All email methods failed. Check RESEND_API_KEY and SMTP config.');
}

export { getSmtpTransporter as transporter };
