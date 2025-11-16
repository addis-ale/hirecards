"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function StatsBar() {
  const [hiringMessesFixed, setHiringMessesFixed] = useState(0);

  useEffect(() => {
    // Simulate a growing counter
    const baseCount = 1337;
    const randomIncrement = Math.floor(Math.random() * 50);
    const targetCount = baseCount + randomIncrement;

    let current = 0;
    const duration = 2000;
    const steps = 60;
    const increment = targetCount / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetCount) {
        setHiringMessesFixed(targetCount);
        clearInterval(timer);
      } else {
        setHiringMessesFixed(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="fixed bottom-8 right-8 z-40 hidden md:block"
    >
      <div className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-sm border border-white/20">
        <div className="text-center">
          <div className="text-sm font-semibold opacity-90 mb-1">
            Hiring Messes Fixed Today
          </div>
          <div className="text-4xl font-bold">
            {hiringMessesFixed.toLocaleString()}+
          </div>
          <div className="text-xs opacity-75 mt-1">
            (and counting... mostly upwards)
          </div>
        </div>
      </div>
    </motion.div>
  );
}

