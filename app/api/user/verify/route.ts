import { NextResponse } from "next/server"
import { fetchUserAccount } from "@/backend/db"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, name } = body

    if (!email || !name) {
      return NextResponse.json(
        { error: "Missing email or name" },
        { status: 400 }
      )
    }

    const user = await fetchUserAccount(email)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Case-insensitive comparison for name
    if (user.name?.toLowerCase() !== name.toLowerCase()) {
      return NextResponse.json({ error: "Verification failed. Name does not match." }, { status: 401 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error verifying user:", error)
    return NextResponse.json(
      { error: "Failed to verify user" },
      { status: 500 }
    )
  }
}
