const DEFAULT_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM"

export async function synthesizeSpeech(section: string, text: string): Promise<string> {
  if (!process.env.ELEVENLABS_API_KEY) {
    throw new Error("ELEVENLABS_API_KEY is not set")
  }
  if (!text) {
    throw new Error("Missing text")
  }

  const ttsRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${DEFAULT_VOICE_ID}`, {
    method: "POST",
    headers: {
      "xi-api-key": process.env.ELEVENLABS_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      voice_settings: { stability: 0.4, similarity_boost: 0.6 },
      model_id: "eleven_multilingual_v2",
      output_format: "mp3_44100_128",
      metadata: { section },
    }),
  })

  if (!ttsRes.ok) {
    const errText = await ttsRes.text()
    throw new Error(errText || "TTS failed")
  }

  const buffer = await ttsRes.arrayBuffer()
  return Buffer.from(buffer).toString("base64")
}
