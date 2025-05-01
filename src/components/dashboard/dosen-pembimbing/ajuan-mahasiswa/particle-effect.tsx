"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface ParticleEffectProps {
  type: "approve" | "reject"
}

export function ParticleEffect({ type }: ParticleEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Particle class
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor(x: number, y: number, size: number, color: string) {
        this.x = x
        this.y = y
        this.size = size
        this.speedX = (Math.random() - 0.5) * 8
        this.speedY = (Math.random() - 0.5) * 8
        this.color = color
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.size > 0.2) this.size -= 0.1
      }

      draw(context: CanvasRenderingContext2D) {
        context.fillStyle = this.color
        context.beginPath()
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        context.fill()
      }
    }

    // Create particles
    const particleArray: Particle[] = []
    const particleCount = 100
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 5 + 1
      const color =
        type === "approve"
          ? `rgba(34, 197, 94, ${Math.random() * 0.8 + 0.2})`
          : `rgba(239, 68, 68, ${Math.random() * 0.8 + 0.2})`

      particleArray.push(new Particle(centerX, centerY, size, color))
    }

    // Animation loop
    let animationId: number
    
    // Store width and height to avoid null checks
    const canvasWidth = canvas.width
    const canvasHeight = canvas.height

    const animate = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)

      for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].update()
        particleArray[i].draw(ctx)

        // Remove tiny particles
        if (particleArray[i].size <= 0.2) {
          particleArray.splice(i, 1)
          i--
        }
      }

      if (particleArray.length > 0) {
        animationId = requestAnimationFrame(animate)
      }
    }

    animate()

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [type])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 pointer-events-none z-10"
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </motion.div>
  )
}
