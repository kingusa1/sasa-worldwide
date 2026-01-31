'use client';

import { useState, useCallback } from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import PhoneInput from '@/components/ui/PhoneInput';
import Toast from '@/components/ui/Toast';

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
}

export default function CTA() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '+971 ',
    company: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false,
  });

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterError, setNewsletterError] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (optional but if provided, must be valid)
    const phoneNumber = formData.phone.replace(/^\+\d+\s*/, '').trim();
    if (phoneNumber && phoneNumber.length < 7) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setToast({
          message: result.message || 'Your message has been sent successfully!',
          type: 'success',
          isVisible: true,
        });
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '+971 ',
          company: '',
          message: '',
        });
        setErrors({});
      } else {
        setToast({
          message: result.error || 'Failed to send message. Please try again.',
          type: 'error',
          isVisible: true,
        });
      }
    } catch {
      setToast({
        message: 'An error occurred. Please try again later.',
        type: 'error',
        isVisible: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handlePhoneChange = (value: string) => {
    setFormData({ ...formData, phone: value });
    if (errors.phone) {
      setErrors({ ...errors, phone: undefined });
    }
  };

  // Newsletter handlers
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newsletterEmail.trim()) {
      setNewsletterError('Email is required');
      return;
    }
    if (!emailRegex.test(newsletterEmail)) {
      setNewsletterError('Please enter a valid email address');
      return;
    }

    setIsSubscribing(true);
    setNewsletterError('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newsletterEmail }),
      });

      const result = await response.json();

      if (result.success) {
        setToast({
          message: result.message || 'Thank you for subscribing!',
          type: 'success',
          isVisible: true,
        });
        setNewsletterEmail('');
      } else {
        setToast({
          message: result.error || 'Failed to subscribe. Please try again.',
          type: 'error',
          isVisible: true,
        });
      }
    } catch {
      setToast({
        message: 'An error occurred. Please try again later.',
        type: 'error',
        isVisible: true,
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <section className="py-24 bg-cream">
      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />

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
                        Your name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. John Smith"
                        disabled={isSubmitting}
                        className={`w-full px-4 py-3 border rounded-xl transition-all focus:outline-none focus:ring-1 ${
                          errors.name
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-200 focus:border-navy focus:ring-navy'
                        } ${isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. john@email.com"
                        disabled={isSubmitting}
                        className={`w-full px-4 py-3 border rounded-xl transition-all focus:outline-none focus:ring-1 ${
                          errors.email
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-200 focus:border-navy focus:ring-navy'
                        } ${isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone number
                      </label>
                      <PhoneInput
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        disabled={isSubmitting}
                        error={errors.phone}
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
                        disabled={isSubmitting}
                        className={`w-full px-4 py-3 border rounded-xl transition-all focus:outline-none focus:ring-1 border-gray-200 focus:border-navy focus:ring-navy ${
                          isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Type here ..."
                      rows={4}
                      disabled={isSubmitting}
                      className={`w-full px-4 py-3 border rounded-xl transition-all focus:outline-none focus:ring-1 resize-none ${
                        errors.message
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-200 focus:border-navy focus:ring-navy'
                      } ${isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    ></textarea>
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`btn-primary ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      'Send'
                    )}
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
            <form onSubmit={handleNewsletterSubmit} className="w-full md:w-auto">
              <div className="flex gap-4">
                <div className="flex-1 md:w-80">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => {
                      setNewsletterEmail(e.target.value);
                      if (newsletterError) setNewsletterError('');
                    }}
                    placeholder="Your email address"
                    disabled={isSubscribing}
                    className={`w-full px-4 py-3 border rounded-xl transition-all focus:outline-none focus:ring-1 ${
                      newsletterError
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-200 focus:border-navy focus:ring-navy'
                    } ${isSubscribing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  />
                  {newsletterError && (
                    <p className="mt-1 text-sm text-red-600">{newsletterError}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className={`w-12 h-12 rounded-full bg-navy text-white flex items-center justify-center hover:bg-navy-700 hover:scale-105 transition-all flex-shrink-0 ${
                    isSubscribing ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubscribing ? (
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
