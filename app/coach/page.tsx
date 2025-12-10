"use client"
import { Suspense } from "react"
import { AppWrapper } from "@/components/app-wrapper"
import { LoadingPage } from "@/components/views/loading-page"

export default function CoachPage() {
  return (
    <Suspense fallback={<LoadingPage isGenerating={false} />}>
      <AppWrapper />
    </Suspense>
  )
}
