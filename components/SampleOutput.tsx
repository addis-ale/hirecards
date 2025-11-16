"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Users,
  Zap,
} from "lucide-react";

export default function SampleOutput() {
  const redFlags = [
    "Salary 15% below market median",
    "High competition in tech hubs",
    "Required skills combination is rare",
  ];

  const recommendations = [
    "Consider remote-first to expand talent pool",
    "Adjust salary to $95K-$125K for competitive positioning",
    "Split role into Senior + Mid-level positions",
  ];

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-white via-blue-50/30 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="section-container relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full mb-4 border border-primary-100">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-semibold">
                See The Output Before You Type Anything
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Your{" "}
              <span className="gradient-text">Market Reality Snapshot</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              This is what you get in ~30 seconds. No guessing. No BS.
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
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header with Score */}
            <div className="bg-gradient-to-br from-primary-600 to-secondary-600 p-8 text-white">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="text-sm font-semibold opacity-90 mb-2">
                    REALITY CHECK RESULTS
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
                    Good, with tweaks
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
                    Your ask: $85K-$105K{" "}
                    <span className="text-red-600 font-semibold">
                      ⚠️ 20% below
                    </span>
                  </div>
                </div>
              </div>

              {/* Competition Level */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-900 font-bold">
                  <Users className="w-5 h-5 text-orange-600" />
                  <span>Competition Level</span>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-orange-700">
                        High
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        87 similar roles posted this week
                      </div>
                    </div>
                    <div className="text-4xl">🔥</div>
                  </div>
                </div>
              </div>

              {/* Red Flags */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-900 font-bold">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span>Red Flags ({redFlags.length})</span>
                </div>
                <div className="space-y-2">
                  {redFlags.map((flag, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-2 bg-red-50 border border-red-200 rounded-lg p-3"
                    >
                      <span className="text-red-600 text-sm mt-0.5">⚠️</span>
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
                      <span className="text-blue-600 text-sm mt-0.5">💡</span>
                      <span className="text-sm text-gray-700 flex-1">
                        {rec}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Market Snapshot Footer */}
            <div className="bg-gray-50 border-t border-gray-200 px-8 py-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-sm">
                    <strong>Market Trend:</strong> Demand up 23% vs last quarter
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Generated in 2.3 seconds
                </div>
              </div>
            </div>
          </div>

          {/* CTA Below Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-8"
          >
            <a
              href="/create"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-bold rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 text-lg"
            >
              <span>Get Your Reality Check Now</span>
              <span className="text-2xl">→</span>
            </a>
            <p className="text-sm text-gray-500 mt-3">
              No signup required • Free forever • Takes ~30 seconds
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

