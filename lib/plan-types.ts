export interface WorkoutItem {
  name: string
  sets: number
  reps: number
  rest: string
  focus?: string
  imagePrompt?: string
  imageUrl?: string
}

export interface MealItem {
  meal: string
  items: string
  calories: number
  protein: number
  carbs: number
  fats: number
  imagePrompt?: string
  imageUrl?: string
}

export interface PlanContent {
  workouts: WorkoutItem[]
  meals: MealItem[]
  tips: string[]
  motivation: string
}
