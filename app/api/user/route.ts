import { createHash } from "crypto"
import { NextResponse } from "next/server"
import type { UserData } from "@/components/app-wrapper"
import { fetchUserAccount, upsertUserAccount, updateUserProfile } from "@/backend/db"

function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex")
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("POST /api/user request:", body.mode, body.email)

    const { mode, email, password, profile } = body as {
      mode: "signup" | "login"
      email: string
      password: string
      profile?: Partial<UserData>
    }

    if (!mode || !email || !password) {
      return NextResponse.json({ error: "Missing email, password, or mode" }, { status: 400 })
    }

    const passwordHash = hashPassword(password)

    if (mode === "signup") {
      console.log("Checking if user exists:", email)
      const existing = await fetchUserAccount(email)
      if (existing) {
        console.log("User already exists:", email)
        return NextResponse.json({ error: "Email already exists" }, { status: 409 })
      }
      console.log("Creating new user:", email)
      const record = await upsertUserAccount({ email, password_hash: passwordHash, ...profile })
      console.log("User created successfully:", record.email)
      return NextResponse.json({ user: record })
    }

    console.log("Fetching user for login:", email)
    const record = await fetchUserAccount(email)
    if (!record) {
      console.log("User not found:", email)
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    if (record.password_hash !== passwordHash) {
      console.log("Invalid password for:", email)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    console.log("Login successful:", email)
    return NextResponse.json({ user: record })
  } catch (error) {
    console.error("Error in POST /api/user:", error)
    const message = (error as Error).message
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    console.log("PUT /api/user request:", body.email)

    const { email, profile } = body as {
      email: string
      profile: Partial<UserData>
    }

    if (!email || !profile) {
      return NextResponse.json({ error: "Missing email or profile data" }, { status: 400 })
    }

    const updatedUser = await updateUserProfile(email, profile)
    
    if (!updatedUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user: updatedUser })

  } catch (error) {
    console.error("Error in PUT /api/user:", error)
    const message = (error as Error).message
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
