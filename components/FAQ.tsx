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
    <section className="relative py-20 md:py-32 overflow-hidden bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Your Burning Questions
              <br />
              <span style={{ color: "#70B2B2" }} className="text-2xl md:text-3xl font-semibold">
                (Probably Dumb, But We will Answer)
              </span>
            </h2>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We have got answers to the questions keeping you up at night. And the weird ones too.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            const gradients = [
              "from-[#016B61] to-[#70B2B2]",
              "from-[#70B2B2] to-[#9ECFD4]",
              "from-[#9ECFD4] to-[#70B2B2]",
              "from-[#016B61] to-[#9ECFD4]",
              "from-[#70B2B2] to-[#016B61]",
              "from-[#9ECFD4] to-[#016B61]",
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
                  className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
                    isOpen
                      ? "shadow-xl shadow-slate-900/10"
                      : "shadow-lg shadow-slate-200/50"
                  }`}
                >
                  {/* Gradient border overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 transition-opacity duration-300 ${
                      isOpen ? "opacity-100" : ""
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
                        <h3 className="text-lg font-bold leading-relaxed text-gray-900">{faq.question}</h3>
                      </div>

                      <div className={`flex-shrink-0 transition-all duration-300 ${isOpen ? "rotate-180" : ""}`}>
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300"
                          style={{ backgroundColor: isOpen ? "#016B61" : "#E5E9C5" }}
                        >
                          <ChevronDown
                            className="w-5 h-5 transition-colors duration-300"
                            style={{ color: isOpen ? "#ffffff" : "#016B61" }}
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
                          <div className="pt-4 mt-4" style={{ borderTop: "1px solid #9ECFD4" }}>
                            <p className="leading-relaxed text-base text-gray-600">{faq.answer}</p>
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
          className="text-center mt-12 md:col-span-2"
        >
          <div className="inline-block">
            <p className="italic mb-6 flex items-center gap-2 justify-center" style={{ color: "#016B61", opacity: 0.6 }}>
              <Sparkles className="w-4 h-4" />
              My circuits are fried. You are on your own now, champ.
            </p>
            <button
              onClick={() => openChatbot()}
              className="group relative inline-flex items-center gap-3 px-8 py-4 text-white font-semibold text-lg rounded-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:translate-y-0"
              style={{ background: "linear-gradient(to right, #016B61, #70B2B2, #016B61)", boxShadow: "0 10px 40px -10px #016B6140" }}
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
