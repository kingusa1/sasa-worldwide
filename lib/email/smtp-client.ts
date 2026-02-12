import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import { ReactElement } from 'react';

// ============================================
// Unified Email Sender
// Priority order:
// 1. Brevo (HTTP API - free 300/day, works on Vercel, no domain verification)
// 2. Resend (HTTP API - works on Vercel, needs domain verification)
// 3. SMTP (direct - works on local dev only, blocked on Vercel)
// ============================================

let _transporter: nodemailer.Transporter | null = null;

// --- Brevo (Sendinblue) via fetch - FREE 300 emails/day ---
async function sendViaBrevo(to: string, subject: string, html: string): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error('BREVO_API_KEY not configured');

  const senderEmail = process.env.SMTP_USER || 'it@sasa-worldwide.com';
  const senderName = 'SASA Worldwide';

  console.log(`[Email/Brevo] Sending to=${to}, subject="${subject}"`);

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`[Email/Brevo] API error (${response.status}):`, errorBody);
    throw new Error(`Brevo API error: ${response.status} - ${errorBody}`);
  }

  const data = await response.json();
  console.log(`[Email/Brevo] Sent successfully: messageId=${data.messageId}`);
}

// --- Resend via their SDK ---
async function sendViaResend(to: string, subject: string, html: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY not configured');

  const { Resend } = await import('resend');
  const resend = new Resend(apiKey);

  console.log(`[Email/Resend] Sending to=${to}, subject="${subject}"`);

  const { data, error } = await resend.emails.send({
    from: 'SASA Worldwide <onboarding@resend.dev>',
    to,
    subject,
    html,
  });

  if (error) {
    console.error('[Email/Resend] API error:', JSON.stringify(error));
    throw new Error(`Resend error: ${JSON.stringify(error)}`);
  }

  console.log(`[Email/Resend] Sent successfully: id=${data?.id}`);
}

// --- SMTP via nodemailer (local dev only) ---
async function sendViaSMTP(to: string, subject: string, html: string): Promise<void> {
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
    });
  }

  const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER || '';
  console.log(`[Email/SMTP] Sending to=${to}, subject="${subject}"`);

  const info = await _transporter.sendMail({ from: fromEmail, to, subject, html });
  console.log(`[Email/SMTP] Sent successfully: messageId=${info.messageId}`);
}

// --- Main export: tries all providers in order ---
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
  // Build HTML
  let html: string;
  if (rawHtml) {
    html = rawHtml;
  } else if (template) {
    html = await render(template);
  } else {
    throw new Error('Either template or html must be provided');
  }

  const toAddress = Array.isArray(to) ? to.join(', ') : to;
  const errors: string[] = [];

  // 1. Try Brevo (HTTP, works on Vercel, free, no domain verification)
  if (process.env.BREVO_API_KEY) {
    try {
      await sendViaBrevo(toAddress, subject, html);
      return;
    } catch (e: any) {
      errors.push(`Brevo: ${e.message}`);
    }
  }

  // 2. Try Resend (HTTP, works on Vercel, needs domain verification)
  if (process.env.RESEND_API_KEY) {
    try {
      await sendViaResend(toAddress, subject, html);
      return;
    } catch (e: any) {
      errors.push(`Resend: ${e.message}`);
    }
  }

  // 3. Try SMTP (works locally, blocked on Vercel)
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
    try {
      await sendViaSMTP(toAddress, subject, html);
      return;
    } catch (e: any) {
      errors.push(`SMTP: ${e.message}`);
      _transporter = null;
    }
  }

  console.error('[Email] All providers failed:', errors);
  throw new Error(`All email methods failed: ${errors.join(' | ')}`);
}

export { sendViaSMTP as transporter };
