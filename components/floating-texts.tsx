"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface FloatingTextsProps {
  texts: string[]
}

interface FloatingText {
  id: number
  text: string
  position: { x: number; y: number }
  size: "sm" | "md" | "lg"
  color: "blue" | "red" | "orange"
  duration: number
}

export function FloatingTexts({ texts }: FloatingTextsProps) {
  const [visibleTexts, setVisibleTexts] = useState<FloatingText[]>([])
  const [counter, setCounter] = useState(0)
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 })

  // Colors for the floating texts
  const colors = {
    blue: "rgba(59, 130, 246, 0.6)",
    red: "rgba(239, 68, 68, 0.6)",
    orange: "rgba(249, 115, 22, 0.6)",
  }

  // Font sizes for different text sizes
  const fontSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  }

  // Update viewport size on mount and resize
  useEffect(() => {
    const updateViewportSize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateViewportSize()
    window.addEventListener("resize", updateViewportSize)

    return () => {
      window.removeEventListener("resize", updateViewportSize)
    }
  }, [])

  // Generate a new floating text
  const generateFloatingText = (): FloatingText => {
    const colorKeys = Object.keys(colors) as Array<keyof typeof colors>
    const sizeKeys = Object.keys(fontSizes) as Array<keyof typeof fontSizes>

    // Define bottom area for texts to appear - between 80-95% of viewport height
    // Leaving the bottom 5% for the button
    const bottomAreaStart = 80
    const bottomAreaEnd = 95

    // Calculate horizontal spacing to avoid overlapping
    // Divide screen into 3 sections for up to 3 texts
    const horizontalSections = [
      { min: 15, max: 30 }, // Left section
      { min: 40, max: 60 }, // Middle section
      { min: 70, max: 85 }, // Right section
    ]

    // Pick a random section based on existing texts to avoid overlap
    let availableSections = [...horizontalSections]
    visibleTexts.forEach((text) => {
      const textX = text.position.x
      availableSections = availableSections.filter((section) => textX < section.min || textX > section.max)
    })

    // If all sections are taken, just pick a random one
    if (availableSections.length === 0) {
      availableSections = [...horizontalSections]
    }

    const selectedSection = availableSections[Math.floor(Math.random() * availableSections.length)]
    const xPosition = Math.random() * (selectedSection.max - selectedSection.min) + selectedSection.min

    return {
      id: counter,
      text: texts[Math.floor(Math.random() * texts.length)],
      position: {
        x: xPosition,
        y: Math.random() * (bottomAreaEnd - bottomAreaStart) + bottomAreaStart,
      },
      size: sizeKeys[Math.floor(Math.random() * sizeKeys.length)],
      color: colorKeys[Math.floor(Math.random() * colorKeys.length)],
      duration: 2 + Math.random(), // 2-3 seconds
    }
  }

  // Manage the floating texts
  useEffect(() => {
    // Only start generating texts once we have viewport dimensions
    if (viewportSize.width === 0 || viewportSize.height === 0) return

    // Initial texts - only show 2-3 texts
    if (visibleTexts.length === 0) {
      const textCount = 2 + Math.floor(Math.random() * 2) // 2 or 3 texts
      const initialTexts = Array.from({ length: textCount }).map((_, i) => generateFloatingText())
      setVisibleTexts(initialTexts)
      setCounter((prev) => prev + textCount)
    }

    // Periodically replace a random text
    const interval = setInterval(() => {
      setVisibleTexts((prev) => {
        // Ensure we never have more than 3 texts
        if (prev.length >= 3) {
          // Remove a random text
          const newTexts = [...prev]
          const indexToRemove = Math.floor(Math.random() * newTexts.length)
          newTexts.splice(indexToRemove, 1)

          // Add a new text
          newTexts.push(generateFloatingText())
          setCounter((prev) => prev + 1)

          return newTexts
        } else {
          // We have less than 3 texts, so we can add one more
          const newTexts = [...prev, generateFloatingText()]
          setCounter((prev) => prev + 1)
          return newTexts.slice(0, 3) // Ensure we never exceed 3
        }
      })
    }, 2000) // Replace a text every 2 seconds

    return () => clearInterval(interval)
  }, [texts, viewportSize, visibleTexts.length])

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <AnimatePresence>
        {visibleTexts.map((item) => (
          <motion.div
            key={item.id}
            className={`absolute ${fontSizes[item.size]} font-medium pointer-events-none`}
            style={{
              left: `${item.position.x}%`,
              top: `${item.position.y}%`,
              color: colors[item.color],
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
            }}
          >
            {item.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

