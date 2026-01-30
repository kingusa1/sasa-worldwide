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

---

## Security

### Security Policy

SASA Worldwide takes security seriously. This section outlines our security measures and responsible disclosure policies.

#### Vulnerability Disclosure

If you discover a security vulnerability, please report it responsibly:

| Contact | Details |
|---------|---------|
| **Email** | security@sasaworldwide.com |
| **PGP Key** | Available upon request |
| **Response Time** | Within 48 business hours |

**Important**: Do NOT publicly disclose vulnerabilities before they are patched. We appreciate responsible disclosure and will acknowledge researchers who report valid vulnerabilities.

#### Security Measures Implemented

| Category | Implementation |
|----------|----------------|
| **Transport Security** | TLS 1.3 encryption for all data in transit |
| **Authentication** | Secure session management with HTTP-only cookies |
| **Input Validation** | Server-side validation and sanitization on all inputs |
| **XSS Protection** | Content Security Policy (CSP) headers enforced |
| **CSRF Protection** | Anti-CSRF tokens on all state-changing operations |
| **SQL Injection** | Parameterized queries and ORM-based data access |
| **Rate Limiting** | API endpoint protection against brute force and abuse |
| **Security Headers** | Full suite of protective HTTP headers |
| **Dependency Scanning** | Automated vulnerability scanning of dependencies |

