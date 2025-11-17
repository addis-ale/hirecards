"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Users,
  MessageSquare,
  Target,
  AlertTriangle,
} from "lucide-react";

const cardTypes = [
  {
    id: 1,
    type: "Reality Check Card",
    icon: AlertTriangle,
    color: "bg-red-600",
    preview: {
      jobTitle: "Senior Full-Stack Engineer",
      location: "San Francisco • Remote OK • Series B Startup",
      feasibilityScore: "78/100",
      scoreNote: "Could be worse... barely",
      marketSalary: "$110K - $145K",
      yourSalary: "$85K-$105K (20% below market)",
      competition: "Very High",
      competitionNote: "87 similar roles posted this week",
      redFlags: [
        "Salary 20% below market",
        "87 competitors fighting for same talent",
        "Skill combo is rarer than expected",
      ],
      recommendations: [
        "Go remote or expand search radius",
        "Bump salary before someone else does",
        "Consider splitting role requirements",
      ],
    },
  },
  {
    id: 2,
    type: "Role Definition Card",
    icon: Briefcase,
    color: "bg-blue-600",
    preview: {
      title: "Senior Product Manager",
      department: "Product",
      level: "Senior",
      keyResponsibilities: [
        "Product Strategy",
        "Cross-functional Leadership",
        "Roadmap Planning",
      ],
      successMetrics: "Product adoption, Team velocity, Revenue impact",
    },
  },
  {
    id: 3,
    type: "Salary Benchmark Card",
    icon: DollarSign,
    color: "bg-green-600",
    preview: {
      baseSalary: "$140,000 - $180,000",
      equity: "0.1% - 0.25%",
      benefits: ["Health Insurance", "401(k) Match", "Unlimited PTO"],
      marketPosition: "75th percentile - Competitive",
    },
  },
  {
    id: 4,
    type: "Market Intelligence Card",
    icon: TrendingUp,
    color: "bg-purple-600",
    preview: {
      demand: "Very High - Growing +15% YoY",
      avgTimeToFill: "45 days",
      talentAvailability: "Moderate - 2,400 active candidates",
      competition: "High - Top companies hiring",
    },
  },
  {
    id: 5,
    type: "Candidate Persona Card",
    icon: Target,
    color: "bg-pink-600",
    preview: {
      idealProfile: "5+ years in product management",
      experienceLevel: "Senior IC or Lead",
      keySkills: [
        "Product Strategy",
        "Data Analysis",
        "Stakeholder Management",
      ],
      culturalFit: "Collaborative, Data-driven, Customer-focused",
    },
  },
  {
    id: 6,
    type: "Team Structure Card",
    icon: Users,
    color: "bg-indigo-600",
    preview: {
      reportsTo: "VP of Product",
      teamSize: "3-5 direct reports",
      collaboration: ["Engineering", "Design", "Marketing", "Sales"],
      organizationalImpact: "Cross-functional leadership",
    },
  },
  {
    id: 7,
    type: "Outreach Templates Card",
    icon: MessageSquare,
    color: "bg-orange-600",
    preview: {
      linkedInPitch: "Personalized connection message",
      emailTemplate: "Professional outreach email",
      followUp: "Thoughtful follow-up sequence",
      talkingPoints: ["Company mission", "Growth opportunity", "Team culture"],
    },
  },
  {
    id: 8,
    type: "Interview Guide Card",
    icon: CheckCircle,
    color: "bg-teal-600",
    preview: {
      structuredQuestions: [
        "Product strategy",
        "Stakeholder management",
        "Data-driven decisions",
      ],
      evaluationCriteria: "Strategic thinking, Communication, Execution",
      skillAssessments: "Product case study, Metrics analysis",
      hiringFramework: "Scorecard-based decision process",
    },
  },
];

export default function BattleCardPreview() {
  const [selectedCard, setSelectedCard] = useState(cardTypes[0]);

  return (
    <section
      className="py-20 md:py-32 relative overflow-hidden"
      style={{ backgroundColor: "#FFFFFF" }}
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
              See Your <span className="text-[#3B7CFF]">Battle Cards</span> in
              Action
            </h2>
            <p className="text-xl text-gray-600">
              Interactive preview of what you&apos;ll get
            </p>
          </motion.div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Card Type Selector */}
            <div className="space-y-4">
              {cardTypes.map((card) => {
                const Icon = card.icon;
                return (
                  <motion.button
                    key={card.id}
                    onClick={() => setSelectedCard(card)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                      selectedCard.id === card.id
                        ? "border-primary-500 bg-primary-50 shadow-lg"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {card.type}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Click to preview
                        </p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Card Preview */}
            <div className="relative lg:sticky lg:top-24 h-[900px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCard.id}
                  initial={{ opacity: 0, rotateY: -30, x: -50 }}
                  animate={{ opacity: 1, rotateY: 0, x: 0 }}
                  exit={{ opacity: 0, rotateY: 30, x: 50 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <div
                    className={`h-full ${selectedCard.color} rounded-2xl shadow-2xl p-8 text-white overflow-hidden relative`}
                  >
                    <div className="flex items-center space-x-3 mb-6">
                      {(() => {
                        const Icon = selectedCard.icon;
                        return <Icon className="w-8 h-8" />;
                      })()}
                      <h3 className="text-2xl font-bold">
                        {selectedCard.type}
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {Object.entries(selectedCard.preview).map(
                        ([key, value], index) => (
                          <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
                          >
                            <div className="text-sm font-semibold uppercase tracking-wide mb-1 opacity-80">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </div>
                            {Array.isArray(value) ? (
                              <ul className="space-y-1">
                                {value.map((item, i) => (
                                  <li
                                    key={i}
                                    className="flex items-center space-x-2"
                                  >
                                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <div className="text-lg font-semibold">
                                {value}
                              </div>
                            )}
                          </motion.div>
                        )
                      )}
                    </div>

                    <div className="absolute bottom-4 right-4 opacity-10">
                      {(() => {
                        const Icon = selectedCard.icon;
                        return <Icon className="w-32 h-32" />;
                      })()}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
