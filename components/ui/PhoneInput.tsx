'use client';

import { useState } from 'react';

const countryCodes = [
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+974', country: 'Qatar', flag: '🇶🇦' },
  { code: '+973', country: 'Bahrain', flag: '🇧🇭' },
  { code: '+968', country: 'Oman', flag: '🇴🇲' },
  { code: '+965', country: 'Kuwait', flag: '🇰🇼' },
  { code: '+20', country: 'Egypt', flag: '🇪🇬' },
  { code: '+962', country: 'Jordan', flag: '🇯🇴' },
  { code: '+961', country: 'Lebanon', flag: '🇱🇧' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+92', country: 'Pakistan', flag: '🇵🇰' },
  { code: '+63', country: 'Philippines', flag: '🇵🇭' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+1', country: 'USA/Canada', flag: '🇺🇸' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+39', country: 'Italy', flag: '🇮🇹' },
  { code: '+34', country: 'Spain', flag: '🇪🇸' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  required?: boolean;
}

export default function PhoneInput({ value, onChange, disabled, error, required }: PhoneInputProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Parse current value to extract country code and number
  const getSelectedCode = () => {
    for (const country of countryCodes) {
      if (value.startsWith(country.code)) {
        return country;
      }
    }
    return countryCodes[0]; // Default to UAE
  };

  const selectedCountry = getSelectedCode();
  const phoneNumber = value.replace(selectedCountry.code, '').trim();

  const handleCodeSelect = (code: string) => {
    onChange(code + ' ' + phoneNumber);
    setIsOpen(false);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = e.target.value.replace(/[^\d\s]/g, '');
    onChange(selectedCountry.code + ' ' + newNumber);
  };

  return (
    <div className="relative">
      <div className={`flex border rounded-xl overflow-hidden transition-all ${error ? 'border-red-300 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500' : 'border-gray-200 focus-within:border-navy focus-within:ring-1 focus-within:ring-navy'} ${disabled ? 'bg-gray-100' : 'bg-white'}`}>
        {/* Country Code Selector */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className="flex items-center gap-1 px-3 py-3 bg-gray-50 border-r border-gray-200 hover:bg-gray-100 transition-colors disabled:cursor-not-allowed disabled:hover:bg-gray-50"
        >
          <span className="text-lg">{selectedCountry.flag}</span>
          <span className="text-sm font-medium text-gray-700">{selectedCountry.code}</span>
          <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Phone Number Input */}
        <input
          type="tel"
          value={phoneNumber}
          onChange={handleNumberChange}
          disabled={disabled}
          required={required}
          placeholder="50 123 4567"
          className="flex-1 px-4 py-3 border-0 focus:outline-none focus:ring-0 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
            {countryCodes.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => handleCodeSelect(country.code)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${selectedCountry.code === country.code ? 'bg-navy/5' : ''}`}
              >
                <span className="text-lg">{country.flag}</span>
                <span className="text-sm font-medium text-gray-900">{country.country}</span>
                <span className="text-sm text-gray-500 ml-auto">{country.code}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
