"use client"

import { motion } from "framer-motion"
import { Briefcase, Target, Users, Building2 } from "lucide-react"
import { useChatbot } from "./ChatbotProvider"
import { useState } from "react"

const personas = [
  {
    icon: Briefcase,
    title: "Startup Founder",
    description:
      "Hiring is hard. Doing it wrong is expensive. You need to move fast, but you can not afford to hire the wrong person. Get strategic hiring insights without the overhead of a full talent team.",
    gradient: "from-blue-500 to-cyan-400",
    shadowColor: "shadow-blue-500/25",
    bgAccent: "bg-blue-50",
    dark: false,
  },
  {
    icon: Users,
    title: "Talent Acquisition Manager",
    description:
      "Drowning in reqs. Doing the work of 5 people. Juggling multiple roles while hiring managers expect magic. This is your life raft - instant battle cards that make you look like a strategic genius.",
    gradient: "from-violet-600 to-purple-500",
    shadowColor: "shadow-violet-500/25",
    bgAccent: "bg-violet-100",
    dark: false,
  },
  {
    icon: Target,
    title: "Hiring Manager",
    description:
      "You just want a job description that makes sense and candidates who actually fit. Stop wasting time on misaligned interviews. Get clear role definitions, realistic expectations, and a hiring plan that works.",
    gradient: "from-emerald-600 to-teal-500",
    shadowColor: "shadow-emerald-500/25",
    bgAccent: "bg-emerald-100",
    dark: false,
  },
  {
    icon: Building2,
    title: "Agency and RPO",
    description:
      "Move fast. Hire faster. Deliver quality at scale. Your clients expect deep market insights and strategic guidance. Stand out by delivering comprehensive battle cards that prove you understand the role better than anyone.",
    gradient: "from-orange-500 to-amber-400",
    shadowColor: "shadow-orange-500/25",
    bgAccent: "bg-orange-50",
    dark: false,
  },
]

export default function BuiltFor() {
  const { openChatbot } = useChatbot()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="py-24 md:py-36 relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-100">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Soft gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-blue-100/40 to-cyan-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-violet-100/40 to-purple-100/40 rounded-full blur-3xl" />

        <motion.div
          animate={{
            y: [0, -30, 0],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/3 w-[300px] h-[300px] bg-gradient-to-br from-slate-800/20 to-slate-900/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/3 left-1/4 w-[250px] h-[250px] bg-gradient-to-br from-slate-700/15 to-slate-800/10 rounded-full blur-3xl"
        />

        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.3]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.4) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="absolute -top-20 -right-20 w-[400px] h-[800px] bg-gradient-to-b from-slate-900/5 via-slate-800/10 to-transparent rotate-12 blur-2xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-700 shadow-lg shadow-slate-900/20 mb-8">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse" />
              <span className="text-sm font-medium text-slate-300">Who is this for?</span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
              Built for These
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient_3s_linear_infinite]">
                Beautiful Delusionals
              </span>
            </h2>
            <p className="text-xl text-slate-500 font-medium">(Who Think They Can Actually Hire Good People)</p>
          </motion.div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {personas.map((persona, index) => {
            const Icon = persona.icon
            const isHovered = hoveredIndex === index
            const isDark = persona.dark

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group relative"
              >
                <div
                  className={`relative h-full rounded-3xl p-8 border transition-all duration-500 ${
                    isDark
                      ? `bg-slate-900 border-slate-700/50 ${isHovered ? `shadow-2xl shadow-slate-900/50 -translate-y-2` : "shadow-xl shadow-slate-900/30"}`
                      : `${persona.bgAccent} border-slate-100 ${isHovered ? `shadow-2xl ${persona.shadowColor} -translate-y-2` : "shadow-lg shadow-slate-200/50"}`
                  }`}
                >
                  {/* Gradient border on hover */}
                  <div
                    className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${persona.gradient} opacity-0 transition-opacity duration-500 ${
                      isHovered ? "opacity-100" : ""
                    }`}
                    style={{ padding: "2px" }}
                  >
                    <div className={`w-full h-full rounded-3xl ${isDark ? "bg-slate-900" : "bg-white"}`} />
                  </div>

                  {isDark && (
                    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${persona.gradient} opacity-5`} />
                  )}

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${persona.gradient} flex items-center justify-center mb-6 transition-transform duration-500 ${
                        isHovered ? "scale-110 rotate-3" : ""
                      } ${isDark ? "shadow-lg shadow-black/30" : ""}`}
                    >
                      <Icon className="w-8 h-8 text-white" strokeWidth={1.5} />
                    </div>

                    {/* Title */}
                    <h3 className={`text-xl font-bold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
                      {persona.title}
                    </h3>

                    {/* Description */}
                    <p className={`leading-relaxed text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      {persona.description}
                    </p>

                    {/* Hover indicator */}
                    <div
                      className={`mt-6 flex items-center gap-2 text-sm font-semibold transition-all duration-300 ${
                        isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                      }`}
                    >
                      <span className={`bg-gradient-to-r ${persona.gradient} bg-clip-text text-transparent`}>
                        That&apos;s me
                      </span>
                      <svg
                        className={`w-4 h-4 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                          style={{ stroke: `url(#gradient-${index})` }}
                        />
                      </svg>
                      <svg width="0" height="0">
                        <defs>
                          <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop
                              offset="0%"
                              stopColor={
                                index === 0 ? "#3b82f6" : index === 1 ? "#8b5cf6" : index === 2 ? "#10b981" : "#f97316"
                              }
                            />
                            <stop
                              offset="100%"
                              stopColor={
                                index === 0 ? "#22d3ee" : index === 1 ? "#a855f7" : index === 2 ? "#14b8a6" : "#fbbf24"
                              }
                            />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* CTA - keeping dark button as contrast */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16"
        >
          <button
            onClick={() => openChatbot()}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-semibold text-lg rounded-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-slate-900/25 hover:-translate-y-1"
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

            <span className="relative">Think You Qualify? Try It</span>
            <svg
              className="w-5 h-5 relative transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  )
}
