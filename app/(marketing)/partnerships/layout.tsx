import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Partnerships',
  description: 'Partner with SASA Worldwide for sales operations in the UAE. Strategic partnerships for brands, agencies, and enterprises seeking growth across all seven Emirates.',
  openGraph: {
    title: 'Partnerships | SASA Worldwide',
    description: 'Strategic sales partnerships for brands and enterprises across the UAE.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
