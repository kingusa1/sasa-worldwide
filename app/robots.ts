import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.sasa-worldwide.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/staff/',
          '/sales/',
          '/affiliate/',
          '/crm/',
          '/api/',
          '/login',
          '/signup/',
          '/forgot-password',
          '/reset-password',
          '/verify-email',
          '/form/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
