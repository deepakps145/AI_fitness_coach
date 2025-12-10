import { NextResponse } from "next/server"
import { fetchPlanByEmail, upsertPlanRecord, updateUserProfile } from "@/backend/db"
import type { PlanContent } from "@/lib/plan-types"
import type { UserData } from "@/components/app-wrapper"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email")
    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 })
    }
    const record = await fetchPlanByEmail(email)
    return NextResponse.json({ record })
  } catch (error) {
    const message = (error as Error).message
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { email, userData, plan } = (await req.json()) as {
      email: string
      userData: Partial<UserData>
      plan: PlanContent
    }
    if (!email || !plan) {
      return NextResponse.json({ error: "Missing email or plan" }, { status: 400 })
    }
    const record = await upsertPlanRecord(email, userData, plan)
    if (userData && Object.keys(userData).length > 0) {
      await updateUserProfile(email, userData)
    }
    return NextResponse.json({ record })
  } catch (error) {
    const message = (error as Error).message
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
