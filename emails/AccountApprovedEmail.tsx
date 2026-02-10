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
  Img,
} from '@react-email/components';

interface AccountApprovedEmailProps {
  name: string;
  loginUrl: string;
}

export function AccountApprovedEmail({ name, loginUrl }: AccountApprovedEmailProps) {
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
            <Text style={emoji}>🎉</Text>

            <Text style={heading}>Welcome to the Team, {name}!</Text>

            <Text style={paragraph}>
              Great news! Your account has been approved by our administrators. You now have full access to the SASA Worldwide platform.
            </Text>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={loginUrl}>
                Login to Your Dashboard
              </Button>
            </Section>

            <Text style={subheading}>Next Steps:</Text>
            <Text style={listItem}>• Complete your profile information</Text>
            <Text style={listItem}>• Explore training resources in SASA Academy</Text>
            <Text style={listItem}>• Contact HR for onboarding schedule</Text>
            <Text style={listItem}>• Review company policies and guidelines</Text>

            <Hr style={divider} />

            <Text style={paragraph}>
              <strong>Need Help?</strong>
            </Text>
            <Text style={paragraph}>
              Contact HR: hr@sasa-worldwide.com<br />
              Phone: +971 4 584 3777<br />
              Hours: Sunday-Thursday, 9AM-6PM GST
            </Text>

            <Text style={footnote}>
              We're excited to have you on board!
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
};

const subheading = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#002E59',
  margin: '24px 0 12px 0',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#333333',
  margin: '16px 0',
};

const listItem = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#333333',
  margin: '8px 0',
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
  margin: '16px 0',
  fontStyle: 'italic',
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

export default AccountApprovedEmail;
