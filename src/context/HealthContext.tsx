import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { 
  MoodEntry, 
  WaterEntry, 
  MealEntry, 
  SleepEntry, 
  ExerciseEntry, 
  WeightEntry,
  JournalEntry,
  StretchRoutine
} from '../types/health';

interface ThemeContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

// Initial data
const today = new Date();
const dateStr = today.toISOString().split('T')[0];

interface HealthContextType extends ThemeContextType {
  // Mood data
  moodEntries: MoodEntry[];
  addMoodEntry: (entry: MoodEntry) => void;
  
  // Water data
  waterEntries: WaterEntry[];
  waterGoal: number;
  setWaterGoal: (goal: number) => void;
  addWaterEntry: (entry: WaterEntry) => void;
  
  // Meal data
  mealEntries: MealEntry[];
  addMealEntry: (entry: MealEntry) => void;
  
  // Sleep data
  sleepEntries: SleepEntry[];
  addSleepEntry: (entry: SleepEntry) => void;
  
  // Fitness data
  exerciseEntries: ExerciseEntry[];
  addExerciseEntry: (entry: ExerciseEntry) => void;
  
  // Weight data
  weightEntries: WeightEntry[];
  addWeightEntry: (entry: WeightEntry) => void;
  
  // Journal entries
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: JournalEntry) => void;
  
  // Stretch routines
  stretchRoutines: StretchRoutine[];
  activeStretchRoutine: StretchRoutine | null;
  setActiveStretchRoutine: (routine: StretchRoutine | null) => void;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Mood state
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([
    { id: '1', date: dateStr, mood: 'happy', note: 'Had a great day!' },
    { id: '2', date: new Date(today.getTime() - 86400000).toISOString().split('T')[0], mood: 'neutral', note: 'Average day' },
  ]);
  
  // Water state
  const [waterEntries, setWaterEntries] = useState<WaterEntry[]>([
    { id: '1', date: dateStr, amount: 250, time: '08:00' },
    { id: '2', date: dateStr, amount: 250, time: '10:30' },
    { id: '3', date: dateStr, amount: 350, time: '13:15' },
  ]);
  const [waterGoal, setWaterGoal] = useState<number>(2000);
  
  // Meal state
  const [mealEntries, setMealEntries] = useState<MealEntry[]>([
    { id: '1', date: dateStr, mealType: 'breakfast', description: 'Oatmeal with berries', calories: 350, time: '08:30' },
    { id: '2', date: dateStr, mealType: 'lunch', description: 'Grilled chicken salad', calories: 450, time: '12:30' },
  ]);
  
  // Sleep state
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([
    { id: '1', date: dateStr, hoursSlept: 7.5, quality: 'good', bedTime: '23:00', wakeTime: '06:30' },
    { id: '2', date: new Date(today.getTime() - 86400000).toISOString().split('T')[0], hoursSlept: 8, quality: 'excellent', bedTime: '22:30', wakeTime: '06:30' },
  ]);
  
  // Fitness state
  const [exerciseEntries, setExerciseEntries] = useState<ExerciseEntry[]>([
    { id: '1', date: dateStr, type: 'cardio', name: 'Running', duration: 30, calories: 300, completed: true },
    { id: '2', date: dateStr, type: 'strength', name: 'Push-ups', duration: 15, sets: 3, reps: 15, completed: true },
    { id: '3', date: dateStr, type: 'flexibility', name: 'Yoga', duration: 20, completed: false },
  ]);
  
  // Weight state
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([
    { id: '1', date: new Date(today.getTime() - 7 * 86400000).toISOString().split('T')[0], weight: 70.5 },
    { id: '2', date: new Date(today.getTime() - 6 * 86400000).toISOString().split('T')[0], weight: 70.3 },
    { id: '3', date: new Date(today.getTime() - 5 * 86400000).toISOString().split('T')[0], weight: 70.2 },
    { id: '4', date: new Date(today.getTime() - 4 * 86400000).toISOString().split('T')[0], weight: 70.0 },
    { id: '5', date: new Date(today.getTime() - 3 * 86400000).toISOString().split('T')[0], weight: 69.8 },
    { id: '6', date: new Date(today.getTime() - 2 * 86400000).toISOString().split('T')[0], weight: 69.7 },
    { id: '7', date: new Date(today.getTime() - 86400000).toISOString().split('T')[0], weight: 69.5 },
    { id: '8', date: dateStr, weight: 69.4 },
  ]);
  
  // Journal state
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
    { 
      id: '1', 
      date: dateStr, 
      title: 'Feeling motivated', 
      content: 'Today I feel very motivated to exercise and eat well.', 
      tags: ['motivation', 'exercise'], 
      mood: 'energetic' 
    },
    { 
      id: '2', 
      date: new Date(today.getTime() - 86400000).toISOString().split('T')[0], 
      title: 'Stress management', 
      content: 'Found a new way to manage stress through deep breathing.', 
      tags: ['stress', 'breathing'], 
      mood: 'calm' 
    },
  ]);
  
  // Stretch routines
  const defaultStretchRoutines: StretchRoutine[] = [
    {
      id: '1',
      name: 'Morning Stretch',
      exercises: [
        { id: '1', name: 'Neck Rolls', duration: 30, description: 'Gently roll your neck in a circular motion.' },
        { id: '2', name: 'Shoulder Stretch', duration: 45, description: 'Pull each arm across chest and hold.' },
        { id: '3', name: 'Hamstring Stretch', duration: 60, description: 'Reach for your toes while seated.' },
      ]
    },
    {
      id: '2',
      name: 'Post-Workout',
      exercises: [
        { id: '1', name: 'Quad Stretch', duration: 45, description: 'Pull foot to buttocks while standing.' },
        { id: '2', name: 'Calf Stretch', duration: 30, description: 'Lean against wall with one leg extended.' },
        { id: '3', name: 'Upper Back Stretch', duration: 45, description: 'Clasp hands and extend arms forward.' },
      ]
    }
  ];
  
  const [stretchRoutines, setStretchRoutines] = useState<StretchRoutine[]>(defaultStretchRoutines);
  const [activeStretchRoutine, setActiveStretchRoutine] = useState<StretchRoutine | null>(null);
  
  // Handler functions
  const addMoodEntry = (entry: MoodEntry) => {
    setMoodEntries([...moodEntries, { ...entry, id: Date.now().toString() }]);
  };
  
  const addWaterEntry = (entry: WaterEntry) => {
    setWaterEntries([...waterEntries, { ...entry, id: Date.now().toString() }]);
  };
  
  const addMealEntry = (entry: MealEntry) => {
    setMealEntries([...mealEntries, { ...entry, id: Date.now().toString() }]);
  };
  
  const addSleepEntry = (entry: SleepEntry) => {
    setSleepEntries([...sleepEntries, { ...entry, id: Date.now().toString() }]);
  };
  
  const addExerciseEntry = (entry: ExerciseEntry) => {
    setExerciseEntries([...exerciseEntries, { ...entry, id: Date.now().toString() }]);
  };
  
  const addWeightEntry = (entry: WeightEntry) => {
    setWeightEntries([...weightEntries, { ...entry, id: Date.now().toString() }]);
  };
  
  const addJournalEntry = (entry: JournalEntry) => {
    setJournalEntries([...journalEntries, { ...entry, id: Date.now().toString() }]);
  };
  
  const value = {
    theme,
    setTheme,
    moodEntries,
    addMoodEntry,
    waterEntries,
    waterGoal,
    setWaterGoal,
    addWaterEntry,
    mealEntries,
    addMealEntry,
    sleepEntries,
    addSleepEntry,
    exerciseEntries,
    addExerciseEntry,
    weightEntries,
    addWeightEntry,
    journalEntries,
    addJournalEntry,
    stretchRoutines,
    activeStretchRoutine,
    setActiveStretchRoutine,
  };
  
  return (
    <HealthContext.Provider value={value}>
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (context === undefined) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};