"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { TwitterShareButton } from "react-share";

interface FlipTileProps {
  text: string
}

export function FlipTile({ text }: FlipTileProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div
      className="w-full h-full perspective-1000"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        className="relative w-full h-full"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front side - completely blank black tile */}
        {!isFlipped && <div className="absolute w-full h-full bg-black border border-gray-800 rounded-lg flex items-center justify-center backface-hidden">
          {/* Completely blank - no text */}
        </div>}

        {/* Back side - with text */}
        {isFlipped && <div
          className="absolute w-full h-full bg-gray-900 border border-gray-800 rounded-lg flex items-center justify-center backface-hidden p-4 text-center"
          style={{ transform: "rotateY(180deg)" }}
        >
          <span className="text-white text-lg font-medium">{text}</span>
        </div>}
      </motion.div>
    </div>
  )
}

