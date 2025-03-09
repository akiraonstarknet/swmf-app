"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useAnimation } from "framer-motion"

interface CometTrailProps {
  from: "left" | "center" | "right"
  to: "left" | "center" | "right"
  color: "blue" | "orange" | "red" | "purple"
  trigger: number
  duration: number
}

export function CometTrail({ from, to, color, trigger, duration }: CometTrailProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const cometHeadControls = useAnimation()
  const cometTailControls = useAnimation()

  // Color configurations
  const colorMap = {
    blue: {
      primary: "rgba(59, 130, 246, 0.8)",
      glow: "rgba(59, 130, 246, 0.6)",
      head: "rgba(59, 130, 246, 1)",
    },
    orange: {
      primary: "rgba(249, 115, 22, 0.8)",
      glow: "rgba(249, 115, 22, 0.6)",
      head: "rgba(249, 115, 22, 1)",
    },
    red: {
      primary: "rgba(239, 68, 68, 0.8)",
      glow: "rgba(239, 68, 68, 0.6)",
      head: "rgba(239, 68, 68, 1)",
    },
    purple: {
      primary: "rgba(147, 51, 234, 0.8)",
      glow: "rgba(147, 51, 234, 0.6)",
      head: "rgba(147, 51, 234, 1)",
    },
  }

  // Calculate positions based on from/to
  const getPosition = (position: "left" | "center" | "right", width: number) => {
    switch (position) {
      case "left":
        return 100 // 100px from left
      case "center":
        return width / 2
      case "right":
        return width - 100 // 100px from right
    }
  }

  // Update dimensions on resize
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

  // Trigger animation
  useEffect(() => {
    const animateComet = async () => {
      // Always start from center (Starknet)
      const startX = dimensions.width / 2
      const endX = to === "left" ? 100 : dimensions.width - 100
      const trailWidth = dimensions.width / 10 // 1/10 of screen width

      // Reset animations
      await cometHeadControls.set({
        left: startX,
        opacity: 0,
      })

      await cometTailControls.set({
        width: 0,
        opacity: 0,
        left: to === "left" ? startX - trailWidth : startX,
      })

      // Animate comet head
      cometHeadControls.start({
        left: endX,
        opacity: [0, 1, 0],
        transition: {
          left: { duration: duration, ease: "easeInOut" },
          opacity: { duration: duration, times: [0, 0.1, 1] },
        },
      })

      // Animate comet tail
      cometTailControls.start({
        width: trailWidth,
        opacity: [0, 1, 0],
        left: to === "left" ? endX - trailWidth : startX,
        transition: {
          width: { duration: duration / 3, ease: "easeOut" },
          left: { duration: duration, ease: "easeInOut" },
          opacity: { duration: duration, times: [0, 0.1, 1] },
        },
      })
    }

    if (dimensions.width > 0) {
      animateComet()
    }
  }, [trigger, dimensions, cometHeadControls, cometTailControls, duration, to])

  // Generate particles for comet tail
  const particles = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    size: 2 + Math.random() * 3,
    delay: i * 0.05,
    offsetX: 0,
    offsetY: Math.random() * 10 - 5,
  }))

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none">
      {dimensions.width > 0 && (
        <div className="absolute inset-0">
          {/* Comet head (glowing circle) */}
          <motion.div
            className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 z-1"
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: colorMap[color].head,
              boxShadow: `0 0 15px 5px ${colorMap[color].glow}`,
            }}
            animate={cometHeadControls}
            initial={{ left: dimensions.width / 2, opacity: 0 }}
          />

          {/* Comet tail */}
          {/* <motion.div
            className="absolute top-1/2 h-2 transform -translate-y-1/2 z-0"
            style={{
              background:
                to === "left"
                  ? `linear-gradient(to left, ${colorMap[color].primary}, transparent)`
                  : `linear-gradient(to right, transparent, ${colorMap[color].primary})`,
              boxShadow: `0 0 10px 2px ${colorMap[color].glow}`,
            }}
            animate={cometTailControls}
            initial={{
              width: 0,
              opacity: 0,
              left: to === "left" ? dimensions.width / 2 - dimensions.width / 10 : dimensions.width / 2,
            }}
          /> */}

          {/* Particles for comet effect */}
          <motion.div
            className="absolute top-1/2 transform -translate-y-1/2 z-0"
            animate={cometHeadControls}
            initial={{ left: dimensions.width / 2, opacity: 0 }}
          >
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute rounded-full"
                style={{
                  width: particle.size,
                  height: particle.size,
                  backgroundColor: colorMap[color].head,
                  boxShadow: `0 0 8px 2px ${colorMap[color].glow}`,
                  top: particle.offsetY,
                  left: to === "left" ? -20 - particle.offsetX : 20 + particle.offsetX,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{
                  duration: duration / 2,
                  delay: particle.delay,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>
        </div>
      )}
    </div>
  )
}

