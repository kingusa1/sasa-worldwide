import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'B2G Government Sales Services',
  description: 'Government sales and activation services in the UAE. National service campaigns, public awareness programs, and ministry activations by SASA Worldwide.',
  openGraph: {
    title: 'B2G Government Services | SASA Worldwide',
    description: 'National service campaigns and government activations across all seven Emirates.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
