import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { Plus, Minus, Droplets, Check, Settings, BarChart } from 'lucide-react';

export const WaterTracker: React.FC = () => {
  const { waterEntries, waterGoal, addWaterEntry, setWaterGoal } = useHealth();
  const [amount, setAmount] = useState(250); // ml
  const [showSettings, setShowSettings] = useState(false);
  const [goalInput, setGoalInput] = useState(waterGoal.toString());
  
  // Get today's water entries
  const today = new Date().toISOString().split('T')[0];
  const todaysEntries = waterEntries.filter(entry => entry.date === today);
  const totalWaterToday = todaysEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const waterPercentage = Math.min(Math.round((totalWaterToday / waterGoal) * 100), 100);
  
  // Add water entry
  const addWater = () => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);
    
    addWaterEntry({
      id: Date.now().toString(),
      date: today,
      amount,
      time: timeStr
    });
  };
  
  // Handle goal update
  const updateGoal = () => {
    const newGoal = parseInt(goalInput);
    if (!isNaN(newGoal) && newGoal > 0) {
      setWaterGoal(newGoal);
      setShowSettings(false);
    }
  };
  
  // Preset amounts
  const presets = [100, 250, 350, 500];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Water Tracker</h1>
      
      {/* Today's Progress */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Today's Progress</h2>
          <button 
            onClick={() => setShowSettings(!showSettings)} 
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Settings size={18} />
          </button>
        </div>
        
        {showSettings ? (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Daily Water Goal (ml)
            </label>
            <div className="flex">
              <input
                type="number"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                step="50"
              />
              <button
                onClick={updateGoal}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
              >
                <Check size={18} />
              </button>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Recommended daily intake: 2000ml - 3000ml
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-40 h-40">
              {/* Water wave animation */}
              <div 
                className="absolute bottom-0 left-0 right-0 bg-blue-400 rounded-b-full transition-all duration-1000 ease-in-out"
                style={{ 
                  height: `${waterPercentage}%`,
                  animation: 'waterWave 2s ease-in-out infinite alternate',
                  overflow: 'hidden'
                }}
              >
                <div 
                  className="absolute bottom-0 left-0 right-0 h-6 bg-blue-300 opacity-30"
                  style={{ 
                    transform: 'translateY(30%) rotate(-5deg) scale(1.5)',
                    animation: 'wave 3s ease-in-out infinite alternate'
                  }}
                ></div>
              </div>
              
              {/* Glass container */}
              <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
              
              {/* Percentage text */}
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl font-bold text-blue-800">{waterPercentage}%</span>
                <span className="text-sm text-blue-600">{totalWaterToday}/{waterGoal}ml</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium">Add Water</h3>
          <div className="text-sm text-gray-500">
            {totalWaterToday >= waterGoal ? '🎉 Goal reached!' : `${waterGoal - totalWaterToday}ml left`}
          </div>
        </div>
        
        {/* Amount input */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => setAmount(Math.max(0, amount - 50))}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
          >
            <Minus size={18} />
          </button>
          
          <div className="text-center">
            <span className="text-2xl font-bold text-blue-700">{amount}</span>
            <span className="text-lg ml-1 text-blue-700">ml</span>
          </div>
          
          <button
            onClick={() => setAmount(amount + 50)}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
          >
            <Plus size={18} />
          </button>
        </div>
        
        {/* Quick presets */}
        <div className="flex justify-between mb-5">
          {presets.map(preset => (
            <button
              key={preset}
              onClick={() => setAmount(preset)}
              className={`p-3 rounded-lg flex flex-col items-center transition-colors ${
                amount === preset ? 'bg-blue-100 text-blue-700' : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <Droplets 
                size={18} 
                className={amount === preset ? 'text-blue-500' : 'text-gray-400'} 
              />
              <span className="text-sm mt-1">{preset}ml</span>
            </button>
          ))}
        </div>
        
        <button
          onClick={addWater}
          className="w-full py-3 bg-blue-600 text-white rounded-lg flex items-center justify-center font-medium hover:bg-blue-700"
        >
          <Plus size={18} className="mr-1" />
          Add Water
        </button>
      </div>
      
      {/* Today's Entries */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h2 className="text-lg font-medium mb-4">Today's Entries</h2>
        
        {todaysEntries.length > 0 ? (
          <div className="space-y-3">
            {todaysEntries.map((entry, index) => (
              <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                    <Droplets size={18} />
                  </div>
                  <div>
                    <p className="font-medium">{entry.amount}ml</p>
                    <p className="text-xs text-gray-500">{entry.time}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {index === 0 ? 'Latest' : ''}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No water entries for today yet.</p>
        )}
      </div>
      
      {/* Weekly Stats */}
      <div className="mt-6 bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <div className="flex items-center mb-4">
          <BarChart size={18} className="text-blue-600 mr-2" />
          <h2 className="text-lg font-medium">Weekly Overview</h2>
        </div>
        
        <div className="h-40 flex items-end justify-between space-x-1 md:space-x-3 mb-2">
          {Array.from({ length: 7 }).map((_, index) => {
            const date = new Date();
            date.setDate(date.getDate() - 6 + index);
            const dateStr = date.toISOString().split('T')[0];
            const dayEntries = waterEntries.filter(entry => entry.date === dateStr);
            const total = dayEntries.reduce((sum, entry) => sum + entry.amount, 0);
            const percentage = Math.min(Math.round((total / waterGoal) * 100), 100);
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full relative h-32 flex items-end">
                  <div className="w-full bg-gray-100 rounded-t-lg" style={{ height: '100%' }}></div>
                  <div 
                    className="absolute bottom-0 w-full bg-blue-400 rounded-t-lg transition-all duration-500"
                    style={{ height: `${percentage}%` }}
                  >
                    {percentage >= 100 && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        ✓
                      </div>
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
    </div>
  );
};