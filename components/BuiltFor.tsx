"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  Target,
  Users,
  Building2,
} from "lucide-react";
import { useChatbot } from "./ChatbotProvider";

const personas = [
  {
    icon: Briefcase,
    title: "Startup Founder",
    description: "Hiring is hard. Doing it wrong is expensive. You need to move fast, but you can't afford to hire the wrong person. Get strategic hiring insights without the overhead of a full talent team.",
    color: "bg-blue-600",
  },
  {
    icon: Users,
    title: "Talent Acquisition Manager",
    description: "Drowning in reqs. Doing the work of 5 people. Juggling multiple roles while hiring managers expect magic. This is your life raft - instant battle cards that make you look like a strategic genius.",
    color: "bg-purple-600",
  },
  {
    icon: Target,
    title: "Hiring Manager",
    description: "You just want a job description that makes sense and candidates who actually fit. Stop wasting time on misaligned interviews. Get clear role definitions, realistic expectations, and a hiring plan that works.",
    color: "bg-green-600",
  },
  {
    icon: Building2,
    title: "Agency and RPO",
    description: "Move fast. Hire faster. Deliver quality at scale. Your clients expect deep market insights and strategic guidance. Stand out by delivering comprehensive battle cards that prove you understand the role better than anyone.",
    color: "bg-orange-600",
  },
];

export default function BuiltFor() {
  const { openChatbot } = useChatbot();
  
  return (
    <section
      className="py-20 md:py-32 relative overflow-hidden"
      style={{ backgroundColor: "#E8ECF5" }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="section-container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Built for These
              <br />
              <span className="text-[#3B7CFF]">Beautiful Delusionals</span>
            </h2>
            <p className="text-xl text-gray-600">
              (Who Think They Can Actually Hire Good People)
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {personas.map((persona, index) => {
            const Icon = persona.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="card hover:scale-105 transition-all duration-300 text-center"
              >
                <div
                  className={`w-16 h-16 mx-auto ${persona.color} rounded-2xl flex items-center justify-center mb-4`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">
                  {persona.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {persona.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <button onClick={() => openChatbot()} className="btn-primary text-lg inline-block">
            Think You Qualify? Try It
          </button>
        </motion.div>
      </div>
    </section>
  );
}
