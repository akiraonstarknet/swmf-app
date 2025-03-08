"use client"

import { useState, useEffect } from "react"
import { CometTrail } from "@/components/comet-trail"
import { TpsTrails } from "@/components/tps-trails"
import { HeroSection } from "@/components/hero-section"
import { FloatingTexts } from "@/components/floating-texts"

export default function Home() {
  const [animationTrigger, setAnimationTrigger] = useState(0)
  const [showTpsTrails, setShowTpsTrails] = useState(false)

  // Trigger the animation every 2 seconds (1s animation + 1s pause)
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTrigger((prev) => prev + 1)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const promotionalTexts = [
    "1000 TPS",
    "Dead cheap gas ($0.002)",
    "SWMF",
    "Starknet Brother",
    "Trustless Zero-knowledge proofs",
    "Quantum resistant",
    "Layer 2 scaling",
    "Smart contracts",
    "Decentralized apps",
    "Cross-chain compatibility",
    "Secure transactions",
    "Blockchain innovation",
  ]

  return (
    <div className="min-h-screen bg-black text-white p-8 pb-24">
      {/* TPS trails container - positioned behind hero section */}
      {showTpsTrails && (
        <div className="fixed inset-0 pointer-events-none z-500">
          <TpsTrails targetPosition={{ x: "50%", y: "12%" }} startFromBottom={true} />
        </div>
      )}

      {/* Header with blockchain names */}
      <div className="relative h-24 z-600">
        {/* Trail container - positioned below text */}
        <div className="absolute inset-0">
          <CometTrail from="center" to="left" color="blue" trigger={animationTrigger} duration={1} />
          <CometTrail from="center" to="right" color="orange" trigger={animationTrigger} duration={1} />
        </div>

        {/* Blockchain names - positioned above trails with 50% opacity */}
        <div className="absolute left-8 top-1/2 transform -translate-y-1/2 text-2xl font-bold z-10 opacity-50">
          Ethereum
        </div>

        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold z-10 opacity-50">
          Starknet
        </div>

        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 text-2xl font-bold z-10 opacity-50">
          Bitcoin
        </div>
      </div>

      {/* Hero Section - high z-index to appear above trails */}
      <div className="relative z-1000">
        <HeroSection/>
      </div>

      {/* Floating promotional texts */}
      <FloatingTexts texts={promotionalTexts} />

      {/* Fixed Feel 1000 TPS Button */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center z-2000">
        <button
          onClick={() => setShowTpsTrails(!showTpsTrails)}
          className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-colors border border-gray-700 shadow-lg"
        >
          Feel 1000 TPS
        </button>
      </div>
    </div>
  )
}

