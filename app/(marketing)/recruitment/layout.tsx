import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Recruitment',
  description: 'SASA Worldwide recruitment. Apply to join the largest field sales force in the UAE. Sales agent, team leader, and management positions available.',
  openGraph: {
    title: 'Recruitment | SASA Worldwide',
    description: 'Join the largest field sales force in the UAE. Apply now for sales positions.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
