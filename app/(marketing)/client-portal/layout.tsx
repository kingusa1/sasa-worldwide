import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Client Portal',
  description: 'SASA Worldwide client portal. Access your campaign dashboards, reports, and performance analytics.',
  openGraph: {
    title: 'Client Portal | SASA Worldwide',
    description: 'Access your campaign dashboards, reports, and performance analytics.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
