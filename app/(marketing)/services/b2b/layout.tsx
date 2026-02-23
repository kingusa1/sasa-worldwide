import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'B2B Sales Services',
  description: 'Corporate B2B sales solutions in the UAE. Employee benefit programs, corporate sales engagements, workplace activations, and strategic business development by SASA Worldwide.',
  openGraph: {
    title: 'B2B Sales Services | SASA Worldwide',
    description: 'Corporate sales engagements, workplace activations, and strategic B2B solutions across the UAE.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
