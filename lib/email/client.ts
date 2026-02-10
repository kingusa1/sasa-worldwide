import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export const FROM_EMAIL = 'SASA Worldwide <onboarding@resend.dev>';

// Note: For production, change to: 'SASA Worldwide <noreply@sasa-worldwide.com>'
// after verifying your domain in Resend dashboard
