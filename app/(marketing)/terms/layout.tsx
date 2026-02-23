import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'SASA Worldwide terms of service. Terms and conditions for using our website and services.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
