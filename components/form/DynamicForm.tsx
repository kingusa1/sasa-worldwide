'use client';

import { useState } from 'react';
import { FormField } from '@/lib/supabase/projects';
import { StripeCheckoutEmbed } from './StripeCheckoutEmbed';

interface ProductOption {
  name: string;
  description?: string;
  price: number;
  stripe_price_id?: string;
  cost_of_goods?: number;
  commission_rate?: number;
}

interface DynamicFormProps {
  projectId: string;
  salespersonId: string;
  formFields: FormField[];
  projectName: string;
  projectDescription?: string;
  price: number;
  logoUrl?: string;
  products?: ProductOption[];
  salespersonName?: string;
  stripePublishableKey?: string;
}

export default function DynamicForm({
  projectId,
  salespersonId,
  formFields,
  projectName,
  projectDescription,
  price,
  logoUrl,
  products,
  salespersonName,
  stripePublishableKey,
}: DynamicFormProps) {
  const hasMultipleProducts = products && products.length > 1;
  const [selectedProduct, setSelectedProduct] = useState<number>(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Step 2: payment
  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const currentProduct = hasMultipleProducts ? products![selectedProduct] : null;
  const currentPrice = currentProduct ? currentProduct.price : price;
  const currentProductName = currentProduct ? currentProduct.name : projectName;

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    formFields.forEach((field) => {
      if (field.required && !formData[field.name]?.trim()) {
        newErrors[field.name] = `${field.label} is required`;
      }
      if (field.type === 'email' && formData[field.name]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.name])) {
          newErrors[field.name] = 'Please enter a valid email address';
        }
      }
      if (field.type === 'tel' && formData[field.name]) {
        const phoneRegex = /^[+]?[\d\s\-()]+$/;
        if (!phoneRegex.test(formData[field.name])) {
          newErrors[field.name] = 'Please enter a valid phone number';
        }
      }
    });

    if (!agreedToTerms) {
      newErrors['terms'] = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/form/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projectId,
          salesperson_id: salespersonId,
          customer_data: formData,
          selected_product_index: hasMultipleProducts ? selectedProduct : 0,
          ui_mode: 'embedded',
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to submit form');

      if (data.client_secret) {
        setClientSecret(data.client_secret);
        setStep('payment');
      } else {
        throw new Error('Payment setup failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      setSubmitError(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pair fields into two-column layout (textareas and selects get full width)
  const pairedFields: Array<FormField[]> = [];
  let currentPair: FormField[] = [];
  formFields.forEach((field) => {
    if (field.type === 'textarea' || field.type === 'select') {
      if (currentPair.length > 0) {
        pairedFields.push([...currentPair]);
        currentPair = [];
      }
      pairedFields.push([field]);
    } else {
      currentPair.push(field);
      if (currentPair.length === 2) {
        pairedFields.push([...currentPair]);
        currentPair = [];
      }
    }
  });
  if (currentPair.length > 0) pairedFields.push(currentPair);

  const inputClasses = 'w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#002E59] focus:border-transparent outline-none transition-all';
  const errorInputClasses = 'border-red-400 focus:ring-red-400';

  const renderField = (field: FormField) => {
    const hasError = !!errors[field.name];

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            id={field.name}
            name={field.name}
            rows={3}
            required={field.required}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className={`${inputClasses} ${hasError ? errorInputClasses : ''}`}
            disabled={isSubmitting}
          />
        );
      case 'select':
        return (
          <select
            id={field.name}
            name={field.name}
            required={field.required}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className={`${inputClasses} ${hasError ? errorInputClasses : ''}`}
            disabled={isSubmitting}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      default:
        return (
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            required={field.required}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className={`${inputClasses} ${hasError ? errorInputClasses : ''}`}
            disabled={isSubmitting}
          />
        );
    }
  };

  // Payment step - show embedded checkout
  if (step === 'payment' && clientSecret) {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-[#002E59] text-white">
          <div className="max-w-3xl mx-auto px-4 py-6">
            <div className="flex items-center gap-4">
              {logoUrl && (
                <img src={logoUrl} alt={projectName} className="h-10 object-contain brightness-0 invert" />
              )}
              <div>
                <h1 className="text-xl font-bold">{projectName}</h1>
                <p className="text-blue-200 text-sm">Complete your payment</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8">
          <button
            onClick={() => { setStep('details'); setClientSecret(null); }}
            className="mb-6 text-sm text-[#002E59] hover:underline flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to details
          </button>

          {/* Order Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Order Summary</h3>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-700">{currentProductName}</span>
              <span className="font-semibold">AED {currentPrice.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 mt-2 pt-3 flex justify-between items-center">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-xl font-bold text-[#002E59]">AED {currentPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Embedded Checkout */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <StripeCheckoutEmbed clientSecret={clientSecret} publishableKey={stripePublishableKey || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''} />
          </div>

          <p className="mt-6 text-center text-xs text-gray-400">
            Secure payment powered by Stripe
          </p>
        </div>
      </div>
    );
  }

  // Details step
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-[#002E59] text-white">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10">
          <div className="flex items-center gap-5">
            {logoUrl && (
              <img src={logoUrl} alt={projectName} className="h-14 object-contain brightness-0 invert" />
            )}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">{projectName}</h1>
              {projectDescription && (
                <p className="text-blue-200 text-sm mt-1">{projectDescription}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleContinueToPayment}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Customer Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Details */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#002E59] text-white text-xs font-bold">1</span>
                  Your Details
                </h2>

                <div className="space-y-4">
                  {pairedFields.map((pair, pairIndex) => (
                    <div
                      key={pairIndex}
                      className={pair.length === 2 ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : ''}
                    >
                      {pair.map((field) => (
                        <div key={field.name}>
                          <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1.5">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          {renderField(field)}
                          {errors[field.name] && (
                            <p className="mt-1 text-xs text-red-500">{errors[field.name]}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Selection */}
              {hasMultipleProducts && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#002E59] text-white text-xs font-bold">2</span>
                    Select Your Plan
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {products!.map((product, index) => (
                      <button
                        type="button"
                        key={index}
                        onClick={() => setSelectedProduct(index)}
                        disabled={isSubmitting}
                        className={`relative p-5 rounded-xl border-2 text-left transition-all ${
                          selectedProduct === index
                            ? 'border-[#002E59] bg-blue-50 ring-1 ring-[#002E59]'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {selectedProduct === index && (
                          <div className="absolute top-3 right-3">
                            <svg className="w-5 h-5 text-[#002E59]" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                        <p className={`font-semibold text-base ${selectedProduct === index ? 'text-[#002E59]' : 'text-gray-900'}`}>
                          {product.name}
                        </p>
                        {product.description && (
                          <p className="text-xs text-gray-500 mt-1">{product.description}</p>
                        )}
                        <p className={`text-xl font-bold mt-3 ${selectedProduct === index ? 'text-[#002E59]' : 'text-gray-700'}`}>
                          AED {product.price.toFixed(2)}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-8">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Order Summary</h3>

                {/* Product Info */}
                <div className="space-y-3 pb-4 border-b border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{currentProductName}</span>
                    <span className="text-gray-900 font-medium">AED {currentPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-4 pb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-[#002E59]">AED {currentPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Terms */}
                <div className="mb-5">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => {
                        setAgreedToTerms(e.target.checked);
                        if (errors['terms']) {
                          setErrors((prev) => { const n = { ...prev }; delete n['terms']; return n; });
                        }
                      }}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#002E59] focus:ring-[#002E59]"
                      disabled={isSubmitting}
                    />
                    <span className="text-xs text-gray-600 leading-relaxed">
                      I agree to the{' '}
                      <a href="/terms" target="_blank" className="text-[#002E59] underline">Terms & Conditions</a>
                      {' '}and{' '}
                      <a href="/privacy" target="_blank" className="text-[#002E59] underline">Privacy Policy</a>
                    </span>
                  </label>
                  {errors['terms'] && (
                    <p className="mt-1 text-xs text-red-500">{errors['terms']}</p>
                  )}
                </div>

                {/* Submit Error */}
                {submitError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-xs text-red-700">{submitError}</p>
                  </div>
                )}

                {/* Continue Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 bg-[#002E59] text-white rounded-xl font-semibold text-sm hover:bg-[#001f3f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      Continue to Payment
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </>
                  )}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secure payment powered by Stripe
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-10 text-center text-sm text-gray-500">
          <p>
            Powered by{' '}
            <a href="https://sasa-worldwide.com" className="text-[#002E59] font-medium hover:underline">
              SASA Worldwide
            </a>
          </p>
          {salespersonName && (
            <p className="mt-1">
              Your sales representative: {salespersonName}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
