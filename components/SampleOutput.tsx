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
    <section
      className="py-16 md:py-20 relative overflow-hidden"
      style={{ backgroundColor: "#d7f4f2" }}
    >
      <div className="section-container relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-6 border"
              style={{
                backgroundColor: "rgba(16, 42, 99, 0.1)",
                color: "#102a63",
                borderColor: "#278f8c",
              }}
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-bold">
                SAMPLE DAMAGE REPORT • 8+ Cards Total
              </span>
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: "#102a63" }}
            >
              Here&apos;s What{" "}
              <span style={{ color: "#102a63" }}>We&apos;ll Tell You</span>
            </h2>
            <p
              className="text-xl max-w-2xl mx-auto"
              style={{ color: "#102a63", opacity: 0.8 }}
            >
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
          className="max-w-3xl mx-auto"
        >
          <div
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
            style={{ border: "2px solid #278f8c" }}
          >
            {/* Header with Score */}
            <div
              className="p-6 text-white"
              style={{ backgroundColor: "#102a63" }}
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="text-sm font-bold opacity-90 mb-2 uppercase">
                    YOUR HIRING POSTED. ROASTED
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold">
                    Senior Full-Stack Engineer
                  </h3>
                  <p className="text-xs opacity-80 mt-1">
                    San Francisco • Remote OK • Series B Startup
                  </p>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/20">
                  <div className="text-4xl font-bold">78</div>
                  <div className="text-xs font-semibold opacity-90">
                    /100 Feasibility
                  </div>
                  <div className="text-xs opacity-75 mt-1">
                    Could be worse... barely
                  </div>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="p-6 grid md:grid-cols-2 gap-5">
              {/* Salary Range */}
              <div className="space-y-2">
                <div
                  className="flex items-center space-x-2 font-bold text-sm"
                  style={{ color: "#102a63" }}
                >
                  <DollarSign
                    className="w-4 h-4"
                    style={{ color: "#278f8c" }}
                  />
                  <span>Market Salary Range</span>
                </div>
                <div
                  className="border rounded-lg p-3"
                  style={{
                    backgroundColor: "rgba(39, 143, 140, 0.1)",
                    borderColor: "#278f8c",
                  }}
                >
                  <div
                    className="text-2xl font-bold"
                    style={{ color: "#278f8c" }}
                  >
                    $110K - $145K
                  </div>
                  <div className="text-xs mt-1" style={{ color: "#102a63" }}>
                    Your range: $85K-$105K{" "}
                    <span className="text-red-600 font-semibold inline-flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" /> 20% below market
                    </span>
                  </div>
                </div>
              </div>

              {/* Competition Level */}
              <div className="space-y-2">
                <div
                  className="flex items-center space-x-2 font-bold text-sm"
                  style={{ color: "#102a63" }}
                >
                  <Users className="w-4 h-4" style={{ color: "#278f8c" }} />
                  <span>Competition Analysis</span>
                </div>
                <div
                  className="border rounded-lg p-3"
                  style={{
                    backgroundColor: "rgba(16, 42, 99, 0.05)",
                    borderColor: "#278f8c",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div
                        className="text-xl font-bold"
                        style={{ color: "#102a63" }}
                      >
                        Very High
                      </div>
                      <div
                        className="text-xs mt-1"
                        style={{ color: "#102a63", opacity: 0.7 }}
                      >
                        87 similar roles posted this week
                      </div>
                    </div>
                    <Flame className="w-8 h-8" style={{ color: "#278f8c" }} />
                  </div>
                </div>
              </div>

              {/* Red Flags */}
              <div className="space-y-2">
                <div
                  className="flex items-center space-x-2 font-bold text-sm"
                  style={{ color: "#102a63" }}
                >
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>Key Red Flags ({redFlags.length})</span>
                </div>
                <div className="space-y-2">
                  {redFlags.map((flag, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-2 bg-red-50 border border-red-200 rounded-lg p-2"
                    >
                      <AlertTriangle className="w-3 h-3 text-red-600 mt-0.5 flex-shrink-0" />
                      <span
                        className="text-xs flex-1"
                        style={{ color: "#102a63" }}
                      >
                        {flag}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-2">
                <div
                  className="flex items-center space-x-2 font-bold text-sm"
                  style={{ color: "#102a63" }}
                >
                  <CheckCircle
                    className="w-4 h-4"
                    style={{ color: "#278f8c" }}
                  />
                  <span>Recommendations ({recommendations.length})</span>
                </div>
                <div className="space-y-2">
                  {recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-2 border rounded-lg p-2"
                      style={{
                        backgroundColor: "rgba(39, 143, 140, 0.1)",
                        borderColor: "#278f8c",
                      }}
                    >
                      <Lightbulb
                        className="w-3 h-3 mt-0.5 flex-shrink-0"
                        style={{ color: "#278f8c" }}
                      />
                      <span
                        className="text-xs flex-1"
                        style={{ color: "#102a63" }}
                      >
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
            <p
              className="text-lg font-semibold mb-6"
              style={{ color: "#102a63" }}
            >
              This is just the{" "}
              <span className="text-red-600">Damage Report Card</span>, you get
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
