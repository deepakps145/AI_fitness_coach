
"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dumbbell, Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface SignInPageProps {
  onAuth: (email: string) => void
  onNavigateToSignUp: () => void
}

export function SignInPage({ onAuth, onNavigateToSignUp }: SignInPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Forgot Password State
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false)
  const [forgotStep, setForgotStep] = useState<"verify" | "reset">("verify")
  const [forgotEmail, setForgotEmail] = useState("")
  const [forgotName, setForgotName] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [isForgotLoading, setIsForgotLoading] = useState(false)
  const [forgotError, setForgotError] = useState<string | null>(null)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    if (email && password) {
      try {
        const res = await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode: "login", email, password }),
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

  const handleVerifyUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotError(null)
    setIsForgotLoading(true)
    try {
      const res = await fetch("/api/user/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, name: forgotName }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Verification failed")
      }

      setForgotStep("reset")
    } catch (err) {
      setForgotError(err instanceof Error ? err.message : "Verification failed")
    } finally {
      setIsForgotLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmNewPassword) {
      setForgotError("Passwords do not match")
      return
    }

    setForgotError(null)
    setIsForgotLoading(true)
    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, newPassword }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to reset password")
      }

      toast({
        title: "Success",
        description: "Password reset successfully. Please sign in.",
      })
      setForgotPasswordOpen(false)
      setForgotStep("verify")
      setForgotEmail("")
      setForgotName("")
      setNewPassword("")
      setConfirmNewPassword("")
    } catch (err) {
      setForgotError(err instanceof Error ? err.message : "Failed to reset password")
    } finally {
      setIsForgotLoading(false)
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
              Welcome Back
            </h1>
            <p className="text-center text-muted-foreground mb-8 text-sm">
              Get your personalized fitness plan
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
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-xs text-cyan-400 hover:text-cyan-300"
                    onClick={() => setForgotPasswordOpen(true)}
                    type="button"
                  >
                    Forgot password?
                  </Button>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/5 border-white/10 focus:border-cyan-400/50 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                  </Button>
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-400 text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20"
                >
                  {error}
                </motion.p>
              )}

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
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Login"
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Toggle Auth Mode */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account?
              <button
                onClick={onNavigateToSignUp}
                className="ml-1 text-cyan-400 hover:text-cyan-300 font-medium transition"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotPasswordOpen} onOpenChange={(open) => {
        setForgotPasswordOpen(open)
        if (!open) {
          setForgotStep("verify")
          setForgotEmail("")
          setForgotName("")
          setNewPassword("")
          setConfirmNewPassword("")
          setForgotError(null)
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{forgotStep === "verify" ? "Reset Password" : "Create New Password"}</DialogTitle>
          </DialogHeader>
          
          <AnimatePresence mode="wait">
            {forgotStep === "verify" ? (
              <motion.form
                key="verify"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleVerifyUser}
                className="space-y-4 py-4"
              >
                <p className="text-sm text-muted-foreground">
                  Enter your email and name to verify your identity.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="forgot-email">Email</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="forgot-name">Full Name</Label>
                  <Input
                    id="forgot-name"
                    type="text"
                    value={forgotName}
                    onChange={(e) => setForgotName(e.target.value)}
                    required
                  />
                </div>
                {forgotError && (
                  <p className="text-sm text-red-500">{forgotError}</p>
                )}
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setForgotPasswordOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isForgotLoading}>
                    {isForgotLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Verify
                  </Button>
                </div>
              </motion.form>
            ) : (
              <motion.form
                key="reset"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleResetPassword}
                className="space-y-4 py-4"
              >
                <p className="text-sm text-muted-foreground">
                  Enter your new password below.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmNewPassword ? "text" : "password"}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                    >
                      {showConfirmNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                {forgotError && (
                  <p className="text-sm text-red-500">{forgotError}</p>
                )}
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setForgotStep("verify")}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button type="submit" disabled={isForgotLoading}>
                    {isForgotLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Reset Password
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
