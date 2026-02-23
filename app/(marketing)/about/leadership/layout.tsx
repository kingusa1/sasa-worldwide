import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Leadership Team',
  description: 'Meet the leadership team behind SASA Worldwide. Our experienced executives drive sales mastery, AI education, and business development across the UAE.',
  openGraph: {
    title: 'Leadership Team | SASA Worldwide',
    description: 'Meet the experienced executives leading SASA Worldwide\'s sales operations across the UAE.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
