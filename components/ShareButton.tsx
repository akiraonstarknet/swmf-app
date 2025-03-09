import { motion } from "framer-motion"
import { Icons } from "@/components/Icons"
import { TwitterShareButton } from "react-share";

export default function ShareButton() {
    // Shaking animation variants
    const shakeAnimation = {
      initial: { x: 0 },
      shake: {
        x: [0, -4, 7, -8, 5, -3, 0],
        transition: {
          duration: 0.6,
          ease: "easeInOut",
          times: [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1],
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 3, // Wait 3 seconds between shakes
        },
      },
    }
  
    return (
        <motion.div
          variants={shakeAnimation}
          initial="initial"
          animate="shake"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white rounded-lg border border-black shadow-sm"
        >
          <TwitterShareButton
            url={'swmf.fun'}
            title="Minted My NFT on Starknet"
            style={{
              display: "flex",
              alignItems: "center",
              gap: ".6rem",
              padding: ".5rem 1rem",
              borderRadius: "8px",
              borderColor:'black',
              backgroundColor: "white",
              color: "black",
              textWrap: "nowrap",
            }}
          >
            <span className="hidden sm:block">Share On</span>
            <Icons.X className="size-4 shrink-0" />
          </TwitterShareButton>
        </motion.div>
    )
  }