import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Section,
  Hr,
} from '@react-email/components';

interface AccountRejectedEmailProps {
  name: string;
  reason?: string;
}

export function AccountRejectedEmail({ name, reason }: AccountRejectedEmailProps) {
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
            <Text style={heading}>Application Update</Text>

            <Text style={paragraph}>
              Dear {name},
            </Text>

            <Text style={paragraph}>
              Thank you for your interest in joining SASA Worldwide. After careful review of your application, we regret to inform you that we're unable to proceed with your account registration at this time.
            </Text>

            {reason && (
              <>
                <Text style={subheading}>Reason:</Text>
                <Text style={reasonText}>{reason}</Text>
              </>
            )}

            <Hr style={divider} />

            <Text style={paragraph}>
              <strong>Have Questions?</strong>
            </Text>
            <Text style={paragraph}>
              If you have any questions about this decision or would like to discuss your application further, please don't hesitate to contact our HR department.
            </Text>

            <Text style={paragraph}>
              <strong>Contact Information:</strong><br />
              Email: hr@sasa-worldwide.com<br />
              Phone: +971 4 584 3777<br />
              Hours: Sunday-Thursday, 9AM-6PM GST
            </Text>

            <Text style={footnote}>
              We appreciate your interest in SASA Worldwide and wish you the best in your future endeavors.
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

const reasonText = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#dc2626',
  backgroundColor: '#fef2f2',
  padding: '16px',
  borderRadius: '8px',
  margin: '12px 0',
  border: '1px solid #fecaca',
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

export default AccountRejectedEmail;
