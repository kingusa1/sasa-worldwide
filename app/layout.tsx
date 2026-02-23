import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import FloatingActions from "@/components/ui/FloatingActions";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";

const inter = Inter({
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5, // Allow zooming for accessibility
  userScalable: true,
};

const siteUrl = 'https://www.sasa-worldwide.com';
const siteName = 'SASA Worldwide';
const siteDescription = 'UAE-based sales operations and Sales as a Service company delivering structured, scalable, and high-performance activation programs across all seven Emirates.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'SASA Worldwide | The Performance Growth Engine',
    template: '%s | SASA Worldwide',
  },
  description: siteDescription,
  keywords: [
    'SASA Worldwide',
    'sales operations UAE',
    'Sales as a Service',
    'field sales UAE',
    'B2B sales Dubai',
    'B2C sales Dubai',
    'sales outsourcing UAE',
    'sales activation programs',
    'performance growth engine',
    'sales team Dubai',
    'sales operations company',
    'UAE sales agency',
    'Dubai sales company',
    'sales campaigns UAE',
    'retail activation UAE',
  ],
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  icons: {
    icon: [
      { url: '/images/logo/favicon-square.png', type: 'image/png' },
    ],
    apple: [
      { url: '/images/logo/favicon-square.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/images/logo/favicon-square.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName,
    title: 'SASA Worldwide | The Performance Growth Engine',
    description: siteDescription,
    images: [
      {
        url: '/images/logo/sasa-logo-color.png',
        width: 1200,
        height: 630,
        alt: 'SASA Worldwide - The Performance Growth Engine',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SASA Worldwide | The Performance Growth Engine',
    description: siteDescription,
    images: ['/images/logo/sasa-logo-color.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    // Add your Google Search Console verification code here after setup
    // google: 'your-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <SessionProvider>
          {children}
          <FloatingActions />
        </SessionProvider>
      </body>
    </html>
  );
}
