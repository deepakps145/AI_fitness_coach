"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { UserData } from "../app-wrapper"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface OnboardingPageProps {
  userData: Partial<UserData>
  setUserData: (data: Partial<UserData>) => void
  onGeneratePlan: (data: Partial<UserData>) => void
  isSubmitting?: boolean
  error?: string | null
}

export function OnboardingPage({ userData, setUserData, onGeneratePlan, isSubmitting, error }: OnboardingPageProps) {
  const [step, setStep] = useState(1)

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      onGeneratePlan(userData)
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-background via-background to-slate-900 flex items-center justify-center p-4"
    >
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-2xl">
        <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-2xl" />

          <div className="relative z-10">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <h2 className="text-lg font-semibold text-foreground">Step {step} of 4</h2>
                <span className="text-sm text-muted-foreground">{step * 25}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${step * 25}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                />
              </div>
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              {step === 1 && <Step1 userData={userData} setUserData={setUserData} key="step1" />}
              {step === 2 && <Step2 userData={userData} setUserData={setUserData} key="step2" />}
              {step === 3 && <Step3 userData={userData} setUserData={setUserData} key="step3" />}
              {step === 4 && <Step4 userData={userData} setUserData={setUserData} key="step4" />}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex gap-4 mt-8">
              <Button onClick={handleBack} disabled={step === 1} variant="outline" className="flex-1 bg-transparent">
                Back
              </Button>
              <Button
                onClick={handleNext}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500"
                disabled={isSubmitting}
              >
                {step === 4 ? (isSubmitting ? "Generating..." : "Generate Plan") : "Next"}
              </Button>
            </div>
            {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function Step1({
  userData,
  setUserData,
}: {
  userData: Partial<UserData>
  setUserData: (data: Partial<UserData>) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h3 className="text-2xl font-bold text-foreground">Personal Details</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
          <Input
            placeholder="John Doe"
            value={userData.name || ""}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            className="bg-white/5 border-white/10"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Age</label>
          <Input
            type="number"
            placeholder="25"
            value={userData.age || ""}
            onChange={(e) => setUserData({ ...userData, age: Number.parseInt(e.target.value) })}
            className="bg-white/5 border-white/10"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Gender</label>
          <Select value={userData.gender || ""} onValueChange={(value) => setUserData({ ...userData, gender: value })}>
            <SelectTrigger className="bg-white/5 border-white/10">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </motion.div>
  )
}

function Step2({
  userData,
  setUserData,
}: {
  userData: Partial<UserData>
  setUserData: (data: Partial<UserData>) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h3 className="text-2xl font-bold text-foreground">Body Stats</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Height (cm)</label>
          <Input
            type="number"
            placeholder="180"
            value={userData.height || ""}
            onChange={(e) => setUserData({ ...userData, height: Number.parseInt(e.target.value) })}
            className="bg-white/5 border-white/10"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Weight (kg)</label>
          <Input
            type="number"
            placeholder="75"
            value={userData.weight || ""}
            onChange={(e) => setUserData({ ...userData, weight: Number.parseInt(e.target.value) })}
            className="bg-white/5 border-white/10"
          />
        </div>
      </div>
    </motion.div>
  )
}

function Step3({
  userData,
  setUserData,
}: {
  userData: Partial<UserData>
  setUserData: (data: Partial<UserData>) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h3 className="text-2xl font-bold text-foreground">Goals & Level</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Goal</label>
          <Select value={userData.goal || ""} onValueChange={(value) => setUserData({ ...userData, goal: value })}>
            <SelectTrigger className="bg-white/5 border-white/10">
              <SelectValue placeholder="Select goal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weight-loss">Weight Loss</SelectItem>
              <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Experience Level</label>
          <Select value={userData.level || ""} onValueChange={(value) => setUserData({ ...userData, level: value })}>
            <SelectTrigger className="bg-white/5 border-white/10">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Location</label>
          <Select
            value={userData.location || ""}
            onValueChange={(value) => setUserData({ ...userData, location: value })}
          >
            <SelectTrigger className="bg-white/5 border-white/10">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="home">Home</SelectItem>
              <SelectItem value="gym">Gym</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </motion.div>
  )
}

function Step4({
  userData,
  setUserData,
}: {
  userData: Partial<UserData>
  setUserData: (data: Partial<UserData>) => void
}) {
  const prefs = userData.dietaryPrefs || []

  const togglePref = (pref: string) => {
    const newPrefs = prefs.includes(pref) ? prefs.filter((p) => p !== pref) : [...prefs, pref]
    setUserData({ ...userData, dietaryPrefs: newPrefs })
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h3 className="text-2xl font-bold text-foreground">Dietary & Wellness</h3>
      <div className="grid grid-cols-2 gap-4">
        {["Vegetarian", "Non-Veg", "Keto", "Vegan", "Pescatarian", "Gluten-free"].map((pref) => (
          <motion.button
            key={pref}
            onClick={() => togglePref(pref)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-4 rounded-lg border-2 transition ${
              prefs.includes(pref) ? "border-cyan-500 bg-cyan-500/10" : "border-white/10 bg-white/5"
            }`}
          >
            <span className={prefs.includes(pref) ? "text-cyan-400 font-semibold" : "text-foreground"}>{pref}</span>
          </motion.button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Medical history (optional)</label>
          <Textarea
            placeholder="e.g., lower back pain, knee injury"
            value={userData.medicalHistory || ""}
            onChange={(e) => setUserData({ ...userData, medicalHistory: e.target.value })}
            className="bg-white/5 border-white/10"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Stress level (optional)</label>
          <Select
            value={userData.stressLevel || ""}
            onValueChange={(value) => setUserData({ ...userData, stressLevel: value })}
          >
            <SelectTrigger className="bg-white/5 border-white/10">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </motion.div>
  )
}
