import { resend, FROM_EMAIL } from './client';
import { render } from '@react-email/render';
import { ReactElement } from 'react';

export async function sendEmail({
  to,
  subject,
  template,
}: {
  to: string;
  subject: string;
  template: ReactElement;
}) {
  try {
    const html = render(template);

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('[Email] Send error:', error);
      throw error;
    }

    console.log('[Email] Successfully sent to:', to);
    return data;
  } catch (error) {
    console.error('[Email] Failed to send:', error);
    throw error;
  }
}
