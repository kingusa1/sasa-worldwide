import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services',
  description: 'SASA Worldwide offers B2C, B2B, B2B2C, and B2G sales services across the UAE. Elite field teams, corporate sales, retail activations, and government campaigns.',
  openGraph: {
    title: 'Sales Services | SASA Worldwide',
    description: 'B2C, B2B, B2B2C, and B2G sales services across all seven Emirates in the UAE.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
