"use client";

import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-white">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="section-container relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full mb-6 border border-primary-100">
              <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold">
                Your Hiring Process Probably Sucks
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="gradient-text">Instant Hiring</span>
              <br />
              Reality Check.
              <br />
              <span className="text-3xl md:text-4xl lg:text-5xl">
                Before You Waste 2 Months.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Get feasibility score, salary benchmarks, competition analysis,
              red flags and recommendations — in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href="/create"
                className="btn-primary flex items-center space-x-2 text-lg"
              >
                <span>Fix My Mess 🔥</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="btn-secondary flex items-center space-x-2 text-lg">
                <Play className="w-5 h-5" />
                <span>See It Work (Proof)</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-primary-600">⚡</span>
                <span>Faster than your last bad hire</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-primary-600">🎯</span>
                <span>8+ card types (we counted)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-primary-600">✨</span>
                <span>AI that doesn't suck</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Hero Image/Cards Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 max-w-6xl mx-auto"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 perspective-1000">
              {/* Sample Cards */}
              {[
                {
                  title: "Role Definition",
                  color: "from-blue-500 to-blue-600",
                  icon: "💼",
                },
                {
                  title: "Market Data",
                  color: "from-purple-500 to-purple-600",
                  icon: "📊",
                },
                {
                  title: "Salary Range",
                  color: "from-pink-500 to-pink-600",
                  icon: "💰",
                },
              ].map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, rotateY: -20, y: 20 }}
                  animate={{ opacity: 1, rotateY: 0, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="card hover:scale-105 transition-transform duration-300"
                >
                  <div
                    className={`w-full h-48 bg-gradient-to-br ${card.color} rounded-lg p-6 text-white flex flex-col justify-between`}
                  >
                    <div className="text-5xl">{card.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                      <div className="h-2 bg-white/30 rounded-full w-3/4"></div>
                      <div className="h-2 bg-white/30 rounded-full w-1/2 mt-2"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
