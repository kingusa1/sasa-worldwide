import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Corporate Social Responsibility',
  description: 'SASA Worldwide\'s CSR initiatives. Community engagement, workforce development, and social impact programs across the UAE.',
  openGraph: {
    title: 'CSR | SASA Worldwide',
    description: 'Community engagement, workforce development, and social impact across the UAE.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
