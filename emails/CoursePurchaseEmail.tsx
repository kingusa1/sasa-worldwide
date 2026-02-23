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

interface CoursePurchaseEmailProps {
  name: string;
  email: string;
  password: string;
  loginUrl: string;
  courseName: string;
}

export function CoursePurchaseEmail({ name, email, password, loginUrl, courseName }: CoursePurchaseEmailProps) {
  const logoUrl = `${process.env.NEXT_PUBLIC_APP_URL}/images/logo/sasa-logo-color.png`;

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img
              src={logoUrl}
              alt="SASA Worldwide"
              width="180"
              height="60"
              style={logo}
            />
          </Section>

          <Section style={content}>
            <Section style={iconContainer}>
              <div style={iconCircle}>
                <Text style={icon}>🎓</Text>
              </div>
            </Section>

            <Text style={heading}>Welcome to SASA Training!</Text>
            <Text style={subtitle}>Hi {name},</Text>

            <Text style={paragraph}>
              Thank you for purchasing the <strong>{courseName}</strong>. Your account has been created
              and the course has been automatically assigned to your dashboard.
            </Text>

            <Section style={credentialsBox}>
              <Text style={credentialsTitle}>Your Login Credentials</Text>
              <Text style={credentialItem}>
                <strong>Email:</strong> {email}
              </Text>
              <Text style={credentialItem}>
                <strong>Password:</strong> {password}
              </Text>
            </Section>

            <Section style={buttonContainer}>
              <Button style={button} href={loginUrl}>
                Login & Start Learning
              </Button>
            </Section>

            <Text style={paragraph}>
              Once logged in, click <strong>Training</strong> in your navigation to access your course.
              You can start learning right away!
            </Text>

            <Hr style={divider} />

            <Section style={warningBox}>
              <Text style={warningText}>
                <strong>Important:</strong> Please save your credentials and change your password after your first login for security.
              </Text>
            </Section>
          </Section>

          <Section style={footer}>
            <Hr style={footerDivider} />
            <Text style={footerText}>
              <strong>SASA Worldwide</strong>
              <br />
              Dubai, United Arab Emirates
            </Text>
            <Text style={footerText}>
              &copy; {new Date().getFullYear()} SASA Worldwide. All rights reserved.
            </Text>
            <Text style={footerLinks}>
              <a href={`${process.env.NEXT_PUBLIC_APP_URL}`} style={footerLink}>Website</a>
              {' | '}
              <a href={`${process.env.NEXT_PUBLIC_APP_URL}/contact`} style={footerLink}>Contact Us</a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

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

const subtitle = {
  fontSize: '20px',
  color: '#64748b',
  margin: '0 0 32px 0',
  textAlign: 'center' as const,
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '28px',
  color: '#475569',
  margin: '16px 0',
};

const credentialsBox = {
  backgroundColor: '#f0fdf4',
  border: '2px solid #22c55e',
  borderRadius: '12px',
  padding: '24px',
  margin: '32px 0',
};

const credentialsTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#166534',
  margin: '0 0 16px 0',
};

const credentialItem = {
  fontSize: '16px',
  lineHeight: '28px',
  color: '#15803d',
  margin: '4px 0',
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

const warningBox = {
  backgroundColor: '#fef3c7',
  border: '1px solid #fde047',
  borderRadius: '12px',
  padding: '20px',
  margin: '24px 0',
};

const warningText = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#92400e',
  margin: '0',
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

export default CoursePurchaseEmail;
