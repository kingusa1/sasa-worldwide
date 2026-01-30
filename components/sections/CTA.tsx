'use client';

import { useState } from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function CTA() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="bg-white rounded-3xl shadow-card overflow-hidden">
            <div className="grid lg:grid-cols-2">
              {/* Form Side */}
              <div className="p-10 lg:p-16">
                <span className="section-badge mb-4">CONTACT US</span>
                <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
                  Let&apos;s Connect
                </h2>
                <p className="text-gray-600 mb-10">
                  Connect with our experts for a free consultation and tailored solutions.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. John Smith"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. john@email.com"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. +1 222 444 66"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company name
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="e.g. Execor"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Type here ..."
                      rows={4}
                      className="w-full resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Send
                  </button>
                </form>
              </div>

              {/* Image & Contact Info Side */}
              <div className="relative min-h-[500px] lg:min-h-0">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/60 to-navy/90"></div>
                </div>

                {/* Content Wrapper with Flexbox for proper spacing */}
                <div className="relative h-full flex flex-col justify-between p-8 lg:p-12">
                  {/* Top Content */}
                  <div>
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Get Started Today
                    </span>
                    <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 leading-tight">
                      Ready to Transform<br />Your Sales?
                    </h3>
                    <p className="text-white/80 leading-relaxed text-sm lg:text-base">
                      Partner with UAE&apos;s leading sales operations company. We deliver measurable results through elite field teams, AI-powered systems, and proven methodologies.
                    </p>

                    {/* Benefits Pills */}
                    <div className="mt-6 flex flex-col gap-3">
                      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <span className="text-white font-medium text-sm">Free Consultation</span>
                          <p className="text-white/60 text-xs">No cost, no commitment assessment</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <span className="text-white font-medium text-sm">24-Hour Response</span>
                          <p className="text-white/60 text-xs">We respond within one business day</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <div>
                          <span className="text-white font-medium text-sm">No Obligations</span>
                          <p className="text-white/60 text-xs">Explore options with zero pressure</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Contact Info */}
                  <div className="mt-8 pt-6 border-t border-white/20">
                    <div className="flex items-center gap-4">
                      <a
                        href="tel:+97145843777"
                        className="w-14 h-14 rounded-full bg-white flex items-center justify-center flex-shrink-0 hover:scale-110 transition-all shadow-lg"
                      >
                        <svg className="w-6 h-6 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </a>
                      <div>
                        <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Call us directly</p>
                        <a
                          href="tel:+97145843777"
                          className="text-xl font-bold text-white hover:underline"
                        >
                          +971 4 584 3777
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Newsletter */}
        <ScrollReveal delay={200}>
          <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-lg font-semibold text-navy mb-2">
                Subscribe to SASA Worldwide Insights
              </h3>
              <p className="text-gray-600 text-sm">
                our monthly look at the critical issues facing global businesses.
              </p>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 md:w-80"
              />
              <button className="w-12 h-12 rounded-full bg-navy text-white flex items-center justify-center hover:bg-navy-700 hover:scale-105 transition-all flex-shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
