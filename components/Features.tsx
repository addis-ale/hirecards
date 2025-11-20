"use client"

import {
  Briefcase,
  DollarSign,
  TrendingUp,
  Target,
  Users,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: AlertTriangle,
    title: "Reality Check Card",
    description:
      "Feasibility score, market salary range, competition analysis, red flags, and instant recommendations.",
    suit: "♠",
  },
  {
    icon: Briefcase,
    title: "Role Definition Card",
    description: "Clear job description, key responsibilities, required skills, and success metrics for the position.",
    suit: "♥",
  },
  {
    icon: DollarSign,
    title: "Salary Benchmark Card",
    description: "Market-aligned compensation data, equity ranges, benefits comparison, and competitive positioning.",
    suit: "♦",
  },
  {
    icon: TrendingUp,
    title: "Market Intelligence Card",
    description: "Hiring trends, demand analysis, talent availability, and competitive landscape insights.",
    suit: "♣",
  },
  {
    icon: Target,
    title: "Candidate Persona Card",
    description: "Ideal candidate profile, experience level, skill requirements, and cultural fit indicators.",
    suit: "♠",
  },
  {
    icon: Users,
    title: "Team Structure Card",
    description: "Reporting lines, team composition, collaboration needs, and organizational fit analysis.",
    suit: "♥",
  },
  {
    icon: MessageSquare,
    title: "Outreach Templates Card",
    description: "Recruiting messages, email templates, LinkedIn pitches, and personalized outreach strategies.",
    suit: "♦",
  },
  {
    icon: CheckCircle,
    title: "Interview Guide Card",
    description: "Structured questions, evaluation criteria, skill assessments, and hiring decision framework.",
    suit: "♣",
  },
]

export default function Features() {
  return (
    <section
      id="features"
      className="relative py-16 md:py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-black to-black"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 left-5 md:left-20 w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-orange-500/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
        <motion.div
          className="absolute top-1/3 right-5 md:right-20 w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-red-500/20"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-16 h-16 md:w-24 md:h-24 rounded-full border-4 border-orange-500/10"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/40 backdrop-blur-sm">
              <span className="text-red-300 text-sm font-semibold">♠ ALL IN ON EXCELLENCE ♠</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
              This Isn&apos;t Just
              <span className="block bg-gradient-to-r from-red-500 via-orange-400 to-red-600 bg-clip-text text-transparent">
                {" "}
                Premium Features
              </span>
              <span className="block text-xl sm:text-2xl md:text-3xl font-normal text-gray-300 mt-3">
                It&apos;s Structured Dominance for Winning Hires
              </span>
            </h2>
            <p className="text-base md:text-lg text-gray-300 mt-4">
              Real insights. Real power. Real winners (the good hand).
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group relative h-full"
              >
                <div className="relative h-full rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-br from-red-950/40 to-orange-950/20 border border-red-500/20 hover:border-red-500/50 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 md:p-8 flex flex-col hover:bg-gradient-to-br hover:from-red-900/50 hover:to-orange-900/30">
                  <div className="absolute top-4 right-6 text-3xl md:text-4xl text-red-500/30 group-hover:text-red-400/50 transition-colors duration-300 font-bold">
                    {feature.suit}
                  </div>

                  <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mb-5 md:mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl">
                    <Icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                  </div>

                  <div className="flex-1 flex flex-col">
                    <h3 className="text-lg md:text-xl font-bold mb-3 text-white group-hover:text-red-200 transition-colors duration-300 line-clamp-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-200 leading-relaxed">{feature.description}</p>
                  </div>

                  <motion.div
                    className="absolute -bottom-2 -right-2 w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-tl from-red-500/20 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
