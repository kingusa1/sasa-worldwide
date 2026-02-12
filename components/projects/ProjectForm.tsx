'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormFieldBuilder from './FormFieldBuilder';

interface FormField {
  name: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'number' | 'date';
  label: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export default function ProjectForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    project_type: 'vouchers',
    description: '',
    price: '',
    cost_of_goods: '',
    commission_rate: '10',
    status: 'draft',
  });
  const [formFields, setFormFields] = useState<FormField[]>([
    { name: 'name', type: 'text', label: 'Full Name', required: true },
    { name: 'email', type: 'email', label: 'Email Address', required: true },
    { name: 'phone', type: 'tel', label: 'Phone Number', required: true },
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'name') {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      setFormData({ ...formData, name: value, slug });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      if (!formData.name || !formData.slug || !formData.price) throw new Error('Please fill in all required fields');
      if (formFields.length === 0) throw new Error('Please add at least one form field');
      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          cost_of_goods: parseFloat(formData.cost_of_goods || '0'),
          commission_rate: parseFloat(formData.commission_rate),
          form_fields: formFields,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create project');
      router.push(`/admin/projects/${data.project.id}`);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white shadow rounded-lg p-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Project Name *</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-navy focus:ring-navy" placeholder="CAFU Vouchers 2026" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">URL Slug *</label>
            <input type="text" name="slug" required value={formData.slug} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-navy focus:ring-navy" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Project Type *</label>
            <select name="project_type" required value={formData.project_type} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-navy focus:ring-navy">
              <option value="vouchers">Vouchers</option>
              <option value="real_estate">Real Estate</option>
              <option value="services">Services</option>
              <option value="products">Products</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status *</label>
            <select name="status" required value={formData.status} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-navy focus:ring-navy">
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" rows={3} value={formData.description} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-navy focus:ring-navy" />
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 pt-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Pricing & Commission</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Price (AED) *</label>
            <input type="number" name="price" required min="0" step="0.01" value={formData.price} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-navy focus:ring-navy" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cost of Goods (AED)</label>
            <input type="number" name="cost_of_goods" min="0" step="0.01" value={formData.cost_of_goods} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-navy focus:ring-navy" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Commission Rate (%)</label>
            <input type="number" name="commission_rate" min="0" max="100" step="0.01" value={formData.commission_rate} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-navy focus:ring-navy" />
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 pt-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Form Fields *</h2>
        <FormFieldBuilder fields={formFields} onChange={setFormFields} />
      </div>
      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-md"><p className="text-sm text-red-800">{error}</p></div>}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button type="button" onClick={() => router.back()} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-navy hover:bg-blue-900 disabled:opacity-50">{isSubmitting ? 'Creating...' : 'Create Project'}</button>
      </div>
    </form>
  );
}
