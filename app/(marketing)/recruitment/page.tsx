'use client';

import { useState } from 'react';
import Link from 'next/link';

const jobListings = [
  {
    id: 1,
    title: 'Field Sales Agent',
    department: 'Sales Operations',
    location: 'Dubai, UAE',
    type: 'Full-time',
    experience: 'Entry Level',
    salary: 'AED 4,000 - 8,000 + Commission',
    description: 'Join our field force team and become the face of leading brands across the UAE. Perfect for motivated individuals looking to start their sales career with unlimited earning potential.',
    whatYouWillDo: [
      'Conduct door-to-door and retail sales campaigns for premium brands',
      'Build relationships with customers and identify their needs',
      'Meet daily sales targets and activity KPIs',
      'Attend daily briefings and training sessions',
      'Use SASA OS mobile app to log activities and track performance',
      'Represent partner brands with professionalism at all times',
    ],
    requirements: [
      'High school diploma or equivalent',
      'Excellent communication skills in English and Arabic',
      'Positive attitude and willingness to learn',
      'Valid UAE residence visa',
      'Ability to work outdoors and travel within assigned territory',
    ],
    benefits: [
      'Uncapped commission structure',
      'Comprehensive training through SASA Academy',
      'Clear 5-phase career progression path',
      'Health insurance coverage',
      'Transportation allowance',
      'Performance bonuses and incentives',
    ],
    team: 'You will join a team of 50+ field agents across Dubai, with direct support from Crew Managers.',
  },
  {
    id: 2,
    title: 'Account Manager',
    department: 'Client Relations',
    location: 'Dubai, UAE',
    type: 'Full-time',
    experience: '2+ Years',
    salary: 'AED 10,000 - 15,000 + Bonus',
    description: 'Manage key client accounts and drive campaign success. Ideal for experienced sales professionals ready to take ownership of client relationships and multi-location operations.',
    whatYouWillDo: [
      'Manage relationships with assigned client accounts',
      'Oversee campaign performance across multiple locations',
      'Prepare weekly and monthly performance reports',
      'Coordinate with field teams to optimize results',
      'Identify upselling and cross-selling opportunities',
      'Resolve client issues and maintain high satisfaction scores',
      'Use Salesforce CRM for pipeline and relationship management',
    ],
    requirements: [
      "Bachelor's degree in Business or related field",
      '2+ years of account management or B2B sales experience',
      'Strong analytical and reporting skills',
      'Experience with CRM systems (Salesforce preferred)',
      'Excellent presentation and communication skills',
      'Fluent in English; Arabic is a plus',
    ],
    benefits: [
      'Competitive base salary + quarterly bonuses',
      'Annual leave: 22 days',
      'Health insurance for employee + family',
      'Professional development budget',
      'Flexible working arrangements',
      'Career progression to Crew Manager within 12-18 months',
    ],
    team: 'You will work within our Client Relations team of 15 professionals, reporting to the Client Success Director.',
  },
  {
    id: 3,
    title: 'Crew Manager',
    department: 'Field Operations',
    location: 'Abu Dhabi, UAE',
    type: 'Full-time',
    experience: '3+ Years',
    salary: 'AED 15,000 - 22,000 + Team Bonus',
    description: 'Lead and motivate field teams to achieve daily targets. Perfect for natural leaders who can inspire teams, drive performance, and develop talent.',
    whatYouWillDo: [
      'Lead a team of 8-12 field sales agents',
      'Conduct daily morning briefings and end-of-day debriefs',
      'Coach and mentor team members on sales techniques',
      'Track daily, weekly, and monthly team performance',
      'Recruit, onboard, and train new team members',
      'Manage territory assignments and route planning',
      'Collaborate with Account Managers on campaign execution',
      'Report directly to Assistant Director on team metrics',
    ],
    requirements: [
      "Bachelor's degree preferred",
      '3+ years of sales team leadership experience',
      'Proven track record of exceeding team targets',
      'Strong coaching and mentoring abilities',
      'Valid UAE driving license',
      'Experience in field sales or direct marketing',
      'Fluent in English and Arabic',
    ],
    benefits: [
      'Base salary + team performance bonus (up to 30%)',
      'Company vehicle or car allowance',
      'Fuel card',
      'Annual leave: 25 days',
      'Comprehensive health insurance',
      'Leadership development program access',
      'Fast-track to Assistant Director role',
    ],
    team: 'You will manage one of our high-performing field crews in Abu Dhabi, with peer support from 8 other Crew Managers.',
  },
  {
    id: 4,
    title: 'Financial Advisor',
    department: 'Corporate',
    location: 'Dubai, UAE',
    type: 'Full-time',
    experience: '5+ Years',
    salary: 'AED 25,000 - 40,000',
    description: 'Provide strategic financial guidance and manage corporate partnerships. Seeking experienced finance professionals to drive financial planning and analysis across our growing operations.',
    whatYouWillDo: [
      'Lead financial planning and analysis (FP&A) activities',
      'Prepare monthly, quarterly, and annual financial reports',
      'Develop and monitor budgets for multiple campaigns',
      'Analyze campaign profitability and ROI metrics',
      'Support pricing strategy and commission structures',
      'Liaise with external auditors and regulatory bodies',
      'Present financial insights to executive leadership',
      'Manage cash flow forecasting and treasury operations',
    ],
    requirements: [
      "Bachelor's degree in Finance, Accounting, or Economics",
      '5+ years of financial advisory or FP&A experience',
      'CFA, CPA, or ACCA certification preferred',
      'Advanced Excel and financial modeling skills',
      'Experience with ERP systems (SAP, Oracle)',
      'Strong presentation and stakeholder management skills',
      'Experience in sales operations or marketing industry is a plus',
    ],
    benefits: [
      'Competitive salary package',
      'Annual bonus: up to 20% of base',
      'Annual leave: 25 days + public holidays',
      'Premium health insurance',
      'Education assistance for professional certifications',
      'Pension contribution scheme',
      'Flexible working hours',
    ],
    team: 'You will join the Corporate Finance team of 6 professionals, reporting to the CFO.',
  },
  {
    id: 5,
    title: 'Salesforce Consultant',
    department: 'Technology',
    location: 'Dubai, UAE',
    type: 'Full-time',
    experience: '4+ Years',
    salary: 'AED 20,000 - 32,000',
    description: 'Drive Salesforce implementation and optimization across our SASA OS platform. Join our technology team to build the systems that power UAE\'s most advanced sales operations.',
    whatYouWillDo: [
      'Configure and customize Salesforce Sales Cloud and Service Cloud',
      'Develop custom objects, workflows, and automation rules',
      'Integrate Salesforce with SASA OS and third-party systems',
      'Create dashboards and reports for sales leadership',
      'Train end users and create documentation',
      'Manage Salesforce releases and deployments',
      'Troubleshoot issues and provide technical support',
      'Lead discovery sessions for new feature requirements',
    ],
    requirements: [
      "Bachelor's degree in Computer Science, IT, or related field",
      'Salesforce Administrator and/or Developer certification required',
      '4+ years of Salesforce implementation experience',
      'Experience with Apex, Visualforce, and Lightning components',
      'Knowledge of REST/SOAP APIs and integration patterns',
      'Experience in sales operations or CRM consulting',
      'Strong problem-solving and communication skills',
    ],
    benefits: [
      'Competitive salary based on experience',
      'Salesforce certification sponsorship',
      'Annual conference attendance (Dreamforce)',
      'Annual leave: 22 days',
      'Health insurance',
      'Remote working options (2 days/week)',
      'Learning & development budget',
    ],
    team: 'You will join our Technology team of 12 engineers, working closely with the Product Manager and CTO.',
  },
  {
    id: 6,
    title: 'Office Manager',
    department: 'Administration',
    location: 'Dubai, UAE',
    type: 'Full-time',
    experience: '3+ Years',
    salary: 'AED 12,000 - 18,000',
    description: 'Oversee daily office operations and support our growing team. Ideal for organized professionals who thrive in fast-paced environments and can manage multiple priorities with ease.',
    whatYouWillDo: [
      'Manage day-to-day office operations and facilities',
      'Coordinate with building management and vendors',
      'Handle procurement of office supplies and equipment',
      'Support HR with onboarding logistics and documentation',
      'Organize company events, meetings, and travel arrangements',
      'Manage office budgets and expense tracking',
      'Ensure compliance with health and safety regulations',
      'Serve as the primary point of contact for administrative queries',
    ],
    requirements: [
      "Bachelor's degree in Business Administration or related field",
      '3+ years of office management experience',
      'Proficiency in MS Office suite (Excel, Word, PowerPoint)',
      'Experience with office management software',
      'Excellent organizational and multitasking skills',
      'Strong interpersonal and communication abilities',
      'Fluent in English; Arabic is a plus',
    ],
    benefits: [
      'Competitive salary',
      'Annual leave: 22 days',
      'Health insurance',
      'Employee discount programs',
      'Professional development opportunities',
      'Friendly and collaborative work environment',
      'Career growth within SASA operations',
    ],
    team: 'You will be part of the Administration team, supporting 150+ employees across our Dubai headquarters.',
  },
];

