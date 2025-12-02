"use client";

import { FileText, Sparkles, Download } from "lucide-react";
import { motion } from "framer-motion";
import { useChatbot } from "./ChatbotProvider";

const steps = [
  {
    icon: FileText,
    title: "SHARE YOUR REQUIREMENTS",
    description:
      "Tell us about your role requirements, ideal candidate profile, and hiring needs. The more details, the better your battle cards.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Sparkles,
    title: "GENERATED FROM REAL DATA",
    description:
      "Comprehensive battle cards generated from real-world scraped data, complete with key competencies, interview questions, and evaluation criteria tailored to your role.",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Download,
    title: "SHARE & START HIRING",
    description:
      "Get your deck instantly. Share with your hiring team. Run structured interviews that help you identify the best candidates.",
    color: "from-pink-500 to-pink-600",
  },
];

export default function HowItWorks() {
  const { openChatbot } = useChatbot();
  
  return (
    <section
      id="how-it-works"
      className="py-20 md:py-32"
      style={{ backgroundColor: "#E8ECF5" }}
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
              How We <span className="text-[#3B7CFF]">Fix Your Chaos</span>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
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
                  {/* Connector line with animated pulse (hidden on mobile) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-[calc(50%+48px)] right-[calc(-100%+50%-48px)] h-0.5 z-0">
                      {/* Base line */}
                      <div className="absolute inset-0 bg-primary-200"></div>

                      {/* Animated flowing gradient */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-500 to-transparent"
                        initial={{ x: "-100%" }}
                        animate={{ x: "200%" }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                          delay: index * 0.5,
                        }}
                      ></motion.div>

                      {/* Animated circle */}
                      <motion.div
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-primary-600 rounded-full shadow-lg"
                        initial={{ left: "0%" }}
                        animate={{ left: "100%" }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.5,
                        }}
                      ></motion.div>
                    </div>
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
            <button onClick={() => openChatbot()} className="btn-primary text-lg inline-block">
              Let&apos;s Do This
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
