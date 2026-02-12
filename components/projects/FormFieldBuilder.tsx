'use client';
import { useState } from 'react';

interface FormField {
  name: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'number' | 'date';
  label: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

interface Props {
  fields: FormField[];
  onChange: (fields: FormField[]) => void;
}

export default function FormFieldBuilder({ fields, onChange }: Props) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addField = () => {
    onChange([...fields, {
      name: `field_${Date.now()}`,
      type: 'text',
      label: 'New Field',
      required: false
    }]);
    setEditingIndex(fields.length);
  };

  const updateField = (index: number, updates: Partial<FormField>) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updates };
    onChange(newFields);
  };

  const removeField = (index: number) => {
    onChange(fields.filter((_, i) => i !== index));
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === fields.length - 1) return;
    const newFields = [...fields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];
    onChange(newFields);
  };

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div key={index} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <input
                type="text"
                value={field.label}
                onChange={(e) => updateField(index, { label: e.target.value })}
                className="text-sm font-medium border-none bg-transparent focus:ring-0 p-0"
                placeholder="Field Label"
              />
            </div>
            <div className="flex space-x-2">
              <button type="button" onClick={() => moveField(index, 'up')} disabled={index === 0} className="text-gray-400 hover:text-gray-600 disabled:opacity-30">↑</button>
              <button type="button" onClick={() => moveField(index, 'down')} disabled={index === fields.length - 1} className="text-gray-400 hover:text-gray-600 disabled:opacity-30">↓</button>
              <button type="button" onClick={() => removeField(index)} className="text-red-400 hover:text-red-600">✕</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Field Name</label>
              <input
                type="text"
                value={field.name}
                onChange={(e) => updateField(index, { name: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_') })}
                className="w-full text-xs border-gray-300 rounded p-1"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Type</label>
              <select
                value={field.type}
                onChange={(e) => updateField(index, { type: e.target.value as any })}
                className="w-full text-xs border-gray-300 rounded p-1"
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="tel">Phone</option>
                <option value="textarea">Textarea</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Placeholder</label>
              <input
                type="text"
                value={field.placeholder || ''}
                onChange={(e) => updateField(index, { placeholder: e.target.value })}
                className="w-full text-xs border-gray-300 rounded p-1"
              />
            </div>
            <div className="flex items-center pt-5">
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => updateField(index, { required: e.target.checked })}
                className="h-4 w-4 text-navy focus:ring-navy border-gray-300 rounded"
              />
              <label className="ml-2 text-xs text-gray-600">Required</label>
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addField}
        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-sm text-gray-600 hover:border-gray-400 hover:text-gray-700"
      >
        + Add Field
      </button>
    </div>
  );
}
