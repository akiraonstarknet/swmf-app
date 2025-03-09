"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"

type CometTrailProps = {
  from: "left" | "right" | "center"
  to: "left" | "right" | "center"
  color: "blue" | "orange" | "green" | "purple"
  flowDirection: "inward" | "outward"
  trigger: number
  duration: number
}

export function CometTrail2({ from, to, color, flowDirection, trigger, duration }: CometTrailProps) {
  const [path, setPath] = useState<string>("")
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate path based on from and to positions
  useEffect(() => {
    const calculatePath = () => {
      if (!containerRef.current) return

      const container = containerRef.current
      const width = container.clientWidth
      const height = container.clientHeight

      setDimensions({ width, height })

      const getX = (position: string): number => {
        switch (position) {
          case "left":
            return width * 0.1
          case "right":
            return width * 0.9
          case "center":
          default:
            return width * 0.5
        }
      }

      const fromX = getX(from)
      const toX = getX(to)
      const y = height / 2

      // Create a straight line path
      const svgPath = `M ${fromX} ${y} L ${toX} ${y}`

      setPath(svgPath)
    }

    calculatePath()
    window.addEventListener("resize", calculatePath)

    return () => {
      window.removeEventListener("resize", calculatePath)
    }
  }, [from, to])

  // Get magical fire color values based on the specified color
  const getMagicalFireColors = (
    colorName: string,
  ): {
    core: string
    mid: string
    outer: string
    glow: string
    spark1: string
    spark2: string
    magic: string
  } => {
    switch (colorName) {
      case "blue":
        return {
          core: "#0369A1", // Deep intense blue
          mid: "#0EA5E9", // Medium blue
          outer: "#7DD3FC", // Light blue
          glow: "rgba(14, 165, 233, 0.9)", // Blue glow (increased opacity)
          spark1: "#BAE6FD", // Very light blue
          spark2: "#0284C7", // Darker blue
          magic: "#F0F9FF", // Almost white blue
        }
      case "orange":
        return {
          core: "#C2410C", // Deep intense orange
          mid: "#F97316", // Medium orange
          outer: "#FDBA74", // Light orange
          glow: "rgba(249, 115, 22, 0.9)", // Orange glow (increased opacity)
          spark1: "#FED7AA", // Very light orange
          spark2: "#EA580C", // Darker orange
          magic: "#FFF7ED", // Almost white orange
        }
      default:
        return {
          core: "#0369A1", // Default to blue
          mid: "#0EA5E9",
          outer: "#7DD3FC",
          glow: "rgba(14, 165, 233, 0.9)",
          spark1: "#BAE6FD",
          spark2: "#0284C7",
          magic: "#F0F9FF",
        }
    }
  }

  const fireColors = getMagicalFireColors(color)
  const filterId = `fire-glow-${color}`
  const fireGradientId = `fire-gradient-${color}`
  const coreGradientId = `core-gradient-${color}`
  const heatDistortionId = `heat-distortion-${color}`
  const turbulenceId = `turbulence-${color}`
  const denseGlowId = `dense-glow-${color}`

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {path && dimensions.width > 0 && (
        <svg width={dimensions.width} height={dimensions.height} className="absolute inset-0">
          {/* Filters and gradients for magical fire effects */}
          <defs>
            {/* Fire glow filter - increased intensity */}
            <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="10" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Dense glow filter - for more intense effects */}
            <filter id={denseGlowId} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="15" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Heat distortion filter */}
            <filter id={heatDistortionId}>
              <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="turbulence" seed="3">
                <animate attributeName="baseFrequency" values="0.05;0.07;0.05" dur="10s" repeatCount="indefinite" />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="15" />
            </filter>

            {/* Turbulence filter for flame distortion - increased intensity */}
            <filter id={turbulenceId}>
              <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="4" result="turbulence" seed="5">
                <animate attributeName="baseFrequency" values="0.03;0.05;0.03" dur="8s" repeatCount="indefinite" />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="20" />
            </filter>

            {/* Fire gradient - from core to outer */}
            <linearGradient id={fireGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={fireColors.core}>
                <animate
                  attributeName="stop-color"
                  values={`${fireColors.core};${fireColors.mid};${fireColors.core}`}
                  dur="3s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="50%" stopColor={fireColors.mid}>
                <animate
                  attributeName="stop-color"
                  values={`${fireColors.mid};${fireColors.outer};${fireColors.mid}`}
                  dur="2s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor={fireColors.outer}>
                <animate
                  attributeName="stop-color"
                  values={`${fireColors.outer};${fireColors.mid};${fireColors.outer}`}
                  dur="3s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>

            {/* Core gradient - for the intense center */}
            <radialGradient id={coreGradientId}>
              <stop offset="0%" stopColor={fireColors.core} />
              <stop offset="70%" stopColor={fireColors.mid} />
              <stop offset="100%" stopColor={fireColors.outer} />
            </radialGradient>
          </defs>

          {/* Background glow for density */}
          <motion.path
            d={path}
            fill="none"
            stroke={fireColors.outer}
            strokeWidth={60}
            strokeLinecap="round"
            filter={`url(#${denseGlowId})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 1 }}
          />

          {/* Heat distortion along the path - wider for more coverage */}
          <motion.path
            d={path}
            fill="none"
            stroke="transparent"
            strokeWidth={50}
            filter={`url(#${heatDistortionId})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 1 }}
          />

          {/* Main fire trail - wider outer flame */}
          <motion.path
            d={path}
            fill="none"
            stroke={fireColors.outer}
            strokeWidth={30}
            strokeLinecap="round"
            filter={`url(#${turbulenceId})`}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 0.8,
              strokeWidth: [25, 30, 25],
            }}
            transition={{
              opacity: { duration: 1 },
              strokeWidth: {
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
              },
            }}
          />

          {/* Mid-layer flame - thicker */}
          <motion.path
            d={path}
            fill="none"
            stroke={fireColors.mid}
            strokeWidth={20}
            strokeLinecap="round"
            filter={`url(#${filterId})`}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 0.9,
              strokeWidth: [18, 20, 18],
            }}
            transition={{
              opacity: { duration: 1 },
              strokeWidth: {
                duration: 1.2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
              },
            }}
          />

          {/* Core flame - intense center, thicker */}
          <motion.path
            d={path}
            fill="none"
            stroke={fireColors.core}
            strokeWidth={10}
            strokeLinecap="round"
            filter={`url(#${filterId})`}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              strokeWidth: [8, 10, 8],
            }}
            transition={{
              opacity: { duration: 1 },
              strokeWidth: {
                duration: 0.8,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
              },
            }}
          />

          {/* Additional dense core for extra intensity */}
          <motion.path
            d={path}
            fill="none"
            stroke={fireColors.core}
            strokeWidth={5}
            strokeLinecap="round"
            filter={`url(#${filterId})`}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              strokeWidth: [4, 5, 4],
            }}
            transition={{
              opacity: { duration: 1 },
              strokeWidth: {
                duration: 0.6,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
              },
            }}
          />

          {/* Continuous flowing flame particles along the path - increased count */}
          {[...Array(50)].map((_, i) => {
            const size = 2 + Math.random() * 8
            const duration = 2 + Math.random() * 1
            const delay = i * (duration / 50) // Staggered delays for continuous flow

            // Determine color based on random factor - more intense colors appear less frequently
            const colorRandom = Math.random()
            const particleColor =
              colorRandom < 0.3 ? fireColors.core : colorRandom < 0.7 ? fireColors.mid : fireColors.outer

            return (
              <motion.circle
                key={`flame-${i}`}
                r={size}
                fill={particleColor}
                filter={`url(#${filterId})`}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 0.9, 0],
                  scale: [0.5, 1.2, 0.5],
                  y: [0, (Math.random() - 0.5) * 20, 0], // Random vertical movement for flickering
                }}
                transition={{
                  duration,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 0.1,
                  ease: "easeInOut",
                  delay,
                  y: {
                    duration: 0.5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  },
                }}
              >
                <motion.animateMotion
                  path={path}
                  dur={duration + "s"}
                  repeatCount="indefinite"
                  rotate="auto"
                  keyPoints={flowDirection === "outward" ? "0;1" : "1;0"}
                  keyTimes="0;1"
                  calcMode="spline"
                  keySplines="0.25 0.1 0.25 1"
                />
              </motion.circle>
            )
          })}

          {/* Continuous twisting flame shapes - increased count and size */}
          {[...Array(20)].map((_, i) => {
            const duration = 2 + Math.random() * 1.5
            const delay = i * (duration / 20) // Staggered delays for continuous flow

            // Create a flame shape that twists and curls - larger for more density
            const flameHeight = 15 + Math.random() * 20
            const flameWidth = 8 + Math.random() * 12

            // Determine color based on random factor
            const colorRandom = Math.random()
            const flameColor =
              colorRandom < 0.3 ? fireColors.core : colorRandom < 0.7 ? fireColors.mid : fireColors.outer

            return (
              <motion.g
                key={`twist-flame-${i}`}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 0.8, 0],
                  rotate: [0, Math.random() > 0.5 ? 30 : -30, 0], // Random rotation for twisting
                }}
                transition={{
                  duration,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 0.1,
                  ease: "easeInOut",
                  delay,
                  rotate: {
                    duration: duration * 0.8,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  },
                }}
              >
                <motion.animateMotion
                  path={path}
                  dur={duration + "s"}
                  repeatCount="indefinite"
                  rotate="auto"
                  keyPoints={flowDirection === "outward" ? "0;1" : "1;0"}
                  keyTimes="0;1"
                  calcMode="spline"
                  keySplines="0.25 0.1 0.25 1"
                />

                {/* Flame shape */}
                <path
                  d={`M 0,0 
                     C ${flameWidth / 2},-${flameHeight / 3} ${flameWidth},-${flameHeight / 2} 0,-${flameHeight} 
                     C -${flameWidth},-${flameHeight / 2} -${flameWidth / 2},-${flameHeight / 3} 0,0 Z`}
                  fill={flameColor}
                  filter={`url(#${filterId})`}
                />
              </motion.g>
            )
          })}

          {/* Continuous magical sparks that fly off the path - increased count */}
          {[...Array(40)].map((_, i) => {
            const duration = 1.5 + Math.random() * 1
            const delay = i * (duration / 40) // Staggered delays for continuous flow
            const offsetX = (Math.random() - 0.5) * 60
            const offsetY = (Math.random() - 0.5) * 60

            return (
              <motion.g key={`spark-container-${i}`}>
                <motion.animateMotion
                  path={path}
                  dur={duration + "s"}
                  repeatCount="indefinite"
                  rotate="auto"
                  keyPoints={flowDirection === "outward" ? "0;1" : "1;0"}
                  keyTimes="0;1"
                  calcMode="spline"
                  keySplines="0.25 0.1 0.25 1"
                />

                <motion.circle
                  r={1 + Math.random() * 3}
                  fill={fireColors.spark1}
                  filter={`url(#${filterId})`}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0],
                    x: [0, offsetX],
                    y: [0, offsetY],
                  }}
                  transition={{
                    duration: duration * 0.6,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: duration * 0.4,
                    ease: "easeOut",
                    delay: Math.random() * 0.5,
                  }}
                />
              </motion.g>
            )
          })}

          {/* Magical glow at source (Starknet) - larger */}
          <motion.circle
            cx={
              from === "center"
                ? dimensions.width * 0.5
                : from === "left"
                  ? dimensions.width * 0.1
                  : dimensions.width * 0.9
            }
            cy={dimensions.height / 2}
            r={18}
            fill={`url(#${coreGradientId})`}
            filter={`url(#${denseGlowId})`}
            animate={{
              scale: [0.9, 1.1, 0.9],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />

          {/* Magical glow at destination (Bitcoin/Ethereum) - larger */}
          <motion.circle
            cx={
              to === "center" ? dimensions.width * 0.5 : to === "left" ? dimensions.width * 0.1 : dimensions.width * 0.9
            }
            cy={dimensions.height / 2}
            r={15}
            fill={`url(#${coreGradientId})`}
            filter={`url(#${denseGlowId})`}
            animate={{
              scale: [0.8, 1, 0.8],
              opacity: [0.7, 0.9, 0.7],
            }}
            transition={{
              duration: 2.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />

          {/* Continuous star-shaped magical sparks - increased count and size */}
          {[...Array(15)].map((_, i) => {
            const duration = 3 + Math.random() * 2
            const delay = i * (duration / 15) // Staggered delays for continuous flow
            const starSize = 4 + Math.random() * 4

            return (
              <motion.g key={`star-container-${i}`}>
                <motion.animateMotion
                  path={path}
                  dur={duration + "s"}
                  repeatCount="indefinite"
                  rotate="auto"
                  keyPoints={flowDirection === "outward" ? "0;1" : "1;0"}
                  keyTimes="0;1"
                  calcMode="spline"
                  keySplines="0.25 0.1 0.25 1"
                />

                <motion.path
                  // Create a star shape
                  d={`M 0,-${starSize} ${starSize / 3},-${starSize / 3} ${starSize},0 ${starSize / 3},${starSize / 3} 0,${starSize} -${starSize / 3},${starSize / 3} -${starSize},0 -${starSize / 3},-${starSize / 3} z`}
                  fill={fireColors.magic}
                  filter={`url(#${filterId})`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    rotate: [0, 180],
                  }}
                  transition={{
                    duration: duration * 0.6,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: duration * 0.4,
                    ease: "easeInOut",
                    delay: Math.random() * 0.5,
                  }}
                />
              </motion.g>
            )
          })}

          {/* Additional dense particles for extra fullness */}
          {[...Array(30)].map((_, i) => {
            const size = 1 + Math.random() * 4
            const duration = 1.5 + Math.random() * 1
            const delay = i * (duration / 30)

            return (
              <motion.circle
                key={`dense-particle-${i}`}
                r={size}
                fill={i % 2 === 0 ? fireColors.spark1 : fireColors.spark2}
                filter={`url(#${filterId})`}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 0.7, 0],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 0.1,
                  ease: "easeInOut",
                  delay,
                }}
              >
                <motion.animateMotion
                  path={path}
                  dur={duration + "s"}
                  repeatCount="indefinite"
                  rotate="auto"
                  keyPoints={flowDirection === "outward" ? "0;1" : "1;0"}
                  keyTimes="0;1"
                  calcMode="spline"
                  keySplines="0.25 0.1 0.25 1"
                />
              </motion.circle>
            )
          })}
        </svg>
      )}
    </div>
  )
}

