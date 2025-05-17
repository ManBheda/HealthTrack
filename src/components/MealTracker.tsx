import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { Plus, X, UtensilsCrossed, Clock, BarChart } from 'lucide-react';

export const MealTracker: React.FC = () => {
  const { mealEntries, addMealEntry } = useHealth();
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New meal form state
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [description, setDescription] = useState('');
  const [calories, setCalories] = useState('');
  const [mealTime, setMealTime] = useState('');
  
  // Get today's date
  const today = new Date().toISOString().split('T')[0];
  
  // Filter today's meals
  const todaysMeals = mealEntries.filter(meal => meal.date === today);
  const totalCaloriesToday = todaysMeals.reduce((sum, meal) => sum + meal.calories, 0);
  
  // Group meals by type
  const mealsByType = {
    breakfast: todaysMeals.filter(meal => meal.mealType === 'breakfast'),
    lunch: todaysMeals.filter(meal => meal.mealType === 'lunch'),
    dinner: todaysMeals.filter(meal => meal.mealType === 'dinner'),
    snack: todaysMeals.filter(meal => meal.mealType === 'snack'),
  };
  
  // Setup current time for meal input
  const setupAddMeal = (type: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    
    setMealType(type);
    setMealTime(`${hours}:${minutes}`);
    setShowAddModal(true);
  };
  
  // Add new meal
  const addMeal = () => {
    if (description.trim() === '' || !calories || !mealTime) return;
    
    addMealEntry({
      id: Date.now().toString(),
      date: today,
      mealType,
      description,
      calories: Number(calories),
      time: mealTime
    });
    
    // Reset form
    setDescription('');
    setCalories('');
    setMealTime('');
    setShowAddModal(false);
  };
  
  // Calculate daily calorie breakdown
  const calculateCaloriePercentage = (mealType: string) => {
    const mealCalories = mealsByType[mealType as keyof typeof mealsByType].reduce(
      (sum, meal) => sum + meal.calories, 0
    );
    return totalCaloriesToday > 0 ? Math.round((mealCalories / totalCaloriesToday) * 100) : 0;
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Meal Tracker</h1>
      
      {/* Daily Summary */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 mb-6">
        <h2 className="text-lg font-medium mb-4">Daily Summary</h2>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <p className="text-3xl font-bold text-gray-900">{totalCaloriesToday}</p>
            <p className="text-sm text-gray-500">Total calories today</p>
          </div>
          
          <div className="flex items-center mt-2 md:mt-0">
            <div className="h-24 w-24 relative">
              <svg viewBox="0 0 36 36" className="w-full h-full">
                {/* Breakfast */}
                {calculateCaloriePercentage('breakfast') > 0 && (
                  <path
                    d={`M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831`}
                    fill="none"
                    stroke="#FCD34D"
                    strokeWidth="4"
                    strokeDasharray={`${calculateCaloriePercentage('breakfast')}, 100`}
                    strokeDashoffset="0"
                  />
                )}
                
                {/* Lunch */}
                {calculateCaloriePercentage('lunch') > 0 && (
                  <path
                    d={`M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831`}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="4"
                    strokeDasharray={`${calculateCaloriePercentage('lunch')}, 100`}
                    strokeDashoffset={`${-calculateCaloriePercentage('breakfast')}`}
                  />
                )}
                
                {/* Dinner */}
                {calculateCaloriePercentage('dinner') > 0 && (
                  <path
                    d={`M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831`}
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="4"
                    strokeDasharray={`${calculateCaloriePercentage('dinner')}, 100`}
                    strokeDashoffset={`${-(calculateCaloriePercentage('breakfast') + calculateCaloriePercentage('lunch'))}`}
                  />
                )}
                
                {/* Snack */}
                {calculateCaloriePercentage('snack') > 0 && (
                  <path
                    d={`M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831`}
                    fill="none"
                    stroke="#A855F7"
                    strokeWidth="4"
                    strokeDasharray={`${calculateCaloriePercentage('snack')}, 100`}
                    strokeDashoffset={`${-(calculateCaloriePercentage('breakfast') + calculateCaloriePercentage('lunch') + calculateCaloriePercentage('dinner'))}`}
                  />
                )}
              </svg>
            </div>
            
            <div className="ml-3">
              <div className="flex items-center mb-1">
                <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
                <span className="text-sm">Breakfast ({calculateCaloriePercentage('breakfast')}%)</span>
              </div>
              <div className="flex items-center mb-1">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                <span className="text-sm">Lunch ({calculateCaloriePercentage('lunch')}%)</span>
              </div>
              <div className="flex items-center mb-1">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                <span className="text-sm">Dinner ({calculateCaloriePercentage('dinner')}%)</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                <span className="text-sm">Snacks ({calculateCaloriePercentage('snack')}%)</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick add buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => setupAddMeal('breakfast')}
            className="p-3 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-lg flex flex-col items-center justify-center transition-colors"
          >
            <UtensilsCrossed size={20} className="mb-1" />
            <span>Add Breakfast</span>
          </button>
          <button
            onClick={() => setupAddMeal('lunch')}
            className="p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg flex flex-col items-center justify-center transition-colors"
          >
            <UtensilsCrossed size={20} className="mb-1" />
            <span>Add Lunch</span>
          </button>
          <button
            onClick={() => setupAddMeal('dinner')}
            className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg flex flex-col items-center justify-center transition-colors"
          >
            <UtensilsCrossed size={20} className="mb-1" />
            <span>Add Dinner</span>
          </button>
          <button
            onClick={() => setupAddMeal('snack')}
            className="p-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg flex flex-col items-center justify-center transition-colors"
          >
            <UtensilsCrossed size={20} className="mb-1" />
            <span>Add Snack</span>
          </button>
        </div>
      </div>
      
      {/* Today's Meals */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h2 className="text-lg font-medium mb-4">Today's Meals</h2>
        
        {todaysMeals.length > 0 ? (
          <div className="space-y-4">
            {/* Breakfast */}
            {mealsByType.breakfast.length > 0 && (
              <div>
                <h3 className="flex items-center text-sm font-medium text-yellow-700 mb-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                  Breakfast
                </h3>
                <div className="space-y-2">
                  {mealsByType.breakfast.map(meal => (
                    <div key={meal.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="mr-3">
                          <p className="font-medium">{meal.description}</p>
                          <p className="text-xs text-gray-500 flex items-center">
                            <Clock size={12} className="mr-1" />
                            {meal.time}
                          </p>
                        </div>
                      </div>
                      <span className="font-medium">{meal.calories} cal</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Lunch */}
            {mealsByType.lunch.length > 0 && (
              <div>
                <h3 className="flex items-center text-sm font-medium text-green-700 mb-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Lunch
                </h3>
                <div className="space-y-2">
                  {mealsByType.lunch.map(meal => (
                    <div key={meal.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="mr-3">
                          <p className="font-medium">{meal.description}</p>
                          <p className="text-xs text-gray-500 flex items-center">
                            <Clock size={12} className="mr-1" />
                            {meal.time}
                          </p>
                        </div>
                      </div>
                      <span className="font-medium">{meal.calories} cal</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Dinner */}
            {mealsByType.dinner.length > 0 && (
              <div>
                <h3 className="flex items-center text-sm font-medium text-blue-700 mb-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Dinner
                </h3>
                <div className="space-y-2">
                  {mealsByType.dinner.map(meal => (
                    <div key={meal.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="mr-3">
                          <p className="font-medium">{meal.description}</p>
                          <p className="text-xs text-gray-500 flex items-center">
                            <Clock size={12} className="mr-1" />
                            {meal.time}
                          </p>
                        </div>
                      </div>
                      <span className="font-medium">{meal.calories} cal</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Snacks */}
            {mealsByType.snack.length > 0 && (
              <div>
                <h3 className="flex items-center text-sm font-medium text-purple-700 mb-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Snacks
                </h3>
                <div className="space-y-2">
                  {mealsByType.snack.map(meal => (
                    <div key={meal.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="mr-3">
                          <p className="font-medium">{meal.description}</p>
                          <p className="text-xs text-gray-500 flex items-center">
                            <Clock size={12} className="mr-1" />
                            {meal.time}
                          </p>
                        </div>
                      </div>
                      <span className="font-medium">{meal.calories} cal</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500 mb-3">No meals recorded today</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              <Plus size={18} className="inline mr-1" />
              Add your first meal
            </button>
          </div>
        )}
        
        {/* Weekly nutrition chart */}
        {todaysMeals.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center mb-3">
              <BarChart size={18} className="text-blue-600 mr-2" />
              <h3 className="text-md font-medium">Weekly Calorie Intake</h3>
            </div>
            
            <div className="h-40 flex items-end justify-between space-x-2">
              {Array.from({ length: 7 }).map((_, index) => {
                const date = new Date();
                date.setDate(date.getDate() - 6 + index);
                const dateStr = date.toISOString().split('T')[0];
                const dayEntries = mealEntries.filter(entry => entry.date === dateStr);
                const dayTotal = dayEntries.reduce((sum, entry) => sum + entry.calories, 0);
                
                // Define a maximum expected calorie value for scaling
                const maxExpectedCalories = 2500;
                const heightPercentage = Math.min((dayTotal / maxExpectedCalories) * 100, 100);
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full h-32 bg-gray-100 rounded-t-lg relative">
                      <div
                        className="absolute bottom-0 w-full bg-blue-400 rounded-t-lg"
                        style={{ height: `${heightPercentage}%` }}
                      >
                        {dayTotal > 0 && (
                          <span className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs font-medium">
                            {dayTotal}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs mt-2 text-gray-500">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      {/* Add Meal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Add Meal</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meal Type
              </label>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => setMealType('breakfast')}
                  className={`p-2 rounded-lg text-center text-sm ${
                    mealType === 'breakfast' 
                      ? 'bg-yellow-100 text-yellow-700 font-medium' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Breakfast
                </button>
                <button
                  onClick={() => setMealType('lunch')}
                  className={`p-2 rounded-lg text-center text-sm ${
                    mealType === 'lunch' 
                      ? 'bg-green-100 text-green-700 font-medium' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Lunch
                </button>
                <button
                  onClick={() => setMealType('dinner')}
                  className={`p-2 rounded-lg text-center text-sm ${
                    mealType === 'dinner' 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Dinner
                </button>
                <button
                  onClick={() => setMealType('snack')}
                  className={`p-2 rounded-lg text-center text-sm ${
                    mealType === 'snack' 
                      ? 'bg-purple-100 text-purple-700 font-medium' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Snack
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. Grilled chicken salad"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="calories" className="block text-sm font-medium text-gray-700 mb-1">
                Calories
              </label>
              <input
                type="number"
                id="calories"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. 450"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                type="time"
                id="time"
                value={mealTime}
                onChange={(e) => setMealTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <button
              onClick={addMeal}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Meal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};