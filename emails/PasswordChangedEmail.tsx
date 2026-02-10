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

interface PasswordChangedEmailProps {
  name: string;
  timestamp: string;
  supportUrl: string;
}

export function PasswordChangedEmail({ name, timestamp, supportUrl }: PasswordChangedEmailProps) {
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
            <Text style={emoji}>✅</Text>

            <Text style={heading}>Password Changed Successfully</Text>

            <Text style={paragraph}>
              Hello {name},
            </Text>

            <Text style={paragraph}>
              Your password was successfully changed on <strong>{timestamp}</strong>.
            </Text>

            <Section style={infoBox}>
              <Text style={infoText}>
                ✓ Your password has been updated<br />
                ✓ Your account is secure<br />
                ✓ You can now login with your new password
              </Text>
            </Section>

            <Hr style={divider} />

            <Text style={warningHeading}>⚠️ Didn't Make This Change?</Text>
            <Text style={warningText}>
              If you did NOT change your password, your account may have been compromised. Please contact our support team immediately to secure your account.
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={supportUrl}>
                Contact Support
              </Button>
            </Section>

            <Hr style={divider} />

            <Text style={footnote}>
              <strong>Support Contact:</strong><br />
              Email: info@sasa-worldwide.com<br />
              Phone: +971 4 584 3777
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

const emoji = {
  fontSize: '48px',
  textAlign: 'center' as const,
  margin: '0 0 16px 0',
};

const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#002E59',
  margin: '0 0 24px 0',
  lineHeight: '32px',
  textAlign: 'center' as const,
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#333333',
  margin: '16px 0',
};

const infoBox = {
  backgroundColor: '#ecfdf5',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
  border: '1px solid #a7f3d0',
};

const infoText = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#065f46',
  margin: '0',
};

const warningHeading = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#dc2626',
  margin: '16px 0 8px 0',
};

const warningText = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#991b1b',
  backgroundColor: '#fef2f2',
  padding: '16px',
  borderRadius: '8px',
  margin: '12px 0',
  borderLeft: '4px solid #dc2626',
};

const buttonContainer = {
  padding: '16px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#dc2626',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 28px',
  lineHeight: '24px',
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

export default PasswordChangedEmail;
