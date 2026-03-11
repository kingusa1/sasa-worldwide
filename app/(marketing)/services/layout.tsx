import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services',
  description: 'SASA Worldwide offers B2C, B2B, B2B2C, B2G sales services, and AI & Technology solutions across the UAE. Elite field teams, corporate sales, retail activations, government campaigns, AI automation, CRM builds, and website development.',
  openGraph: {
    title: 'Sales & Technology Services | SASA Worldwide',
    description: 'B2C, B2B, B2B2C, B2G sales services, and AI & Technology solutions across all seven Emirates in the UAE.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
