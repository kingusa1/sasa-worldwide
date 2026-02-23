import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Mission & Values',
  description: 'Discover SASA Worldwide\'s mission: discipline, innovation, and impact. Our core values drive structured operations and consistent execution across the UAE.',
  openGraph: {
    title: 'Mission & Values | SASA Worldwide',
    description: 'Discipline, innovation, and impact — the core values driving SASA Worldwide\'s success.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
