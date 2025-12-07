"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiEffectProps {
  trigger: boolean;
  onComplete?: () => void;
}

export const ConfettiEffect: React.FC<ConfettiEffectProps> = ({ trigger, onComplete }) => {
  const [confetti, setConfetti] = useState<Array<{
    id: number;
    x: number;
    y: number;
    color: string;
    rotation: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    if (trigger) {
      // Generate confetti pieces
      const colors = [
        "#278f8c", // Teal
        "#1a6764", // Dark teal
        "#10b981", // Green
        "#f59e0b", // Amber
        "#f97316", // Orange
        "#ef4444", // Red
        "#8b5cf6", // Purple
        "#ec4899", // Pink
      ];

      const pieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        delay: Math.random() * 0.5,
      }));

      setConfetti(pieces);

      // Clean up after animation
      const timer = setTimeout(() => {
        setConfetti([]);
        onComplete?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  return (
    <AnimatePresence>
      {confetti.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {confetti.map((piece) => (
            <motion.div
              key={piece.id}
              initial={{
                x: `${piece.x}%`,
                y: `${piece.y}%`,
                rotate: piece.rotation,
                scale: 1,
                opacity: 1,
              }}
              animate={{
                y: "110%",
                x: `${piece.x + (Math.random() - 0.5) * 20}%`,
                rotate: piece.rotation + 360,
                scale: [1, 1.2, 0.8, 0],
                opacity: [1, 1, 1, 0],
              }}
              transition={{
                duration: 2 + Math.random(),
                delay: piece.delay,
                ease: "easeOut",
              }}
              className="absolute w-3 h-3 rounded-sm"
              style={{
                backgroundColor: piece.color,
                boxShadow: `0 0 6px ${piece.color}`,
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

