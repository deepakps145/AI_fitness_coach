export function buildImageUrl(prompt: string): string {
  const encoded = encodeURIComponent(prompt)
  return `https://image.pollinations.ai/prompt/${encoded}`
}
