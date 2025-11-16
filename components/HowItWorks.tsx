"use client";

import { FileText, Sparkles, Download } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: FileText,
    title: "YOU SPILL YOUR GUTS",
    description:
      "Tell us about your hiring chaos. No judgment (yet). We've seen worse. Probably.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Sparkles,
    title: "AI WARMS UP THE GRILL",
    description:
      "Our highly caffeinated AI dissects your requirements and generates battle cards. Trained on real data, not LinkedIn influencer posts.",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Download,
    title: "SHARE & DOMINATE",
    description:
      "Get your deck instantly. Share with your team. Actually hire someone good for once.",
    color: "from-pink-500 to-pink-600",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              How We <span className="text-primary-600">Fix Your Chaos</span>
              <br />
              <span className="text-2xl md:text-3xl font-normal text-gray-600">
                (In Three Actually Simple Steps)
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              From mess to masterpiece faster than your average hiring round
            </p>
          </motion.div>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative"
                >
                  {/* Connector line (hidden on mobile) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-16 left-[60%] w-full h-0.5 bg-primary-200 z-0"></div>
                  )}

                  <div className="relative z-10 text-center">
                    <div
                      className={`w-24 h-24 mx-auto bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg transform hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-12 h-12 text-white" />
                    </div>
                    <div className="inline-block px-4 py-1 bg-gray-100 rounded-full text-sm font-semibold text-gray-600 mb-4">
                      Step {index + 1}
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-16"
          >
            <a href="/create" className="btn-primary text-lg inline-block">
              Let&apos;s Do This 🚀
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
