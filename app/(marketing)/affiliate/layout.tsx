import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Affiliate Program',
  description: 'Join the SASA Worldwide affiliate program. Earn commissions by referring clients for sales operations and training services across the UAE.',
  openGraph: {
    title: 'Affiliate Program | SASA Worldwide',
    description: 'Earn commissions by referring clients to SASA Worldwide\'s sales services.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
