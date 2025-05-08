"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export function ConfettiExplosion() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Confetti class
    class Confetti {
      x: number
      y: number
      size: number
      color: string
      speedX: number
      speedY: number
      angle: number
      rotationSpeed: number
      shape: "circle" | "square" | "triangle"
      canvasWidth: number
      canvasHeight: number

      constructor(canvasWidth: number, canvasHeight: number) {
        this.canvasWidth = canvasWidth
        this.canvasHeight = canvasHeight
        this.x = Math.random() * this.canvasWidth
        this.y = Math.random() * this.canvasHeight - this.canvasHeight
        this.size = Math.random() * 10 + 5
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`
        this.speedX = Math.random() * 3 - 1.5
        this.speedY = Math.random() * 3 + 1.5
        this.angle = Math.random() * 360
        this.rotationSpeed = Math.random() * 0.2 - 0.1
        this.shape = Math.random() < 0.33 ? "circle" : Math.random() < 0.5 ? "square" : "triangle"
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY
        this.angle += this.rotationSpeed

        // Add gravity
        this.speedY += 0.05

        // Add some randomness to movement
        this.speedX += (Math.random() - 0.5) * 0.1
      }

      draw(context: CanvasRenderingContext2D) {
        context.save()
        context.translate(this.x, this.y)
        context.rotate((this.angle * Math.PI) / 180)
        context.fillStyle = this.color

        if (this.shape === "circle") {
          context.beginPath()
          context.arc(0, 0, this.size / 2, 0, Math.PI * 2)
          context.fill()
        } else if (this.shape === "square") {
          context.fillRect(-this.size / 2, -this.size / 2, this.size, this.size)
        } else if (this.shape === "triangle") {
          context.beginPath()
          context.moveTo(0, -this.size / 2)
          context.lineTo(this.size / 2, this.size / 2)
          context.lineTo(-this.size / 2, this.size / 2)
          context.closePath()
          context.fill()
        }

        context.restore()
      }
    }

    // Store current canvas dimensions
    const canvasWidth = canvas.width
    const canvasHeight = canvas.height

    // Create confetti
    const confettiArray: Confetti[] = []
    const confettiCount = 200

    for (let i = 0; i < confettiCount; i++) {
      confettiArray.push(new Confetti(canvasWidth, canvasHeight))
    }

    // Animation loop
    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)

      for (let i = 0; i < confettiArray.length; i++) {
        confettiArray[i].update()
        confettiArray[i].draw(ctx)

        // Remove confetti that's off screen
        if (confettiArray[i].y > canvasHeight + 100) {
          confettiArray.splice(i, 1)
          i--
        }
      }

      if (confettiArray.length > 0) {
        animationId = requestAnimationFrame(animate)
      }
    }

    animate()

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 pointer-events-none z-50"
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </motion.div>
  )
}
