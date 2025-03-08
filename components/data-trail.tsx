"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useAnimation } from "framer-motion"

interface DataTrailProps {
  from: "left" | "center" | "right"
  to: "left" | "center" | "right"
  color: "blue" | "orange" | "red" | "purple"
  trigger: number
  duration: number
}

export function DataTrail({ from, to, color, trigger, duration }: DataTrailProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const trailControls = useAnimation()
  const headControls = useAnimation()

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
    const animateTrail = async () => {
      // Reset animations
      await trailControls.set({ pathLength: 0, opacity: 0 })
      await headControls.set({ pathOffset: 0, opacity: 0 })

      // Animate trail and head
      trailControls.start({
        pathLength: 1,
        opacity: [0, 1, 1, 0],
        transition: {
          pathLength: { duration: duration, ease: "easeInOut" },
          opacity: { duration: duration, times: [0, 0.1, 0.9, 1] },
        },
      })

      headControls.start({
        pathOffset: 1,
        opacity: [0, 1, 0],
        transition: {
          pathOffset: { duration: duration, ease: "easeInOut" },
          opacity: { duration: duration, times: [0, 0.1, 1] },
        },
      })
    }

    if (dimensions.width > 0) {
      animateTrail()
    }
  }, [trigger, dimensions, trailControls, headControls, duration])

  // Calculate path
  const fromX = getPosition(from, dimensions.width)
  const toX = getPosition(to, dimensions.width)
  const centerY = dimensions.height / 2

  // Calculate trail length (1/10 of screen width)
  const trailLength = dimensions.width / 10

  // Calculate path
  const path = `M ${fromX} ${centerY} L ${toX} ${centerY}`

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none">
      {dimensions.width > 0 && (
        <>
          {/* Trail */}
          <svg className="absolute inset-0 w-full h-full">
            <motion.path
              d={path}
              stroke={colorMap[color].primary}
              strokeWidth={3}
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={trailControls}
              style={{
                filter: `drop-shadow(0 0 6px ${colorMap[color].glow})`,
                strokeDasharray: trailLength,
                strokeDashoffset: 0,
              }}
            />
          </svg>

          {/* Head of the trail (glowing circle) */}
          <svg className="absolute inset-0 w-full h-full">
            <motion.circle
              cx={0}
              cy={0}
              r={6}
              fill={colorMap[color].head}
              initial={{ pathOffset: 0, opacity: 0 }}
              animate={headControls}
              style={{
                offsetPath: `path("${path}")`,
                filter: `drop-shadow(0 0 8px ${colorMap[color].head})`,
              }}
            />
          </svg>
        </>
      )}
    </div>
  )
}

