// Mood Tracker Types
export type MoodType = 'happy' | 'sad' | 'neutral' | 'excited' | 'tired' | 'stressed' | 'calm' | 'energetic';

export interface MoodEntry {
  id: string;
  date: string;
  mood: MoodType;
  note?: string;
}

// Water Tracker Types
export interface WaterEntry {
  id: string;
  date: string;
  amount: number; // in ml
  time: string;
}

// Meal Tracker Types
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MealEntry {
  id: string;
  date: string;
  mealType: MealType;
  description: string;
  calories: number;
  time: string;
  image?: string;
}

// Sleep Tracker Types
export type SleepQuality = 'poor' | 'fair' | 'good' | 'excellent';

export interface SleepEntry {
  id: string;
  date: string;
  hoursSlept: number;
  quality: SleepQuality;
  bedTime: string;
  wakeTime: string;
  notes?: string;
}

// Fitness Tracker Types
export type ExerciseType = 'cardio' | 'strength' | 'flexibility' | 'balance';

export interface ExerciseEntry {
  id: string;
  date: string;
  type: ExerciseType;
  name: string;
  duration: number; // in minutes
  calories?: number;
  sets?: number;
  reps?: number;
  completed: boolean;
}

// Stretch Routine Types
export interface StretchExercise {
  id: string;
  name: string;
  duration: number; // in seconds
  description: string;
  image?: string;
}

export interface StretchRoutine {
  id: string;
  name: string;
  exercises: StretchExercise[];
}

// Mental Health Journal Types
export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  tags: string[];
  mood: string;
}

// Weight Tracker Types
export interface WeightEntry {
  id: string;
  date: string;
  weight: number; // in kg
  notes?: string;
}