'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">
              HireCards
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/#features" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Features
            </Link>
            <Link href="/#how-it-works" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              How It Works
            </Link>
            <Link href="/#testimonials" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Testimonials
            </Link>
            <Link href="/create" className="btn-primary">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="section-container py-4 space-y-4">
            <Link
              href="/#features"
              className="block py-2 text-gray-700 hover:text-primary-600 transition-colors font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              className="block py-2 text-gray-700 hover:text-primary-600 transition-colors font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="/#testimonials"
              className="block py-2 text-gray-700 hover:text-primary-600 transition-colors font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Testimonials
            </Link>
            <Link
              href="/create"
              className="block btn-primary text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
