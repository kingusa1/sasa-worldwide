import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Join SASA Worldwide — UAE\'s leading sales operations company. Explore career opportunities in sales, management, training, and business development across all seven Emirates.',
  openGraph: {
    title: 'Careers at SASA Worldwide',
    description: 'Career opportunities in sales, management, and business development across the UAE.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
