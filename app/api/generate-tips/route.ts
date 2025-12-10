import { NextResponse } from "next/server"
import { generateTipsFromGemini } from "@/backend/gemini"
import type { PlanContent } from "@/lib/plan-types"
import type { UserData } from "@/components/app-wrapper"

export async function POST(req: Request) {
  try {
    const { userData, plan } = (await req.json()) as {
      userData: Partial<UserData>
      plan?: Pick<PlanContent, "workouts" | "meals">
    }
    if (!userData) {
      return NextResponse.json({ error: "Missing user data" }, { status: 400 })
    }
    const tips = await generateTipsFromGemini(userData, plan)
    return NextResponse.json(tips)
  } catch (error) {
    const message = (error as Error).message
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
