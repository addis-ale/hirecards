"use client";

import { useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Zap, Target, Sparkles } from "lucide-react";
import { StaticOrb, GridPattern, StaticBeam } from "./HeroBackground";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #ffffff 0%, #f0f9ff 50%, #ffffff 100%)",
      }}
    >
      {/* Background Elements */}
      <GridPattern />
      <StaticBeam />
      <StaticOrb size={400} initialX={10} initialY={20} />
      <StaticOrb size={300} initialX={80} initialY={70} />
      <StaticOrb size={250} initialX={50} initialY={50} />

      {/* Mouse Follower Effect */}
      <motion.div
        className="pointer-events-none absolute rounded-full opacity-20 blur-2xl"
        style={{
          width: 300,
          height: 300,
          background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)",
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-cyan-200 shadow-lg mb-6"
        >
          <Sparkles className="w-4 h-4 text-cyan-600" />
          <span className="text-sm font-medium text-gray-700">
            AI-Powered Hiring Intelligence
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
        >
          <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Transform Hiring
          </span>
          <br />
          <span className="text-gray-900">Into Strategy</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
        >
          Instantly generate comprehensive hiring battle cards with market insights,
          salary data, and strategic guidance powered by AI.
        </motion.p>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-10"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">60-Second Setup</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md">
            <Target className="w-5 h-5 text-cyan-600" />
            <span className="text-sm font-medium text-gray-700">Real-Time Market Data</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">AI-Powered Insights</span>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <button
            onClick={onGetStarted}
            className="group relative px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-2">
              Get Started Free
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
          <p className="mt-4 text-sm text-gray-500">
            No credit card required • Generate unlimited cards
          </p>
        </motion.div>
      </div>
    </div>
  );
}
