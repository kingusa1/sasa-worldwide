import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'B2B2C Sales Services',
  description: 'B2B2C hybrid sales solutions in the UAE. Showroom advisors, retail cross-sell, dealer activations, and channel partner programs by SASA Worldwide.',
  openGraph: {
    title: 'B2B2C Sales Services | SASA Worldwide',
    description: 'Hybrid sales solutions combining retail, dealer, and channel partner programs across the UAE.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
