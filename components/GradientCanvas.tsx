"use client";

import { useEffect, useRef } from "react";

export default function GradientCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawGradient();
    };

    const drawGradient = () => {
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) / 1.5
      );

      gradient.addColorStop(0, "#ffffff");
      gradient.addColorStop(0.3, "#ffffff");
      gradient.addColorStop(0.7, "#f5faff");
      gradient.addColorStop(1, "#cfe9ff");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add subtle animated circles
      const time = Date.now() * 0.001;

      // Circle 1
      const circle1X = canvas.width * (0.5 + Math.sin(time * 0.3) * 0.1);
      const circle1Y = canvas.height * (0.3 + Math.cos(time * 0.2) * 0.1);
      const gradient1 = ctx.createRadialGradient(
        circle1X,
        circle1Y,
        0,
        circle1X,
        circle1Y,
        300
      );
      gradient1.addColorStop(0, "rgba(66, 133, 244, 0.1)");
      gradient1.addColorStop(1, "rgba(66, 133, 244, 0)");
      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Circle 2
      const circle2X = canvas.width * (0.7 + Math.cos(time * 0.25) * 0.1);
      const circle2Y = canvas.height * (0.6 + Math.sin(time * 0.15) * 0.1);
      const gradient2 = ctx.createRadialGradient(
        circle2X,
        circle2Y,
        0,
        circle2X,
        circle2Y,
        250
      );
      gradient2.addColorStop(0, "rgba(15, 191, 149, 0.08)");
      gradient2.addColorStop(1, "rgba(15, 191, 149, 0)");
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Animation loop
    let animationId: number;
    const animate = () => {
      drawGradient();
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="gradient-canvas"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}

