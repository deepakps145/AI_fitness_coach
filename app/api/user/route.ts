import { createHash } from "crypto"
import { NextResponse } from "next/server"
import type { UserData } from "@/components/app-wrapper"
import { fetchUserAccount, upsertUserAccount } from "@/backend/db"

function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex")
}

export async function POST(req: Request) {
  try {
    const { mode, email, password, profile } = (await req.json()) as {
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
      const existing = await fetchUserAccount(email)
      if (existing) {
        return NextResponse.json({ error: "Email already exists" }, { status: 409 })
      }
      const record = await upsertUserAccount({ email, password_hash: passwordHash, ...profile })
      return NextResponse.json({ user: record })
    }

    const record = await fetchUserAccount(email)
    if (!record) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    if (record.password_hash !== passwordHash) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    return NextResponse.json({ user: record })
  } catch (error) {
    const message = (error as Error).message
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
