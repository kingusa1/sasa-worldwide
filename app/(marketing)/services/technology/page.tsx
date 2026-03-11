'use client';

import Link from 'next/link';

const services = [
  {
    title: 'AI Automation',
    description: 'Intelligent workflow automation that eliminates repetitive tasks, reduces errors, and lets your team focus on what matters most.',
  },
  {
    title: 'CRM Build & Integration',
    description: 'Custom CRM solutions built to fit your business — from Salesforce and HubSpot setup to fully bespoke platforms.',
  },
  {
    title: 'Website Development',
    description: 'Professional, high-performance websites designed to convert visitors into customers with modern UX and SEO best practices.',
  },
  {
    title: 'Chatbot & AI Assistants',
    description: 'Smart AI-powered chatbots and virtual assistants that handle customer inquiries 24/7 and qualify leads automatically.',
  },
];

const solutions = [
  'Sales pipeline automation',
  'Customer onboarding workflows',
  'AI-powered lead scoring',
  'Custom dashboard & reporting',
  'E-commerce platforms',
  'Email marketing automation',
  'Document & invoice automation',
  'API integrations & middleware',
];

const process = [
  { step: '01', title: 'Consultation', desc: 'We assess your current systems, understand your goals, and identify the highest-impact opportunities for automation and technology.' },
  { step: '02', title: 'Design', desc: 'Our team creates a detailed blueprint of your solution — wireframes, workflows, integrations, and timelines — for your approval.' },
  { step: '03', title: 'Build', desc: 'We develop, test, and refine your solution using agile methodology with regular check-ins and progress demos.' },
  { step: '04', title: 'Launch & Support', desc: 'We deploy your solution, train your team, and provide ongoing support to ensure everything runs smoothly.' },
];

export default function TechnologyServicesPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-navy text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <span className="section-badge bg-white/10 border-white/20 text-white mb-6">AI & Technology</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              AI Automation & Technology Solutions
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              From AI-powered automation and custom CRM platforms to professional websites
              and intelligent chatbots — we build the technology that drives your business forward.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-navy">100+</div>
              <div className="text-gray-500 text-sm uppercase tracking-wider">Projects Delivered</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-navy">50+</div>
              <div className="text-gray-500 text-sm uppercase tracking-wider">AI Automations Built</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-navy">40%</div>
              <div className="text-gray-500 text-sm uppercase tracking-wider">Average Cost Reduction</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-navy">24/7</div>
              <div className="text-gray-500 text-sm uppercase tracking-wider">AI Assistant Availability</div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Overview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="section-badge mb-4">What We Build</span>
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
                Technology That Works For You
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We don&apos;t just build technology — we build solutions that solve real business
                problems. Whether you need to automate manual processes, set up a CRM to manage
                your sales pipeline, or launch a professional website, our team delivers results.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Every solution is custom-built for your business, integrating seamlessly with
                your existing tools and workflows. No generic templates — just technology
                designed to make your operations faster, smarter, and more profitable.
              </p>
              <Link href="/contact" className="btn-primary inline-flex">
                Get a Free Consultation
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {services.map((service, i) => (
                <div key={i} className="bg-cream rounded-2xl p-6">
                  <h3 className="font-bold text-navy mb-2">{service.title}</h3>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="section-badge mb-4">Solutions We Deliver</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy">
              Built for Every Business Need
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              From simple workflow automations to complex enterprise integrations,
              we have the expertise to deliver.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {solutions.map((solution, i) => (
              <div key={i} className="bg-white rounded-xl p-6 text-center hover:shadow-card transition-shadow">
                <span className="text-navy font-semibold">{solution}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="section-badge mb-4">Our Process</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy">
              How We Deliver
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-navy flex items-center justify-center">
                  <span className="text-xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold text-navy mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why SASA Tech */}
      <section className="py-24 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="section-badge bg-white/10 border-white/20 text-white mb-4">Why Choose Us</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Technology Built by People Who Understand Sales
              </h2>
              <p className="text-white/80 mb-8 leading-relaxed">
                Unlike generic tech agencies, we understand the sales world inside and out.
                Every solution we build is informed by years of real-world sales operations
                experience — so your technology actually drives revenue.
              </p>
              <ul className="space-y-4">
                {[
                  'Deep sales operations expertise built into every solution',
                  'AI-first approach — we automate before we build',
                  'Ongoing support and continuous improvement',
                  'Transparent pricing with no hidden costs',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-white"></span>
                    <span className="text-white/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-64 h-64 rounded-full bg-white/10 flex items-center justify-center">
                <svg className="w-32 h-32 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
            Ready to Automate & Scale?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Let&apos;s discuss how our AI automation, CRM, and web development services
            can transform your business operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              Get Started
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-navy text-navy font-semibold rounded-full hover:bg-navy hover:text-white transition-colors"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
