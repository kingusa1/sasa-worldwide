export function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SASA Worldwide',
    alternateName: 'SASA',
    url: 'https://www.sasa-worldwide.com',
    logo: 'https://www.sasa-worldwide.com/images/logo/sasa-logo-color.png',
    description:
      'UAE-based sales operations and Sales as a Service company delivering structured, scalable, and high-performance activation programs across all seven Emirates.',
    foundingDate: '2010',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dubai',
      addressCountry: 'AE',
    },
    areaServed: {
      '@type': 'Country',
      name: 'United Arab Emirates',
    },
    sameAs: [
      'https://www.linkedin.com/company/sasa-worldwide',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      url: 'https://www.sasa-worldwide.com/contact',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function WebSiteJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SASA Worldwide',
    url: 'https://www.sasa-worldwide.com',
    description:
      'UAE-based sales operations and Sales as a Service company delivering structured, scalable, and high-performance activation programs across all seven Emirates.',
    publisher: {
      '@type': 'Organization',
      name: 'SASA Worldwide',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.sasa-worldwide.com/images/logo/sasa-logo-color.png',
      },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function ArticleJsonLd({
  title,
  description,
  image,
  datePublished,
  author,
  url,
}: {
  title: string
  description: string
  image: string
  datePublished: string
  author: string
  url: string
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image,
    datePublished,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'SASA Worldwide',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.sasa-worldwide.com/images/logo/sasa-logo-color.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
