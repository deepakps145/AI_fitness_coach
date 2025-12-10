import { Buffer } from "buffer"
import type { PlanContent } from "@/lib/plan-types"

const GEMINI_MODEL = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash"
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta"

const DEFAULT_MOTIVATION = "Your plan is ready. Stay consistent and you'll see results."

function buildPrompt(body: Record<string, unknown>) {
  const lines = [
    "You are an expert fitness coach and dietitian.",
    "Respond ONLY with valid JSON. Do not include code fences, markdown, or prose.",
    "Ensure all keys and string values are enclosed in double quotes.",
    "Do not use trailing commas.",
    "Fields: workouts (array of {name, sets, reps, rest, focus, imagePrompt}), meals (array of {meal, items, calories, protein, carbs, fats, imagePrompt}), tips (array of strings), motivation (single string).",
    "Keep workouts 4-6 items, meals 4 items (breakfast, lunch, snack, dinner).",
    "Tailor to the user's goals, level, location, dietary preferences, and medical notes.",
    `User data: ${JSON.stringify(body)}`,
  ]
  return lines.join("\n")
}

function buildTipsPrompt(body: Record<string, unknown>, plan?: Pick<PlanContent, "workouts" | "meals">) {
  const lines = [
    "You are a motivational fitness coach.",
    "Respond ONLY with JSON containing { \"tips\": string[], \"motivation\": string }.",
    "Tips must be actionable (max 2 sentences each). Motivation should be a single uplifting quote.",
    `User data: ${JSON.stringify(body)}`,
  ]
  if (plan) {
    lines.push(`Current plan context: ${JSON.stringify(plan)}`)
  }
  return lines.join("\n")
}

const extractJson = (text: string): string | null => {
  const fenced = text.match(/```json([\s\S]*?)```/i)
  if (fenced?.[1]) return fenced[1].trim()
  const braces = text.match(/\{[\s\S]*\}/)
  if (braces?.[0]) return braces[0].trim()
  return null
}

const repairJson = (text: string): string => {
  // 1. Remove markdown code blocks
  let cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim()
  
  // 2. Attempt to fix common JSON syntax errors
  // Replace single quotes with double quotes for keys/values, but be careful about apostrophes in text
  // This is hard to do perfectly with regex. 
  // Instead, let's focus on the structure.
  
  // If the model returns "key": "value" "key2": "value" (missing comma)
  // We can try to insert commas between value and key.
  // Look for " (end of string) followed by whitespace/newlines then " (start of key)
  cleaned = cleaned.replace(/"\s+(?=")/g, '", ')
  
  // If the model returns number followed by key without comma: 123 "key"
  cleaned = cleaned.replace(/(\d+)\s+(?=")/g, '$1, ')

  // If the model returns boolean followed by key without comma: true "key"
  cleaned = cleaned.replace(/(true|false)\s+(?=")/g, '$1, ')

  // Remove trailing commas before closing braces/brackets
  cleaned = cleaned.replace(/,\s*([\]}])/g, '$1')

  return cleaned
}

async function requestGemini(prompt: string, retries = 3, delay = 1000) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set")
  }

  for (let i = 0; i < retries; i++) {
    try {
      const geminiRes = await fetch(
        `${GEMINI_BASE}/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0.8,
              maxOutputTokens: 8192,
              responseMimeType: "application/json",
            },
          }),
        },
      )

      if (!geminiRes.ok) {
        const errorText = await geminiRes.text()
        let errorJson: any
        try {
          errorJson = JSON.parse(errorText)
        } catch {
          // If not JSON, use text
        }

        const status = geminiRes.status
        const message = errorJson?.error?.message || errorText

        // Handle 503 (Overloaded) and 429 (Rate Limit) with retries
        if (status === 503 || status === 429) {
          if (i < retries - 1) {
            // Exponential backoff: 1s, 2s, 4s...
            const waitTime = delay * Math.pow(2, i)
            console.warn(`Gemini API ${status} error. Retrying in ${waitTime}ms...`)
            await new Promise((resolve) => setTimeout(resolve, waitTime))
            continue
          }
        }

        // If we are here, it's a fatal error or we ran out of retries
        if (status === 429) {
           throw new Error("AI Usage Limit Exceeded. Please try again later.")
        }
        if (status === 503) {
           throw new Error("AI Service Overloaded. Please try again in a moment.")
        }

        throw new Error(message || `Gemini request failed with status ${status}`)
      }

      const geminiJson = (await geminiRes.json()) as any
      const parts = geminiJson?.candidates?.[0]?.content?.parts
      const rawText: string | undefined = Array.isArray(parts)
        ? parts
            .map((p: any) => {
              if (typeof p?.text === "string") return p.text
              if (p?.inlineData?.data) {
                try {
                  const buf = Buffer.from(p.inlineData.data, "base64").toString("utf8")
                  return buf
                } catch {
                  return ""
                }
              }
              if (p?.json) {
                try {
                  return JSON.stringify(p.json)
                } catch {
                  return ""
                }
              }
              return ""
            })
            .join("\n")
            .trim()
        : undefined
      if (!rawText) {
        throw new Error("No content returned from Gemini")
      }

      return rawText

    } catch (error) {
      // If it's the last retry, rethrow
      if (i === retries - 1) throw error
      // If it's a network error (fetch failed), wait and retry
      const waitTime = delay * Math.pow(2, i)
      console.warn(`Network error. Retrying in ${waitTime}ms...`, error)
      await new Promise((resolve) => setTimeout(resolve, waitTime))
    }
  }
  throw new Error("Failed to connect to AI service after multiple attempts")
}

function parseJsonPayload<T>(rawText: string): T {
  try {
    const cleaned = extractJson(rawText) ?? rawText.trim()
    return JSON.parse(cleaned) as T
  } catch (err) {
    const repaired = repairJson(rawText)
    return JSON.parse(repaired) as T
  }
}

export async function generatePlanFromGemini(body: Record<string, unknown>): Promise<PlanContent> {
  const prompt = buildPrompt(body)
  const rawText = await requestGemini(prompt)
  const parsed = parseJsonPayload<PlanContent>(rawText)

  return {
    workouts: parsed.workouts || [],
    meals: parsed.meals || [],
    tips: parsed.tips || [],
    motivation: parsed.motivation || DEFAULT_MOTIVATION,
  }
}

export async function generateTipsFromGemini(
  body: Record<string, unknown>,
  plan?: Pick<PlanContent, "workouts" | "meals">,
): Promise<{ tips: string[]; motivation: string }> {
  const prompt = buildTipsPrompt(body, plan)
  const rawText = await requestGemini(prompt)
  const parsed = parseJsonPayload<{ tips?: string[]; motivation?: string }>(rawText)
  return {
    tips: parsed.tips || [],
    motivation: parsed.motivation || DEFAULT_MOTIVATION,
  }
}
