import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about SASA Worldwide — UAE\'s leading sales operations company. Since 2010, we\'ve built the largest field force network across all seven Emirates with 600+ active clients.',
  openGraph: {
    title: 'About SASA Worldwide',
    description: 'UAE\'s leading sales operations company since 2010. 600+ active clients across all seven Emirates.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