const departments = ['All', 'Sales Operations', 'Client Relations', 'Field Operations', 'Corporate', 'Technology', 'Administration'];

export default function RecruitmentPage() {
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [expandedJob, setExpandedJob] = useState<number | null>(null);

  const filteredJobs = selectedDepartment === 'All'
    ? jobListings
    : jobListings.filter(job => job.department === selectedDepartment);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-navy text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <span className="section-badge bg-white/10 border-white/20 text-white mb-6">Join Our Team</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Current Openings
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Discover exciting career opportunities at SASA Worldwide. We&apos;re always looking
              for talented individuals who share our passion for excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-navy">{jobListings.length}</div>
              <div className="text-gray-500 text-sm">Open Positions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-navy">7</div>
              <div className="text-gray-500 text-sm">Emirates Coverage</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-navy">500+</div>
              <div className="text-gray-500 text-sm">Team Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-navy">24hrs</div>
              <div className="text-gray-500 text-sm">Response Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter */}
          <div className="mb-12">
            <h2 className="text-lg font-semibold text-navy mb-4">Filter by Department</h2>
            <div className="flex flex-wrap gap-2">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedDepartment === dept
                      ? 'bg-navy text-white'
                      : 'bg-cream text-gray-600 hover:bg-navy/10'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Jobs List */}
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-cream rounded-2xl overflow-hidden transition-shadow hover:shadow-card"
              >
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-navy mb-2">{job.title}</h3>
                      <div className="flex flex-wrap gap-3 text-sm">
                        <span className="flex items-center gap-1 text-gray-600">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          {job.department}
                        </span>
                        <span className="flex items-center gap-1 text-gray-600">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1 text-gray-600">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {job.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 bg-navy/10 text-navy text-sm font-medium rounded-full">
                        {job.experience}
                      </span>
                      <svg
                        className={`w-5 h-5 text-navy transition-transform ${expandedJob === job.id ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedJob === job.id && (
                  <div className="px-6 pb-6 border-t border-gray-200 pt-6">
                    {/* Overview & Salary */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
                      <p className="text-gray-600 flex-1">{job.description}</p>
                      <div className="flex-shrink-0 px-4 py-3 bg-navy/5 rounded-xl">
                        <span className="text-xs text-gray-500 uppercase tracking-wider">Salary Range</span>
                        <div className="text-lg font-bold text-navy">{job.salary}</div>
                      </div>
                    </div>

                    {/* What You'll Do */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-navy mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-navy/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                        What You&apos;ll Do
                      </h4>
                      <ul className="grid md:grid-cols-2 gap-2">
                        {job.whatYouWillDo.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                            <span className="w-1.5 h-1.5 bg-navy/40 rounded-full mt-1.5 flex-shrink-0"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Requirements & Benefits Grid */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      {/* Requirements */}
                      <div className="bg-white rounded-xl p-5 border border-gray-100">
                        <h4 className="font-semibold text-navy mb-3 flex items-center gap-2">
                          <svg className="w-5 h-5 text-navy/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Requirements
                        </h4>
                        <ul className="space-y-2">
                          {job.requirements.map((req, i) => (
                            <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                              <svg className="w-4 h-4 text-navy flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Benefits */}
                      <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                        <h4 className="font-semibold text-navy mb-3 flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                          </svg>
                          Benefits & Perks
                        </h4>
                        <ul className="space-y-2">
                          {job.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                              <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Team Info */}
                    <div className="bg-navy/5 rounded-xl p-4 mb-6">
                      <h4 className="font-semibold text-navy mb-1 text-sm">Your Team</h4>
                      <p className="text-gray-600 text-sm">{job.team}</p>
                    </div>

                    {/* Apply Button */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link
                        href="/contact"
                        className="btn-primary inline-flex"
                      >
                        Apply Now
                        <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                      <a
                        href={`mailto:careers@sasaworldwide.com?subject=Application for ${job.title}`}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-navy/20 text-navy font-medium rounded-full hover:bg-navy/5 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Email Resume
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No positions available in this department currently.</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="section-badge mb-4">Why SASA</span>
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
                You&apos;ll Know What You&apos;re Getting—No Gimmicks
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We believe in transparency in everything we do, including our hiring process.
                When you join SASA, you&apos;ll have clear expectations, defined career paths,
                and honest feedback to help you grow.
              </p>
              <Link href="/careers" className="btn-primary inline-flex">
                Learn About Career Paths
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '📈', title: 'Growth', desc: 'Clear advancement path' },
                { icon: '🎓', title: 'Training', desc: 'AI-powered learning' },
                { icon: '🤝', title: 'Culture', desc: 'Collaborative team' },
                { icon: '💰', title: 'Rewards', desc: 'Competitive packages' },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 text-center">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-navy mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Don&apos;t See the Right Role?
          </h2>
          <p className="text-xl text-white/80 mb-10">
            We&apos;re always interested in hearing from talented individuals.
            Send us your resume and we&apos;ll keep you in mind for future opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-navy font-semibold rounded-full hover:bg-gray-100 transition-colors"
            >
              Submit Your Resume
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a
              href="tel:+97145843777"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-colors border border-white/20"
            >
              Call HR: +971 4 584 3777
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
