'use client';

export default function PrivacyPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-12 bg-navy text-white">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-white/80">Last updated: January 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-navy max-w-none">
          <h2 className="text-2xl font-bold text-navy mb-4">Introduction</h2>
          <p className="text-gray-600 mb-6">
            SASA Worldwide Management Consultancies CO LLC (&quot;SASA,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
          </p>

          <h2 className="text-2xl font-bold text-navy mb-4 mt-8">Information We Collect</h2>
          <p className="text-gray-600 mb-4">We may collect the following types of information:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li><strong>Personal Information:</strong> Name, email address, phone number, company name, and job title when you contact us or submit forms.</li>
            <li><strong>Usage Data:</strong> Information about how you interact with our website, including IP address, browser type, pages visited, and time spent on pages.</li>
            <li><strong>Cookies:</strong> Small data files stored on your device to enhance your browsing experience.</li>
          </ul>

          <h2 className="text-2xl font-bold text-navy mb-4 mt-8">How We Use Your Information</h2>
          <p className="text-gray-600 mb-4">We use collected information to:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li>Respond to your inquiries and provide customer support</li>
            <li>Send you information about our services and updates</li>
            <li>Improve our website and services</li>
            <li>Comply with legal obligations</li>
            <li>Protect against fraudulent or unauthorized activity</li>
          </ul>

          <h2 className="text-2xl font-bold text-navy mb-4 mt-8">Data Sharing</h2>
          <p className="text-gray-600 mb-6">
            We do not sell your personal information. We may share your data with trusted service providers who assist us in operating our website and conducting our business, subject to confidentiality agreements. We may also disclose information when required by law.
          </p>

          <h2 className="text-2xl font-bold text-navy mb-4 mt-8">Data Security</h2>
          <p className="text-gray-600 mb-6">
            We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
          </p>

          <h2 className="text-2xl font-bold text-navy mb-4 mt-8">Your Rights</h2>
          <p className="text-gray-600 mb-4">You have the right to:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li>Access and receive a copy of your personal data</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to processing of your data</li>
            <li>Withdraw consent at any time</li>
          </ul>

          <h2 className="text-2xl font-bold text-navy mb-4 mt-8">Contact Us</h2>
          <p className="text-gray-600 mb-6">
            If you have questions about this privacy policy or our data practices, please contact us at:
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
