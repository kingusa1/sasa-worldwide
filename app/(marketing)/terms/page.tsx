'use client';

export default function TermsPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-12 bg-navy text-white">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-white/80">Last updated: January 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-navy max-w-none">
          <h2 className="text-2xl font-bold text-navy mb-4">Agreement to Terms</h2>
          <p className="text-gray-600 mb-6">
            By accessing or using the SASA Worldwide website and services, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our services.
          </p>

          <h2 className="text-2xl font-bold text-navy mb-4 mt-8">Services Description</h2>
          <p className="text-gray-600 mb-6">
            SASA Worldwide provides sales operations, field force management, and activation services. Our services include B2C, B2B, B2B2C, and B2G solutions as described on our website. Service availability and scope may vary based on location and client requirements.
          </p>

          <h2 className="text-2xl font-bold text-navy mb-4 mt-8">Use of Website</h2>
          <p className="text-gray-600 mb-4">You agree to use our website only for lawful purposes. You must not:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li>Use the website in any way that violates applicable laws or regulations</li>
            <li>Attempt to gain unauthorized access to any part of the website</li>
            <li>Transmit any viruses, malware, or harmful code</li>
            <li>Collect or harvest any information from the website without permission</li>
            <li>Impersonate any person or entity</li>
          </ul>

          <h2 className="text-2xl font-bold text-navy mb-4 mt-8">Intellectual Property</h2>
          <p className="text-gray-600 mb-6">
            All content on this website, including text, graphics, logos, images, and software, is the property of SASA Worldwide or its content suppliers and is protected by intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our express written consent.
          </p>

          <h2 className="text-2xl font-bold text-navy mb-4 mt-8">Client Engagements</h2>
          <p className="text-gray-600 mb-6">
            Formal service engagements are governed by separate service agreements between SASA Worldwide and clients. These Terms of Service do not constitute a service agreement and do not create any obligation for SASA to provide services.
          </p>

          <h2 className="text-2xl font-bold text-navy mb-4 mt-8">Limitation of Liability</h2>
          <p className="text-gray-600 mb-6">
            To the fullest extent permitted by law, SASA Worldwide shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use our website or services. Our total liability shall not exceed the amount you paid for services in the twelve months preceding the claim.
          </p>

          <h2 className="text-2xl font-bold text-navy mb-4 mt-8">Indemnification</h2>
          <p className="text-gray-600 mb-6">
            You agree to indemnify and hold SASA Worldwide harmless from any claims, damages, losses, or expenses arising from your violation of these terms or your use of our website.
          </p>

          <h2 className="text-2xl font-bold text-navy mb-4 mt-8">Governing Law</h2>
          <p className="text-gray-600 mb-6">
            These terms shall be governed by and construed in accordance with the laws of the United Arab Emirates. Any disputes shall be subject to the exclusive jurisdiction of the courts of Dubai, UAE.
          </p>

          <h2 className="text-2xl font-bold text-navy mb-4 mt-8">Changes to Terms</h2>
          <p className="text-gray-600 mb-6">
            We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to our website. Your continued use of our services after changes constitutes acceptance of the modified terms.
          </p>

          <h2 className="text-2xl font-bold text-navy mb-4 mt-8">Contact Information</h2>
          <p className="text-gray-600 mb-6">
            For questions about these Terms of Service, please contact us at:
          </p>
          <div className="bg-cream rounded-xl p-6">
            <p className="text-gray-700">
              <strong>SASA Worldwide Management Consultancies CO LLC</strong><br />
              Prime Business Center - Tower A, Office NO. A1201<br />
              Jumeirah Village Circle, Dubai, UAE<br />
              Email: info@sasa-worldwide.com<br />
              Phone: +971 458 437 77
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
