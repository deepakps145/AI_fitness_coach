"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Dumbbell } from "lucide-react"

interface LoadingPageProps {
  isGenerating?: boolean
}

export function LoadingPage({ isGenerating }: LoadingPageProps) {
  const [textIndex, setTextIndex] = useState(0)

  const loadingTexts = [
    "Analyzing your body type...",
    "Calculating macros and training split...",
    "Drafting your personalized workout routine...",
    "Creating your meal plan...",
    "Finalizing your fitness guide...",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingTexts.length)
    }, 3000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-background via-background to-slate-900 flex flex-col items-center justify-center p-4"
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
        }}
        className="mb-12"
      >
        <Dumbbell className="w-24 h-24 text-cyan-400" />
      </motion.div>

      {/* Dynamic Loading Text */}
      <motion.div
        key={textIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <h2 className="text-2xl font-bold text-foreground mb-4">{isGenerating ? "Creating Your Plan" : "Loading"}</h2>
        <p className="text-lg text-cyan-400 font-semibold">{loadingTexts[textIndex]}</p>
      </motion.div>

      {/* Loading Bars */}
      <motion.div className="mt-12 flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ height: ["24px", "48px", "24px"] }}
            transition={{
              duration: 0.8,
              delay: i * 0.2,
              repeat: Number.POSITIVE_INFINITY,
            }}
            className="w-2 bg-gradient-to-t from-cyan-500 to-blue-500 rounded-full"
          />
        ))}
      </motion.div>
    </motion.div>
  )
}
