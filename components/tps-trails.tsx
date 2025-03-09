"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"

interface TpsTrailsProps {
  targetPosition: { x: string; y: string }
  startFromHero?: boolean
  startFromBottom?: boolean
}

export function TpsTrails({ targetPosition, startFromHero = false, startFromBottom = false }: TpsTrailsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Update dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)

    return () => {
      window.removeEventListener("resize", updateDimensions)
    }
  }, [])

  // Generate a large number of trails to simulate 1000 TPS
  const trailCount = 150 // Visually represents 1000 TPS without overwhelming the browser

  // Colors for the trails
  const colors = [
    { primary: "rgba(59, 130, 246, 1)", glow: "rgba(59, 130, 246, 0.8)" }, // blue
    { primary: "rgba(239, 68, 68, 1)", glow: "rgba(239, 68, 68, 0.8)" }, // red
    { primary: "rgba(249, 115, 22, 1)", glow: "rgba(249, 115, 22, 0.8)" }, // orange
  ]

  // Generate continuous trails
  const [trails, setTrails] = useState<any[]>([])

  useEffect(() => {
    // Generate initial trails
    const newTrails = Array.from({ length: trailCount }).map((_, i) => generateTrail(i))
    setTrails(newTrails)

    // Regenerate trails periodically
    const interval = setInterval(() => {
      setTrails((prev) => {
        // Replace a few trails at a time for continuous effect
        const updatedTrails = [...prev]
        for (let i = 0; i < 10; i++) {
          const index = Math.floor(Math.random() * trailCount)
          updatedTrails[index] = generateTrail(index)
        }
        return updatedTrails
      })
    }, 100)

    return () => clearInterval(interval)
  }, [dimensions, startFromHero, startFromBottom])

  // Generate a single trail with random properties
  function generateTrail(id: number) {
    const color = colors[Math.floor(Math.random() * colors.length)]

    // Determine start position based on props
    let startY
    if (startFromBottom) {
      startY = 95 // Start from bottom of screen
    } else if (startFromHero) {
      startY = 65 // Start from hero section
    } else {
      startY = 95 // Default to bottom
    }

    return {
      id,
      // Start position - horizontal spread around center
      startX: 50 + (Math.random() - 0.5) * 100, // Random horizontal position around center (35-65%)
      startY: startY, // Start position based on props
      // Random properties for varied appearance
      duration: 0.5 + Math.random() * 0.5, // Random duration (0.5-1s)
      delay: Math.random() * 0.3, // Random start delay
      size: 2 + Math.random() * 3, // Random trail size
      color,
      // Random offsets for Brownian motion
      offsetX: (Math.random() - 0.5) * 40, // Random X offset
      offsetY: (Math.random() - 0.5) * 10, // Random Y offset
    }
  }

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
      {dimensions.width > 0 &&
        trails.map((trail) => (
          <motion.div
            key={`${trail.id}-${trail.startX}`}
            className="absolute rounded-full"
            style={{
              width: trail.size,
              height: trail.size,
              backgroundColor: trail.color.primary,
              boxShadow: `0 0 10px 3px ${trail.color.glow}`,
              left: `${trail.startX}%`,
              top: `${trail.startY}%`,
            }}
            initial={{
              opacity: 0,
              scale: 0.5,
            }}
            animate={{
              left: [`${trail.startX}%`, `calc(${targetPosition.x} + ${trail.offsetX}px)`],
              top: [`${trail.startY}%`, `calc(${targetPosition.y} + ${trail.offsetY}px)`],
              opacity: [0, 1, 0],
              scale: [1, 2, 1],
            }}
            transition={{
              duration: trail.duration,
              delay: trail.delay,
              ease: "easeOut",
              times: [0, 0.2, 1],
            }}
          />
        ))}

      {/* Add comet tails for more visible trails */}
      {dimensions.width > 0 &&
        trails.slice(0, 50).map((trail) => (
          <motion.div
            key={`tail-${trail.id}-${trail.startX}`}
            className="absolute"
            style={{
              width: trail.size * 2,
              height: trail.size * 15,
              left: `${trail.startX}%`,
              top: `${trail.startY}%`,
              background: `linear-gradient(to top, ${trail.color.primary}, transparent)`,
              borderRadius: "50px",
              transformOrigin: "center bottom",
            }}
            initial={{
              opacity: 0,
              scaleY: 0.2,
            }}
            animate={{
              left: [`${trail.startX}%`, `calc(${targetPosition.x} + ${trail.offsetX}px)`],
              top: [`${trail.startY}%`, `calc(${targetPosition.y} + ${trail.offsetY}px)`],
              opacity: [0, 0.7, 0],
              scaleY: [0.2, 1, 0.2],
            }}
            transition={{
              duration: trail.duration,
              delay: trail.delay,
              ease: "easeOut",
              times: [0, 0.2, 1],
            }}
          />
        ))}
    </div>
  )
}

