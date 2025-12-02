"use client";

import {
  Briefcase,
  Code,
  TrendingUp,
  Map,
  DollarSign,
  Target,
  BarChart3,
  UserCheck,
  MessageSquare,
  Send,
  Mic,
  ClipboardList,
  CalendarCheck,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Briefcase,
    title: "Role Card",
    description:
      "What this person will actually do and what success looks like in the first 6–12 months.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Code,
    title: "Skills Card",
    description:
      "The must-have abilities, tools, and experience needed to perform the role.",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: TrendingUp,
    title: "Market Card",
    description:
      "How big the talent pool is and how competitive the market is for this profile.",
    color: "from-indigo-500 to-indigo-600",
  },
  {
    icon: Map,
    title: "Talent Map Card",
    description:
      "Where the strongest candidates come from, companies, locations, and common backgrounds.",
    color: "from-cyan-500 to-cyan-600",
  },
  {
    icon: DollarSign,
    title: "Pay Card",
    description:
      "What candidates expect to earn in this market and how your budget compares.",
    color: "from-green-500 to-green-600",
  },
  {
    icon: Target,
    title: "Reality Card",
    description:
      "Feasibility score, market conditions, what helps or hurts your case, and the truth about making this hire.",
    color: "from-red-500 to-red-600",
  },
  {
    icon: BarChart3,
    title: "Funnel Card",
    description:
      "The volume of outreach and interviews you'll need to fill the role.",
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: UserCheck,
    title: "Fit Card",
    description:
      "What motivates this persona, what they care about, and what usually makes them say yes or no.",
    color: "from-pink-500 to-pink-600",
  },
  {
    icon: MessageSquare,
    title: "Message Card",
    description:
      "How to pitch the role in a way that actually gets replies.",
    color: "from-violet-500 to-violet-600",
  },
  {
    icon: Send,
    title: "Outreach Card",
    description:
      "Ready-to-send email and DM templates for reaching ideal candidates.",
    color: "from-sky-500 to-sky-600",
  },
  {
    icon: Mic,
    title: "Interview Card",
    description:
      "The recommended interview process and competencies to assess at each stage.",
    color: "from-teal-500 to-teal-600",
  },
  {
    icon: ClipboardList,
    title: "Scorecard Card",
    description:
      "A simple evaluation framework to keep the team aligned and reduce bias.",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    icon: CalendarCheck,
    title: "Plan Card",
    description:
      "Your next steps, the checklist, SLAs, and actions to kick off and run the hiring process well.",
    color: "from-amber-500 to-amber-600",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="py-20 md:py-32"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      {/* Header with Container */}
      <div className="section-container mb-16">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              This Isn&apos;t Just
              <span style={{ color: "#70B2B2" }}> Pretty Cards</span>
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
      </div>

      {/* Scrolling Cards - Full Width */}
      <div className="w-full">
        {/* Top Row - Scrolling Right */}
        <div className="relative overflow-hidden mb-6">
          <motion.div
            className="flex gap-6"
            animate={{
              x: [0, -2000],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40,
                ease: "linear",
              },
            }}
          >
            {/* Duplicate the first 7 cards twice for seamless loop */}
            {[...features.slice(0, 7), ...features.slice(0, 7)].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={`top-${index}`}
                  className="relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer group flex-shrink-0"
                  style={{
                    width: "320px",
                    height: "280px",
                  }}
                >
                  {/* Gradient Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}
                  ></div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col p-6">
                    {/* Icon */}
                    <div
                      className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    {/* Text Content */}
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-lg font-bold mb-3 text-gray-900 group-hover:text-[#3B7CFF] transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm">
                        {feature.description}
                      </p>
                    </div>

                    {/* Decorative Element */}
                    <div
                      className={`absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-tl-full transition-all duration-500 transform translate-x-6 translate-y-6`}
                    ></div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Bottom Row - Scrolling Left */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-6"
            animate={{
              x: [-2000, 0],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40,
                ease: "linear",
              },
            }}
          >
            {/* Duplicate the last 6 cards twice for seamless loop */}
            {[...features.slice(7, 13), ...features.slice(7, 13)].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={`bottom-${index}`}
                  className="relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer group flex-shrink-0"
                  style={{
                    width: "320px",
                    height: "280px",
                  }}
                >
                  {/* Gradient Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}
                  ></div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col p-6">
                    {/* Icon */}
                    <div
                      className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    {/* Text Content */}
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-lg font-bold mb-3 text-gray-900 group-hover:text-[#3B7CFF] transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm">
                        {feature.description}
                      </p>
                    </div>

                    {/* Decorative Element */}
                    <div
                      className={`absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-tl-full transition-all duration-500 transform translate-x-6 translate-y-6`}
                    ></div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
