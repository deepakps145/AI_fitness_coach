import { NextResponse } from "next/server"
import { buildImageUrl } from "@/backend/image"

// Using Pollinations as a free, no-auth image generator for quick prototypes.
export async function POST(req: Request) {
  try {
    const { prompt } = (await req.json()) as { prompt: string }
    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 })
    }

    const imageUrl = buildImageUrl(prompt)

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error("/api/generate-image error", error)
    return NextResponse.json({ error: (error as Error).message || "Unexpected error" }, { status: 500 })
  }
}
