"use client";

import { motion } from "framer-motion";
import {
  Code,
  Briefcase,
  Coffee,
  Target,
  TrendingUp,
  Users,
  Zap,
  Rocket,
} from "lucide-react";

const personas = [
  {
    icon: Briefcase,
    title: "Startup Founder",
    description: "Hiring is hard. Doing it wrong is expensive.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Users,
    title: "Head of Talent",
    description: "Drowning in reqs. This is your life raft.",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Coffee,
    title: "Solo Recruiter",
    description: "You're doing the work of 5 people. We know.",
    color: "from-pink-500 to-pink-600",
  },
  {
    icon: Target,
    title: "Hiring Manager",
    description: "You just want a job description that makes sense.",
    color: "from-green-500 to-green-600",
  },
  {
    icon: TrendingUp,
    title: "VP of People",
    description: "Scaling fast. Breaking things. Need structure.",
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: Code,
    title: "Tech Lead",
    description: "If it compiles, it ships. If they can code, they're hired.",
    color: "from-indigo-500 to-indigo-600",
  },
  {
    icon: Rocket,
    title: "Growth Team",
    description: "You need people yesterday. We get it.",
    color: "from-teal-500 to-teal-600",
  },
  {
    icon: Zap,
    title: "Speed Demon",
    description: "Move fast. Hire faster. No excuses.",
    color: "from-yellow-500 to-yellow-600",
  },
];

export default function BuiltFor() {
  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="section-container">
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
              <span className="gradient-text">Beautiful Delusionals</span>
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
                  className={`w-16 h-16 mx-auto bg-gradient-to-br ${persona.color} rounded-2xl flex items-center justify-center mb-4`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">{persona.title}</h3>
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
          <a href="/create" className="btn-primary text-lg inline-block">
            Think You Qualify? Try It 🎯
          </a>
        </motion.div>
      </div>
    </section>
  );
}
