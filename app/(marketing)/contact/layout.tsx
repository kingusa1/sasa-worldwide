import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact SASA Worldwide for sales operations, partnerships, and business inquiries. Based in Dubai, UAE — serving all seven Emirates.',
  openGraph: {
    title: 'Contact SASA Worldwide',
    description: 'Get in touch for sales operations, partnerships, and business inquiries in the UAE.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
