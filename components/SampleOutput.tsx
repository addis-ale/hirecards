"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Users,
  Zap,
  TrendingUp,
  Flame,
  Lightbulb,
} from "lucide-react";

export default function SampleOutput() {
  const redFlags = [
    "Salary 20% below market (good luck with that)",
    "87 competitors fighting for the same unicorns",
    "This skill combo is rarer than a bug-free deploy",
  ];

  const recommendations = [
    "Go remote or go home (literally)",
    "Bump that salary before someone else does",
    "Split this Frankenstein role into two humans",
  ];

  return (
    <section className="min-h-screen pt-4 pb-20 md:pt-6 md:pb-24 bg-gradient-to-b from-white via-blue-50/30 to-white relative overflow-hidden flex items-center">
      {/* Dotted Background Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle, #d1d5db 2px, transparent 2px)",
          backgroundSize: "24px 24px",
        }}
      ></div>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="section-container relative z-10 mt-16">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 bg-red-50 text-red-700 px-4 py-2 rounded-full mb-6 border border-red-200">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-bold">
                SAMPLE DAMAGE REPORT • 8+ Cards Total
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Here&apos;s What{" "}
              <span className="gradient-text">We&apos;ll Tell You</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Brutally honest scores. Market reality. Red flags you can&apos;t
              ignore. And fixes that actually work.
            </p>
          </motion.div>
        </div>

        {/* Sample Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header with Score */}
            <div className="bg-gradient-to-br from-primary-600 to-secondary-600 p-8 text-white">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="text-sm font-bold opacity-90 mb-2 uppercase">
                    YOUR HIRING POSTED — ROASTED
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold">
                    Senior Full-Stack Engineer
                  </h3>
                  <p className="text-sm opacity-80 mt-1">
                    San Francisco • Remote OK • Series B Startup
                  </p>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20">
                  <div className="text-5xl font-bold">78</div>
                  <div className="text-sm font-semibold opacity-90">
                    /100 Feasibility
                  </div>
                  <div className="text-xs opacity-75 mt-1">
                    Could be worse... barely
                  </div>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="p-8 grid md:grid-cols-2 gap-6">
              {/* Salary Range */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-900 font-bold">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span>Market Salary Range</span>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-3xl font-bold text-green-700">
                    $110K - $145K
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Your range: $85K-$105K{" "}
                    <span className="text-red-600 font-semibold inline-flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" /> 20% below market
                    </span>
                  </div>
                </div>
              </div>

              {/* Competition Level */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-900 font-bold">
                  <Users className="w-5 h-5 text-orange-600" />
                  <span>Competition Analysis</span>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-orange-700">
                        Very High
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        87 similar roles posted this week
                      </div>
                    </div>
                    <Flame className="w-10 h-10 text-orange-600" />
                  </div>
                </div>
              </div>

              {/* Red Flags */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-900 font-bold">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span>Key Red Flags ({redFlags.length})</span>
                </div>
                <div className="space-y-2">
                  {redFlags.map((flag, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-2 bg-red-50 border border-red-200 rounded-lg p-3"
                    >
                      <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700 flex-1">
                        {flag}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-900 font-bold">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span>Recommendations ({recommendations.length})</span>
                </div>
                <div className="space-y-2">
                  {recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-2 bg-blue-50 border border-blue-200 rounded-lg p-3"
                    >
                      <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700 flex-1">
                        {rec}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Explanation Below Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-8"
          >
            <p className="text-lg font-semibold text-gray-900 mb-6">
              This is just the{" "}
              <span className="text-red-600">Damage Report Card</span> — you get
              8+ more cards that&apos;ll save your hiring budget.
            </p>
            <a
              href="/create"
              className="btn-primary inline-flex items-center justify-center px-6 py-3 text-sm"
            >
              <span>Try It Now</span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
