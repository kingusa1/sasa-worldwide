'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

const tabContent = [
  {
    label: 'SALES',
    headline: 'The Performance Growth Engine',
    subheadline: 'We build, train, and deploy elite sales teams powered by discipline, systems, and AI-enabled oversight. Our field force delivers measurable results across all seven Emirates.',
    cta: { text: 'Start a Partnership', href: '/partnerships' },
    stats: [
      { value: '50K+', label: 'Daily Interactions' },
      { value: '600+', label: 'Active Clients' },
    ],
  },
  {
    label: 'LEADERSHIP',
    headline: 'Building Leaders, Scaling Businesses',
    subheadline: 'Our 5-phase leadership pathway develops talent from entry-level agents to directors. We invest in people because great leaders create exceptional results.',
    cta: { text: 'Join SASA', href: '/careers' },
    stats: [
      { value: '5', label: 'Career Phases' },
      { value: '90%', label: 'Retention Rate' },
    ],
  },
  {
    label: 'GROWTH',
    headline: 'Sales That Perform. Teams That Grow.',
    subheadline: 'Structured operations, AI-powered training, and transparent reporting drive consistent growth. We don\'t just execute—we elevate your entire sales operation.',
    cta: { text: 'Learn More', href: '/about' },
    stats: [
      { value: '$5B', label: 'Client Savings' },
      { value: '80%', label: 'Global 500' },
    ],
  },
];

export default function Hero() {
  const [activeTab, setActiveTab] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  // Auto-rotate tabs every 5 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % tabContent.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        if (rect.bottom > 0) {
          setScrollY(window.scrollY);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[100dvh] flex items-center overflow-hidden">
      {/* Background Image with Parallax */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
          transform: `translateY(${scrollY * 0.4}px) scale(1.1)`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-navy/40"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full">
        <div className="max-w-3xl">
          {/* Category Tabs */}
          <div
            className="flex items-center gap-2 md:gap-4 mb-10"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {tabContent.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`relative px-6 py-3 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${activeTab === index
                    ? 'bg-white text-navy shadow-lg scale-105'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
              >
                {tab.label}
                {activeTab === index && (
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-transparent border-t-white"></div>
                )}
              </button>
            ))}
          </div>

          {/* Dynamic Content with fade animation */}
          <div
            key={activeTab}
            className="animate-fade-in-up"
            style={{ animationDuration: '0.5s' }}
          >
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              {tabContent[activeTab].headline.split('. ').map((part, i) => (
                <span key={i}>
                  {part}
                  {i < tabContent[activeTab].headline.split('. ').length - 1 && <br />}
                </span>
              ))}
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed max-w-2xl">
              {tabContent[activeTab].subheadline}
            </p>

            {/* Stats */}
            <div className="flex gap-8 mb-10">
              {tabContent[activeTab].stats.map((stat, i) => (
                <div key={i} className="text-white">
                  <div className="text-3xl md:text-4xl font-bold">{stat.value}</div>
                  <div className="text-white/60 text-sm uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <Link
              href={tabContent[activeTab].cta.href}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-navy font-semibold rounded-full hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <span>{tabContent[activeTab].cta.text}</span>
              <span className="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 animate-bounce-slow">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/60 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}
