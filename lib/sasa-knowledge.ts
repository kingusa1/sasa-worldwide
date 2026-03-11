// SASA Worldwide Knowledge Base
// This contains all public company information for the AI assistant
// Last updated: auto-updates via /api/ai/refresh-knowledge

export const SASA_KNOWLEDGE = {
  company: {
    name: "SASA Worldwide",
    legalName: "SASA WORLDWIDE MANAGEMENT CONSULTANCIES CO LLC",
    founded: 2010,
    tagline: "The Performance Growth Engine",
    description: "UAE's leading sales operations company delivering structured, scalable, and high-performance activation programs across all seven Emirates.",
    positioning: "UAE-first global AI and sales ecosystem",
    mission: "Deliver structured, scalable, and high-performance activation programs that drive measurable results through discipline, innovation, and AI-enabled systems across the UAE.",
    missionDetailed: "Sales must be measurable, not guesswork. Transform sales operations from guesswork to science by combining field excellence with cutting-edge technology, helping businesses achieve predictable, scalable growth across the UAE market.",
    vision: "Be the definitive partner for sales operations excellence in the Middle East, setting new standards for performance, professionalism, and innovation.",
    visionDetailed: "A future where every business in the UAE has access to world-class sales capabilities — where performance is predictable, teams are empowered, and growth is inevitable.",
  },

  contact: {
    phone: "+971 4 584 3777",
    email: "info@sasa-worldwide.com",
    whatsapp: "https://wa.me/971545304000",
    whatsappNumber: "+971 545 304000",
    address: {
      building: "Prime Business Center - Tower A",
      office: "Office A1201",
      area: "Jumeirah Village Circle (JVC)",
      city: "Dubai",
      country: "UAE",
      full: "Prime Business Center - Tower A, Office A1201, Jumeirah Village Circle (JVC), Dubai, UAE"
    },
    businessHours: "Sunday - Thursday: 9AM - 6PM",
    closedDays: "Friday - Saturday: Closed",
    responseTime: "Within 24 hours",
  },

  stats: {
    clients: "600+",
    teamMembers: "500+",
    dailyInteractions: "50,000+",
    emiratesCoverage: 7,
    partnerLocations: "200+",
    employeeRetention: "90%",
    googleRating: "4.9",
    campaigns: "600+",
    greatPlaceToWork: "Certified",
    timeToDirector: "1 year",
  },

  services: {
    b2c: {
      name: "B2C Residential",
      subtitle: "Consumer Direct Sales",
      description: "Elite field teams executing door-to-door, residential, and retail campaigns with precision and professionalism across all seven Emirates.",
      features: [
        "Door-to-door residential campaigns",
        "Kiosk and mall activations",
        "Event and exhibition sales",
        "Mystery shopping programs",
        "Customer feedback collection",
        "Lead generation & qualification",
      ],
      stat: "50,000+ daily customer interactions",
      pageUrl: "/services/b2c",
    },
    b2b: {
      name: "B2B Corporate",
      subtitle: "Enterprise Solutions",
      description: "High-performance corporate activation programs for enterprise clients with deployed teams for complex corporate sales cycles.",
      features: [
        "Corporate sales teams deployment",
        "Key account management",
        "B2B lead generation",
        "Trade show & conference activations",
        "Corporate partnership development",
        "Enterprise solution selling",
      ],
      stat: "600+ corporate client partnerships",
      pageUrl: "/services/b2b",
    },
    b2b2c: {
      name: "B2B2C Hybrid",
      subtitle: "Automotive & Retail Partnerships",
      description: "Automotive showroom and retail partnership engagements combining B2B relationships with consumer reach.",
      features: [
        "Automotive showroom sales",
        "Retail partner integrations",
        "Channel marketing programs",
        "Product launch activations",
        "Brand ambassador programs",
        "In-store promoter deployment",
      ],
      stat: "200+ partner retail locations",
      pageUrl: "/services/b2b2c",
    },
    b2g: {
      name: "B2G Government",
      subtitle: "National & Public Sector Programs",
      description: "Structured national activation programs for government initiatives across all Emirates.",
      features: [
        "National census & survey programs",
        "Public awareness campaigns",
        "Community outreach initiatives",
        "Government service enrollment",
        "Smart city initiatives support",
        "Emirate-wide activations",
      ],
      stat: "7 Emirates coverage",
      pageUrl: "/services/b2g",
    },
    technology: {
      name: "AI & Technology Solutions",
      subtitle: "Digital Transformation",
      description: "End-to-end AI automation, CRM development, website builds, and chatbot solutions designed to streamline operations and accelerate growth.",
      features: [
        "AI automation & workflow systems",
        "Custom CRM build & integration (Salesforce, HubSpot, bespoke)",
        "Professional website development",
        "Chatbot & AI assistant deployment",
        "Data analytics & dashboards",
        "Business process automation",
      ],
      solutions: [
        "Sales pipeline automation",
        "Customer onboarding workflows",
        "AI-powered lead scoring",
        "Custom dashboard & reporting",
        "E-commerce platforms",
        "Email marketing automation",
        "Document & invoice automation",
        "API integrations & middleware",
      ],
      stat: "100+ projects delivered",
      pageUrl: "/services/technology",
    },
  },

  training: {
    programName: "SASA Professional Sales Certification",
    tagline: "Stop Guessing. Start Selling with a System.",
    pageUrl: "/training",
    methodology: {
      name: "The 4-Foundation System",
      foundations: [
        {
          number: 1,
          name: "The Law of Averages (The Mathematics)",
          description: "Calculate daily activity targets, eliminate income uncertainty with proven math, build a predictable revenue engine.",
        },
        {
          number: 2,
          name: "The 5-Step Sales Blueprint (The Structure)",
          description: "Introduction, Short Story, Presentation, Close, Consolidation. KISS Storytelling and closing techniques. Never feel lost in a sales conversation again.",
        },
        {
          number: 3,
          name: "The 6 Impulse Factors (The Psychology)",
          description: "Greed, Indifference, Fear of Loss, Urgency, Jones Effect, Power of Suggestion. Ethical persuasion that builds trust and closes deals.",
        },
        {
          number: 4,
          name: "The 8 Successful Working Habits (The Daily Disciplines)",
          description: "Attitude, punctuality, preparation, full commitment, territory coverage, resilience, goal-setting, personal accountability.",
        },
      ],
    },
    packages: [
      {
        name: "Starter Package",
        subtitle: "Sales Certification + 2-Day On-Site Training",
        price: "AED 1,000",
        priceNote: "One-time payment, lifetime access",
        duration: "2 days on-site training",
        includes: "Complete 4-Foundation System, all course materials, lifetime access",
        outcomes: ["Clear repeatable sales structure", "Strong confidence", "Practical insights", "Foundation for sustainable revenue"],
      },
      {
        name: "Full Immersion Package",
        subtitle: "Full On-Site Certification Program",
        price: "AED 5,000",
        priceNote: "One-time payment, train until certified",
        duration: "Daily on-site training until full certification (no fixed end date, no time limit)",
        highlights: "Face-to-face with certified trainers, real-world sales experience, live customer interactions, true mastery through daily execution",
        popular: true,
      },
      {
        name: "Corporate/Enterprise Package",
        subtitle: "Corporate Sales Training Program",
        price: "Custom pricing",
        priceNote: "Volume discounts for groups of 5+",
        features: [
          "Customized training schedule and curriculum",
          "On-site training at client location or SASA offices",
          "Dedicated SASA-certified corporate trainer",
          "Team performance tracking and reporting",
          "Custom sales playbook for industry",
          "Post-training support and follow-up sessions",
        ],
      },
    ],
  },

  careers: {
    overview: "SASA offers a structured 5-phase leadership pathway for career growth - complete all phases within 1 year.",
    pageUrl: "/careers",
    phases: [
      {
        phase: 1, title: "Agent", duration: "Month 1-2", subtitle: "Foundation",
        description: "Build your sales foundation with hands-on field experience.",
        skills: "Sales fundamentals, product knowledge, field discipline, customer engagement",
        kpis: "40+ daily contacts, 15-20% conversion, 85%+ product knowledge, 95%+ attendance",
      },
      {
        phase: 2, title: "Account Manager", duration: "Month 3-4", subtitle: "Growth",
        description: "Manage client relationships and develop account strategies.",
        skills: "Client management, location oversight, basic reporting, relationship building",
        kpis: "AED 50K+ monthly location revenue, 4.5+/5 client satisfaction, 98%+ report accuracy",
      },
      {
        phase: 3, title: "Crew Manager", duration: "Month 5-7", subtitle: "Leadership",
        description: "Lead and mentor teams of 8-12 sales professionals.",
        skills: "Team leadership, performance tracking, daily operations, team motivation",
        kpis: "110%+ of collective team targets, 85%+ team retention, 100% daily briefing completion",
      },
      {
        phase: 4, title: "Assistant Director", duration: "Month 8-10", subtitle: "Strategy",
        description: "Drive strategic initiatives and oversee multiple teams.",
        skills: "Multi-location oversight, strategic support, resource allocation, process optimization",
        kpis: "AED 500K+ monthly multi-location revenue, 15%+ operational efficiency improvement",
      },
      {
        phase: 5, title: "Director", duration: "Month 11-12", subtitle: "Executive",
        description: "Shape company direction and lead major business units.",
        skills: "Campaign ownership, executive leadership, business development, P&L responsibility",
        kpis: "AED 2M+ quarterly campaign P&L, 25%+ annual client portfolio growth",
      },
    ],
    benefits: [
      "Merit-based advancement (performance-driven, not tenure-based)",
      "Continuous learning through SASA AI Academy",
      "Team collaboration culture (supportive, non-competitive)",
      "Professional mentorship from experienced leaders",
      "Health insurance",
      "Transportation allowance",
      "Performance bonuses",
      "Uncapped commission potential",
    ],
    certifications: ["Great Place to Work Certified"],
    applyUrl: "/recruitment",
  },

  recruitment: {
    pageUrl: "/recruitment",
    openPositions: [
      { title: "Field Sales Agent", department: "Sales Operations", location: "Dubai", experience: "Entry Level", type: "Full-time", compensation: "Commission-based during training, then base + commission" },
      { title: "Account Manager", department: "Client Relations", location: "Dubai", experience: "2+ years", type: "Full-time" },
      { title: "Crew Manager", department: "Field Operations", location: "Abu Dhabi", experience: "3+ years", type: "Full-time" },
      { title: "Financial Advisor", department: "Corporate", location: "Dubai", experience: "5+ years", type: "Full-time" },
      { title: "Salesforce Consultant", department: "Technology", location: "Dubai", experience: "4+ years", type: "Full-time" },
      { title: "Office Manager", department: "Administration", location: "Dubai", experience: "3+ years", type: "Full-time" },
    ],
    hiringPhilosophy: "Know What You're Getting — No Gimmicks. Transparency in hiring, clear expectations, defined career paths, honest feedback for growth.",
  },

  leadership: {
    coFounders: [
      {
        name: "Adam Qureshi",
        role: "Co-Founder & CEO",
        expertise: ["Sales Mastery", "AI Education", "Team Building", "Business Development"],
        bio: "4+ years direct sales experience, built and scaled high-performance teams across the UK, developed 75+ active agents, 1,500+ weekly customer acquisitions.",
      },
      {
        name: "Salah Elgemiabby",
        role: "Co-Founder & Sales Director",
        expertise: ["Team Development", "Performance Management", "Business Expansion", "Operational Excellence"],
      },
    ],
    cSuite: [
      { name: "Ahmed Abdulmutal", role: "Chief Operations Officer", expertise: ["Operations Management", "Process Optimization", "Quality Assurance"] },
      { name: "Lujain Karim", role: "Chief Financial Officer", expertise: ["Financial Strategy", "Budget Management", "Risk Analysis"] },
      { name: "Omnia Eltaib", role: "Chief Technology Officer", expertise: ["Technology Strategy", "AI & Analytics", "Digital Transformation"] },
      { name: "Dr. Malaz Elgemiabby", role: "Chief Strategic Operations Partner", expertise: ["Strategic Planning", "Business Partnerships", "Organizational Development"] },
    ],
    salesDirectors: [
      { name: "Masnun Taher", role: "Sales Director", expertise: ["Sales Performance", "Training & Mindset", "Daily Execution"] },
      { name: "Joseph McCauley", role: "Sales Director", expertise: ["Client Acquisition", "Sales Strategy", "Team Leadership"] },
      { name: "Jonathan Bulmer", role: "Sales Director", expertise: ["Training & Development", "Performance Improvement", "Culture Building"] },
    ],
    pageUrl: "/about/leadership",
  },

  technology: {
    platform: {
      name: "SASA OS",
      description: "Proprietary platform for real-time performance tracking, analytics, and sales operations management.",
      features: ["Real-time dashboards", "Performance tracking", "KPI monitoring", "AI-enabled oversight", "Fraud detection", "Quality assurance"],
    },
    academy: {
      name: "SASA AI Academy",
      description: "AI-powered training platform for continuous workforce upskilling and professional development.",
    },
  },

  values: [
    { name: "Excellence", description: "Pursuing highest standards from recruitment to execution" },
    { name: "Integrity", description: "Building trust through transparency and ethical practices" },
    { name: "Innovation", description: "Continuously evolving methods and technologies" },
    { name: "Partnership", description: "Collaborative relationships creating mutual success" },
  ],

  timeline: [
    { year: 2010, event: "Foundation in Dubai with vision to revolutionize sales operations" },
    { year: 2014, event: "Expansion to all 7 Emirates, building the largest field force network" },
    { year: 2018, event: "Launch of SASA OS platform for real-time tracking" },
    { year: 2021, event: "Introduction of AI Academy for workforce training" },
    { year: 2024, event: "Market leadership with 600+ active clients" },
  ],

  social: {
    instagram: "https://www.instagram.com/sasa__worldwide",
    facebook: "https://www.facebook.com/profile.php?id=61586521990816",
    linkedin: "https://www.linkedin.com/company/sasa-worldwide",
    whatsapp: "https://wa.me/971545304000",
  },

  website: {
    trainingAcademy: "/training",
    pages: {
      home: "/",
      about: "/about",
      mission: "/about/mission",
      leadership: "/about/leadership",
      services: "/services",
      b2c: "/services/b2c",
      b2b: "/services/b2b",
      b2b2c: "/services/b2b2c",
      b2g: "/services/b2g",
      technology: "/services/technology",
      careers: "/careers",
      recruitment: "/recruitment",
      training: "/training",
      contact: "/contact",
      blog: "/blog",
      partnerships: "/partnerships",
      csr: "/csr",
    },
  },

  csr: {
    overview: "SASA is committed to making a positive impact in the UAE community, aligned with UAE Vision 2031.",
    pageUrl: "/csr",
    initiatives: [
      { name: "Youth Employment Program", impact: "500+ youth employed annually", category: "Community" },
      { name: "Sustainable Operations", impact: "40% paper reduction", category: "Environment" },
      { name: "Skills Development", impact: "1,000+ trained annually", category: "Education" },
      { name: "Community Outreach", impact: "50+ events yearly", category: "Social Impact" },
      { name: "Emiratization Support", impact: "30% workforce target", category: "National Development" },
      { name: "Digital Inclusion", impact: "200+ workshops", category: "Technology" },
    ],
  },

  partnerships: {
    overview: "SASA partners with leading brands across industries as your execution partner, not just a service provider.",
    pageUrl: "/partnerships",
    featured: "SASA x CAFU Fuel Subscription partnership - national activation across multiple channels",
    benefits: [
      "Structured operations with clear processes and accountability",
      "Fast national mobilization - deploy across all 7 Emirates within days",
      "KPI-driven reporting with real-time dashboards",
      "AI-enabled oversight for fraud detection and quality assurance",
      "Trained field teams through AI Academy",
      "SASA OS unified operating system for transparency",
    ],
    process: [
      { step: 1, name: "Discovery", description: "30-minute consultation" },
      { step: 2, name: "Assessment", description: "In-depth analysis of goals and requirements" },
      { step: 3, name: "Planning", description: "Customized activation strategy" },
      { step: 4, name: "Execution", description: "Full deployment with ongoing management and real-time reporting" },
    ],
    inquiryEmail: "info@sasa-worldwide.com",
  },
};

