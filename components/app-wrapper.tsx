"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { AnimatePresence } from "framer-motion"
import { SignInPage } from "./views/signin-page"
import { SignUpPage } from "./views/signup-page"
import { OnboardingPage } from "./views/onboarding-page"
import { LoadingPage } from "./views/loading-page"
import { DashboardPage } from "./views/dashboard-page"
import { generatePlan, generateImage, speakText, fetchStoredPlan, savePlan, regenerateTips } from "@/lib/ai"
import type { PlanContent } from "@/lib/plan-types"

export type AppView = "signin" | "signup" | "onboarding" | "loading" | "dashboard"

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
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialView = searchParams.get("view") === "signup" ? "signup" : "signin"
  const [currentView, setCurrentView] = useState<AppView>(initialView)
  const [userData, setUserData] = useState<Partial<UserData>>({})
  const [plan, setPlan] = useState<PlanContent | null>(null)
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasFetchedRemote, setHasFetchedRemote] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem(SESSION_KEY)
      if (storedEmail) {
        setUserData((prev) => ({ ...prev, email: storedEmail }))
        // If we have a stored email, we can skip the auth screen and go to loading/dashboard
        // But we need to fetch the plan first.
        // The existing fetchRemote effect will handle the fetching if userData.email is set.
        // We just need to set the view to loading initially if we found a session.
        setCurrentView("loading")
      }
    }
  }, [])

  useEffect(() => {
    setHasFetchedRemote(false)
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
      localStorage.setItem(SESSION_KEY, email)
    }
  }

  const handleLogout = () => {
    setUserData({})
    setPlan(null)
    setCurrentView("signin")
    if (typeof window !== "undefined") {
      localStorage.removeItem(SESSION_KEY)
    }
    router.push("/")
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

  const handleUpdateProfile = async (updatedData: Partial<UserData>) => {
    if (!userData.email) return
    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userData.email, profile: updatedData }),
      })
      if (!res.ok) throw new Error("Failed to update profile")
      const { user } = await res.json()
      setUserData((prev) => ({ ...prev, ...user }))
    } catch (err) {
      console.error("Profile update error", err)
      throw err
    }
  }

  return (
    <div>
      <AnimatePresence mode="wait">
        {currentView === "signin" && (
          <SignInPage
            key="signin"
            onAuth={handleAuth}
            onNavigateToSignUp={() => setCurrentView("signup")}
          />
        )}
        {currentView === "signup" && (
          <SignUpPage
            key="signup"
            onAuth={handleAuth}
            onNavigateToSignIn={() => setCurrentView("signin")}
          />
        )}
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
            onUpdateProfile={handleUpdateProfile}
            onLogout={handleLogout}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
