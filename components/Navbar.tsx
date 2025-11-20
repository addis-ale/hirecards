"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Menu, X, Spade as Spades } from "lucide-react"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [isScrolling, setIsScrolling] = useState(false)
  const lastScrollY = useRef(0)
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      setIsScrolled(currentScrollY > 10)

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false)
        setIsScrolling(true)
      } else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true)
        setIsScrolling(false)
      }

      lastScrollY.current = currentScrollY

      scrollTimeout.current = setTimeout(() => {
        setIsVisible(true)
        setIsScrolling(false)
      }, 150)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }
    }
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 pt-4 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div
        className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 ${
          isScrolled ? "shadow-2xl" : "shadow-xl"
        }`}
        style={{
          backgroundColor: isScrolled ? "rgba(236, 76, 47, 0.94)" : "rgba(236, 76, 47, 0.92)",
          backdropFilter: "blur(8px)",
          borderBottom: "2px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="px-6">
          <div className="flex items-center justify-between h-14 md:h-16">
            <Link href="/" className="flex items-center space-x-3 group">
              <div
                className="w-9 h-9 bg-gradient-to-br from-white to-orange-100 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg"
                style={{
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                }}
              >
                <Spades className="w-5 h-5 text-[#EC4C2F]" />
              </div>
              <span className="text-xl font-bold text-white drop-shadow-lg">PokerPro</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/#games"
                className="text-white/90 hover:text-white transition-colors font-semibold text-sm tracking-wide"
              >
                Games
              </Link>
              <Link
                href="/#tournaments"
                className="text-white/90 hover:text-white transition-colors font-semibold text-sm tracking-wide"
              >
                Tournaments
              </Link>
              <Link
                href="/#leaderboard"
                className="text-white/90 hover:text-white transition-colors font-semibold text-sm tracking-wide"
              >
                Leaderboard
              </Link>
              <Link
                href="/#strategies"
                className="text-white/90 hover:text-white transition-colors font-semibold text-sm tracking-wide"
              >
                Strategies
              </Link>
              <Link
                href="/play"
                className="px-6 py-2 text-sm font-bold text-[#EC4C2F] bg-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 drop-shadow-md"
              >
                Play Now
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-white/20 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div
            className="md:hidden rounded-b-2xl"
            style={{
              backgroundColor: "rgba(236, 76, 47, 0.98)",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div className="px-6 py-4 space-y-2">
              <Link
                href="/#games"
                className="block font-semibold text-sm py-3 px-4 rounded-lg transition-all text-white/90 hover:bg-white/10 hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Games
              </Link>
              <Link
                href="/#tournaments"
                className="block font-semibold text-sm py-3 px-4 rounded-lg transition-all text-white/90 hover:bg-white/10 hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Tournaments
              </Link>
              <Link
                href="/#leaderboard"
                className="block font-semibold text-sm py-3 px-4 rounded-lg transition-all text-white/90 hover:bg-white/10 hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Leaderboard
              </Link>
              <Link
                href="/#strategies"
                className="block font-semibold text-sm py-3 px-4 rounded-lg transition-all text-white/90 hover:bg-white/10 hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Strategies
              </Link>
              <Link
                href="/play"
                className="block bg-white text-[#EC4C2F] px-4 py-2 text-sm font-bold text-center rounded-lg mt-4 hover:shadow-lg hover:scale-105 transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Play Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
