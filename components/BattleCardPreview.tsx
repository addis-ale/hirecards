'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, DollarSign, TrendingUp, CheckCircle, Users, MessageSquare, ListChecks, ClipboardList } from 'lucide-react';

const cardTypes = [
  {
    id: 1,
    type: 'Role Definition',
    icon: Briefcase,
    color: 'from-blue-500 to-blue-600',
    preview: {
      title: 'Senior Product Manager',
      department: 'Product',
      level: 'Senior',
      summary: 'Lead product strategy and execution for our core platform, working cross-functionally with engineering, design, and business teams.',
    }
  },
  {
    id: 2,
    type: 'Compensation',
    icon: DollarSign,
    color: 'from-green-500 to-green-600',
    preview: {
      range: '$140,000 - $180,000',
      equity: '0.1% - 0.25%',
      benefits: ['Health Insurance', '401(k) Match', 'Unlimited PTO'],
      position: '75th percentile',
    }
  },
  {
    id: 3,
    type: 'Market Data',
    icon: TrendingUp,
    color: 'from-purple-500 to-purple-600',
    preview: {
      demand: 'Very High',
      avgTimeToFill: '45 days',
      competition: 'High',
      trend: 'Growing +15% YoY',
    }
  },
  {
    id: 4,
    type: 'Requirements',
    icon: CheckCircle,
    color: 'from-pink-500 to-pink-600',
    preview: {
      experience: '5+ years in product management',
      skills: ['Product Strategy', 'Data Analysis', 'Stakeholder Management'],
      education: 'Bachelor\'s degree required',
    }
  },
];

export default function BattleCardPreview() {
  const [selectedCard, setSelectedCard] = useState(cardTypes[0]);

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
              See Your <span className="gradient-text">Battle Cards</span> in Action
            </h2>
            <p className="text-xl text-gray-600">
              Interactive preview of what you'll get
            </p>
          </motion.div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
                        ? 'border-primary-500 bg-primary-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{card.type}</h3>
                        <p className="text-sm text-gray-600">Click to preview</p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Card Preview */}
            <div className="relative h-[500px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCard.id}
                  initial={{ opacity: 0, rotateY: -30, x: -50 }}
                  animate={{ opacity: 1, rotateY: 0, x: 0 }}
                  exit={{ opacity: 0, rotateY: 30, x: 50 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <div className={`h-full bg-gradient-to-br ${selectedCard.color} rounded-2xl shadow-2xl p-8 text-white overflow-hidden`}>
                    <div className="flex items-center space-x-3 mb-6">
                      {(() => {
                        const Icon = selectedCard.icon;
                        return <Icon className="w-8 h-8" />;
                      })()}
                      <h3 className="text-2xl font-bold">{selectedCard.type}</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {Object.entries(selectedCard.preview).map(([key, value], index) => (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
                        >
                          <div className="text-sm font-semibold uppercase tracking-wide mb-1 opacity-80">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          {Array.isArray(value) ? (
                            <ul className="space-y-1">
                              {value.map((item, i) => (
                                <li key={i} className="flex items-center space-x-2">
                                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="text-lg font-semibold">{value}</div>
                          )}
                        </motion.div>
                      ))}
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
