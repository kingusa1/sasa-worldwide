'use client';

import { useState } from 'react';
import { FormField } from '@/lib/supabase/projects';

interface ProductOption {
  name: string;
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
  price: number;
  logoUrl?: string;
  products?: ProductOption[];
}

export default function DynamicForm({
  projectId,
  salespersonId,
  formFields,
  projectName,
  price,
  logoUrl,
  products,
}: DynamicFormProps) {
  const hasMultipleProducts = products && products.length > 1;
  const [selectedProduct, setSelectedProduct] = useState<number>(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const currentPrice = hasMultipleProducts ? products[selectedProduct].price : price;

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/form/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_id: projectId,
          salesperson_id: salespersonId,
          customer_data: formData,
          selected_product_index: hasMultipleProducts ? selectedProduct : 0,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form');
      }

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      setSubmitError(error.message || 'An error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const commonClasses = 'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-navy focus:ring-navy sm:text-sm';
    const errorClasses = errors[field.name] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '';

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            id={field.name}
            name={field.name}
            rows={4}
            required={field.required}
            placeholder={field.placeholder}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className={`${commonClasses} ${errorClasses}`}
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
            className={`${commonClasses} ${errorClasses}`}
            disabled={isSubmitting}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
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
            placeholder={field.placeholder}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className={`${commonClasses} ${errorClasses}`}
            disabled={isSubmitting}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-navy px-6 py-8 sm:px-10">
            <div className="flex items-center justify-center">
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt={projectName}
                  className="h-16 w-auto object-contain mr-4"
                />
              )}
              <div className="text-center">
                <h1 className="text-3xl font-bold text-white">{projectName}</h1>
                {!hasMultipleProducts && (
                  <p className="mt-2 text-lg text-gray-200">
                    AED {currentPrice.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-8 sm:px-10">
            {/* Product Selection for multiple products */}
            {hasMultipleProducts && (
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Your Plan *
                </label>
                <div className="space-y-3">
                  {products.map((product, index) => (
                    <label
                      key={index}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedProduct === index
                          ? 'border-navy bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="product_selection"
                          checked={selectedProduct === index}
                          onChange={() => setSelectedProduct(index)}
                          className="h-4 w-4 text-navy focus:ring-navy border-gray-300"
                          disabled={isSubmitting}
                        />
                        <span className={`ml-3 font-medium ${
                          selectedProduct === index ? 'text-navy' : 'text-gray-700'
                        }`}>
                          {product.name}
                        </span>
                      </div>
                      <span className={`text-lg font-bold ${
                        selectedProduct === index ? 'text-navy' : 'text-gray-500'
                      }`}>
                        AED {product.price.toFixed(2)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-6">
              {formFields.map((field) => (
                <div key={field.name}>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderField(field)}
                  {errors[field.name] && (
                    <p className="mt-1 text-sm text-red-600">{errors[field.name]}</p>
                  )}
                </div>
              ))}
            </div>

            {submitError && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">{submitError}</p>
              </div>
            )}

            <div className="mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-navy hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </div>
                ) : (
                  `Pay AED ${currentPrice.toFixed(2)}`
                )}
              </button>
            </div>

            <p className="mt-4 text-xs text-center text-gray-500">
              Secure payment powered by Stripe
            </p>
          </form>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Powered by{' '}
            <a
              href="https://sasa-worldwide.com"
              className="text-navy font-medium hover:underline"
            >
              SASA Worldwide
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
