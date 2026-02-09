'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef, useCallback } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  {
    href: '/about',
    label: 'About',
    submenu: [
      { href: '/about', label: 'Who We Are' },
      { href: '/about/mission', label: 'Mission & Vision' },
      { href: '/about/leadership', label: 'Leadership' },
    ]
  },
  {
    href: '/services',
    label: 'Services',
    submenu: [
      { href: '/services/b2c', label: 'B2C Services' },
      { href: '/services/b2b', label: 'B2B Services' },
      { href: '/services/b2b2c', label: 'B2B2C Services' },
      { href: '/services/b2g', label: 'B2G Services' },
    ]
  },
  { href: '/partnerships', label: 'Partnerships' },
  { href: '/blog', label: 'Insights' },
  {
    href: '/careers',
    label: 'Company',
    submenu: [
      { href: '/careers', label: 'Career Path' },
      { href: '/recruitment', label: 'Recruitment' },
      { href: '/csr', label: 'CSR' },
      { href: '/affiliate', label: 'Affiliate Program' },
      { href: '/client-portal', label: 'SASA Academy' },
    ]
  },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback((label: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveDropdown(label);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo/sasa-logo-color.png"
              alt="SASA Worldwide"
              width={140}
              height={48}
              className={`h-10 w-auto transition-all duration-300 ${scrolled ? '' : 'brightness-0 invert'
                }`}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => link.submenu && handleMouseEnter(link.label)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={link.href}
                  className={`px-4 py-2 text-sm font-medium transition-colors rounded-full flex items-center gap-1 ${scrolled
                      ? 'text-gray-700 hover:text-navy hover:bg-gray-100'
                      : 'text-white hover:bg-white/10'
                    } ${link.label === 'Home' ? (scrolled ? 'bg-navy/10 text-navy' : 'bg-white/20') : ''}`}
                >
                  {link.label}
                  {link.submenu && (
                    <svg className={`w-4 h-4 transition-transform ${activeDropdown === link.label ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>

                {/* Dropdown */}
                {link.submenu && activeDropdown === link.label && (
                  <div className="absolute top-full left-0 pt-2 w-52">
                    <div className="py-2 bg-white rounded-xl shadow-xl border border-gray-100">
                      {link.submenu.map((sublink) => (
                        <Link
                          key={sublink.href}
                          href={sublink.href}
                          className="block px-4 py-2.5 text-sm text-gray-600 hover:text-navy hover:bg-gray-50 transition-colors"
                        >
                          {sublink.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/login"
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all border ${scrolled
                  ? 'border-navy text-navy hover:bg-navy hover:text-white'
                  : 'border-white text-white hover:bg-white hover:text-navy'
                }`}
            >
              Login
            </Link>
            <Link
              href="/contact"
              className="btn-primary"
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className={`lg:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-h-[80vh] overflow-y-auto">
            <div className="p-4 space-y-1">
              {navLinks.map((link) => (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    className="block py-3 px-4 text-gray-700 hover:text-navy hover:bg-gray-50 rounded-xl transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                  {link.submenu && (
                    <div className="pl-4 space-y-1 mt-1">
                      {link.submenu.map((sublink) => (
                        <Link
                          key={sublink.href}
                          href={sublink.href}
                          className="block py-2 px-4 text-sm text-gray-500 hover:text-navy hover:bg-gray-50 rounded-xl transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {sublink.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 mt-4 border-t border-gray-100 space-y-3">
                <Link
                  href="/login"
                  className="block w-full text-center py-3 px-4 border-2 border-navy text-navy font-medium rounded-full hover:bg-navy hover:text-white transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/contact"
                  className="btn-primary w-full text-center justify-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
