import { NextResponse } from "next/server"
import { generatePlanFromGemini } from "@/backend/gemini"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const plan = await generatePlanFromGemini(body)
    return NextResponse.json(plan)
  } catch (error) {
    console.error("/api/generate-plan error", error)
    return NextResponse.json({ error: (error as Error).message || "Unexpected error" }, { status: 500 })
  }
}
