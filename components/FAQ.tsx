"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react"
import { useChatbot } from "./ChatbotProvider"

const faqs = [
  {
    question: "Is my genius hiring strategy safe with you?",
    answer:
      "Your data is encrypted, secure, and honestly more organized than your current hiring process. We only use it to generate your cards, not to judge your past hiring decisions (though we could).",
  },
  {
    question: "Will this AI *actually* give me useful feedback?",
    answer:
      "Unlike that one recruiter you hired who ghosted, yes. Our AI is trained on real market data, not LinkedIn influencer hot takes. It gives you actionable insights, not corporate buzzwords.",
  },
  {
    question: "What if my hiring needs are *actually* good? Will it say so?",
    answer:
      "If you have got your act together, we will tell you. If not, we will help you fix it. Either way, you will get battle cards that make your life easier. Win-win.",
  },
  {
    question: "How long does this take? I am very impatient.",
    answer:
      '2-3 minutes. Faster than your average coffee break. Definitely faster than reading 47 &quot;Top 10 Hiring Tips&quot; blog posts that all say the same thing.',
  },
  {
    question: "Can I delete my cards if I cry too much?",
    answer:
      "Yes, but why would you? The truth hurts, but bad hires hurt more. Plus, you can edit and regenerate cards anytime. We are not monsters.",
  },
  {
    question: "Do I need a credit card to start?",
    answer:
      "Nope. Free to try, free to love, free to tell your friends about. We will only ask for payment if you want the premium features (they are worth it, trust us).",
  },
]

const FloatingOrb = ({
  delay,
  duration,
  size,
  initialX,
  initialY,
  gradient,
}: {
  delay: number
  duration: number
  size: number
  initialX: number
  initialY: number
  gradient: string
}) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={{
      width: size,
      height: size,
      left: `${initialX}%`,
      top: `${initialY}%`,
      background: gradient,
    }}
    animate={{
      x: [0, 50, -30, 0],
      y: [0, -40, 20, 0],
      scale: [1, 1.2, 0.9, 1],
    }}
    transition={{
      duration,
      delay,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    }}
  />
)

const GridPattern = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div
      className="absolute inset-0 opacity-[0.02]"
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.5) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }}
    />
  </div>
)

export default function FAQ() {
  const { openChatbot } = useChatbot()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="relative py-24 md:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-100">
        <GridPattern />
        <FloatingOrb
          delay={0}
          duration={25}
          size={400}
          initialX={10}
          initialY={20}
          gradient="linear-gradient(135deg, #3b82f6 0%, #0ea5e9 50%, #06b6d4 100%)"
        />
        <FloatingOrb
          delay={5}
          duration={28}
          size={350}
          initialX={80}
          initialY={70}
          gradient="linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #d946ef 100%)"
        />
        <FloatingOrb
          delay={10}
          duration={26}
          size={300}
          initialX={50}
          initialY={5}
          gradient="linear-gradient(135deg, #06b6d4 0%, #14b8a6 50%, #10b981 100%)"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-200 shadow-lg shadow-blue-500/10 mb-6">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Common Questions</span>
            </div>

            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
              Your Burning Questions
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient_3s_linear_infinite] text-3xl md:text-4xl font-semibold">
                (Probably Dumb, But We will Answer)
              </span>
            </h2>

            <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto">
              We have got answers to the questions keeping you up at night. And the weird ones too.
            </p>
          </motion.div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            const gradients = [
              "from-blue-500 to-cyan-400",
              "from-violet-500 to-purple-400",
              "from-emerald-500 to-teal-400",
              "from-orange-500 to-amber-400",
              "from-pink-500 to-rose-400",
              "from-indigo-500 to-blue-400",
            ]
            const gradient = gradients[index % gradients.length]

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onMouseEnter={() => {}}
                className="group relative"
              >
                <div
                  className={`relative rounded-2xl overflow-hidden transition-all duration-500 ${
                    isOpen
                      ? "shadow-xl shadow-slate-900/10 -translate-y-1"
                      : "shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/50 hover:-translate-y-1"
                  }`}
                >
                  {/* Gradient border overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 transition-opacity duration-500 ${
                      isOpen ? "opacity-100" : "group-hover:opacity-100"
                    }`}
                    style={{ padding: "1.5px" }}
                  >
                    <div className="w-full h-full rounded-2xl bg-white" />
                  </div>

                  {/* Content */}
                  <div
                    className="relative z-10 bg-white rounded-2xl p-6 cursor-pointer"
                    onClick={() => toggleFAQ(index)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 text-left">
                        <h3 className="text-lg font-bold text-slate-900 leading-relaxed">{faq.question}</h3>
                      </div>

                      <div className={`flex-shrink-0 transition-all duration-300 ${isOpen ? "rotate-180" : ""}`}>
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                            isOpen
                              ? `bg-gradient-to-br ${gradient} shadow-lg`
                              : "bg-gradient-to-br from-slate-100 to-slate-50"
                          }`}
                        >
                          <ChevronDown
                            className={`w-5 h-5 transition-colors duration-300 ${
                              isOpen ? "text-white" : "text-slate-600"
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 mt-4 border-t border-slate-100">
                            <p className="text-slate-600 leading-relaxed text-base">{faq.answer}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="inline-block">
            <p className="text-slate-500 italic mb-6 flex items-center gap-2 justify-center">
              <Sparkles className="w-4 h-4" />
              My circuits are fried. You are on your own now, champ.
            </p>
            <button
              onClick={() => openChatbot()}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600 text-white font-semibold text-lg rounded-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-1 active:translate-y-0"
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

              <span className="relative">Just Take Me to the Cards Already</span>
              <svg
                className="w-5 h-5 relative transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
