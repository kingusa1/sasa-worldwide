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

interface ProductEntry {
  name: string;
  price: string;
  cost_of_goods: string;
  commission_rate: string;
  stripe_product_id?: string;
  stripe_price_id?: string;
}

interface ProjectFormProps {
  initialData?: {
    name: string;
    slug: string;
    project_type: string;
    description: string | null;
    price: number;
    cost_of_goods: number;
    commission_rate: number;
    status: string;
    form_fields: FormField[];
    products?: Array<{
      name: string;
      price: number;
      cost_of_goods: number;
      commission_rate: number;
      stripe_product_id?: string;
      stripe_price_id?: string;
    }>;
  };
  projectId?: string;
}

function initProducts(initialData?: ProjectFormProps['initialData']): ProductEntry[] {
  if (initialData?.products && initialData.products.length > 0) {
    return initialData.products.map((p) => ({
      name: p.name,
      price: p.price.toString(),
      cost_of_goods: (p.cost_of_goods || 0).toString(),
      commission_rate: (p.commission_rate || 10).toString(),
      stripe_product_id: p.stripe_product_id,
      stripe_price_id: p.stripe_price_id,
    }));
  }
  return [{
    name: initialData?.name || '',
    price: initialData?.price?.toString() || '',
    cost_of_goods: initialData?.cost_of_goods?.toString() || '',
    commission_rate: initialData?.commission_rate?.toString() || '10',
  }];
}

export default function ProjectForm({ initialData, projectId }: ProjectFormProps = {}) {
  const isEditMode = !!projectId;
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    project_type: initialData?.project_type || 'vouchers',
    description: initialData?.description || '',
    status: initialData?.status || 'draft',
  });
  const [products, setProducts] = useState<ProductEntry[]>(initProducts(initialData));
  const [formFields, setFormFields] = useState<FormField[]>(
    initialData?.form_fields || [
      { name: 'name', type: 'text', label: 'Full Name', required: true },
      { name: 'email', type: 'email', label: 'Email Address', required: true },
      { name: 'phone', type: 'tel', label: 'Phone Number', required: true },
    ]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'name' && !isEditMode) {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      setFormData({ ...formData, name: value, slug });
    }
  };

  const handleProductChange = (index: number, field: keyof ProductEntry, value: string) => {
    const updated = [...products];
    updated[index] = { ...updated[index], [field]: value };
    setProducts(updated);
  };

  const addProduct = () => {
    setProducts([...products, { name: '', price: '', cost_of_goods: '', commission_rate: '10' }]);
  };

  const removeProduct = (index: number) => {
    if (products.length <= 1) return;
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setWarning(null);
    setIsSubmitting(true);
    try {
      if (!formData.name || !formData.slug) throw new Error('Please fill in all required fields');
      if (formFields.length === 0) throw new Error('Please add at least one form field');
      if (products.length === 0) throw new Error('Please add at least one product');

      for (const p of products) {
        if (!p.name || !p.price || parseFloat(p.price) <= 0) {
          throw new Error(`Product "${p.name || 'unnamed'}" needs a name and valid price`);
        }
      }

      const url = isEditMode ? `/api/admin/projects/${projectId}` : '/api/admin/projects';
      const method = isEditMode ? 'PUT' : 'POST';

      const productsPayload = products.map((p) => ({
        name: p.name,
        price: parseFloat(p.price),
        cost_of_goods: parseFloat(p.cost_of_goods || '0'),
        commission_rate: parseFloat(p.commission_rate || '10'),
        stripe_product_id: p.stripe_product_id || undefined,
        stripe_price_id: p.stripe_price_id || undefined,
      }));

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: productsPayload[0].price,
          cost_of_goods: productsPayload[0].cost_of_goods,
          commission_rate: productsPayload[0].commission_rate,
          products: productsPayload,
          form_fields: formFields,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || (isEditMode ? 'Failed to update project' : 'Failed to create project'));
      if (data.warning) setWarning(data.warning);
      router.push(`/admin/projects/${isEditMode ? projectId : data.project.id}`);
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
            <input type="text" name="slug" required value={formData.slug} onChange={handleChange} disabled={isEditMode} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-navy focus:ring-navy ${isEditMode ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
            {isEditMode && <p className="mt-1 text-xs text-gray-500">Slug cannot be changed (used in QR codes)</p>}
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

      {/* Products Section */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Products & Pricing *</h2>
          <button
            type="button"
            onClick={addProduct}
            className="inline-flex items-center px-3 py-1.5 border border-navy text-navy rounded-md text-sm font-medium hover:bg-navy hover:text-white transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </button>
        </div>

        <div className="space-y-4">
          {products.map((product, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">
                  Product {index + 1}
                  {index === 0 && <span className="ml-2 text-xs text-navy bg-blue-50 px-2 py-0.5 rounded">Primary</span>}
                </span>
                {products.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProduct(index)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <div className="sm:col-span-4">
                  <label className="block text-sm font-medium text-gray-700">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={product.name}
                    onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-navy focus:ring-navy"
                    placeholder="e.g. 12 Month Plan, Standard Package"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price (AED) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={product.price}
                    onChange={(e) => handleProductChange(index, 'price', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-navy focus:ring-navy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cost of Goods (AED)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={product.cost_of_goods}
                    onChange={(e) => handleProductChange(index, 'cost_of_goods', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-navy focus:ring-navy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Commission (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={product.commission_rate}
                    onChange={(e) => handleProductChange(index, 'commission_rate', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-navy focus:ring-navy"
                  />
                </div>
              </div>
              {product.stripe_product_id && (
                <p className="mt-2 text-xs text-green-600">Stripe connected: {product.stripe_product_id}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Form Fields *</h2>
        <FormFieldBuilder fields={formFields} onChange={setFormFields} />
      </div>
      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-md"><p className="text-sm text-red-800">{error}</p></div>}
      {warning && <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md"><p className="text-sm text-yellow-800">{warning}</p></div>}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button type="button" onClick={() => router.back()} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-navy hover:bg-blue-900 disabled:opacity-50">{isSubmitting ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Project' : 'Create Project')}</button>
      </div>
    </form>
  );
}