// Helper function to get a formatted knowledge string for the AI
export function getKnowledgeSummary(): string {
  const k = SASA_KNOWLEDGE;
  return `
COMPANY: ${k.company.name} (${k.company.legalName})
Founded: ${k.company.founded} | ${k.company.tagline}
${k.company.description}
Mission: ${k.company.mission}
Vision: ${k.company.vision}

CONTACT:
- Phone: ${k.contact.phone}
- Email: ${k.contact.email}
- WhatsApp: ${k.contact.whatsappNumber}
- Address: ${k.contact.address.full}
- Hours: ${k.contact.businessHours}
- Closed: ${k.contact.closedDays}
- Response time: ${k.contact.responseTime}

KEY STATS:
- ${k.stats.clients} corporate clients
- ${k.stats.teamMembers} team members
- ${k.stats.dailyInteractions} daily interactions
- ${k.stats.emiratesCoverage} Emirates coverage
- ${k.stats.employeeRetention} employee retention
- ${k.stats.googleRating} Google rating
- Great Place to Work: ${k.stats.greatPlaceToWork}

SERVICES:
1. B2C Residential - ${k.services.b2c.description} (${k.services.b2c.stat}) - Page: ${k.services.b2c.pageUrl}
2. B2B Corporate - ${k.services.b2b.description} (${k.services.b2b.stat}) - Page: ${k.services.b2b.pageUrl}
3. B2B2C Hybrid - ${k.services.b2b2c.description} (${k.services.b2b2c.stat}) - Page: ${k.services.b2b2c.pageUrl}
4. B2G Government - ${k.services.b2g.description} (${k.services.b2g.stat}) - Page: ${k.services.b2g.pageUrl}
5. AI & Technology - ${k.services.technology.description} (${k.services.technology.stat}) - Page: ${k.services.technology.pageUrl}
   Solutions: ${k.services.technology.solutions.join(', ')}

TRAINING PROGRAMS (Page: /training):
Program: ${k.training.programName} - "${k.training.tagline}"
Methodology: ${k.training.methodology.name}
${k.training.methodology.foundations.map(f => `- Foundation ${f.number}: ${f.name} - ${f.description}`).join('\n')}

Training Packages:
${k.training.packages.map(p => `- ${p.name}: ${p.price} (${p.priceNote}) - ${p.subtitle}${p.duration ? ` - Duration: ${p.duration}` : ''}`).join('\n')}

CAREERS (5-Phase Leadership Path - Page: /careers):
${k.careers.phases.map(p => `- Phase ${p.phase}: ${p.title} (${p.duration}) - ${p.description}${p.kpis ? ` | KPIs: ${p.kpis}` : ''}`).join('\n')}
Benefits: ${k.careers.benefits.join(', ')}
Apply at: ${k.careers.applyUrl}

CURRENT JOB OPENINGS (Page: /recruitment):
${k.recruitment.openPositions.map(p => `- ${p.title} (${p.department}) - ${p.location}, ${p.experience}, ${p.type}`).join('\n')}

LEADERSHIP TEAM (Page: /about/leadership):
Co-Founders: ${k.leadership.coFounders.map(l => `${l.name} - ${l.role}`).join(', ')}
C-Suite: ${k.leadership.cSuite.map(l => `${l.name} - ${l.role}`).join(', ')}
Sales Directors: ${k.leadership.salesDirectors.map(l => `${l.name} - ${l.role}`).join(', ')}

TECHNOLOGY:
- SASA OS: ${k.technology.platform.description}
- SASA AI Academy: ${k.technology.academy.description}

PARTNERSHIPS (Page: /partnerships):
${k.partnerships.overview}
Featured: ${k.partnerships.featured}
Process: ${k.partnerships.process.map(s => `${s.step}. ${s.name} - ${s.description}`).join(', ')}
Inquiry: ${k.partnerships.inquiryEmail}

CSR INITIATIVES (Page: /csr):
${k.csr.initiatives.map(i => `- ${i.name}: ${i.impact}`).join('\n')}

VALUES: ${k.values.map(v => `${v.name} (${v.description})`).join(', ')}

WEBSITE PAGES:
${Object.entries(k.website.pages).map(([name, url]) => `- ${name}: ${url}`).join('\n')}

SOCIAL MEDIA:
- Instagram: ${k.social.instagram}
- Facebook: ${k.social.facebook}
- LinkedIn: ${k.social.linkedin}
`.trim();
}
