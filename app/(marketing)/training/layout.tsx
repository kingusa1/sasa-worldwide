import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Training Courses',
  description: 'SASA Worldwide training platform. Professional sales training courses, AI education, and business development programs for sales teams across the UAE.',
  openGraph: {
    title: 'Training Courses | SASA Worldwide',
    description: 'Professional sales training, AI education, and business development programs.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
