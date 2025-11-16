'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  DollarSign,
  TrendingUp,
  CheckCircle,
  List,
  Users,
  MessageSquare,
  Clipboard,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface BattleCardProps {
  card: {
    id: number;
    type: string;
    title: string;
    icon: string;
    content: any;
  };
  index: number;
}

const iconMap: { [key: string]: any } = {
  briefcase: Briefcase,
  'dollar-sign': DollarSign,
  'trending-up': TrendingUp,
  'check-circle': CheckCircle,
  list: List,
  users: Users,
  'message-square': MessageSquare,
  clipboard: Clipboard,
};

const colorMap: { [key: string]: string } = {
  'Role Definition': 'from-blue-500 to-blue-600',
  'Compensation': 'from-green-500 to-green-600',
  'Market Intelligence': 'from-purple-500 to-purple-600',
  'Requirements': 'from-pink-500 to-pink-600',
  'Responsibilities': 'from-indigo-500 to-indigo-600',
  'Culture Fit': 'from-orange-500 to-orange-600',
  'Messaging': 'from-teal-500 to-teal-600',
  'Interview Guide': 'from-yellow-500 to-yellow-600',
};

export default function BattleCard({ card, index }: BattleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = iconMap[card.icon] || Briefcase;
  const colorClass = colorMap[card.type] || 'from-gray-500 to-gray-600';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group"
    >
      <div
        className={`relative h-full bg-gradient-to-br ${colorClass} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Card Header */}
        <div className="p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <Icon className="w-8 h-8" />
            <button
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>
          <h3 className="text-2xl font-bold mb-2">{card.title}</h3>
          <p className="text-sm opacity-90">{card.type}</p>
        </div>

        {/* Card Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white text-gray-900"
            >
              <div className="p-6 space-y-4">
                {Object.entries(card.content).map(([key, value]) => (
                  <div key={key} className="border-b border-gray-100 pb-3 last:border-0">
                    <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    {Array.isArray(value) ? (
                      <ul className="space-y-1">
                        {value.map((item: string, i: number) => (
                          <li key={i} className="flex items-start space-x-2 text-sm">
                            <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mt-1.5 flex-shrink-0"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-sm font-medium text-gray-900">{value}</div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed Preview */}
        {!isExpanded && (
          <div className="p-6 bg-white/10 backdrop-blur-sm text-white">
            <div className="space-y-2">
              {Object.entries(card.content).slice(0, 2).map(([key, value]) => (
                <div key={key} className="text-sm">
                  <span className="opacity-75">
                    {key.replace(/([A-Z])/g, ' $1').trim()}:{' '}
                  </span>
                  <span className="font-semibold">
                    {Array.isArray(value) ? value.length + ' items' : String(value).substring(0, 30) + '...'}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs opacity-75">Click to expand</div>
          </div>
        )}

        {/* Decorative Icon */}
        <div className="absolute bottom-4 right-4 opacity-10 pointer-events-none">
          <Icon className="w-24 h-24" />
        </div>
      </div>
    </motion.div>
  );
}
