/**
 * QR Code Generation Utility
 * Generates QR codes for salesperson form URLs
 */

import QRCode from 'qrcode';

export interface QRCodeData {
  qr_code_url: string; // Data URL for immediate display
  qr_code_data: string; // Base64 data URL (backup)
  form_url: string;
}

/**
 * Generate QR code for salesperson assignment
 * Creates a QR code with SASA navy branding
 * Returns data URL for immediate display/storage
 */
export async function generateQRCodeForAssignment(
  projectSlug: string,
  salespersonSlug: string,
  salespersonName: string
): Promise<QRCodeData> {
  try {
    // Validate environment variable
    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      throw new Error('NEXT_PUBLIC_BASE_URL environment variable is not set');
    }

    // 1. Generate URLs
    const fullUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/form/${projectSlug}/${salespersonSlug}`;
    const formUrlPath = `/form/${projectSlug}/${salespersonSlug}`;

    // 2. Generate QR code with absolute URL (phones need full URL)
    let qrDataURL: string;
    try {
      qrDataURL = await QRCode.toDataURL(fullUrl, {
        width: 1000,
        margin: 2,
        color: {
          dark: '#002E59', // Navy color (SASA brand)
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'M',
      });
    } catch (qrError: any) {
      throw new Error(`QR code generation failed: ${qrError.message}`);
    }

    return {
      qr_code_url: qrDataURL,
      qr_code_data: qrDataURL,
      form_url: formUrlPath,
    };

  } catch (error: any) {
    console.error('QR code generation error:', error);
    throw new Error(`Failed to generate QR code: ${error.message}`);
  }
}

/**
 * Generate QR code from any URL
 * Use this for custom QR code generation
 */
export async function generateQRCodeDataURL(url: string): Promise<string> {
  try {
    return await QRCode.toDataURL(url, {
      width: 1000,
      margin: 2,
      color: {
        dark: '#002E59',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    });
  } catch (error: any) {
    throw new Error(`Failed to generate QR code: ${error.message}`);
  }
}

/**
 * Generate QR code as buffer (for file download)
 * Returns PNG buffer
 */
export async function generateQRCodeBuffer(url: string): Promise<Buffer> {
  try {
    return await QRCode.toBuffer(url, {
      width: 1000,
      margin: 2,
      color: {
        dark: '#002E59',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
      type: 'png',
    });
  } catch (error: any) {
    throw new Error(`Failed to generate QR code buffer: ${error.message}`);
  }
}
