"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface TrailProps {
  start: { x: string; y: string }
  end: { x: string; y: string }
  color: string
  trigger: number
  isFlame?: boolean
}

export function Trail({ start, end, color, trigger, isFlame = false }: TrailProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => setIsAnimating(false), 800)
    return () => clearTimeout(timer)
  }, [trigger])

  const colorMap = {
    blue: "rgba(59, 130, 246, 0.8)",
    orange: "rgba(249, 115, 22, 0.8)",
    red: "rgba(239, 68, 68, 0.8)",
  }

  const glowColor = colorMap[color as keyof typeof colorMap]

  if (isFlame) {
    return (
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {/* Main trail */}
        <motion.div
          className="absolute h-1 rounded-full"
          style={{
            left: start.x,
            top: start.y,
            transformOrigin: "left center",
            background: glowColor,
            boxShadow: `0 0 10px 3px ${glowColor}`,
            width: isAnimating ? "100%" : "0%",
          }}
          initial={{
            scaleX: 0,
            opacity: 0,
          }}
          animate={{
            scaleX: isAnimating ? 1 : 0,
            opacity: isAnimating ? [0, 1, 0.7, 0] : 0,
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          transformTemplate={(_, transform) => {
            // Calculate angle between start and end points
            const startX = (Number.parseFloat(start.x) / 100) * window.innerWidth
            const startY = (Number.parseFloat(start.y) / 100) * window.innerHeight
            const endX = (Number.parseFloat(end.x) / 100) * window.innerWidth
            const endY = (Number.parseFloat(end.y) / 100) * window.innerHeight

            const angle = (Math.atan2(endY - startY, endX - startX) * 180) / Math.PI

            return `${transform} rotate(${angle}deg)`
          }}
        />

        {/* Flame particles */}
        {isAnimating &&
          [...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                left: start.x,
                top: start.y,
                width: 2 + Math.random() * 3,
                height: 2 + Math.random() * 3,
                background: glowColor,
                boxShadow: `0 0 8px 2px ${glowColor}`,
              }}
              initial={{
                x: 0,
                y: 0,
                opacity: 0,
              }}
              animate={{
                x: `calc(${(Number.parseFloat(end.x) - Number.parseFloat(start.x)) * (0.3 + Math.random() * 0.7)}px + ${Math.random() * 20 - 10}px)`,
                y: `calc(${(Number.parseFloat(end.y) - Number.parseFloat(start.y)) * (0.3 + Math.random() * 0.7)}px + ${Math.random() * 20 - 10}px)`,
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 0.5 + Math.random() * 0.3,
                delay: i * 0.05,
                ease: "easeOut",
              }}
            />
          ))}
      </div>
    )
  }

  // Original trail if not flame
  return (
    <div
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{
        transformOrigin: start.x + " " + start.y,
      }}
    >
      <motion.div
        className="absolute h-0.5 rounded-full"
        style={{
          left: start.x,
          top: start.y,
          transformOrigin: "left center",
          background: glowColor,
          boxShadow: `0 0 8px 2px ${glowColor}`,
          width: isAnimating ? "100%" : "0%",
        }}
        initial={{
          scaleX: 0,
          opacity: 0,
        }}
        animate={{
          scaleX: isAnimating ? 1 : 0,
          opacity: isAnimating ? 1 : 0,
        }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
        transformTemplate={(_, transform) => {
          // Calculate angle between start and end points
          const startX = (Number.parseFloat(start.x) / 100) * window.innerWidth
          const startY = (Number.parseFloat(start.y) / 100) * window.innerHeight
          const endX = (Number.parseFloat(end.x) / 100) * window.innerWidth
          const endY = (Number.parseFloat(end.y) / 100) * window.innerHeight

          const angle = (Math.atan2(endY - startY, endX - startX) * 180) / Math.PI

          return `${transform} rotate(${angle}deg)`
        }}
      />
    </div>
  )
}

