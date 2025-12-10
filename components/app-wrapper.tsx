"use client"

import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { AuthPage } from "./views/auth-page"
import { OnboardingPage } from "./views/onboarding-page"
import { LoadingPage } from "./views/loading-page"
import { DashboardPage } from "./views/dashboard-page"
import { generatePlan, generateImage, speakText, fetchStoredPlan, savePlan, regenerateTips } from "@/lib/ai"
import type { PlanContent } from "@/lib/plan-types"

export type AppView = "auth" | "onboarding" | "loading" | "dashboard"

export interface UserData {
  email: string
  name: string
  age: number
  gender: string
  height: number
  weight: number
  goal: string
  level: string
  location: string
  dietaryPrefs: string[]
  medicalHistory?: string
  stressLevel?: string
}

const SESSION_KEY = "fitai:session-email"

export function AppWrapper() {
  const [currentView, setCurrentView] = useState<AppView>("auth")
  const [userData, setUserData] = useState<Partial<UserData>>({})
  const [plan, setPlan] = useState<PlanContent | null>(null)
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasFetchedRemote, setHasFetchedRemote] = useState(false)
  useEffect(() => {
    setHasFetchedRemote(false)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    const storedEmail = window.localStorage.getItem(SESSION_KEY)
    if (storedEmail) {
      setUserData((prev) => ({ ...prev, email: storedEmail }))
      setCurrentView("loading")
    }
  }, [])

  useEffect(() => {
    const htmlElement = document.documentElement
    if (theme === "dark") {
      htmlElement.classList.add("dark")
      htmlElement.classList.remove("light")
    } else {
      htmlElement.classList.add("light")
      htmlElement.classList.remove("dark")
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"))
  }

  const handleAuth = async (email: string) => {
    setUserData((prev) => ({ ...prev, email }))
    setPlan(null)
    setError(null)
    setCurrentView("loading")
    setHasFetchedRemote(false)
    if (typeof window !== "undefined") {
      window.localStorage.setItem(SESSION_KEY, email)
    }
  }

  useEffect(() => {
    const fetchRemote = async () => {
      if (!userData.email || plan || hasFetchedRemote === true) return
      setHasFetchedRemote(true)
      setCurrentView("loading")
      try {
        const res = await fetchStoredPlan(userData.email)
        if (res.record?.plan) {
          const mergedUser = { ...res.record.user_data, email: userData.email }
          setUserData(mergedUser)
          let hydratedPlan = res.record.plan
          try {
            const refresh = await regenerateTips(mergedUser, {
              workouts: hydratedPlan.workouts,
              meals: hydratedPlan.meals,
            })
            hydratedPlan = { ...hydratedPlan, tips: refresh.tips, motivation: refresh.motivation }
          } catch (err) {
            console.warn("Tip regeneration failed", err)
          }
          setPlan(hydratedPlan)
          setCurrentView("dashboard")
          return
        }
      } catch (err) {
        console.warn("Remote plan fetch failed", err)
      }
      setCurrentView("onboarding")
    }

    fetchRemote()
  }, [userData.email, plan, hasFetchedRemote])

  const handleGeneratePlan = async (data: Partial<UserData>) => {
    const mergedData = { ...userData, ...data }
    if (!mergedData.email) {
      setError("Missing email. Please log in again.")
      setCurrentView("auth")
      return
    }
    setUserData(mergedData)
    setIsGenerating(true)
    setError(null)
    setCurrentView("loading")
    try {
      const planResponse = await generatePlan(mergedData)
      setPlan(planResponse)
      try {
        await savePlan(mergedData.email, mergedData, planResponse)
      } catch (err) {
        console.warn("Failed to save plan to DB", err)
      }
      setCurrentView("dashboard")
    } catch (err) {
      console.error("Plan generation failed", err)
      setError(err instanceof Error ? err.message : "Failed to generate plan")
      setCurrentView("onboarding")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSpeak = async (section: string, text: string) => {
    const audioBase64 = await speakText(section, text)
    const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`)
    audio.play()
  }

  const handleGenerateImage = async (prompt: string) => {
    const url = await generateImage(prompt)
    return url
  }

  return (
    <div>
      <AnimatePresence mode="wait">
        {currentView === "auth" && <AuthPage key="auth" onAuth={handleAuth} />}
        {currentView === "onboarding" && (
          <OnboardingPage
            key="onboarding"
            userData={userData}
            setUserData={setUserData}
            onGeneratePlan={handleGeneratePlan}
            isSubmitting={isGenerating}
            error={error}
          />
        )}
        {currentView === "loading" && <LoadingPage key="loading" isGenerating={isGenerating} />}
        {currentView === "dashboard" && plan && (
          <DashboardPage
            key="dashboard"
            userData={userData as UserData}
            plan={plan}
            theme={theme}
            toggleTheme={toggleTheme}
            onRegenerate={() => handleGeneratePlan(userData)}
            onSpeak={handleSpeak}
            onGenerateImage={handleGenerateImage}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
