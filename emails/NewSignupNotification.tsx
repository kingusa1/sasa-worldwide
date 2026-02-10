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

interface NewSignupNotificationProps {
  name: string;
  email: string;
  department: string;
  employeeId: string;
  phone?: string;
  requestedAt: string;
  reviewUrl: string;
}

export function NewSignupNotification({
  name,
  email,
  department,
  employeeId,
  phone,
  requestedAt,
  reviewUrl,
}: NewSignupNotificationProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logoText}>SASA Worldwide Admin</Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={badge}>🔔 New Signup Request</Text>

            <Text style={heading}>Staff Signup Requires Approval</Text>

            <Text style={paragraph}>
              A new staff member has submitted a signup request and is awaiting your review.
            </Text>

            {/* User Details Card */}
            <Section style={detailsCard}>
              <Text style={detailsHeading}>Applicant Information</Text>

              <Section style={detailRow}>
                <Text style={detailLabel}>Name:</Text>
                <Text style={detailValue}>{name}</Text>
              </Section>

              <Section style={detailRow}>
                <Text style={detailLabel}>Email:</Text>
                <Text style={detailValue}>{email}</Text>
              </Section>

              <Section style={detailRow}>
                <Text style={detailLabel}>Employee ID:</Text>
                <Text style={detailValue}>{employeeId}</Text>
              </Section>

              <Section style={detailRow}>
                <Text style={detailLabel}>Department:</Text>
                <Text style={detailValue}>{department}</Text>
              </Section>

              {phone && (
                <Section style={detailRow}>
                  <Text style={detailLabel}>Phone:</Text>
                  <Text style={detailValue}>{phone}</Text>
                </Section>
              )}

              <Section style={detailRow}>
                <Text style={detailLabel}>Requested:</Text>
                <Text style={detailValue}>{requestedAt}</Text>
              </Section>
            </Section>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={reviewUrl}>
                Review Application
              </Button>
            </Section>

            <Hr style={divider} />

            <Text style={footnote}>
              Please review this application promptly to maintain a smooth onboarding experience.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              This is an automated notification from SASA Worldwide Admin Portal
            </Text>
            <Text style={footerText}>
              © {new Date().getFullYear()} SASA Worldwide. All rights reserved.
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
  backgroundColor: '#7c3aed',
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

const badge = {
  display: 'inline-block',
  backgroundColor: '#fef3c7',
  color: '#92400e',
  padding: '6px 12px',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 16px 0',
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

const detailsCard = {
  backgroundColor: '#f8f6f3',
  padding: '24px',
  borderRadius: '8px',
  margin: '24px 0',
  border: '1px solid #e5e7eb',
};

const detailsHeading = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#002E59',
  margin: '0 0 16px 0',
};

const detailRow = {
  margin: '12px 0',
};

const detailLabel = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#6b7280',
  margin: '0 0 4px 0',
};

const detailValue = {
  fontSize: '16px',
  color: '#111827',
  margin: '0',
};

const buttonContainer = {
  padding: '24px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#7c3aed',
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
  textAlign: 'center' as const,
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

export default NewSignupNotification;
