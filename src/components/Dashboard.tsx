import React from 'react';
import { useHealth } from '../context/HealthContext';
import { 
  BarChart, Activity, Droplets, Moon, Heart, UtensilsCrossed, Weight, 
  TrendingUp, Plus, ArrowRight
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { 
    moodEntries, waterEntries, waterGoal, mealEntries,
    sleepEntries, exerciseEntries, weightEntries
  } = useHealth();
  
  // Get today's data
  const today = new Date().toISOString().split('T')[0];
  const todaysMoodEntry = moodEntries.find(entry => entry.date === today);
  const todaysWaterEntries = waterEntries.filter(entry => entry.date === today);
  const totalWaterToday = todaysWaterEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const waterPercentage = Math.min(Math.round((totalWaterToday / waterGoal) * 100), 100);
  
  const todaysMeals = mealEntries.filter(entry => entry.date === today);
  const totalCaloriesToday = todaysMeals.reduce((sum, entry) => sum + entry.calories, 0);
  
  const latestSleepEntry = sleepEntries[0];
  const completedExercises = exerciseEntries.filter(entry => entry.date === today && entry.completed);
  const totalExercises = exerciseEntries.filter(entry => entry.date === today);
  
  const lastWeightEntry = weightEntries[weightEntries.length - 1];
  const previousWeightEntry = weightEntries[weightEntries.length - 2];
  const weightDiff = lastWeightEntry && previousWeightEntry 
    ? (lastWeightEntry.weight - previousWeightEntry.weight).toFixed(1)
    : '0';
  
  // Helper for mood color
  const getMoodColor = (mood: string | undefined) => {
    switch(mood) {
      case 'happy': return 'bg-yellow-400';
      case 'sad': return 'bg-blue-400';
      case 'excited': return 'bg-orange-400';
      case 'tired': return 'bg-gray-400';
      case 'stressed': return 'bg-red-400';
      case 'calm': return 'bg-green-400';
      case 'energetic': return 'bg-purple-400';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Today's Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {/* Mood Card */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Current Mood</h2>
            <Heart className="text-pink-500" size={20} />
          </div>
          
          {todaysMoodEntry ? (
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getMoodColor(todaysMoodEntry.mood)}`}>
                {todaysMoodEntry.mood === 'happy' && '😊'}
                {todaysMoodEntry.mood === 'sad' && '😢'}
                {todaysMoodEntry.mood === 'neutral' && '😐'}
                {todaysMoodEntry.mood === 'excited' && '😃'}
                {todaysMoodEntry.mood === 'tired' && '😴'}
                {todaysMoodEntry.mood === 'stressed' && '😰'}
                {todaysMoodEntry.mood === 'calm' && '😌'}
                {todaysMoodEntry.mood === 'energetic' && '⚡'}
              </div>
              <div className="ml-4">
                <p className="font-medium capitalize">{todaysMoodEntry.mood}</p>
                <p className="text-sm text-gray-500">{todaysMoodEntry.note}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-gray-500">No mood recorded today</p>
              <button className="text-blue-500 flex items-center">
                <Plus size={16} />
                <span className="ml-1">Add</span>
              </button>
            </div>
          )}
        </div>
        
        {/* Water Card */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Water Intake</h2>
            <Droplets className="text-blue-500" size={20} />
          </div>
          
          <div className="flex items-center mb-3">
            <div className="w-16 h-16 relative">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="3"
                  strokeDasharray="100, 100"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  strokeDasharray={`${waterPercentage}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-semibold">{waterPercentage}%</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="font-medium">{totalWaterToday}ml / {waterGoal}ml</p>
              <p className="text-sm text-gray-500">{todaysWaterEntries.length} drinks today</p>
            </div>
          </div>
          
          <button className="w-full py-2 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
            <Plus size={16} />
            <span className="ml-1">Add water</span>
          </button>
        </div>
        
        {/* Sleep Card */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Sleep</h2>
            <Moon className="text-indigo-600" size={20} />
          </div>
          
          {latestSleepEntry ? (
            <div>
              <div className="mb-3">
                <span className="text-3xl font-bold">{latestSleepEntry.hoursSlept}</span>
                <span className="text-lg ml-1">hours</span>
              </div>
              <p className="text-sm text-gray-500 mb-1">
                {latestSleepEntry.bedTime} - {latestSleepEntry.wakeTime}
              </p>
              <div className="flex items-center">
                <span className={`inline-block w-3 h-3 rounded-full ${
                  latestSleepEntry.quality === 'excellent' ? 'bg-green-500' :
                  latestSleepEntry.quality === 'good' ? 'bg-blue-500' :
                  latestSleepEntry.quality === 'fair' ? 'bg-yellow-500' : 'bg-red-500'
                } mr-2`}></span>
                <span className="text-sm capitalize">{latestSleepEntry.quality} quality</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No recent sleep data</p>
          )}
        </div>
        
        {/* Meals Card */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Calories</h2>
            <UtensilsCrossed className="text-orange-500" size={20} />
          </div>
          
          <div className="mb-3">
            <span className="text-3xl font-bold">{totalCaloriesToday}</span>
            <span className="text-lg ml-1">cal</span>
          </div>
          
          <div className="space-y-2">
            {todaysMeals.length > 0 ? (
              todaysMeals.map(meal => (
                <div key={meal.id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className={`w-2 h-2 rounded-full ${
                      meal.mealType === 'breakfast' ? 'bg-yellow-500' :
                      meal.mealType === 'lunch' ? 'bg-green-500' :
                      meal.mealType === 'dinner' ? 'bg-blue-500' : 'bg-purple-500'
                    } mr-2`}></span>
                    <span className="text-sm capitalize">{meal.mealType}</span>
                  </div>
                  <span className="text-sm">{meal.calories} cal</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No meals recorded today</p>
            )}
          </div>
        </div>
        
        {/* Exercise Card */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Fitness</h2>
            <Activity className="text-green-500" size={20} />
          </div>
          
          <div className="mb-3">
            {totalExercises.length > 0 ? (
              <div>
                <div className="flex items-center mb-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                    <div 
                      className="h-full bg-green-500 rounded-full" 
                      style={{ width: `${(completedExercises.length / totalExercises.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {completedExercises.length}/{totalExercises.length} completed
                  </span>
                </div>
                <div className="space-y-1">
                  {totalExercises.slice(0, 2).map(exercise => (
                    <div key={exercise.id} className="flex items-center">
                      <span className={`w-3 h-3 rounded ${exercise.completed ? 'bg-green-500' : 'border border-gray-300'} mr-2`}></span>
                      <span className="text-sm">{exercise.name}</span>
                    </div>
                  ))}
                  {totalExercises.length > 2 && (
                    <p className="text-sm text-blue-500">+{totalExercises.length - 2} more</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No exercises planned today</p>
            )}
          </div>
        </div>
        
        {/* Weight Card */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Weight</h2>
            <Weight className="text-purple-500" size={20} />
          </div>
          
          {lastWeightEntry ? (
            <div>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">{lastWeightEntry.weight}</span>
                <span className="text-lg ml-1">kg</span>
                
                <div className={`ml-3 flex items-center ${Number(weightDiff) < 0 ? 'text-green-500' : Number(weightDiff) > 0 ? 'text-red-500' : 'text-gray-500'}`}>
                  {Number(weightDiff) < 0 ? (
                    <TrendingUp size={16} className="transform rotate-180" />
                  ) : Number(weightDiff) > 0 ? (
                    <TrendingUp size={16} />
                  ) : null}
                  <span className="text-sm ml-1">{Math.abs(Number(weightDiff))} kg</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">Last updated: {lastWeightEntry.date}</p>
              <div className="mt-3 h-10 bg-gray-50 rounded-md flex items-end">
                {weightEntries.slice(-7).map((entry, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-1 bg-purple-500 rounded-t-sm" 
                      style={{ 
                        height: `${(entry.weight / Math.max(...weightEntries.slice(-7).map(e => e.weight))) * 30}px` 
                      }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No weight data recorded</p>
          )}
        </div>
      </div>
      
      {/* Quick Actions */}
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button className="bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl p-4 flex flex-col items-center justify-center transition-colors">
          <Droplets size={24} className="mb-2" />
          <span>Log Water</span>
        </button>
        <button className="bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-xl p-4 flex flex-col items-center justify-center transition-colors">
          <UtensilsCrossed size={24} className="mb-2" />
          <span>Log Meal</span>
        </button>
        <button className="bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl p-4 flex flex-col items-center justify-center transition-colors">
          <Weight size={24} className="mb-2" />
          <span>Log Weight</span>
        </button>
        <button className="bg-green-50 hover:bg-green-100 text-green-700 rounded-xl p-4 flex flex-col items-center justify-center transition-colors">
          <Activity size={24} className="mb-2" />
          <span>Start Workout</span>
        </button>
      </div>
      
      {/* Weekly Summary */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Weekly Summary</h2>
          <button className="text-blue-600 flex items-center">
            See all
            <ArrowRight size={16} className="ml-1" />
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex flex-col md:flex-row md:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <BarChart size={18} className="text-blue-600 mr-2" />
                <h3 className="font-medium">Activity Trends</h3>
              </div>
              <div className="h-48 flex items-end justify-between space-x-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                  <div key={day} className="flex flex-col items-center flex-1">
                    <div className="w-full flex space-x-0.5">
                      <div 
                        className="flex-1 bg-blue-200 rounded-t" 
                        style={{ height: `${Math.random() * 60 + 20}px` }}
                      ></div>
                      <div 
                        className="flex-1 bg-green-200 rounded-t" 
                        style={{ height: `${Math.random() * 80 + 10}px` }}
                      ></div>
                      <div 
                        className="flex-1 bg-purple-200 rounded-t" 
                        style={{ height: `${Math.random() * 70 + 15}px` }}
                      ></div>
                    </div>
                    <span className="text-xs mt-2 text-gray-500">{day}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <Activity size={18} className="text-green-600 mr-2" />
                <h3 className="font-medium">Achievements</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-3">
                    <Droplets size={20} />
                  </div>
                  <div>
                    <p className="font-medium">Water Goal Achieved</p>
                    <p className="text-sm text-gray-600">3 days in a row</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                    <Moon size={20} />
                  </div>
                  <div>
                    <p className="font-medium">Sleep Goal Achieved</p>
                    <p className="text-sm text-gray-600">5 days in a row</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};