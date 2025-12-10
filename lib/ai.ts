import type { PlanContent } from "./plan-types"
import type { UserData } from "@/components/app-wrapper"

export interface GeneratePlanRequest {
  name?: string
  age?: number
  gender?: string
  height?: number
  weight?: number
  goal?: string
  level?: string
  location?: string
  dietaryPrefs?: string[]
  medicalHistory?: string
  stressLevel?: string
}

export async function generatePlan(payload: GeneratePlanRequest): Promise<PlanContent> {
  const res = await fetch("/api/generate-plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await res.text()
    try {
      const errJson = JSON.parse(text)
      throw new Error(errJson.error || "Failed to generate plan")
    } catch {
      throw new Error(text || "Failed to generate plan")
    }
  }

  const data = (await res.json()) as PlanContent
  return data
}

export async function speakText(section: string, text: string): Promise<string> {
  const res = await fetch("/api/speak", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ section, text }),
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(errorText || "TTS failed")
  }

  const { audioBase64 } = (await res.json()) as { audioBase64: string }
  return audioBase64
}

export async function generateImage(prompt: string): Promise<string> {
  const res = await fetch("/api/generate-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(errorText || "Image generation failed")
  }

  const { imageUrl } = (await res.json()) as { imageUrl: string }
  return imageUrl
}

export async function fetchStoredPlan(email: string) {
  const res = await fetch(`/api/plan?email=${encodeURIComponent(email)}`)
  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || "Failed to fetch stored plan")
  }
  return (await res.json()) as { record: { plan: PlanContent; user_data: Partial<UserData> } | null }
}

export async function savePlan(email: string, userData: Partial<UserData>, plan: PlanContent) {
  const res = await fetch("/api/plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, userData, plan }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || "Failed to save plan")
  }
  return (await res.json()) as { record: unknown }
}

export async function regenerateTips(userData: Partial<UserData>, plan: Pick<PlanContent, "workouts" | "meals">) {
  const res = await fetch("/api/generate-tips", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userData, plan }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || "Failed to refresh tips")
  }

  return (await res.json()) as { tips: string[]; motivation: string }
}
