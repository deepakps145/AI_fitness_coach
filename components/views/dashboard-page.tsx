"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { UserData } from "../app-wrapper"
import type { PlanContent, WorkoutItem, MealItem } from "@/lib/plan-types"
import { Download, Volume2, Zap, Moon, Sun, ImageIcon, LayoutGrid } from "lucide-react"
import { ProfileSettingsDialog } from "./profile-settings-dialog"

interface DashboardPageProps {
  userData: UserData
  plan: PlanContent
  theme: "dark" | "light"
  toggleTheme: () => void
  onRegenerate: () => void
  onSpeak: (section: string, text: string) => Promise<void>
  onGenerateImage: (prompt: string) => Promise<string>
  onUpdateProfile: (updatedData: Partial<UserData>) => Promise<void>
  onLogout: () => void
}

export function DashboardPage({ userData, plan, theme, toggleTheme, onRegenerate, onSpeak, onGenerateImage, onUpdateProfile, onLogout }: DashboardPageProps) {
  const [activeView, setActiveView] = useState<"overview" | "workout" | "diet">("overview")
  const [imageLoading, setImageLoading] = useState<string | null>(null)
  const [localPlan, setLocalPlan] = useState<PlanContent>(plan)
  const [isExporting, setIsExporting] = useState(false)
  const [audioCooldown, setAudioCooldown] = useState(false)
  const cooldownRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cooldownMs = 3000

  useEffect(() => {
    setLocalPlan(plan)
  }, [plan])

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
  const workoutPlan: WorkoutItem[] = localPlan.workouts || []
  const dietPlan: MealItem[] = localPlan.meals || []
  const tips = localPlan.tips || []
  const motivation = localPlan.motivation || "Let's move today."
  const overviewStats = [
    { label: "Goal", value: userData.goal || "-", unit: "" },
    { label: "Experience", value: userData.level || "-", unit: "" },
    { label: "Location", value: userData.location || "-", unit: "" },
    { label: "Diet", value: (userData.dietaryPrefs || []).join(", ") || "-", unit: "" },
  ]

  const isWorkout = (item: WorkoutItem | MealItem): item is WorkoutItem => (item as WorkoutItem).sets !== undefined

  useEffect(() => {
    return () => {
      if (cooldownRef.current) {
        clearTimeout(cooldownRef.current)
      }
    }
  }, [])

  const speakWithCooldown = async (section: string, text: string) => {
    if (audioCooldown) return
    setAudioCooldown(true)
    try {
      await onSpeak(section, text)
    } finally {
      if (cooldownRef.current) {
        clearTimeout(cooldownRef.current)
      }
      cooldownRef.current = setTimeout(() => {
        setAudioCooldown(false)
      }, cooldownMs)
    }
  }

  const handleExportPdf = async () => {
    if (isExporting) return
    setIsExporting(true)
    try {
      const jsPDFModule = (await import("jspdf")).default
      const pdf = new jsPDFModule("p", "mm", "a4")
      const margin = 14
      let cursorY = 20
      const maxWidth = 182

      const addSectionTitle = (title: string) => {
        if (cursorY > 260) {
          pdf.addPage()
          cursorY = 20
        }
        pdf.setFontSize(16)
        pdf.setFont("helvetica", "bold")
        pdf.text(title, margin, cursorY)
        cursorY += 8
      }

      const addParagraph = (text: string, fontSize = 12) => {
        pdf.setFontSize(fontSize)
        pdf.setFont("helvetica", "normal")
        const lines = pdf.splitTextToSize(text, maxWidth)
        lines.forEach((line: string) => {
          if (cursorY > 280) {
            pdf.addPage()
            cursorY = 20
          }
          pdf.text(line, margin, cursorY)
          cursorY += 6
        })
        cursorY += 2
      }

      pdf.setFontSize(20)
      pdf.setFont("helvetica", "bold")
      pdf.text(`FitAI Plan for ${userData.name || userData.email}`, margin, cursorY)
      cursorY += 10

      addSectionTitle("Overview")
      addParagraph(`Goal: ${userData.goal || "-"}`)
      addParagraph(`Experience: ${userData.level || "-"}`)
      addParagraph(`Location: ${userData.location || "-"}`)
      addParagraph(`Diet: ${(userData.dietaryPrefs || []).join(", ") || "-"}`)

      if (workoutPlan.length) {
        addSectionTitle("Workouts")
        workoutPlan.forEach((workout, index) => {
          addParagraph(
            `${index + 1}. ${workout.name} — ${workout.sets} sets x ${workout.reps} reps, rest ${workout.rest}${workout.focus ? ` | Focus: ${workout.focus}` : ""}`,
          )
        })
      }

      if (dietPlan.length) {
        addSectionTitle("Meals")
        dietPlan.forEach((meal, index) => {
          addParagraph(
            `${index + 1}. ${meal.meal}: ${meal.items} (Cals ${meal.calories}, P ${meal.protein}g, C ${meal.carbs}g, F ${meal.fats}g)`,
          )
        })
      }

      if (tips.length) {
        addSectionTitle("Tips")
        tips.forEach((tip, index) => addParagraph(`${index + 1}. ${tip}`))
      }

      addSectionTitle("Motivation")
      addParagraph(motivation)

      pdf.save("fitai-plan.pdf")
    } catch (err) {
      console.error("PDF export failed", err)
    } finally {
      setIsExporting(false)
    }
  }
  const labelFor = (item: WorkoutItem | MealItem) => (isWorkout(item) ? item.name : item.meal)

  const handleImage = async (item: WorkoutItem | MealItem) => {
    const prompt = item.imagePrompt ? item.imagePrompt : `${isWorkout(item) ? "Exercise" : "Meal"}: ${labelFor(item)}`
    setImageLoading(labelFor(item))
    const url = await onGenerateImage(prompt)
    setImageLoading(null)
    if ("name" in item) {
      setLocalPlan((prev) => ({
        ...prev,
        workouts: prev.workouts.map((w) => (w.name === item.name ? { ...w, imageUrl: url } : w)),
      }))
    } else {
      setLocalPlan((prev) => ({
        ...prev,
        meals: prev.meals.map((m) => (m.meal === item.meal ? { ...m, imageUrl: url } : m)),
      }))
    }
    return url
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-background via-background to-slate-900"
    >
      {/* Fixed Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="sticky top-0 z-40 backdrop-blur-xl bg-white/10 border-b border-white/20"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:py-4 md:gap-4">
          <div className="flex items-center justify-between md:block">
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-cyan-400 break-words">Welcome, {userData.name}</h1>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5">Your personalized fitness plan awaits</p>
            </div>
            {/* Mobile-only profile trigger could go here if we wanted a different layout, but keeping it simple for now */}
          </div>

          <div className="flex items-center gap-2 justify-between md:justify-end overflow-x-auto pb-1 md:pb-0 no-scrollbar">
            <div className="flex gap-2">
              <Button onClick={onRegenerate} size="sm" className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-600 text-white h-9 px-3">
                <Zap className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Regenerate</span>
              </Button>
              <Button
                onClick={handleExportPdf}
                disabled={isExporting}
                size="sm"
                className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-70 h-9 px-3"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isExporting ? "Exporting..." : "Export PDF"}</span>
              </Button>
            </div>
            <ProfileSettingsDialog userData={userData} onUpdate={onUpdateProfile} onLogout={onLogout} />
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Motivation Banner */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8 relative backdrop-blur-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-white/20 rounded-2xl p-8 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl" />
          <div className="relative z-10">
            <p className="text-xl font-semibold text-cyan-400 italic">{motivation}</p>
            <p className="text-sm text-muted-foreground mt-2">Today's motivation</p>
          </div>
        </motion.div>

        <div className="mb-8 flex gap-2">
          <Button
            onClick={() => setActiveView("overview")}
            className={`${activeView === "overview" ? "bg-cyan-500 hover:bg-cyan-600 text-white" : "bg-white/10 hover:bg-white/20 text-foreground"}`}
          >
            <LayoutGrid className="w-4 h-4 mr-2" />
            Overview
          </Button>
          <Button
            onClick={() => setActiveView("workout")}
            className={`${activeView === "workout" ? "bg-cyan-500 hover:bg-cyan-600 text-white" : "bg-white/10 hover:bg-white/20 text-foreground"}`}
          >
            Workout
          </Button>
          <Button
            onClick={() => setActiveView("diet")}
            className={`${activeView === "diet" ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-white/10 hover:bg-white/20 text-foreground"}`}
          >
            Diet
          </Button>
        </div>

        {/* Overview Dashboard */}
        {activeView === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {overviewStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl md:rounded-2xl p-3 md:p-4"
                >
                  <p className="text-[10px] md:text-xs text-muted-foreground mb-0.5 md:mb-1">{stat.label}</p>
                  <div className="flex items-baseline gap-1 md:gap-2">
                    <p className="text-base md:text-2xl font-bold text-cyan-400 truncate flex-1 min-w-0" title={String(stat.value)}>{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.unit}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* AI Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:border-cyan-400/50 transition"
              >
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">AI Plan Generation</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Personalized workout and diet plans generated by Gemini from your goals and constraints.
                </p>
                <Button onClick={onRegenerate} className="w-full bg-cyan-500 hover:bg-cyan-600 text-white text-sm">
                  Generate New Plan
                </Button>
              </motion.div>

              {/* Voice Features */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:border-blue-400/50 transition"
              >
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Volume2 className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Voice Reading</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Listen to your personalized workout and diet plans with natural voice narration.
                </p>
                <Button
                  disabled={audioCooldown}
                  onClick={() =>
                    speakWithCooldown(
                      "plan",
                      `Workouts: ${workoutPlan.map((w) => w.name).join(", ")}. Meals: ${dietPlan
                        .map((m) => m.meal)
                        .join(", ")}. Tips: ${tips.join("; ")}`,
                    )
                  }
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm"
                >
                  Read My Plan
                </Button>
              </motion.div>

              {/* Image Generation */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:border-cyan-400/50 transition"
              >
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
                  <ImageIcon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">AI Image Generation</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Generate realistic images of exercises and meals to better visualize your fitness journey.
                </p>
                <Button
                  disabled={audioCooldown}
                  onClick={() => speakWithCooldown("tips", tips.join(". "))}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white text-sm"
                >
                  Play Tips Audio
                </Button>
              </motion.div>
            </div>

            {/* Quick Stats */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 mt-8"
            >
              <h3 className="text-xl font-bold text-foreground mb-4">AI Tips</h3>
              <ul className="space-y-2 list-disc list-inside text-sm text-muted-foreground">
                {tips.map((tip) => (
                  <li key={tip} className="text-foreground">
                    {tip}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}

        {/* Workout Tab */}
        {activeView === "workout" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {workoutPlan.map((exercise, i) => (
              <motion.div
                key={exercise.name}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-40 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 overflow-hidden flex items-center justify-center">
                  {exercise.imageUrl ? (
                    <img
                      src={exercise.imageUrl}
                      alt={exercise.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <Button
                      variant="ghost"
                      className="bg-white/10 hover:bg-white/20 text-white"
                      onClick={async (e) => {
                        e.stopPropagation()
                        await handleImage(exercise)
                      }}
                    >
                      {imageLoading === exercise.name ? (
                        "Generating..."
                      ) : (
                        <>
                          <ImageIcon className="w-4 h-4 mr-2" />
                          Generate Image
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-4">{exercise.name}</h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Sets</span>
                      <span className="font-semibold text-cyan-400">{exercise.sets}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Reps</span>
                      <span className="font-semibold text-cyan-400">{exercise.reps}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Rest</span>
                      <span className="font-semibold text-blue-400">{exercise.rest}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      disabled={audioCooldown}
                      className="w-full p-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() =>
                        speakWithCooldown(
                          "workout",
                          `${exercise.name}, ${exercise.sets} sets of ${exercise.reps} reps, rest ${exercise.rest}`,
                        )
                      }
                    >
                      <Volume2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Audio Cue</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Diet Tab */}
        {activeView === "diet" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {dietPlan.map((meal, i) => (
              <motion.div
                key={meal.meal}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 overflow-hidden flex items-center justify-center">
                  {meal.imageUrl ? (
                    <img
                      src={meal.imageUrl}
                      alt={meal.meal}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <Button
                      variant="ghost"
                      className="bg-white/10 hover:bg-white/20 text-white"
                      onClick={async (e) => {
                        e.stopPropagation()
                        await handleImage(meal)
                      }}
                    >
                      {imageLoading === meal.meal ? (
                        "Generating..."
                      ) : (
                        <>
                          <ImageIcon className="w-4 h-4 mr-2" />
                          Generate Image
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-foreground mb-1">{meal.meal}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{meal.items}</p>

                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Calories:</span>
                      <span className="ml-2 font-semibold text-cyan-400">{meal.calories}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10">
                      <div>
                        <p className="text-xs text-muted-foreground">Protein</p>
                        <p className="font-semibold text-cyan-400">{meal.protein}g</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Carbs</p>
                        <p className="font-semibold text-blue-400">{meal.carbs}g</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Fats</p>
                        <p className="font-semibold text-cyan-400">{meal.fats}g</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button
                      disabled={audioCooldown}
                      variant="outline"
                      className="w-full bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() =>
                        speakWithCooldown(
                          "meal",
                          `${meal.meal}: ${meal.items}, ${meal.calories} calories, protein ${meal.protein} grams`,
                        )
                      }
                    >
                      <Volume2 className="w-4 h-4 mr-2" />
                      Hear Meal
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </motion.div>
  )
}