#### Security Headers Configuration

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
Content-Security-Policy: default-src 'self'; frame-ancestors 'none';
```

#### Data Protection & Encryption

| Data Type | Protection Method |
|-----------|-------------------|
| **Data at Rest** | AES-256 encryption |
| **Data in Transit** | TLS 1.3 |
| **Passwords** | bcrypt with cost factor 12+ |
| **API Keys** | Encrypted and rotated regularly |
| **Backups** | Encrypted and stored in geographically separate locations |

#### Access Control

- Role-based access control (RBAC) for all administrative functions
- Principle of least privilege enforced
- Multi-factor authentication (MFA) required for admin access
- Session timeout after 30 minutes of inactivity
- IP whitelisting for sensitive operations

#### Incident Response Plan

| Phase | Action |
|-------|--------|
| **1. Detection** | Automated monitoring and alerting systems |
| **2. Assessment** | Security team evaluates severity within 4 hours |
| **3. Containment** | Immediate isolation of affected systems |
| **4. Eradication** | Threat removal and vulnerability patching |
| **5. Recovery** | Service restoration with verified clean state |
| **6. Post-Incident** | Full documentation and preventive measures |

#### Compliance & Audits

- Annual third-party security assessments
- Penetration testing conducted quarterly
- SOC 2 Type II compliance (in progress)
- Regular security awareness training for all staff

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

### Proprietary Software License Agreement

**Copyright (c) 2024 SASA Worldwide. All Rights Reserved.**

#### 1. Grant of License

This software and associated documentation files (the "Software") are the exclusive property of SASA Worldwide, a company registered in the United Arab Emirates. No license, express or implied, is granted to any party to use, copy, modify, distribute, or create derivative works from this Software without prior written consent from SASA Worldwide.

#### 2. Restrictions

You are expressly prohibited from:

- (a) Copying, reproducing, or duplicating any part of this Software
- (b) Modifying, adapting, translating, or creating derivative works
- (c) Distributing, sublicensing, leasing, or lending this Software
- (d) Selling, reselling, or transferring this Software to third parties
- (e) Reverse engineering, decompiling, or disassembling this Software
- (f) Removing or altering any proprietary notices, labels, or marks
- (g) Using this Software for any unlawful purpose
- (h) Using this Software to compete directly or indirectly with SASA Worldwide
- (i) Accessing the Software to build a similar or competitive product

#### 3. Intellectual Property Rights

All intellectual property rights in the Software, including but not limited to patents, copyrights, trademarks, trade secrets, trade dress, and any other proprietary rights, are and shall remain the exclusive property of SASA Worldwide. This Agreement does not transfer any ownership rights.

#### 4. Confidentiality Obligations

The Software contains confidential and proprietary information of SASA Worldwide. You agree to:

- Maintain strict confidentiality of the Software
- Not disclose any part of the Software to third parties
- Implement reasonable security measures to protect the Software
- Notify SASA Worldwide immediately of any unauthorized access

#### 5. Permitted Use

Access to this Software is strictly limited to:

- (a) Authorized employees of SASA Worldwide
- (b) Authorized contractors with executed Non-Disclosure Agreements
- (c) Third parties with explicit written authorization from SASA Worldwide management

#### 6. Termination

This license is effective until terminated. SASA Worldwide may terminate this license immediately and without notice upon any breach of these terms. Upon termination:

- All rights granted to you cease immediately
- You must destroy all copies of the Software
- You must certify destruction in writing upon request

#### 7. Warranty Disclaimer

THE SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NONINFRINGEMENT. SASA WORLDWIDE DOES NOT WARRANT THAT THE SOFTWARE WILL MEET YOUR REQUIREMENTS OR THAT ITS OPERATION WILL BE UNINTERRUPTED OR ERROR-FREE.

#### 8. Limitation of Liability

IN NO EVENT SHALL SASA WORLDWIDE, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, REGARDLESS OF WHETHER SUCH DAMAGES WERE FORESEEABLE OR WHETHER SASA WORLDWIDE WAS ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.

#### 9. Indemnification

You agree to indemnify, defend, and hold harmless SASA Worldwide and its officers, directors, employees, agents, and successors from any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising from your breach of this Agreement or misuse of the Software.

#### 10. Governing Law & Jurisdiction

This Agreement shall be governed by and construed in accordance with the laws of the United Arab Emirates. Any disputes arising under this Agreement shall be subject to the exclusive jurisdiction of the courts of Dubai, UAE.

#### 11. Severability

If any provision of this Agreement is found to be unenforceable or invalid, such provision shall be modified to the minimum extent necessary to make it enforceable, and the remaining provisions shall continue in full force and effect.

#### 12. Entire Agreement

This Agreement constitutes the entire agreement between the parties concerning the Software and supersedes all prior or contemporaneous agreements, representations, warranties, and understandings.

**For licensing inquiries**: legal@sasaworldwide.com

---

## Legal Notices

### Trademarks

"SASA Worldwide", "The Performance Growth Engine", "SASA OS", "SASA Academy", and the SASA logo are registered trademarks of SASA Worldwide in the United Arab Emirates and other jurisdictions. All other trademarks, service marks, and trade names referenced herein are the property of their respective owners.

**Unauthorized use of SASA Worldwide trademarks is strictly prohibited and may constitute a violation of UAE Federal Law and international trademark law.**

### Copyright Notice

**Copyright (c) 2024 SASA Worldwide. All rights reserved.**

All content, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, data compilations, and software, is the exclusive property of SASA Worldwide or its content suppliers and is protected by United Arab Emirates and international copyright laws.

The compilation of all content on this website is the exclusive property of SASA Worldwide and is protected by UAE and international copyright laws.

### Disclaimer of Warranties

THE INFORMATION PROVIDED ON THIS WEBSITE IS PROVIDED "AS IS" WITHOUT ANY REPRESENTATIONS OR WARRANTIES, EXPRESS OR IMPLIED. SASA WORLDWIDE MAKES NO REPRESENTATIONS OR WARRANTIES IN RELATION TO THE INFORMATION ON THIS WEBSITE OR THE COMPLETENESS, ACCURACY, RELIABILITY, SUITABILITY, OR AVAILABILITY OF SUCH INFORMATION.

### Limitation of Liability

SASA WORLDWIDE WILL NOT BE LIABLE TO YOU (WHETHER UNDER THE LAW OF CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY, OR OTHERWISE) IN RELATION TO THE CONTENTS OF, OR USE OF, OR OTHERWISE IN CONNECTION WITH, THIS WEBSITE FOR:

- Any indirect, special, incidental, or consequential loss or damage
- Any business losses, including loss of revenue, income, profits, anticipated savings, contracts, business relationships, reputation, or goodwill
- Any loss or corruption of data
- Any loss arising from events beyond our reasonable control

These limitations apply even if SASA Worldwide has been expressly advised of the potential loss.

### Indemnification

You agree to indemnify, defend, and hold harmless SASA Worldwide, its subsidiaries, affiliates, officers, directors, employees, agents, licensors, and suppliers from and against all claims, losses, expenses, damages, and costs, including reasonable attorneys' fees, arising from:

- Your use of this website
- Your violation of this Agreement
- Your violation of any rights of a third party
- Any content you submit or transmit through this website

### Privacy & Data Protection

SASA Worldwide is committed to protecting your privacy and complying with applicable data protection laws:

| Regulation | Compliance Status |
|------------|-------------------|
| **UAE PDPL** | Fully Compliant |
| **GDPR** | Compliant for EU visitors |
| **CCPA** | Compliant for California residents |
| **DIFC Data Protection Law** | Fully Compliant |

**Data Subject Rights**:
- Right to access your personal data
- Right to rectification of inaccurate data
- Right to erasure ("right to be forgotten")
- Right to restrict processing
- Right to data portability
- Right to object to processing

For privacy inquiries or to exercise your rights: **privacy@sasaworldwide.com**

### Cookie Policy

This website uses cookies for essential functionality. By using this website, you consent to our use of cookies in accordance with our Cookie Policy.

### Third-Party Links & Services

This website may contain links to third-party websites or services. SASA Worldwide:

- Has no control over third-party content or practices
- Does not endorse or assume responsibility for third-party content
- Is not liable for any damages arising from third-party websites
- Recommends reviewing third-party privacy policies before use

### Export Compliance

The Software may be subject to UAE export control laws and regulations. You agree not to export, re-export, or transfer the Software in violation of any applicable laws.

### Force Majeure

SASA Worldwide shall not be liable for any failure or delay resulting from circumstances beyond its reasonable control, including but not limited to acts of God, natural disasters, war, terrorism, riots, embargoes, acts of civil or military authorities, fire, floods, accidents, strikes, or shortages of transportation, facilities, fuel, energy, labor, or materials.

### Amendments

SASA Worldwide reserves the right to modify these terms at any time. Material changes will be posted on this website. Your continued use following any changes constitutes acceptance of the modified terms.

### Contact for Legal Matters

| Department | Email |
|------------|-------|
| **General Legal** | legal@sasaworldwide.com |
| **Privacy** | privacy@sasaworldwide.com |
| **DMCA/Copyright** | legal@sasaworldwide.com |
| **Trademark** | legal@sasaworldwide.com |

---

## Contact

| Channel | Details |
|---------|---------|
| **Website** | [sasaworldwide.com](https://sasaworldwide.com) |
| **General Inquiries** | info@sasaworldwide.com |
| **Legal Department** | legal@sasaworldwide.com |
| **Privacy Officer** | privacy@sasaworldwide.com |
| **Security Team** | security@sasaworldwide.com |
| **Phone** | +971 4 584 3777 |
| **WhatsApp** | +971 4 584 3777 |
| **Headquarters** | Dubai, United Arab Emirates |

---

<div align="center">
  <br/>
  <strong>SASA Worldwide</strong>
  <br/>
  The Performance Growth Engine
  <br/><br/>
  <sub>Copyright &copy; 2024 SASA Worldwide. All Rights Reserved.</sub>
  <br/>
  <sub>Unauthorized reproduction, distribution, or use is strictly prohibited and may result in civil and criminal penalties.</sub>
</div>
