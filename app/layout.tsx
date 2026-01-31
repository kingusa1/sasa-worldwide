import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import FloatingActions from "@/components/ui/FloatingActions";

const inter = Inter({
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5, // Allow zooming for accessibility
  userScalable: true,
};

export const metadata: Metadata = {
  title: "SASA Worldwide | The Performance Growth Engine",
  description: "UAE-based sales operations and Sales as a Service company delivering structured, scalable, and high-performance activation programs across all seven Emirates.",
  icons: {
    icon: [
      { url: '/images/logo/favicon-square.png', type: 'image/png' },
    ],
    apple: [
      { url: '/images/logo/favicon-square.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/images/logo/favicon-square.png',
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
        {children}
        <FloatingActions />
      </body>
    </html>
  );
}
