"use client";

import Link from "next/link";
import { Link2, Zap, Target, Sparkles, FileWarning } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export const Hero = () => {
  const [careerPageUrl, setCareerPageUrl] = useState("");

  const handleAnalyze = () => {
    if (careerPageUrl.trim()) {
      // Handle the career page URL analysis
      console.log("Analyzing career page:", careerPageUrl);
      // You can add your logic here to process the URL
    }
  };

  return (
    <section
      className="relative min-h-screen flex items-center pt-24 pb-0 md:pt-32 md:pb-4 overflow-hidden mb-8"
      style={{ backgroundColor: "#f5f5f5" }}
    >
      <div className="section-container relative z-10 w-full">
        <div className="text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-relaxed mt-16 md:mt-20"
              style={{ color: "#102a63" }}
            >
              <span className="block mb-3">
                Instant{" "}
                <span
                  className="px-3 py-1 rounded-lg"
                  style={{ backgroundColor: "#d7f4f2", color: "#102a63" }}
                >
                  Hiring Reality Check.
                </span>
              </span>
              <span className="text-2xl md:text-3xl lg:text-4xl block mb-2">
                Before You Waste 2 Months.
              </span>
              <span className="text-xl md:text-2xl lg:text-3xl block">
                <span
                  className="px-3 py-1 rounded-lg"
                  style={{ backgroundColor: "#d7f4f2", color: "#102a63" }}
                >
                  (And Your Hiring Budget)
                </span>
              </span>
            </h1>

            <p
              className="text-lg md:text-xl mb-6 max-w-3xl mx-auto leading-relaxed"
              style={{ color: "#102a63", opacity: 0.8 }}
            >
              Drop your career page. We&apos;ll tell you exactly why
              nobody&apos;s applying — or if you&apos;re actually offering
              market rate for a unicorn engineer.
            </p>

            {/* Career Page Input Section */}
            <div className="max-w-2xl mx-auto mb-4">
              <div className="flex flex-col sm:flex-row gap-3 p-2 bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="flex-1 relative">
                  <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="url"
                    value={careerPageUrl}
                    onChange={(e) => setCareerPageUrl(e.target.value)}
                    placeholder="Paste your career page URL... we'll analyze the reality."
                    className="w-full pl-10 pr-3 py-3 text-sm bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleAnalyze();
                      }
                    }}
                  />
                </div>
                <button
                  onClick={handleAnalyze}
                  className="btn-primary flex items-center justify-center space-x-2 text-sm px-6 py-3 whitespace-nowrap"
                >
                  <span>Reality Check</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-3 mb-10">
              <p className="text-base font-medium" style={{ color: "#102a63" }}>
                Or
              </p>
              <Link
                href="/create"
                className="btn-primary flex items-center justify-center space-x-2 text-sm px-6 py-3"
              >
                <span>Build From Scratch</span>
              </Link>
            </div>

            <p
              className="text-sm mb-6"
              style={{ color: "#102a63", opacity: 0.8 }}
            >
              No pressure. It&apos;s only your hiring budget on the line.
            </p>

            <div
              className="flex flex-wrap items-center justify-center gap-8 text-base mt-8"
              style={{ color: "#102a63" }}
            >
              <div className="flex items-center space-x-2">
                <Zap
                  className="w-7 h-7"
                  style={{ color: "#278f8c", fill: "#278f8c" }}
                />
                <span className="font-medium">Faster than regret</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-7 h-7" style={{ color: "#278f8c" }} />
                <span className="font-medium">Brutally honest scoring</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-7 h-7" style={{ color: "#278f8c" }} />
                <span className="font-medium">No BS, just data</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
