'use client';

import { useState, useCallback } from 'react';
import { ContactFormData, ContactResponse } from '@/types/contact';
import PhoneInput from '@/components/ui/PhoneInput';
import Toast from '@/components/ui/Toast';

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '+971 ',
    company: '',
    service: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false,
  });

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
    const phoneDigits = formData.phone?.replace(/\D/g, '') || '';
    if (formData.phone && formData.phone.trim() !== '+971' && phoneDigits.length < 7) {
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
      setToast({
        message: 'Please fix the errors in the form',
        type: 'error',
        isVisible: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data: ContactResponse = await response.json();

      if (data.success) {
        setToast({
          message: 'Your message has been sent successfully! We will get back to you soon.',
          type: 'success',
          isVisible: true,
        });
        setFormData({ name: '', email: '', phone: '+971 ', company: '', service: '', message: '' });
        setErrors({});
      } else {
        setToast({
          message: data.error || 'Something went wrong. Please try again.',
          type: 'error',
          isVisible: true,
        });
      }
    } catch {
      setToast({
        message: 'Failed to send message. Please check your connection and try again.',
        type: 'error',
        isVisible: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  return (
    <div className="bg-white">
      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-navy text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <span className="section-badge bg-white/10 border-white/20 text-white mb-6">Get in Touch</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Let&apos;s Start a Partnership
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Ready to transform your sales operations? Get in touch with our team
              and let&apos;s discuss how we can help you achieve your goals.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-card">
              <h2 className="text-2xl font-bold text-navy mb-2">Send us a message</h2>
              <p className="text-gray-500 mb-8">Fill out the form and our team will get back to you within 24 hours.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isLoading}
                      placeholder="e.g. John Smith"
                      className={errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isLoading}
                      placeholder="e.g. john@company.com"
                      className={errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <PhoneInput
                      value={formData.phone || '+971 '}
                      onChange={handlePhoneChange}
                      disabled={isLoading}
                      error={errors.phone}
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      disabled={isLoading}
                      placeholder="e.g. Your Company"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                    Service Interested In
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select a service</option>
                    <option value="b2c">B2C Residential</option>
                    <option value="b2b">B2B Corporate</option>
                    <option value="b2b2c">B2B2C Hybrid</option>
                    <option value="b2g">B2G Government</option>
                    <option value="other">Other / General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    disabled={isLoading}
                    rows={5}
                    placeholder="Tell us about your sales goals and how we can help..."
                    className={`resize-none disabled:bg-gray-100 disabled:cursor-not-allowed ${errors.message ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-navy mb-2">Contact Information</h2>
                <p className="text-gray-500">Reach out to us directly or visit our office.</p>
              </div>

              {/* Address */}
              <a
                href="https://maps.google.com/?q=Prime+Business+Center+Tower+A+Jumeirah+Village+Circle+Dubai+UAE"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-2xl p-6 shadow-card hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-navy/10 flex items-center justify-center text-navy flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-navy font-semibold mb-1">Office Address</h3>
                    <p className="text-gray-600">Prime Business Center, Tower A</p>
                    <p className="text-gray-600">Office A1201, JVC</p>
                    <p className="text-gray-600">Dubai, UAE</p>
                    <p className="text-navy text-sm mt-2 font-medium">Click to open in Maps →</p>
                  </div>
                </div>
              </a>

              {/* Email */}
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-navy/10 flex items-center justify-center text-navy flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-navy font-semibold mb-1">Email</h3>
                    <a href="mailto:info@sasa-worldwide.com" className="text-navy hover:underline">
                      info@sasa-worldwide.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <a
                href="tel:+97145843777"
                className="block bg-white rounded-2xl p-6 shadow-card hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-navy/10 flex items-center justify-center text-navy flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-navy font-semibold mb-1">Phone</h3>
                    <p className="text-gray-600">+971 4 584 3777</p>
                    <p className="text-navy text-sm mt-2 font-medium">Click to call →</p>
                  </div>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/971545304000"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-2xl p-6 shadow-card hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600 flex-shrink-0">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-navy font-semibold mb-1">WhatsApp</h3>
                    <p className="text-gray-600">Chat with us instantly</p>
                    <p className="text-green-600 text-sm mt-2 font-medium">Open WhatsApp →</p>
                  </div>
                </div>
              </a>

              {/* Business Hours */}
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-navy/10 flex items-center justify-center text-navy flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-navy font-semibold mb-1">Business Hours</h3>
                    <p className="text-gray-600">Sunday - Thursday: 9AM - 6PM</p>
                    <p className="text-gray-600">Friday - Saturday: Closed</p>
                  </div>
                </div>
              </div>

              {/* Google Map */}
              <a
                href="https://maps.google.com/?q=Prime+Business+Centre+Tower+A,Jumeirah+Village+Circle,Dubai,UAE"
                target="_blank"
                rel="noopener noreferrer"
                className="relative h-64 rounded-2xl overflow-hidden shadow-card block group"
              >
                <iframe
                  src="https://maps.google.com/maps?q=Prime%20Business%20Centre%20Tower%20A%2C%20Jumeirah%20Village%20Circle%2C%20Dubai&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, pointerEvents: 'none' }}
                  loading="lazy"
                  title="SASA Worldwide Office - Prime Business Center Tower A, JVC Dubai"
                ></iframe>
                <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/10 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white px-4 py-2 rounded-full text-navy font-medium text-sm shadow-lg">
                    Open in Google Maps
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
