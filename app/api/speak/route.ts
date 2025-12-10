import { NextResponse } from "next/server"
import { synthesizeSpeech } from "@/backend/tts"

export async function POST(req: Request) {
  try {
    const { section, text } = (await req.json()) as { section: string; text: string }
    const audioBase64 = await synthesizeSpeech(section, text)
    return NextResponse.json({ audioBase64 })
  } catch (error) {
    console.error("/api/speak error", error)
    return NextResponse.json({ error: (error as Error).message || "Unexpected error" }, { status: 500 })
  }
}
