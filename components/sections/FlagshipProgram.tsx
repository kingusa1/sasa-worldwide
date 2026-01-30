'use client';

import Link from 'next/link';

export default function FlagshipProgram() {
  return (
    <section className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="section-badge mb-4">Flagship Program</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
              SASA × CAFU Fuel Subscription
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              A national activation success story—managing fuel subscription enrollment
              across all seven Emirates through multiple engagement channels.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                { icon: '👥', text: 'Field teams deployed nationwide' },
                { icon: '🏪', text: 'Kiosk activations in malls and retail centers' },
                { icon: '🏠', text: 'Residential and community outreach' },
                { icon: '🏢', text: 'Corporate and fleet engagement' },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700">
                  <span className="text-xl">{item.icon}</span>
                  {item.text}
                </li>
              ))}
            </ul>
            <Link
              href="/partnerships"
              className="btn-primary inline-flex"
            >
              Learn More in Partnerships
            </Link>
          </div>
          <div className="bg-white rounded-3xl p-10 shadow-card">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-navy flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-navy mb-4">Campaign Highlights</h3>
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="text-center p-4 bg-cream rounded-xl">
                  <div className="text-3xl font-bold text-navy">7</div>
                  <div className="text-gray-500 text-sm">Emirates</div>
                </div>
                <div className="text-center p-4 bg-cream rounded-xl">
                  <div className="text-3xl font-bold text-navy">50K+</div>
                  <div className="text-gray-500 text-sm">Enrollments</div>
                </div>
                <div className="text-center p-4 bg-cream rounded-xl">
                  <div className="text-3xl font-bold text-navy">200+</div>
                  <div className="text-gray-500 text-sm">Locations</div>
                </div>
                <div className="text-center p-4 bg-cream rounded-xl">
                  <div className="text-3xl font-bold text-navy">100%</div>
                  <div className="text-gray-500 text-sm">Tracked</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
