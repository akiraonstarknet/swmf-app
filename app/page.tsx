"use client"

import { useState, useEffect } from "react"
import { CometTrail } from "@/components/comet-trail"
import { TpsTrails } from "@/components/tps-trails"
import { HeroSection } from "@/components/hero-section"
import { FloatingTexts } from "@/components/floating-texts"
import { ToastContainer } from "react-toastify"
import { FloatingTexts2 } from "@/components/floating-texts2"
import { TwitterShareButton } from "react-share";
import { Icons } from "@/components/Icons"
import { motion } from "framer-motion"
import ShareButton from "@/components/ShareButton"
import { CometTrail2 } from "@/components/comet-trail2"

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
      <ToastContainer theme="dark" />
      {/* TPS trails container - positioned behind hero section */}
      {showTpsTrails && (
        <div className="fixed inset-0 pointer-events-none z-500">
          <TpsTrails targetPosition={{ x: "50%", y: "12%" }} startFromBottom={true} />
        </div>
      )}

       {/* Header with blockchain names */}
       <div className="relative h-24 z-60">
        {/* Trail container - positioned below text */}
        {/* <div className="absolute inset-0 opacity-50">
          <CometTrail2
            from="center"
            to="left"
            color="blue"
            flowDirection="outward"
            trigger={animationTrigger}
            duration={1}
          />

          <CometTrail2
            from="center"
            to="right"
            color="orange"
            flowDirection="outward"
            trigger={animationTrigger}
            duration={1}
          />
        </div> */}
        <div className="absolute inset-0">
          <CometTrail from="center" to="left" color="blue" trigger={animationTrigger} duration={1} />
          <CometTrail from="center" to="right" color="orange" trigger={animationTrigger} duration={1} />
        </div>

        {/* Blockchain names - positioned above trails with 50% opacity */}
        <div className="absolute left-8 top-1/2 transform -translate-y-1/2 text-2xl font-bold z-10">
           <img
            src="https://www.cdnlogo.com/logos/e/35/ethereum-blue.svg"
            width="50px"
            alt="Ethereum"
          />
        </div>

        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold z-10">
          <img
            src="https://pbs.twimg.com/profile_images/1656626983617323010/xzIYc6hK_400x400.png"
            width="70px"
            alt="Starknet"
          />
        </div>

        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 text-2xl font-bold z-10">
          {/* Bitcoin
           */}
          <img
            src="https://cryptologos.cc/logos/bitcoin-btc-logo.png"
            width="50px"
            alt="Starknet"
          />
        </div>
      </div>

      {/* Hero Section - high z-index to appear above trails */}
      {!showTpsTrails && <div className="relative z-1000">
        <HeroSection/>
      </div>}
      {showTpsTrails && <div className="relative z-1000 mt-[200px]">
        <div className="flex flex-col items-center text-center mt-8 mb-12 max-w-4xl mx-auto">
          <motion.h1
            className="text-2xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 1.2,
              ease: "easeOut",
            }}
          >
            The one and only Starknet
          </motion.h1>
          <p className="text-md md:text-xl text-gray-300 mb-6">
            This is the future of blockchain technology. Trustless, quantum resistant, and scalable to infinity.
          </p>
          <p className="text-xl md:text-3xl text-gray-300 mb-6 mt-6">
            <b>Starknet Will Melt Faces</b>
          </p>
        </div>
      </div>}

      {/* Floating promotional texts */}
      <FloatingTexts2 texts={promotionalTexts} />

      {/* Fixed Feel 1000 TPS Button */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center z-1800" style={{"zIndex": 1800}}>
        <button
          onClick={() => setShowTpsTrails(!showTpsTrails)}
          className="z-1800 bg-cyan-500 hover:bg-cyan-800 text-white font-bold py-3 px-6 rounded-lg transition-colors border border-gray-700 shadow-lg"
        >
          {!showTpsTrails ? "Feel 1000 TPS" : "Stop the TPS"}
        </button>
      </div>
      <div className="fixed bottom-8 right-8" style={{zIndex: 1000000}}>
        <ShareButton/>
      </div>
    </div>
  )
}

