import { createHash } from "crypto"
import { NextResponse } from "next/server"
import { fetchUserAccount, updateUserPassword } from "@/backend/db"

function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex")
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, newPassword } = body

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: "Missing email or new password" },
        { status: 400 }
      )
    }

    // 1. Fetch user to ensure they exist
    const user = await fetchUserAccount(email)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // 2. Update with new password
    const newPasswordHash = hashPassword(newPassword)
    await updateUserPassword(email, newPasswordHash)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error changing password:", error)
    return NextResponse.json(
      { error: "Failed to change password" },
      { status: 500 }
    )
  }
}
