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

interface EmployeeIdEmailProps {
  employeeId: string;
  signupUrl: string;
}

export function EmployeeIdEmail({ employeeId, signupUrl }: EmployeeIdEmailProps) {
  const logoUrl = `${process.env.NEXT_PUBLIC_APP_URL}/images/logo/sasa-logo-color.png`;

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo */}
          <Section style={header}>
            <Img
              src={logoUrl}
              alt="SASA Worldwide"
              width="180"
              height="60"
              style={logo}
            />
          </Section>

          {/* Main Content */}
          <Section style={content}>
            {/* Welcome Icon */}
            <Section style={iconContainer}>
              <div style={iconCircle}>
                <Text style={icon}>🎉</Text>
              </div>
            </Section>

            <Text style={heading}>Your Employee ID is Ready!</Text>

            <Text style={paragraph}>
              Welcome to SASA Worldwide! Your administrator has created an employee account for you.
            </Text>

            {/* Employee ID Box */}
            <Section style={employeeIdBox}>
              <Text style={employeeIdLabel}>Your Employee ID:</Text>
              <Text style={employeeIdValue}>{employeeId}</Text>
            </Section>

            <Text style={paragraph}>
              You can now use this employee ID to create your staff account and access the SASA Worldwide portal.
            </Text>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={signupUrl}>
                ✓ Create Your Account
              </Button>
            </Section>

            <Hr style={divider} />

            {/* Instructions Box */}
            <Section style={infoBox}>
              <Text style={infoTitle}>📋 Registration Instructions</Text>
              <Text style={infoText}>
                1. Click the button above to go to the registration page
                <br />
                2. Enter your information including the employee ID above
                <br />
                3. Use your @sasa-worldwide.com email address
                <br />
                4. Create a strong password
                <br />
                5. Submit your registration
                <br />
                6. Verify your email address
                <br />
                7. Wait for admin approval (usually 24-48 hours)
              </Text>
            </Section>

            <Text style={footnote}>
              <strong>Important:</strong> This employee ID can only be used once. If you have any questions,
              please contact HR at hr@sasa-worldwide.com or call +971 4 584 3777.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Hr style={footerDivider} />
            <Text style={footerText}>
              <strong>SASA Worldwide</strong>
              <br />
              Dubai, United Arab Emirates
            </Text>
            <Text style={footerText}>
              © {new Date().getFullYear()} SASA Worldwide. All rights reserved.
            </Text>
            <Text style={footerLinks}>
              <a href={`${process.env.NEXT_PUBLIC_APP_URL}`} style={footerLink}>Website</a>
              {' | '}
              <a href={`${process.env.NEXT_PUBLIC_APP_URL}/contact`} style={footerLink}>Contact Us</a>
              {' | '}
              <a href={`${process.env.NEXT_PUBLIC_APP_URL}/privacy`} style={footerLink}>Privacy</a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Beautiful Styles (SASA Branding: Navy #002E59)
const main = {
  backgroundColor: '#f0f4f8',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  padding: '20px',
};

const container = {
  margin: '0 auto',
  maxWidth: '600px',
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
};

const header = {
  background: 'linear-gradient(135deg, #002E59 0%, #004080 100%)',
  padding: '40px 32px',
  textAlign: 'center' as const,
};

const logo = {
  margin: '0 auto',
  display: 'block',
  maxWidth: '180px',
  height: 'auto',
};

const content = {
  padding: '48px 32px',
};

const iconContainer = {
  textAlign: 'center' as const,
  marginBottom: '24px',
};

const iconCircle = {
  display: 'inline-block',
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  textAlign: 'center' as const,
  lineHeight: '80px',
};

const icon = {
  fontSize: '40px',
  margin: '0',
};

const heading = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#002E59',
  margin: '0 0 16px 0',
  textAlign: 'center' as const,
  lineHeight: '1.2',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '28px',
  color: '#475569',
  margin: '16px 0',
};

const employeeIdBox = {
  backgroundColor: '#eff6ff',
  border: '3px solid #002E59',
  borderRadius: '16px',
  padding: '32px',
  margin: '32px 0',
  textAlign: 'center' as const,
};

const employeeIdLabel = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#64748b',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  margin: '0 0 12px 0',
};

const employeeIdValue = {
  fontSize: '36px',
  fontWeight: 'bold',
  color: '#002E59',
  letterSpacing: '2px',
  margin: '0',
  fontFamily: 'monospace',
};

const buttonContainer = {
  padding: '32px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#002E59',
  borderRadius: '12px',
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: '700',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '18px 48px',
  boxShadow: '0 4px 12px rgba(0, 46, 89, 0.3)',
};

const divider = {
  borderColor: '#e2e8f0',
  margin: '32px 0',
};

const infoBox = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  padding: '24px',
  margin: '24px 0',
};

const infoTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#002E59',
  margin: '0 0 16px 0',
};

const infoText = {
  fontSize: '14px',
  lineHeight: '24px',
  color: '#475569',
  margin: '0',
};

const footnote = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#64748b',
  margin: '24px 0 0 0',
  padding: '20px',
  backgroundColor: '#fef3c7',
  border: '1px solid #fde047',
  borderRadius: '12px',
};

const footer = {
  padding: '32px',
  backgroundColor: '#f8fafc',
  textAlign: 'center' as const,
};

const footerDivider = {
  borderColor: '#e2e8f0',
  margin: '0 0 24px 0',
};

const footerText = {
  fontSize: '13px',
  lineHeight: '22px',
  color: '#64748b',
  margin: '8px 0',
};

const footerLinks = {
  fontSize: '12px',
  color: '#94a3b8',
  margin: '16px 0 0 0',
};

const footerLink = {
  color: '#002E59',
  textDecoration: 'none',
};

export default EmployeeIdEmail;
