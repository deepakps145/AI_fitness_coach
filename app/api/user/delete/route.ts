import { createHash } from "crypto"
import { NextResponse } from "next/server"
import { fetchUserAccount, deleteUserAccount } from "@/backend/db"

function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex")
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 }
      )
    }

    // 1. Fetch user to verify password
    const user = await fetchUserAccount(email)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // 2. Verify password
    const passwordHash = hashPassword(password)
    if (user.password_hash !== passwordHash) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 })
    }

    // 3. Delete user
    await deleteUserAccount(email)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    )
  }
}
