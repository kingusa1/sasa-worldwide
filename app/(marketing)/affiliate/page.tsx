'use client';

import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';

const steps = [
  {
    step: '01',
    title: 'Sign Up',
    description: 'Create your affiliate account in minutes. No upfront costs or commitments required.',
  },
  {
    step: '02',
    title: 'Get Your Link',
    description: 'Receive your unique referral link and access marketing materials from your dashboard.',
  },
  {
    step: '03',
    title: 'Promote',
    description: 'Share with your network through your website, social media, email, or direct outreach.',
  },
  {
    step: '04',
    title: 'Earn',
    description: 'Earn 20% recurring commissions on every successful referral. No cap on earnings.',
  },
];

const commissionBenefits = [
  '20% commission on all monthly subscriptions',
  '20% commission on all annual plans',
  'Lifetime commissions as long as the client stays active',
  'No cap on total earnings',
];

const commissionHighlights = [
  { value: '20%', label: 'Recurring Commission' },
  { value: 'Lifetime', label: 'Commission Duration' },
  { value: 'Monthly', label: 'Payout Cycle' },
  { value: '$50', label: 'Minimum Payout' },
];

const dashboardFeatures = [
  {
    title: 'Click Tracking',
    description: 'Monitor every click on your referral links with real-time analytics.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
      </svg>
    ),
  },
  {
    title: 'Conversion Analytics',
    description: 'See which referrals convert to paying customers and optimize your strategy.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: 'Referral Management',
    description: 'Track all your active referrals, their status, and subscription details.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Earnings Dashboard',
    description: 'View your monthly and lifetime earnings with detailed breakdowns.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Payout History',
    description: 'Access complete records of all your past and pending payouts.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    title: 'Marketing Assets',
    description: 'Download banners, email templates, and branded materials to promote effectively.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const payoutMethods = [
  {
    name: 'PayPal',
    description: 'Instant transfers directly to your PayPal account worldwide.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    name: 'Wise',
    description: 'Low-fee international transfers via Wise to 80+ countries.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    name: 'Bank Transfer',
    description: 'Direct deposit to your bank account via wire transfer.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
];

const rules = [
  'No spam or unsolicited messaging to potential referrals',
  'Follow SASA brand guidelines when promoting our services',
  'Disclose your affiliate relationship transparently',
  'No misleading claims about SASA services or earnings',
  'No self-referrals or fraudulent activity of any kind',
  'Comply with all local advertising and marketing regulations',
];

export default function AffiliateProgramPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-navy text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <span className="section-badge bg-white/10 border-white/20 text-white mb-6">Affiliate Program</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Earn by Referring. Grow With Us.
            </h1>
            <p className="text-xl text-white/80 leading-relaxed mb-10">
              Join our affiliate program and earn recurring commissions by referring clients
              to SASA Worldwide. Whether you are a creator, agency, consultant, or business
              owner, your network can turn into predictable income.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup/affiliate"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-navy font-semibold rounded-full hover:bg-gray-100 transition-colors"
              >
                Join the Affiliate Program
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-colors border border-white/20"
              >
                Login to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <ScrollReveal>
              <span className="section-badge mb-4">How It Works</span>
              <h2 className="text-3xl md:text-4xl font-bold text-navy">
                Start Earning in 4 Simple Steps
              </h2>
            </ScrollReveal>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((item, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-navy flex items-center justify-center">
                    <span className="text-xl font-bold text-white">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Structure */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <div>
                <span className="section-badge mb-4">Commission Structure</span>
                <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
                  Earn 20% Recurring Commissions
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Our commission structure is designed to reward you generously for every
                  client you bring to SASA Worldwide. Earn recurring commissions for as
                  long as your referrals remain active customers.
                </p>
                <ul className="space-y-4 mb-8">
                  {commissionBenefits.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700">
                      <span className="w-6 h-6 rounded-full bg-navy/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="bg-cream rounded-3xl p-10">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-navy">Commission Overview</h3>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  {commissionHighlights.map((item, index) => (
                    <div key={index} className="text-center p-4 bg-white rounded-2xl">
                      <div className="text-3xl font-bold text-navy mb-1">{item.value}</div>
                      <div className="text-gray-500 text-sm uppercase tracking-wider">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Dashboard Features */}
      <section className="py-24 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <ScrollReveal>
              <span className="section-badge bg-white/10 border-white/20 text-white mb-4">Your Dashboard</span>
              <h2 className="text-3xl md:text-4xl font-bold">
                Everything You Need to Succeed
              </h2>
              <p className="text-white/70 mt-4 max-w-2xl mx-auto">
                Your affiliate dashboard gives you full visibility into your performance,
                earnings, and marketing assets.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardFeatures.map((feature, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all h-full">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-white/70 leading-relaxed">{feature.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Payout Methods */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <ScrollReveal>
              <span className="section-badge mb-4">Payouts</span>
              <h2 className="text-3xl md:text-4xl font-bold text-navy">
                Flexible Payment Methods
              </h2>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                Choose how you want to receive your earnings with our flexible payout options.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {payoutMethods.map((method, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <div className="bg-white rounded-2xl p-8 text-center hover:shadow-lg transition-shadow h-full">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-navy/10 flex items-center justify-center text-navy">
                    {method.icon}
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-3">{method.name}</h3>
                  <p className="text-gray-600">{method.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={300}>
            <div className="bg-white rounded-2xl p-8 border border-navy/10">
              <h3 className="text-lg font-bold text-navy mb-4">Payout Rules</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { label: 'Minimum payout', value: '$50 USD' },
                  { label: 'Payout cycle', value: 'Monthly (1st of each month)' },
                  { label: 'Processing time', value: '5-7 business days' },
                  { label: 'Currency', value: 'USD' },
                ].map((rule, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-navy flex-shrink-0"></span>
                    <span className="text-gray-700">
                      <span className="font-semibold">{rule.label}:</span> {rule.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Rules & Compliance */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <ScrollReveal>
                <span className="section-badge mb-4">Guidelines</span>
                <h2 className="text-3xl md:text-4xl font-bold text-navy">
                  Rules &amp; Compliance
                </h2>
                <p className="text-gray-600 mt-4">
                  To maintain the integrity of our program, all affiliates must adhere to these guidelines.
                </p>
              </ScrollReveal>
            </div>

            <div className="space-y-4">
              {rules.map((rule, index) => (
                <ScrollReveal key={index} delay={index * 80}>
                  <div className="flex items-start gap-4 bg-cream rounded-xl p-5">
                    <span className="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <p className="text-gray-700">{rule}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={500}>
              <p className="text-sm text-gray-500 mt-8 text-center">
                SASA Worldwide reserves the right to suspend or terminate affiliate accounts
                that violate these guidelines. For full terms, please contact our team.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="join" className="py-24 bg-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Earning?
            </h2>
            <p className="text-xl text-white/80 mb-10">
              Join our affiliate program today and start earning recurring commissions
              by referring businesses to SASA Worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup/affiliate"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-navy font-semibold rounded-full hover:bg-gray-100 transition-colors"
              >
                Join the Affiliate Program
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-colors border border-white/20"
              >
                Login to Affiliate Dashboard
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
