# AI Fitness Coach

Next.js app that builds AI-generated workout and diet plans, reads them aloud with ElevenLabs, generates exercise/meal images, and is ready to persist data to Neon.

## Quick start

1) Install deps

```
pnpm install
```

2) Env vars (`.env.local`)

```
GEMINI_API_KEY=your_google_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM # or your custom voice
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require
# For PostgREST/Neon REST (used by /api/plan)
NEON_REST_URL=https://ep-polished-morning-a1gb3y6f.apirest.ap-southeast-1.aws.neon.tech/neondb/rest/v1
NEON_REST_KEY=your_neon_rest_key
```

3) Run dev server

```
pnpm dev
```

Visit `/` for the landing page and `/coach` for the interactive flow.

## API routes
- `POST /api/generate-plan` → calls Gemini to return workouts, meals, tips, motivation (JSON only)
- `POST /api/speak` → ElevenLabs TTS, returns base64 audio
- `POST /api/generate-image` → image URL via Pollinations (no auth)

## Data model
See `NEON_SETUP.md` for wiring Neon + Drizzle and `db.md` for direct SQL/PostgREST schema. Store user onboarding data and the generated plan JSON.
