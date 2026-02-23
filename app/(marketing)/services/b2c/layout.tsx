import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'B2C Sales Services',
  description: 'Consumer direct sales in the UAE. Door-to-door campaigns, kiosk engagements, community canvassing, and residential sales programs by SASA Worldwide.',
  openGraph: {
    title: 'B2C Consumer Sales | SASA Worldwide',
    description: 'Door-to-door, kiosk, and community sales campaigns across all seven Emirates.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
