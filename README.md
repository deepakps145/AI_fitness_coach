````markdown
# AI Fitness Coach

A powerful Next.js web application that generates personalized AI-driven fitness plans with integrated voice coaching, meal planning, exercise visualization, and data persistence. Built with Framer Motion animations, ElevenLabs TTS, Google Gemini AI, and Neon PostgreSQL.

## Features

**AI-Powered Plans**
- Generate personalized workout routines using Google Gemini
- Create customized meal plans based on user goals and preferences
- Get daily fitness tips and motivation

**Voice Integration**
- Text-to-speech coaching using ElevenLabs
- Audio cues with 3-second cooldown to prevent spam

**Visual Generation**
- AI-generated images for exercises and meals
- Beautiful, responsive UI with smooth animations

**User Management**
- Sign up / Sign in with email-based authentication
- Profile settings with editable user data
- Change password functionality
- Session persistence with localStorage

**Data Persistence**
- PostgreSQL database (Neon) for user accounts and plans
- Automatic data sync across page reloads


## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup (`.env.local`)

```
# AI APIs
GEMINI_API_KEY=your_google_gemini_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM # or your custom voice ID

# Database
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require
```

### 3. Start Development Server

```bash
npm run dev
```

Visit:
- `/` – Landing page with feature overview
- `/coach` – Interactive app (sign in / sign up / dashboard)

## API Routes

### Authentication
- `POST /api/user` – Sign up / Login with email and password
- `POST /api/user/change-password` – Update user password

### Plan Generation
- `POST /api/generate-plan` – Generate workout, meals, tips, and motivation using Gemini
- `GET /api/plan` – Fetch stored user plan from database
- `POST /api/plan` – Save generated plan to database

### Content Generation
- `POST /api/speak` – Generate audio (ElevenLabs TTS) and return base64
- `POST /api/generate-image` – Generate images for exercises/meals (Pollinations API)
- `POST /api/generate-tips` – Generate personalized fitness tips

### Database Schema
- `user_accounts` – Stores user profile, credentials, and settings
- `user_plans` – Stores generated fitness plans with user data snapshots

## Project Structure

```
.
├── app/
│   ├── page.tsx              # Landing page with animations
│   ├── layout.tsx            # Root layout
│   ├── coach/
│   │   └── page.tsx          # Coach app entry point
│   └── api/
│       ├── user/             # Authentication endpoints
│       ├── generate-plan/    # Plan generation
│       ├── generate-image/   # Image generation
│       ├── generate-tips/    # Fitness tips
│       ├── speak/            # TTS audio
│       └── plan/             # Plan storage
├── components/
│   ├── app-wrapper.tsx       # Main app state & routing
│   ├── views/                # Page views (signin, signup, dashboard)
│   └── ui/                   # Reusable UI components
├── backend/
│   ├── db.ts                 # Database functions
│   ├── gemini.ts             # Gemini API integration
│   ├── image.ts              # Image generation
│   └── tts.ts                # TTS integration
├── lib/
│   ├── ai.ts                 # AI helper functions
│   ├── plan-types.ts         # TypeScript interfaces
│   └── utils.ts              # Utilities
└── styles/
    └── globals.css           # Global styles
```