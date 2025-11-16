"use client";

import {
  Briefcase,
  DollarSign,
  TrendingUp,
  Target,
  Users,
  MessageSquare,
  CheckCircle,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Briefcase,
    title: "Role Definition",
    description:
      'No more vague "team player wanted" BS. Get actual job descriptions that make sense.',
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: DollarSign,
    title: "Real Salary Data",
    description:
      "Stop underpaying (or overpaying) like an amateur. Market-aligned numbers that won't embarrass you.",
    color: "from-green-500 to-green-600",
  },
  {
    icon: TrendingUp,
    title: "Market Intel",
    description:
      "Know what's actually happening in talent land. Not your cousin's LinkedIn hot take.",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Target,
    title: "Candidate Persona",
    description:
      'Who you\'re actually looking for. (Spoiler: not just "passionate" about "synergy").',
    color: "from-pink-500 to-pink-600",
  },
  {
    icon: Users,
    title: "Team Structure",
    description:
      "Who reports to who without the org chart that looks like spaghetti.",
    color: "from-indigo-500 to-indigo-600",
  },
  {
    icon: MessageSquare,
    title: "Recruiting Messages",
    description:
      "Pitch templates that don't sound like a bot wrote them (ironically, our AI did).",
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: CheckCircle,
    title: "Interview Framework",
    description:
      "Ask better questions. Stop winging it. Hire people who can actually do the job.",
    color: "from-teal-500 to-teal-600",
  },
  {
    icon: Zap,
    title: "Share Anywhere",
    description:
      'Export faster than you can say "let\'s circle back on that hire."',
    color: "from-yellow-500 to-yellow-600",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 md:py-32 bg-white">
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              This Isn't Just
              <span className="gradient-text"> Pretty Cards</span>
              <br />
              <span className="text-2xl md:text-3xl font-normal text-gray-600">
                It's Structured Smackdown for Bad Hiring
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              Real insights. Real critique. Real results (the good kind).
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="card group hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
