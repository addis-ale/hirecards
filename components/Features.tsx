"use client";

import {
  Briefcase,
  DollarSign,
  TrendingUp,
  Target,
  Users,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: AlertTriangle,
    title: "Reality Check Card",
    description:
      "Feasibility score, market salary range, competition analysis, red flags, and instant recommendations.",
    color: "from-red-500 to-red-600",
  },
  {
    icon: Briefcase,
    title: "Role Definition Card",
    description:
      "Clear job description, key responsibilities, required skills, and success metrics for the position.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: DollarSign,
    title: "Salary Benchmark Card",
    description:
      "Market-aligned compensation data, equity ranges, benefits comparison, and competitive positioning.",
    color: "from-green-500 to-green-600",
  },
  {
    icon: TrendingUp,
    title: "Market Intelligence Card",
    description:
      "Hiring trends, demand analysis, talent availability, and competitive landscape insights.",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Target,
    title: "Candidate Persona Card",
    description:
      "Ideal candidate profile, experience level, skill requirements, and cultural fit indicators.",
    color: "from-pink-500 to-pink-600",
  },
  {
    icon: Users,
    title: "Team Structure Card",
    description:
      "Reporting lines, team composition, collaboration needs, and organizational fit analysis.",
    color: "from-indigo-500 to-indigo-600",
  },
  {
    icon: MessageSquare,
    title: "Outreach Templates Card",
    description:
      "Recruiting messages, email templates, LinkedIn pitches, and personalized outreach strategies.",
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: CheckCircle,
    title: "Interview Guide Card",
    description:
      "Structured questions, evaluation criteria, skill assessments, and hiring decision framework.",
    color: "from-teal-500 to-teal-600",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="py-20 md:py-32"
      style={{ backgroundColor: "#FFFFFF" }}
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
              This Isn&apos;t Just
              <span className="text-[#3B7CFF]"> Pretty Cards</span>
              <br />
              <span className="text-2xl md:text-3xl font-normal text-gray-600">
                It&apos;s Structured Smackdown for Bad Hiring
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
                className="relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer group"
                style={{
                  aspectRatio: "1 / 1.1",
                }}
              >
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}
                ></div>

                {/* Content */}
                <div className="relative h-full flex flex-col p-8">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-[#3B7CFF] transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {feature.description}
                    </p>
                  </div>

                  {/* Decorative Element */}
                  <div
                    className={`absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-tl-full transition-all duration-500 transform translate-x-8 translate-y-8`}
                  ></div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
