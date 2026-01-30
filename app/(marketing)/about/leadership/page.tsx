'use client';

import Link from 'next/link';

const leadership = [
  {
    name: 'Salah Elgemiabby',
    role: 'Chief Executive Officer',
    shortRole: 'CEO',
    initials: 'SE',
    color: 'from-blue-500 to-blue-700',
    bio: 'Salah brings visionary leadership and strategic direction to SASA Worldwide. With extensive experience in sales operations and business development across the UAE, he has built SASA into a leading performance growth engine. His focus on excellence and innovation drives the company\'s mission to transform sales operations.',
    expertise: ['Strategic Leadership', 'Business Development', 'Sales Operations', 'Market Expansion'],
  },
  {
    name: 'Adam Qureshi',
    role: 'Chief Sales Officer',
    shortRole: 'CSO',
    initials: 'AQ',
    color: 'from-teal-500 to-teal-700',
    bio: 'Adam leads SASA\'s sales strategy and client acquisition efforts. His deep understanding of the UAE market and proven track record in building high-performing sales teams ensures that SASA consistently delivers exceptional results for clients across all seven Emirates.',
    expertise: ['Sales Strategy', 'Client Relations', 'Team Building', 'Revenue Growth'],
  },
  {
    name: 'Ahmed Abdulmutal',
    role: 'Chief Operations Officer',
    shortRole: 'COO',
    initials: 'AA',
    color: 'from-indigo-500 to-indigo-700',
    bio: 'Ahmed oversees all operational aspects of SASA Worldwide, ensuring seamless execution of sales programs and campaigns. His expertise in process optimization and operational excellence enables the company to scale efficiently while maintaining the highest quality standards.',
    expertise: ['Operations Management', 'Process Optimization', 'Quality Assurance', 'Scalability'],
  },
  {
    name: 'Lujain Karim',
    role: 'Chief Financial Officer',
    shortRole: 'CFO',
    initials: 'LK',
    color: 'from-orange-500 to-orange-700',
    bio: 'Lujain manages SASA\'s financial strategy and ensures sustainable growth through sound fiscal management. Her analytical expertise and strategic financial planning support the company\'s expansion goals while maintaining strong financial health and investor confidence.',
    expertise: ['Financial Strategy', 'Budget Management', 'Risk Analysis', 'Investment Planning'],
  },
  {
    name: 'Omnia Eltaib',
    role: 'Chief Technology Officer',
    shortRole: 'CTO',
    initials: 'OE',
    color: 'from-purple-500 to-purple-700',
    bio: 'Omnia drives SASA\'s technology initiatives, including the AI-powered systems that give clients a competitive edge. Her innovation leadership ensures that SASA stays at the forefront of sales technology, delivering cutting-edge solutions that maximize performance and efficiency.',
    expertise: ['Technology Strategy', 'AI & Analytics', 'Digital Transformation', 'Innovation'],
  },
  {
    name: 'Dr. Malaz Elgemiabby',
    role: 'Chief Strategic Operations Partner',
    shortRole: 'CSOP',
    initials: 'ME',
    color: 'from-rose-500 to-rose-700',
    bio: 'Dr. Malaz provides strategic guidance and operational partnership to drive SASA\'s long-term success. Her academic background combined with practical business acumen enables her to bridge strategy and execution, ensuring sustainable growth and organizational excellence.',
    expertise: ['Strategic Planning', 'Business Partnerships', 'Organizational Development', 'Research & Insights'],
  },
];

export default function LeadershipPage() {
  return (
    <div className="bg-white">
      {/* Hero Section - Full Screen */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-navy/70"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium tracking-wider mb-6">
            LEADERSHIP
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Our Leadership Team
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Meet the experienced professionals guiding SASA Worldwide&apos;s growth and success across the UAE.
          </p>
        </div>
      </section>

      {/* Leadership Grid - Compact Overview */}
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="section-badge text-navy mb-10 block">LEADERSHIP TEAM</span>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {leadership.map((person, index) => (
              <a
                key={index}
                href={`#leader-${index}`}
                className="group bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center"
              >
                <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${person.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <span className="text-xl font-bold text-white">{person.initials}</span>
                </div>
                <h3 className="text-sm font-bold text-navy mb-1 line-clamp-1">
                  {person.name}
                </h3>
                <div className="text-xs text-navy/60 font-medium">{person.shortRole}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Leadership Profiles */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="section-badge mb-4">MEET THE TEAM</span>
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-12">
            Leadership Profiles
          </h2>

          <div className="space-y-8">
            {leadership.map((person, index) => (
              <div
                key={index}
                id={`leader-${index}`}
                className="bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="grid md:grid-cols-4 gap-0">
                  {/* Left Column - Photo/Avatar Area */}
                  <div className={`bg-gradient-to-br ${person.color} p-8 flex items-center justify-center`}>
                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 border-4 border-white/30">
                        <span className="text-4xl font-bold text-white">{person.initials}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1">{person.name}</h3>
                      <div className="text-white/80 text-sm font-medium">{person.role}</div>
                    </div>
                  </div>

                  {/* Right Column - Details */}
                  <div className="md:col-span-3 p-8">
                    <div className="mb-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${person.color} text-white`}>
                        {person.shortRole}
                      </span>
                    </div>

                    <p className="text-gray-600 leading-relaxed mb-6">
                      {person.bio}
                    </p>

                    <div>
                      <h4 className="text-sm font-semibold text-navy mb-3 uppercase tracking-wider">Areas of Expertise</h4>
                      <div className="flex flex-wrap gap-2">
                        {person.expertise.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full hover:bg-navy hover:text-white transition-colors cursor-default"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inspirational Quote Section */}
      <section className="relative py-32 mt-12">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-2xl">
            <p className="text-xl md:text-2xl text-gray-800 leading-relaxed mb-8 font-medium">
              &ldquo;We are building an organisation where a new recruit can grow from first-day agent
              to director through discipline, performance, and training.&rdquo;
            </p>
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white font-medium rounded-full hover:bg-navy/90 transition-colors"
            >
              Careers
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Our Leadership Journey
          </h2>
          <p className="text-xl text-white/80 mb-10">
            We&apos;re always looking for talented individuals who want to grow
            into leadership roles. Start your journey with SASA today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/careers"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-navy font-semibold rounded-full hover:bg-gray-100 transition-colors"
            >
              Explore Career Paths
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/recruitment"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-colors border border-white/20"
            >
              View Open Positions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
