"use client"

import type React from "react"

import { FileText, Sparkles, Download, ArrowRight } from "lucide-react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useChatbot } from "./ChatbotProvider"
import { useRef, useState } from "react"

const steps = [
  {
    icon: FileText,
    title: "SHARE YOUR REQUIREMENTS",
    description:
      "Tell us about your role requirements, ideal candidate profile, and hiring needs. The more details, the better your battle cards.",
    color: "from-emerald-400 to-green-500",
    glowColor: "rgba(16, 185, 129, 0.4)",
    number: "01",
  },
  {
    icon: Sparkles,
    title: "GENERATED FROM REAL DATA",
    description:
      "Comprehensive battle cards generated from real-world scraped data - complete with key competencies, interview questions, and evaluation criteria tailored to your role.",
    color: "from-green-400 to-teal-500",
    glowColor: "rgba(52, 211, 153, 0.4)",
    number: "02",
  },
  {
    icon: Download,
    title: "SHARE & START HIRING",
    description:
      "Get your deck instantly. Share with your hiring team. Run structured interviews that help you identify the best candidates.",
    color: "from-teal-400 to-cyan-500",
    glowColor: "rgba(110, 231, 183, 0.4)",
    number: "03",
  },
]

function StepCard({
  step,
  index,
}: {
  step: (typeof steps)[0]
  index: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    stiffness: 300,
    damping: 30,
  })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 300,
    damping: 30,
  })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  const Icon = step.icon

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.15 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative group cursor-pointer"
    >
      {/* Glow effect behind card */}
      <motion.div
        className="absolute -inset-4 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
        style={{ background: step.glowColor }}
      />

      <div className="relative bg-white/50 backdrop-blur-xl border border-emerald-200/50 rounded-2xl p-8 h-full overflow-hidden">
        {/* Animated border gradient */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, ${step.glowColor}, transparent 50%)`,
            padding: "1px",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />

        {/* Step number - large background text */}
        <div className="absolute -top-4 -right-2 text-[120px] font-black text-emerald-100/30 leading-none select-none">
          {step.number}
        </div>

        {/* Floating particles on hover */}
        {isHovered && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-1 h-1 rounded-full bg-gradient-to-r ${step.color}`}
                initial={{
                  opacity: 0,
                  x: Math.random() * 100,
                  y: Math.random() * 100,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  y: [0, -50],
                  x: Math.random() * 20 - 10,
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.2,
                }}
              />
            ))}
          </>
        )}

        <div className="relative z-10">
          {/* Icon container */}
          <motion.div
            className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-lg`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
            style={{
              boxShadow: isHovered ? `0 20px 40px -10px ${step.glowColor}` : "none",
            }}
          >
            <Icon className="w-8 h-8 text-white" />
          </motion.div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-sm font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
              STEP {index + 1}
            </span>
            <motion.div
              className={`h-px flex-1 bg-gradient-to-r ${step.color} opacity-30`}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
            />
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-3 tracking-wide">{step.title}</h3>

          {/* Description */}
          <p className="text-slate-400 leading-relaxed text-sm">{step.description}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function HowItWorks() {
  const { openChatbot } = useChatbot()

  return (
    <section
      id="how-it-works"
      className="relative py-24 md:py-36 overflow-hidden bg-gradient-to-b from-white to-emerald-50"
    >
      {/* Background elements */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-200/20 rounded-full blur-3xl" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(16,185,129,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/50 border border-emerald-200/50 mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-sm text-slate-400 font-medium">Simple 3-Step Process</span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span
                              className="bg-gradient-to-r from-blue-600 via-green-00 to-teal-600 bg-clip-text text-transparent">How We </span>
              <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
                Fix Your Chaos
              </span>
            </h2>
            <p className="text-xl text-slate-500">From mess to masterpiece faster than your average hiring round</p>
          </motion.div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16">
          {steps.map((step, index) => (
            <StepCard key={index} step={step} index={index} />
          ))}
        </div>

        {/* Connector line - desktop only */}
        <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 w-2/3 max-w-2xl">
          <svg className="w-full h-2" viewBox="0 0 800 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.path
              d="M0 4 H800"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              strokeDasharray="8 8"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#6ee7b7" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <motion.button
            onClick={() => openChatbot()}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full font-semibold text-white text-lg shadow-lg shadow-emerald-500/25 overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
              initial={{ x: "-200%" }}
              whileHover={{ x: "200%" }}
              transition={{ duration: 0.8 }}
            />
            <span className="relative">Let&apos;s Do This</span>
            <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
