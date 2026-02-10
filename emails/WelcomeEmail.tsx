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

interface WelcomeEmailProps {
  name: string;
  verificationUrl: string;
}

export function WelcomeEmail({ name, verificationUrl }: WelcomeEmailProps) {
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
            <Text style={heading}>Welcome, {name}!</Text>

            <Text style={paragraph}>
              Thank you for signing up for SASA Worldwide. Your account is currently under review by our team.
            </Text>

            <Text style={paragraph}>
              First, please verify your email address by clicking the button below:
            </Text>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={verificationUrl}>
                Verify Email Address
              </Button>
            </Section>

            <Text style={paragraph}>
              After email verification, you'll receive a notification once your account is approved by our administrators.
            </Text>

            <Hr style={divider} />

            <Text style={footnote}>
              If you didn't create this account, please ignore this email.
            </Text>

            <Text style={footnote}>
              This link will expire in 24 hours for security reasons.
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

// Styles (SASA Branding: Navy #002E59, Cream #f8f6f3)
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

const divider = {
  borderColor: '#e5e7eb',
  margin: '24px 0',
};

const footnote = {
  fontSize: '14px',
  lineHeight: '20px',
  color: '#6b7280',
  margin: '8px 0',
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

export default WelcomeEmail;
