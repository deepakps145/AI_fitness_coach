
"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dumbbell } from "lucide-react"

interface SignUpPageProps {
  onAuth: (email: string) => void
  onNavigateToSignIn: () => void
}

export function SignUpPage({ onAuth, onNavigateToSignIn }: SignUpPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    if (email && password) {
      if (password !== confirmPassword) {
        setError("Passwords do not match")
        setIsSubmitting(false)
        return
      }

      try {
        const profile = name ? { name } : undefined
        const res = await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode: "signup", email, password, profile }),
        })

        if (!res.ok) {
          const { error: errMsg } = (await res.json()) as { error?: string }
          setError(errMsg || "Authentication failed")
          setIsSubmitting(false)
          return
        }
        onAuth(email)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Authentication failed")
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-background via-background to-slate-900 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-md"
      >
        {/* Glass Card */}
        <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-2xl" />

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-center mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Dumbbell className="w-8 h-8 text-cyan-400" />
              </motion.div>
              <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                FitAI
              </span>
            </div>

            <h1 className="text-3xl font-bold text-center text-foreground mb-2">
              Create Account
            </h1>
            <p className="text-center text-muted-foreground mb-8 text-sm">
              Start your fitness journey today
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/10 focus:border-cyan-400/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/5 border-white/10 focus:border-cyan-400/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Confirm Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-white/5 border-white/10 focus:border-cyan-400/50"
                />
              </div>

              {/* Animated CTA Button */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="relative mt-6">
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(34, 211, 238, 0.3)",
                      "0 0 40px rgba(34, 211, 238, 0.5)",
                      "0 0 20px rgba(34, 211, 238, 0.3)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute inset-0 rounded-lg"
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold relative"
                >
                  {isSubmitting ? "Please wait..." : "Sign Up"}
                </Button>
              </motion.div>
            </form>

            {/* Toggle Auth Mode */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?
              <button
                onClick={onNavigateToSignIn}
                className="ml-1 text-cyan-400 hover:text-cyan-300 font-medium transition"
              >
                Login
              </button>
            </p>
            {error && <p className="text-center text-sm text-red-400 mt-3">{error}</p>}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
