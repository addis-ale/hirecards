"use client";

import Link from "next/link";
import { Link2, Zap, Target, Sparkles } from "lucide-react";
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
    <section className="relative min-h-screen flex items-center pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-blue-50/20 mb-8">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="section-container relative z-10 w-full">
        <div className="text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 bg-red-50 text-red-700 px-4 py-2 rounded-full mb-4 border border-red-200">
              <span className="text-sm font-bold">
                🚨 YOUR JOB POSTING PROBABLY SUCKS
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              <span className="gradient-text">
                Instant Hiring Reality Check.
              </span>
              <br />
              <span className="text-2xl md:text-3xl lg:text-4xl text-gray-900">
                Before You Waste 2 Months.
              </span>
              <br />
              <span className="text-xl md:text-2xl lg:text-3xl text-gray-600">
                (And Your Hiring Budget)
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
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
              <p className="text-base text-gray-500 font-medium">Or</p>
              <Link
                href="/create"
                className="btn-primary flex items-center justify-center space-x-2 text-sm px-6 py-3"
              >
                <span>Build From Scratch</span>
              </Link>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              No pressure. It&apos;s only your hiring budget on the line.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-8 text-base text-gray-600 mt-8">
              <div className="flex items-center space-x-2">
                <Zap className="w-7 h-7 text-red-600 fill-red-600" />
                <span className="font-medium">Faster than regret</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-7 h-7 text-red-600" />
                <span className="font-medium">Brutally honest scoring</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-7 h-7 text-red-600" />
                <span className="font-medium">No BS, just data</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
