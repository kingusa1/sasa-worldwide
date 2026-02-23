'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const checkIcon = (
  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const checkIconWhite = (
  <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: easeOutExpo },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.15, ease: easeOutExpo },
  }),
};

export default function TrainingPage() {
  const whatsappCorpMessage = encodeURIComponent(
    "Hello SASA Worldwide,\n\nI'm interested in the Corporate Sales Training Program for my team. I'd like to learn more about pricing, customization options, and availability.\n\nCompany: \nTeam Size: \nPreferred Start Date: \n\nPlease get back to me at your earliest convenience. Thank you!"
  );

  return (
    <div className="bg-white">
      {/* Pulse glow for popular badge */}
      <style jsx global>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.4); }
          50% { box-shadow: 0 0 20px 6px rgba(255,255,255,0.15); }
        }
        .popular-badge { animation: pulse-glow 2.5s ease-in-out infinite; }
      `}</style>

      {/* Hero */}
      <section className="relative min-h-[60dvh] md:min-h-[80dvh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-navy/80"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium tracking-wider mb-6"
          >
            SASA PROFESSIONAL SALES CERTIFICATION
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: easeOutExpo }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Stop Guessing.<br />Start Selling with a System.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: easeOutExpo }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-4"
          >
            The Complete 4-Foundation System That Transforms Ordinary Salespeople Into Confident, Structured, and Results-Driven Sales Professionals
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-base text-white/50 max-w-xl mx-auto mb-8"
          >
            Trusted by SASA Worldwide partners across all seven Emirates
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8, ease: easeOutExpo }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.a
              href="#packages"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-navy font-semibold rounded-full hover:bg-gray-100 transition-colors"
            >
              View Packages &amp; Enroll
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.a>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-colors border border-white/20"
            >
              Already Enrolled? Login
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Problem / Solution Intro */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
              Most Salespeople Fail Because They Have No System
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              They rely on luck, personality, or random techniques. They don&apos;t know why they win, so they can&apos;t repeat it. And when results drop, they have no framework to fall back on.
            </p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={scaleIn}
            custom={0}
            className="bg-cream rounded-3xl p-8 md:p-12"
          >
            <h3 className="text-xl font-bold text-navy text-center mb-8">The SASA Certification Changes That</h3>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-8 text-center"
            >
              <motion.div variants={fadeUp} custom={0}>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 2 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="w-16 h-16 bg-navy/10 rounded-2xl flex items-center justify-center mx-auto mb-4"
                >
                  <svg className="w-8 h-8 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </motion.div>
                <h4 className="font-bold text-navy mb-2">Predictable Results</h4>
                <p className="text-gray-500 text-sm">Learn the mathematics behind consistent sales income — no more guessing or hoping for the best.</p>
              </motion.div>
              <motion.div variants={fadeUp} custom={1}>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -2 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="w-16 h-16 bg-navy/10 rounded-2xl flex items-center justify-center mx-auto mb-4"
                >
                  <svg className="w-8 h-8 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </motion.div>
                <h4 className="font-bold text-navy mb-2">Know What to Say</h4>
                <p className="text-gray-500 text-sm">A proven conversation framework that gives you confidence in every customer interaction — step by step.</p>
              </motion.div>
              <motion.div variants={fadeUp} custom={2}>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 2 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="w-16 h-16 bg-navy/10 rounded-2xl flex items-center justify-center mx-auto mb-4"
                >
                  <svg className="w-8 h-8 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </motion.div>
                <h4 className="font-bold text-navy mb-2">Close More Deals</h4>
                <p className="text-gray-500 text-sm">Master the psychology behind buying decisions and the daily habits that separate top performers from the rest.</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 4 Foundations Detail */}
      <section className="py-20 bg-cream overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 bg-navy/5 rounded-full text-navy text-sm font-medium tracking-wider mb-4">
              THE 4-FOUNDATION SYSTEM
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              What You Will Learn
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every package covers the complete SASA sales methodology — the same system used by top-performing sales professionals across the UAE.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                num: '01', label: 'FOUNDATION 1', title: 'The Law of Averages', subtitle: 'The Mathematics',
                desc: 'Understand the math behind predictable sales success. Learn how consistent daily activity creates reliable results and how to calculate your personal path to any income goal.',
                items: ['Calculate your exact daily activity targets', 'Eliminate income uncertainty with proven math', 'Build a predictable revenue engine'],
              },
              {
                num: '02', label: 'FOUNDATION 2', title: 'The 5-Step Sales Blueprint', subtitle: 'The Structure',
                desc: 'Master the proven sales conversation framework used by top performers. From Introduction to Consolidation, learn exactly what to say, when to say it, and why it works.',
                items: ['Introduction, Short Story, Presentation, Close, Consolidation', 'Never feel lost in a sales conversation again', 'KISS Storytelling and closing techniques'],
              },
              {
                num: '03', label: 'FOUNDATION 3', title: 'The 6 Impulse Factors', subtitle: 'The Psychology',
                desc: 'Unlock the emotional triggers that influence customer decisions. Learn how to ethically guide buying behavior using proven psychological principles.',
                items: ['Greed, Indifference, Fear of Loss', 'Urgency, the Jones Effect, Power of Suggestion', 'Ethical persuasion that builds trust and closes deals'],
              },
              {
                num: '04', label: 'FOUNDATION 4', title: 'The 8 Successful Working Habits', subtitle: 'The Daily Disciplines',
                desc: 'Build the habits that separate top performers from average salespeople. These are the non-negotiable daily disciplines of every high earner.',
                items: ['Attitude, punctuality, preparation, full commitment', 'Territory coverage, resilience, goal-setting', 'Personal accountability and compound effect'],
              },
            ].map((f, i) => (
              <motion.div
                key={f.num}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="bg-white rounded-2xl p-8"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-navy text-white rounded-xl flex items-center justify-center text-xl font-bold">
                    {f.num}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-navy/50 tracking-wider">{f.label}</span>
                    <h3 className="text-lg font-bold text-navy">{f.title}</h3>
                  </div>
                </div>
                <p className="text-sm font-semibold text-navy/70 mb-3">{f.subtitle}</p>
                <p className="text-gray-600 leading-relaxed text-sm mb-4">{f.desc}</p>
                <ul className="space-y-2">
                  {f.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-500">{checkIcon}<span>{item}</span></li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Outcome Banner */}
      <section className="py-16 bg-navy overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              What You Walk Away With
            </h2>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', title: 'Repeatable Sales Structure', desc: 'A clear framework you can use in every single interaction' },
              { icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z', title: 'Real Confidence', desc: 'Walk into any sales conversation knowing exactly what to do' },
              { icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', title: 'Sustainable Revenue', desc: 'Build predictable income through daily disciplines' },
              { icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z', title: 'Practical Experience', desc: 'Hands-on training with real customers and real scenarios' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} className="text-center">
                <motion.div
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
                  className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-colors"
                >
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                  </svg>
                </motion.div>
                <h4 className="font-semibold text-white text-sm mb-1">{item.title}</h4>
                <p className="text-white/50 text-xs">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-24 bg-cream scroll-mt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 bg-navy/5 rounded-full text-navy text-sm font-medium tracking-wider mb-4">
              CHOOSE YOUR PATH
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Training Packages
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Whether you&apos;re starting your sales career, going all-in with full immersion, or training your entire team — we have a package for you.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">

            {/* Package 1 - Starter */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={scaleIn}
              custom={0}
              whileHover={{ y: -8 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="relative bg-white rounded-3xl border-2 border-navy/10 p-8 hover:shadow-2xl flex flex-col"
            >
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-navy/5 rounded-full text-navy text-xs font-semibold tracking-wider mb-3">
                  STARTER
                </span>
                <h3 className="text-xl font-bold text-navy mb-2">
                  Sales Certification + 2-Day On-Site Training
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Get instant lifetime access to the complete SASA Professional Sales Certification Program. Includes 2 days of practical, hands-on on-site training to learn the core SASA sales methodology.
                </p>
              </div>

              <div className="mb-6">
                <div className="text-4xl font-bold text-navy">AED 1,000</div>
                <p className="text-gray-400 text-sm">One-time payment &middot; Lifetime access</p>
              </div>

              <div className="space-y-3 mb-8 flex-1">
                <p className="text-xs font-semibold text-navy/60 tracking-wider mb-2">WHAT&apos;S INCLUDED</p>
                <div className="flex items-start gap-2 text-sm text-gray-600">{checkIcon}<span>Complete 4-Foundation Sales Mastery System</span></div>
                <div className="flex items-start gap-2 text-sm text-gray-600">{checkIcon}<span>2 days of on-site hands-on training</span></div>
                <div className="flex items-start gap-2 text-sm text-gray-600">{checkIcon}<span>Law of Averages — The Mathematics</span></div>
                <div className="flex items-start gap-2 text-sm text-gray-600">{checkIcon}<span>5-Step Sales Blueprint — The Structure</span></div>
                <div className="flex items-start gap-2 text-sm text-gray-600">{checkIcon}<span>6 Impulse Factors — The Psychology</span></div>
                <div className="flex items-start gap-2 text-sm text-gray-600">{checkIcon}<span>8 Successful Working Habits — The Discipline</span></div>
                <div className="flex items-start gap-2 text-sm text-gray-600">{checkIcon}<span>Lifetime access to all course materials</span></div>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-navy/60 tracking-wider mb-2">PROGRAM OUTCOME</p>
                  <div className="flex items-start gap-2 text-sm text-gray-600">{checkIcon}<span>Clear and repeatable sales structure</span></div>
                  <div className="flex items-start gap-2 text-sm text-gray-600 mt-2">{checkIcon}<span>Strong confidence in real sales conversations</span></div>
                  <div className="flex items-start gap-2 text-sm text-gray-600 mt-2">{checkIcon}<span>Practical insights from on-site training</span></div>
                  <div className="flex items-start gap-2 text-sm text-gray-600 mt-2">{checkIcon}<span>Foundation for predictable, sustainable revenue</span></div>
                </div>
              </div>

              <motion.a
                href="https://sasa-worldwide.app.clientclub.net/courses/offers/bb29ead7-f9a0-42ad-b07f-481ee4a97cfb"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2 w-full px-8 py-4 bg-navy text-white font-semibold rounded-full hover:bg-navy/90 transition-colors text-base"
              >
                Enroll Now — AED 1,000
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.a>
            </motion.div>

            {/* Package 2 - Full On-Site (Most Popular) */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={scaleIn}
              custom={1}
              whileHover={{ y: -8 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="relative bg-navy rounded-3xl p-8 text-white shadow-2xl flex flex-col lg:scale-[1.03]"
            >
              <motion.div
                className="absolute -top-4 left-1/2 -translate-x-1/2"
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <span className="popular-badge inline-block px-4 py-1.5 bg-white text-navy text-xs font-bold tracking-wider rounded-full shadow-lg">
                  MOST POPULAR
                </span>
              </motion.div>

              <div className="mb-6 mt-2">
                <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-white/80 text-xs font-semibold tracking-wider mb-3">
                  FULL IMMERSION
                </span>
                <h3 className="text-xl font-bold mb-2">
                  Full On-Site Certification Program
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  Join a fully immersive on-site sales training program. Training takes place every single day on-site until you complete the entire SASA Professional Sales Certification and earn all required certifications. This program is not time-limited.
                </p>
              </div>

              <div className="mb-6">
                <div className="text-4xl font-bold">AED 5,000</div>
                <p className="text-white/40 text-sm">One-time payment &middot; Train until certified</p>
              </div>

              <div className="space-y-3 mb-8 flex-1">
                <p className="text-xs font-semibold text-white/40 tracking-wider mb-2">WHAT&apos;S INCLUDED</p>
                <div className="flex items-start gap-2 text-sm text-white/80">{checkIconWhite}<span>Everything in Starter Package</span></div>
                <div className="flex items-start gap-2 text-sm text-white/80">{checkIconWhite}<span>Daily on-site training until full certification</span></div>
                <div className="flex items-start gap-2 text-sm text-white/80">{checkIconWhite}<span>Face-to-face with SASA-certified trainers</span></div>
                <div className="flex items-start gap-2 text-sm text-white/80">{checkIconWhite}<span>Real-world sales experience with SASA partners</span></div>
                <div className="flex items-start gap-2 text-sm text-white/80">{checkIconWhite}<span>Live sales conversations with real customers</span></div>
                <div className="flex items-start gap-2 text-sm text-white/80">{checkIconWhite}<span>Not time-limited — train every day until you pass</span></div>
                <div className="flex items-start gap-2 text-sm text-white/80">{checkIconWhite}<span>No fixed end date — you train until you master it</span></div>

                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs font-semibold text-white/40 tracking-wider mb-2">WHAT MAKES THIS UNIQUE</p>
                  <div className="flex items-start gap-2 text-sm text-white/80">{checkIconWhite}<span>Not an online course — fully face-to-face</span></div>
                  <div className="flex items-start gap-2 text-sm text-white/80 mt-2">{checkIconWhite}<span>Train inside real sales environments</span></div>
                  <div className="flex items-start gap-2 text-sm text-white/80 mt-2">{checkIconWhite}<span>True mastery through daily execution</span></div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs font-semibold text-white/40 tracking-wider mb-2">CERTIFICATION REQUIREMENTS</p>
                  <div className="flex items-start gap-2 text-sm text-white/80">{checkIconWhite}<span>Master all four foundations</span></div>
                  <div className="flex items-start gap-2 text-sm text-white/80 mt-2">{checkIconWhite}<span>Complete all practical requirements</span></div>
                  <div className="flex items-start gap-2 text-sm text-white/80 mt-2">{checkIconWhite}<span>Earn all SASA Professional Sales Certifications</span></div>
                </div>
              </div>

              <motion.a
                href="https://sasa-worldwide.app.clientclub.net/courses/offers/b3a7c0d9-d9ac-4632-96ed-5158286cba1e"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2 w-full px-8 py-4 bg-white text-navy font-semibold rounded-full hover:bg-gray-100 transition-colors text-base"
              >
                Enroll Now — AED 5,000
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.a>
            </motion.div>

            {/* Package 3 - Corporate */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={scaleIn}
              custom={2}
              whileHover={{ y: -8 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="relative bg-white rounded-3xl border-2 border-navy/10 p-8 hover:shadow-2xl flex flex-col"
            >
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-navy/5 rounded-full text-navy text-xs font-semibold tracking-wider mb-3">
                  ENTERPRISE
                </span>
                <h3 className="text-xl font-bold text-navy mb-2">
                  Corporate Sales Training Program
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Custom-tailored training program designed for your entire sales team or organization. We bring the full SASA methodology to your company, adapted to your industry and market.
                </p>
              </div>

              <div className="mb-6">
                <div className="text-4xl font-bold text-navy">Contact Us</div>
                <p className="text-gray-400 text-sm">Custom pricing &middot; Tailored to your team</p>
              </div>

              <div className="space-y-3 mb-8 flex-1">
                <p className="text-xs font-semibold text-navy/60 tracking-wider mb-2">WHAT&apos;S INCLUDED</p>
                <div className="flex items-start gap-2 text-sm text-gray-600">{checkIcon}<span>Complete 4-Foundation System for your team</span></div>
                <div className="flex items-start gap-2 text-sm text-gray-600">{checkIcon}<span>Customized training schedule and curriculum</span></div>
                <div className="flex items-start gap-2 text-sm text-gray-600">{checkIcon}<span>On-site training at your location or SASA offices</span></div>
                <div className="flex items-start gap-2 text-sm text-gray-600">{checkIcon}<span>Dedicated SASA-certified corporate trainer</span></div>
                <div className="flex items-start gap-2 text-sm text-gray-600">{checkIcon}<span>Team performance tracking and reporting</span></div>
                <div className="flex items-start gap-2 text-sm text-gray-600">{checkIcon}<span>Custom sales playbook for your industry</span></div>
                <div className="flex items-start gap-2 text-sm text-gray-600">{checkIcon}<span>Post-training support and follow-up sessions</span></div>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-navy/60 tracking-wider mb-2">IDEAL FOR</p>
                  <div className="flex items-start gap-2 text-sm text-gray-600">{checkIcon}<span>Companies building or scaling sales teams</span></div>
                  <div className="flex items-start gap-2 text-sm text-gray-600 mt-2">{checkIcon}<span>Organizations launching new products or markets</span></div>
                  <div className="flex items-start gap-2 text-sm text-gray-600 mt-2">{checkIcon}<span>Teams standardizing their sales process</span></div>
                  <div className="flex items-start gap-2 text-sm text-gray-600 mt-2">{checkIcon}<span>Volume discounts for groups of 5+</span></div>
                </div>
              </div>

              <motion.a
                href={`https://wa.me/971545304000?text=${whatsappCorpMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2 w-full px-8 py-4 bg-navy text-white font-semibold rounded-full hover:bg-navy/90 transition-colors text-base"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Contact via WhatsApp
              </motion.a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>
          <div className="space-y-6">
            {[
              { q: 'Who is this program for?', a: "Anyone who wants to build a successful career in sales — whether you're starting fresh, switching industries, or looking to sharpen your existing skills. This program works for B2B, B2C, field sales, retail, and service-based sales." },
              { q: 'What is the difference between the Starter and Full Immersion packages?', a: 'The Starter package gives you the complete course content plus 2 days of on-site training. The Full Immersion package provides daily on-site training with SASA-certified trainers and real-world sales practice — continuing every day until you complete all certifications. There is no time limit.' },
              { q: 'How long does the Full Immersion program take?', a: 'There is no fixed duration. You train on-site every day until you have mastered all four foundations and completed all certification requirements. The pace depends entirely on your progress and commitment.' },
              { q: 'Do I get a certificate?', a: 'Yes. Upon completing the program and meeting all certification requirements, you earn the SASA Professional Sales Certification — recognized across SASA Worldwide partner companies.' },
              { q: 'Where does the on-site training take place?', a: 'On-site training takes place at SASA offices and with SASA partner companies across the UAE. For Corporate packages, we can also train at your location.' },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                whileHover={{ scale: 1.01 }}
                className="border border-navy/10 rounded-2xl p-6 hover:shadow-md transition-shadow duration-300"
              >
                <h3 className="font-bold text-navy mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-navy text-white overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Your Sales Career Starts Here
          </h2>
          <p className="text-xl text-white/80 mb-4">
            Trusted by professionals and partners of SASA Worldwide, this certification is designed to help you perform at a higher level in any sales environment.
          </p>
          <p className="text-white/50 mb-10">
            Already enrolled? Login to access your courses and continue learning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="#packages"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-navy font-semibold rounded-full hover:bg-gray-100 transition-colors"
            >
              View Packages
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </motion.a>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-colors border border-white/20"
            >
              Login to Access Courses
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
