"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Dumbbell, Sparkles, Volume2, ImageIcon, ShieldCheck, Zap, ArrowRight, Rocket } from "lucide-react"

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Coach", href: "/coach" },
  { label: "Features", href: "#features" },
]

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden text-foreground neon-grid">
      <div className="absolute inset-0 star-field" aria-hidden />
      <motion.div 
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-cyan-500/20 via-transparent to-transparent blur-3xl" 
        aria-hidden 
      />
      <motion.div 
        animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-24 top-40 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" 
        aria-hidden 
      />
      <motion.div 
        animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-12 top-24 h-64 w-64 rounded-full bg-cyan-500/30 blur-3xl" 
        aria-hidden 
      />

      <header className="relative max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight">FitAI Coach</p>
            <p className="text-xs text-muted-foreground">AI fitness, nutrition, voice + visuals</p>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="hover:text-foreground transition">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/coach?view=signin">
            <Button variant="outline" className="border-white/20 text-foreground hover:bg-white/10">
              Login
            </Button>
          </Link>
          <Link href="/coach?view=signup">
            <Button className="bg-gradient-to-r from-purple-500 via-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30">
              Sign Up
            </Button>
          </Link>
        </div>
      </header>

      <section className="relative max-w-6xl mx-auto px-6 py-12 lg:py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-7">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-cyan-200"
          >
            <Sparkles className="w-4 h-4" />
            AI workouts · meals · voice · visuals
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.5 }}
            className="text-4xl lg:text-5xl font-bold leading-tight tracking-tight"
          >
            Your Personal AI Fitness Coach. Tailored Workouts, Diet Plans & Real-time Guidance.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-lg text-muted-foreground max-w-2xl"
          >
            Experience a new era of fitness with AI-generated workout routines, personalized meal plans, and interactive voice coaching. Visualize your progress with AI-generated imagery and stay on track with smart audio cues.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="flex flex-wrap gap-3"
          >
            <Link href="/coach?view=signup">
              <Button className="bg-gradient-to-r from-purple-500 via-cyan-500 to-blue-500 text-white px-6 py-5 text-base shadow-lg shadow-cyan-500/30">
                Start Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/coach?view=signin">
              <Button variant="outline" className="border-white/20 text-foreground hover:bg-white/10 px-6 py-5 text-base">
                See the app
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.3
                }
              }
            }}
            className="grid grid-cols-2 gap-3 text-sm text-muted-foreground"
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}><Badge>Gemini-generated plans</Badge></motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}><Badge>Neon DB ready</Badge></motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}><Badge>ElevenLabs voice</Badge></motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}><Badge>AI images per item</Badge></motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="relative"
        >
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-14 -right-16 h-56 w-56 rounded-full bg-purple-500/25 blur-3xl" 
            aria-hidden 
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl" 
            aria-hidden 
          />
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative glass rounded-3xl p-6 shadow-2xl glow-ring border-white/10 bg-white/5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Next workout</p>
                <p className="text-xl font-semibold">Push Day · 45 min</p>
              </div>
              <Zap className="w-6 h-6 text-cyan-300" />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <CardTile label="Barbell Squat" value="4 x 8" />
              <CardTile label="Bench Press" value="4 x 10" />
              <CardTile label="Macros today" value="2,250 kcal" />
              <CardTile label="Protein target" value="160 g" />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-xs">
              {[
                { icon: Volume2, label: "Voice" },
                { icon: ImageIcon, label: "Images" },
                { icon: ShieldCheck, label: "Saved" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10 text-foreground"
                >
                  <item.icon className="w-4 h-4 text-cyan-300" />
                  {item.label}
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
              <Rocket className="w-4 h-4 text-cyan-300" />
              Ready to generate your plan with Gemini + ElevenLabs.
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section id="features" className="relative max-w-6xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard title="Autonomous plans" description="Gemini builds workouts, meals, tips, and motivation from your inputs—no templates." />
          <FeatureCard title="Voice + visuals" description="ElevenLabs reads your plan, while AI renders exercises and meals on tap." />
          <FeatureCard title="Saved & synced" description="Neon-ready persistence keeps your last plan so returning users pick up instantly." />
        </div>
      </section>
    </main>
  )
}

function Badge({ children }: { children: ReactNode }) {
  return <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-foreground">{children}</div>
}

function CardTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-white/10 border border-white/10">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="font-semibold text-foreground">{value}</p>
    </div>
  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-6 border-white/10 bg-white/5 shadow-lg glow-ring"
    >
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </motion.div>
  )
}
