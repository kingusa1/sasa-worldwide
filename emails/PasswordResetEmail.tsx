import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Button,
  Section,
  Hr,
} from '@react-email/components';

interface PasswordResetEmailProps {
  name: string;
  resetUrl: string;
}

export function PasswordResetEmail({ name, resetUrl }: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logoText}>SASA Worldwide</Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={heading}>Reset Your Password</Text>

            <Text style={paragraph}>
              Hello {name},
            </Text>

            <Text style={paragraph}>
              We received a request to reset your password for your SASA Worldwide account. Click the button below to create a new password:
            </Text>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={resetUrl}>
                Reset Password
              </Button>
            </Section>

            <Text style={expiryText}>
              ⏱️ This link will expire in <strong>1 hour</strong> for security reasons.
            </Text>

            <Hr style={divider} />

            <Text style={warningHeading}>🔒 Security Notice</Text>
            <Text style={warningText}>
              If you didn't request this password reset, please ignore this email. Your password will not be changed unless you click the link above and create a new password.
            </Text>

            <Text style={warningText}>
              Never share your password with anyone. SASA Worldwide will never ask for your password via email.
            </Text>

            <Hr style={divider} />

            <Text style={footnote}>
              Need help? Contact support at info@sasa-worldwide.com
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} SASA Worldwide. All rights reserved.
            </Text>
            <Text style={footerText}>
              Dubai, United Arab Emirates
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
};

const header = {
  backgroundColor: '#002E59',
  padding: '24px',
  borderTopLeftRadius: '12px',
  borderTopRightRadius: '12px',
};

const logoText = {
  margin: '0',
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#ffffff',
  textAlign: 'center' as const,
  letterSpacing: '-0.5px',
};

const content = {
  backgroundColor: '#ffffff',
  padding: '32px',
  borderBottomLeftRadius: '12px',
  borderBottomRightRadius: '12px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
};

const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#002E59',
  margin: '0 0 24px 0',
  lineHeight: '32px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#333333',
  margin: '16px 0',
};

const buttonContainer = {
  padding: '24px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#002E59',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
  lineHeight: '24px',
};

const expiryText = {
  fontSize: '14px',
  lineHeight: '20px',
  color: '#dc2626',
  textAlign: 'center' as const,
  margin: '16px 0',
};

const warningHeading = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#f59e0b',
  margin: '16px 0 8px 0',
};

const warningText = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#6b7280',
  backgroundColor: '#fffbeb',
  padding: '12px',
  borderRadius: '6px',
  margin: '8px 0',
  borderLeft: '4px solid #f59e0b',
};

const divider = {
  borderColor: '#e5e7eb',
  margin: '24px 0',
};

const footnote = {
  fontSize: '14px',
  lineHeight: '20px',
  color: '#6b7280',
  margin: '8px 0',
  textAlign: 'center' as const,
};

const footer = {
  marginTop: '24px',
  textAlign: 'center' as const,
};

const footerText = {
  fontSize: '12px',
  lineHeight: '18px',
  color: '#9ca3af',
  margin: '4px 0',
};

export default PasswordResetEmail;
