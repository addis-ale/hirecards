"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

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
      "If you've got your act together, we'll tell you. If not, we'll help you fix it. Either way, you'll get battle cards that make your life easier. Win-win.",
  },
  {
    question: "How long does this take? I'm very impatient.",
    answer:
      '2-3 minutes. Faster than your average coffee break. Definitely faster than reading 47 "Top 10 Hiring Tips" blog posts that all say the same thing.',
  },
  {
    question: "Can I delete my cards if I cry too much?",
    answer:
      "Yes, but why would you? The truth hurts, but bad hires hurt more. Plus, you can edit and regenerate cards anytime. We're not monsters.",
  },
  {
    question: "Do I need a credit card to start?",
    answer:
      "Nope. Free to try, free to love, free to tell your friends about. We'll only ask for payment if you want the premium features (they're worth it, trust us).",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white">
      <div className="section-container max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Your Burning Questions
              <br />
              <span className="text-2xl md:text-3xl font-normal text-gray-600">
                (Probably Dumb, But We&apos;ll Answer)
              </span>
            </h2>
          </motion.div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="card cursor-pointer hover:shadow-lg transition-all"
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 pr-8">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-6 h-6 text-primary-600 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "transform rotate-180" : ""
                  }`}
                />
              </div>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-gray-600 mt-4 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-gray-500 italic mb-6">
            My circuits are fried. You&apos;re on your own now, champ.
          </p>
          <a href="/create" className="btn-primary text-lg inline-block">
            Just Take Me to the Cards Already 🚀
          </a>
        </motion.div>
      </div>
    </section>
  );
}
