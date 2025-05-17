import React from 'react';
import { useHealth } from '../context/HealthContext';
import { Bell, Moon, Sun, Target, Droplets, Scale, Clock } from 'lucide-react';

export const Settings: React.FC = () => {
  const { waterGoal, setWaterGoal, theme, setTheme } = useHealth();
  const [notifications, setNotifications] = React.useState(true);
  const [sleepGoal, setSleepGoal] = React.useState(8);
  const [weightGoal, setWeightGoal] = React.useState(70);
  const [exerciseGoal, setExerciseGoal] = React.useState(30);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 dark:text-white">Settings</h1>
      
      {/* General Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700 mb-6">
        <h2 className="text-lg font-medium mb-4 dark:text-white">General Settings</h2>
        
        <div className="space-y-4">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {theme === 'light' ? <Sun size={20} className="text-yellow-500 mr-2" /> : <Moon size={20} className="text-blue-500 mr-2" />}
              <span className="dark:text-white">Theme</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setTheme('light')}
                className={`px-3 py-1.5 rounded-lg text-sm ${
                  theme === 'light' 
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-200' 
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                Light
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-3 py-1.5 rounded-lg text-sm ${
                  theme === 'dark' 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-200' 
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                Dark
              </button>
            </div>
          </div>
          
          {/* Notifications Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell size={20} className="text-purple-500 mr-2" />
              <span className="dark:text-white">Notifications</span>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
      
      {/* Health Goals */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-medium mb-4 dark:text-white">Health Goals</h2>
        
        <div className="space-y-6">
          {/* Water Goal */}
          <div>
            <div className="flex items-center mb-2">
              <Droplets size={20} className="text-blue-500 mr-2" />
              <label className="text-sm font-medium dark:text-white">Daily Water Goal (ml)</label>
            </div>
            <input
              type="number"
              value={waterGoal}
              onChange={(e) => setWaterGoal(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              min="500"
              step="100"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Recommended: 2000-3000ml per day</p>
          </div>
          
          {/* Sleep Goal */}
          <div>
            <div className="flex items-center mb-2">
              <Clock size={20} className="text-indigo-500 mr-2" />
              <label className="text-sm font-medium dark:text-white">Sleep Goal (hours)</label>
            </div>
            <input
              type="number"
              value={sleepGoal}
              onChange={(e) => setSleepGoal(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              min="4"
              max="12"
              step="0.5"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Recommended: 7-9 hours per night</p>
          </div>
          
          {/* Weight Goal */}
          <div>
            <div className="flex items-center mb-2">
              <Scale size={20} className="text-green-500 mr-2" />
              <label className="text-sm font-medium dark:text-white">Target Weight (kg)</label>
            </div>
            <input
              type="number"
              value={weightGoal}
              onChange={(e) => setWeightGoal(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              step="0.1"
            />
          </div>
          
          {/* Exercise Goal */}
          <div>
            <div className="flex items-center mb-2">
              <Target size={20} className="text-red-500 mr-2" />
              <label className="text-sm font-medium dark:text-white">Daily Exercise Goal (minutes)</label>
            </div>
            <input
              type="number"
              value={exerciseGoal}
              onChange={(e) => setExerciseGoal(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
              min="0"
              step="5"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Recommended: 30 minutes of moderate activity</p>
          </div>
        </div>
      </div>
    </div>
  );
};