# SASA Worldwide

<div align="center">
  <img src="/public/images/logo/cropped-sasa-logo.png" alt="SASA Worldwide Logo" width="200"/>

  **The Performance Growth Engine**

  UAE's Leading Sales Operations & Sales as a Service Company

  [![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-Proprietary-red)](#license)
</div>

---

## Overview

SASA Worldwide is the official corporate website for UAE's premier sales operations company. We deliver structured, scalable, and high-performance activation programs across all seven Emirates, helping businesses achieve measurable growth through elite field teams, AI-powered systems, and proven methodologies.

### Key Features

- **Responsive Design** - Optimized for all devices from mobile to desktop
- **Modern UI/UX** - Clean, professional interface with smooth animations
- **Performance Optimized** - Built with Next.js 14 App Router for optimal loading
- **SEO Ready** - Structured for search engine visibility
- **Accessibility** - WCAG compliant design patterns

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js 14](https://nextjs.org/) | React framework with App Router |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework |
| [React 18](https://react.dev/) | UI component library |

---

## Project Structure

```
sasa-worldwide/
├── app/                          # Next.js App Router
│   ├── (marketing)/              # Marketing pages route group
│   │   ├── about/                # About pages
│   │   │   ├── leadership/       # Leadership team
│   │   │   └── page.tsx          # About overview
│   │   ├── services/             # Services pages
│   │   ├── careers/              # Career progression
│   │   ├── recruitment/          # Job listings
│   │   ├── contact/              # Contact page
│   │   └── layout.tsx            # Marketing layout
│   ├── api/                      # API routes
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
├── components/                   # React components
│   ├── layout/                   # Header, Footer, Navigation
│   ├── sections/                 # Page sections
│   └── ui/                       # Reusable UI components
├── hooks/                        # Custom React hooks
├── types/                        # TypeScript type definitions
├── public/                       # Static assets
│   └── images/                   # Image assets
├── tailwind.config.js            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies
```

---

## Getting Started

### Prerequisites

- **Node.js** 18.17 or later
- **npm**, **yarn**, **pnpm**, or **bun**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kingusa1/sasa-worldwide.git
   cd sasa-worldwide
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

---

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# Contact Form (if using external service)
NEXT_PUBLIC_CONTACT_EMAIL=info@sasaworldwide.com

# Analytics (optional)
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

---

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kingusa1/sasa-worldwide)

### Other Platforms

This Next.js application can be deployed on any platform that supports Node.js:

- **AWS Amplify**
- **Netlify**
- **DigitalOcean App Platform**
- **Railway**
- **Docker**

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Brand Guidelines

### Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Navy | `#002E59` | Primary brand color |
| Cream | `#f8f6f3` | Background accent |
| White | `#FFFFFF` | Primary background |
| Green | `#25D366` | WhatsApp/Success |

### Typography

- **Primary Font**: Inter
- **Fallback**: system-ui, -apple-system, sans-serif

---

## License

### Proprietary License

Copyright (c) 2024 SASA Worldwide. All Rights Reserved.

This software and associated documentation files (the "Software") are the exclusive property of SASA Worldwide. Unauthorized copying, modification, distribution, or use of this Software, via any medium, is strictly prohibited without express written permission from SASA Worldwide.

**You may NOT:**
- Copy, modify, or distribute this Software
- Use this Software for commercial purposes without authorization
- Sublicense, sell, or transfer rights to this Software
- Reverse engineer or decompile any part of this Software
- Remove or alter any proprietary notices or labels

**Permitted Use:**
- Authorized employees and contractors of SASA Worldwide
- Third parties with explicit written consent from SASA Worldwide

For licensing inquiries, contact: legal@sasaworldwide.com

---

## Legal Notices

### Trademarks

"SASA Worldwide", "The Performance Growth Engine", "SASA OS", and the SASA logo are trademarks of SASA Worldwide. All other trademarks, service marks, and trade names referenced in this website are the property of their respective owners.

### Disclaimer

The information provided on this website is for general informational purposes only. While we strive to keep the information up to date and accurate, SASA Worldwide makes no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information, products, services, or related graphics contained on this website.

### Privacy

SASA Worldwide is committed to protecting your privacy. Any personal information collected through this website is handled in accordance with our Privacy Policy and applicable UAE data protection laws.

### Third-Party Content

This website may contain links to third-party websites or services. SASA Worldwide has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party websites or services.

### Limitation of Liability

In no event shall SASA Worldwide, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of this website.

---

## Contact

<table>
  <tr>
    <td><strong>Website</strong></td>
    <td><a href="https://sasaworldwide.com">sasaworldwide.com</a></td>
  </tr>
  <tr>
    <td><strong>Email</strong></td>
    <td><a href="mailto:info@sasaworldwide.com">info@sasaworldwide.com</a></td>
  </tr>
  <tr>
    <td><strong>Phone</strong></td>
    <td><a href="tel:+97145843777">+971 4 584 3777</a></td>
  </tr>
  <tr>
    <td><strong>WhatsApp</strong></td>
    <td><a href="https://wa.me/97145843777">+971 4 584 3777</a></td>
  </tr>
  <tr>
    <td><strong>Location</strong></td>
    <td>Dubai, United Arab Emirates</td>
  </tr>
</table>

---

## Contributing

This is a private repository. Contributions are limited to authorized team members only.

For internal contributors:
1. Create a feature branch from `main`
2. Make your changes
3. Submit a pull request for review
4. Ensure all checks pass before merging

---

<div align="center">
  <br/>
  <p><strong>SASA Worldwide</strong> - Driving Sales Excellence Across the UAE</p>
  <p>Copyright &copy; 2024 SASA Worldwide. All Rights Reserved.</p>
</div>
