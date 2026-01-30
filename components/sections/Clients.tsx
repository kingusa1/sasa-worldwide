'use client';

import Link from 'next/link';

const benefits = [
  'Serious, measurable sales growth',
  'Structured field operations with governance',
  'Data-backed decisions and transparent reporting',
  'A partner that operates to UAE enterprise standards',
];

export default function Clients() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div
            className="h-[500px] rounded-3xl bg-cover bg-center"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")',
            }}
          ></div>

          {/* Content */}
          <div className="bg-navy text-white rounded-3xl p-10 lg:p-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              UAE-Born, Globally Scalable
            </h2>

            <p className="text-white/80 mb-6 leading-relaxed">
              SASA Worldwide is proudly based in the UAE.
            </p>

            <p className="text-white/80 mb-8 leading-relaxed">
              We are built for brands and organisations that demand:
            </p>

            <ul className="space-y-4 mb-10">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-white/60 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-white/90">{benefit}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-navy font-semibold rounded-full hover:bg-gray-100 transition-colors"
            >
              Hire SASA
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
