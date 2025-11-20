"use client"

import { useEffect, useRef } from "react"

export default function GradientCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    // Animation state
    let animationId: number
    const particles: Array<{
      x: number
      y: number
      radius: number
      vx: number
      vy: number
      color: string
      opacity: number
    }> = []

    // Tomato color palette
    const colors = [
      "rgba(236, 76, 47, 0.4)", // Primary tomato
      "rgba(255, 107, 74, 0.35)", // Lighter tomato
      "rgba(255, 160, 122, 0.3)", // Tomato salmon
      "rgba(255, 200, 180, 0.25)", // Light peachy
    ]

    const initializeParticles = () => {
      particles.length = 0
      const particleCount = 4
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas!.width,
          y: Math.random() * canvas!.height,
          radius: 150 + Math.random() * 150,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          color: colors[i % colors.length],
          opacity: 0.3 + Math.random() * 0.2,
        })
      }
    }

    const animate = () => {
      // Clear canvas with light background
      ctx!.fillStyle = "rgba(255, 250, 246, 1)"
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height)

      // Update and draw particles
      particles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        // Bounce off edges
        if (particle.x - particle.radius < 0 || particle.x + particle.radius > canvas!.width) {
          particle.vx *= -1
        }
        if (particle.y - particle.radius < 0 || particle.y + particle.radius > canvas!.height) {
          particle.vy *= -1
        }

        // Keep in bounds
        particle.x = Math.max(particle.radius, Math.min(canvas!.width - particle.radius, particle.x))
        particle.y = Math.max(particle.radius, Math.min(canvas!.height - particle.radius, particle.y))

        const gradient = ctx!.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.radius)
        gradient.addColorStop(0, particle.color.replace(/[\d.]+\)/, `${particle.opacity})`))
        gradient.addColorStop(1, particle.color.replace(/[\d.]+\)/, "0)"))

        ctx!.fillStyle = gradient
        ctx!.fillRect(0, 0, canvas!.width, canvas!.height)
      })

      animationId = requestAnimationFrame(animate)
    }

    // Set canvas size and initialize
    const resizeCanvas = () => {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
      initializeParticles()
    }

    resizeCanvas()
    animate()

    window.addEventListener("resize", resizeCanvas)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

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
  )
}
