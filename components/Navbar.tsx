"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, Sparkles } from "lucide-react";
import { useChatbot } from "./ChatbotProvider";

export default function Navbar() {
  const { openChatbot } = useChatbot();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 10);

      // Clear existing timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      // Hide navbar when scrolling down
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
        setIsScrolling(true);
      } else if (currentScrollY < lastScrollY.current) {
        // Show immediately when scrolling up
        setIsVisible(true);
        setIsScrolling(false);
      }

      lastScrollY.current = currentScrollY;

      // Show navbar when scrolling stops
      scrollTimeout.current = setTimeout(() => {
        setIsVisible(true);
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 pt-4 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div
        className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 ${
          isScrolled ? "shadow-xl" : "shadow-lg"
        }`}
        style={{
          backgroundColor: isScrolled ? "rgba(215, 244, 242, 0.95)" : "#d7f4f2",
        }}
      >
        <div className="px-6">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-[#278f8c] rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-black">HireCards</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/#features"
                className="text-black/80 hover:text-black transition-colors font-medium text-sm"
              >
                Features
              </Link>
              <Link
                href="/#how-it-works"
                className="text-black/80 hover:text-black transition-colors font-medium text-sm"
              >
                How It Works
              </Link>
              <Link
                href="/#testimonials"
                className="text-black/80 hover:text-black transition-colors font-medium text-sm"
              >
                Testimonials
              </Link>
              <Link
                href="/dashboard"
                className="text-black/80 hover:text-black transition-colors font-medium text-sm"
              >
                My HireCards
              </Link>
              <button 
                onClick={() => openChatbot()}
                className="btn-primary px-4 py-2 text-sm"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-black/10 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-black" />
              ) : (
                <Menu className="w-6 h-6 text-black" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden rounded-b-2xl"
            style={{ backgroundColor: "rgb(16, 42, 99)" }}
          >
            <div className="px-6 py-4 space-y-2">
              <Link
                href="/#features"
                className="block font-medium text-sm py-2 px-3 rounded-lg transition-all"
                style={{
                  color: "rgba(255, 255, 255, 0.9)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#D7F4F2";
                  e.currentTarget.style.color = "rgb(16, 42, 99)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "rgba(255, 255, 255, 0.9)";
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/#how-it-works"
                className="block font-medium text-sm py-2 px-3 rounded-lg transition-all"
                style={{
                  color: "rgba(255, 255, 255, 0.9)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#D7F4F2";
                  e.currentTarget.style.color = "rgb(16, 42, 99)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "rgba(255, 255, 255, 0.9)";
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="/#testimonials"
                className="block font-medium text-sm py-2 px-3 rounded-lg transition-all"
                style={{
                  color: "rgba(255, 255, 255, 0.9)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#D7F4F2";
                  e.currentTarget.style.color = "rgb(16, 42, 99)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "rgba(255, 255, 255, 0.9)";
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Testimonials
              </Link>
              <Link
                href="/dashboard"
                className="block font-medium text-sm py-2 px-3 rounded-lg transition-all"
                style={{
                  color: "rgba(255, 255, 255, 0.9)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#D7F4F2";
                  e.currentTarget.style.color = "rgb(16, 42, 99)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "rgba(255, 255, 255, 0.9)";
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My HireCards
              </Link>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openChatbot(); // Already wrapped, no need to change
                }}
                className="block btn-primary px-4 py-2 text-sm text-center mt-4 w-full"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
