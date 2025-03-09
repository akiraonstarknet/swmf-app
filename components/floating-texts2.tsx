"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

type FloatingText = {
  id: number
  text: string
  x: number
  y: number
  scale: number
  opacity: number
  rotation: number
  duration: number
}

type FloatingTextsProps = {
  texts: string[]
}

export function FloatingTexts2({ texts }: FloatingTextsProps) {
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([])

  useEffect(() => {
    // Create initial floating texts
    const initialTexts: FloatingText[] = []

    for (let i = 0; i < Math.min(texts.length, 15); i++) {
      initialTexts.push(createFloatingText(texts[i], i))
    }

    setFloatingTexts(initialTexts)

    // Periodically replace texts
    const interval = setInterval(() => {
      setFloatingTexts((prev) => {
        // Find the oldest text to replace
        const oldestIndex = prev.findIndex((text) => text.id === Math.min(...prev.map((t) => t.id)))

        if (oldestIndex !== -1) {
          const newTexts = [...prev]
          const randomTextIndex = Math.floor(Math.random() * texts.length)
          newTexts[oldestIndex] = createFloatingText(texts[randomTextIndex], Date.now())
          return newTexts
        }

        return prev
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [texts])

  const createFloatingText = (text: string, id: number): FloatingText => {
    const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1000
    const screenHeight = typeof window !== "undefined" ? window.innerHeight : 800

    // Avoid the center area where the hero section is
    let x: number
    let y: number

    // Determine if text should be in top, bottom, left or right area
    const area = Math.floor(Math.random() * 4)

    switch (area) {
      case 0: // top
        x = Math.random() * screenWidth
        y = Math.random() * (screenHeight * 0.2)
        break
      case 1: // right
        x = screenWidth * 0.8 + Math.random() * (screenWidth * 0.2)
        y = Math.random() * screenHeight
        break
      case 2: // bottom
        x = Math.random() * screenWidth
        y = screenHeight * 0.8 + Math.random() * (screenHeight * 0.2)
        break
      case 3: // left
        x = Math.random() * (screenWidth * 0.2)
        y = Math.random() * screenHeight
        break
      default:
        x = 0
        y = 0
    }

    return {
      id,
      text,
      x,
      y,
      scale: 0.7 + Math.random() * 0.6,
      opacity: 0.3 + Math.random() * 0.4,
      rotation: -10 + Math.random() * 20,
      duration: 20 + Math.random() * 40,
    }
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {floatingTexts.map((item) => (
        <motion.div
          key={item.id}
          className="absolute text-gray-500 font-medium whitespace-nowrap"
          style={{
            left: item.x,
            top: item.y,
            opacity: item.opacity,
            scale: item.scale,
            rotate: item.rotation,
          }}
          animate={{
            x: [-20, 20, -10, 15, -15, 10, -20],
            y: [15, -15, 10, -10, 20, -20, 15],
          }}
          transition={{
            duration: item.duration,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "linear",
          }}
        >
          {item.text}
        </motion.div>
      ))}
    </div>
  )
}

