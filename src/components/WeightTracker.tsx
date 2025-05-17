import React, { useState, useEffect } from 'react';
import { useHealth } from '../context/HealthContext';
import { Weight, Calendar, Plus, BarChart, TrendingDown, TrendingUp, Target } from 'lucide-react';

export const WeightTracker: React.FC = () => {
  const { weightEntries, addWeightEntry } = useHealth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('week');
  
  // Form state
  const [weightValue, setWeightValue] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  
  // Set today's date on load
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);
  
  // Submit new weight entry
  const submitWeightEntry = () => {
    if (!weightValue || !date) return;
    
    addWeightEntry({
      id: Date.now().toString(),
      date,
      weight: parseFloat(weightValue),
      notes: notes.trim() || undefined
    });
    
    // Reset form
    setWeightValue('');
    setNotes('');
    setShowAddForm(false);
  };
  
  // Sort entries by date (newest first)
  const sortedEntries = [...weightEntries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Get entries for selected timeframe
  const getTimeframeEntries = () => {
    const today = new Date();
    let cutoffDate: Date;
    
    switch (timeframe) {
      case 'week':
        cutoffDate = new Date(today);
        cutoffDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        cutoffDate = new Date(today);
        cutoffDate.setMonth(today.getMonth() - 1);
        break;
      case 'year':
        cutoffDate = new Date(today);
        cutoffDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        cutoffDate = new Date(today);
        cutoffDate.setDate(today.getDate() - 7);
    }
    
    return sortedEntries.filter(entry => new Date(entry.date) >= cutoffDate);
  };
  
  const timeframeEntries = getTimeframeEntries();
  
  // Calculate weight change
  const calculateWeightChange = () => {
    if (timeframeEntries.length < 2) return { value: 0, isGain: false };
    
    const first = timeframeEntries[timeframeEntries.length - 1].weight;
    const latest = timeframeEntries[0].weight;
    const diff = latest - first;
    
    return {
      value: Math.abs(diff).toFixed(1),
      isGain: diff >= 0
    };
  };
  
  const weightChange = calculateWeightChange();
  
  // Calculate weight stats
  const calculateWeightStats = () => {
    if (timeframeEntries.length === 0) {
      return { min: 0, max: 0, avg: 0 };
    }
    
    const weights = timeframeEntries.map(entry => entry.weight);
    
    return {
      min: Math.min(...weights).toFixed(1),
      max: Math.max(...weights).toFixed(1),
      avg: (weights.reduce((sum, weight) => sum + weight, 0) / weights.length).toFixed(1)
    };
  };
  
  const weightStats = calculateWeightStats();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Weight Tracker</h1>
      
      {/* Weight Summary */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">Weight Summary</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-2 bg-cyan-600 text-white rounded-lg flex items-center"
          >
            <Plus size={18} className="mr-1" />
            Log Weight
          </button>
        </div>
        
        {sortedEntries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center justify-center p-4 bg-cyan-50 rounded-lg">
              <p className="text-sm text-cyan-700 mb-1">Current Weight</p>
              <p className="text-4xl font-bold text-cyan-800">{sortedEntries[0].weight}</p>
              <p className="text-xs text-cyan-600">
                Last updated: {new Date(sortedEntries[0].date).toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex flex-col items-center justify-center p-4 bg-indigo-50 rounded-lg">
              <p className="text-sm text-indigo-700 mb-1">Weight Change</p>
              <div className="flex items-center">
                {weightChange.value !== '0.0' ? (
                  <>
                    {weightChange.isGain ? (
                      <TrendingUp className="text-red-500 mr-2" size={24} />
                    ) : (
                      <TrendingDown className="text-green-500 mr-2" size={24} />
                    )}
                    <p className={`text-3xl font-bold ${weightChange.isGain ? 'text-red-600' : 'text-green-600'}`}>
                      {weightChange.value} kg
                    </p>
                  </>
                ) : (
                  <p className="text-3xl font-bold text-gray-600">0.0 kg</p>
                )}
              </div>
              <p className="text-xs text-indigo-600">
                In the past {timeframe === 'week' ? '7 days' : timeframe === 'month' ? '30 days' : 'year'}
              </p>
            </div>
            
            <div className="flex flex-col items-center justify-center p-4 bg-violet-50 rounded-lg">
              <p className="text-sm text-violet-700 mb-1">Goal Distance</p>
              <div className="flex items-center">
                <Target className="text-violet-500 mr-2" size={24} />
                <p className="text-3xl font-bold text-violet-800">2.5 kg</p>
              </div>
              <p className="text-xs text-violet-600">To target goal of 67.0 kg</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <Weight size={40} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-600 mb-2">No weight entries recorded yet</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg inline-flex items-center"
            >
              <Plus size={16} className="mr-1" />
              Log Your First Weight
            </button>
          </div>
        )}
      </div>
      
      {/* Add Weight Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 mb-6">
          <h2 className="text-lg font-medium mb-4">Log Weight</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                id="weight"
                step="0.1"
                value={weightValue}
                onChange={(e) => setWeightValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="e.g. 70.5"
              />
            </div>
            
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optional)
            </label>
            <textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="Any observations or notes about your weight today"
            ></textarea>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={submitWeightEntry}
              className="flex-1 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
            >
              Save Weight
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {/* Weight Trends */}
      {sortedEntries.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <BarChart size={20} className="text-cyan-600 mr-2" />
              <h2 className="text-lg font-medium">Weight Trends</h2>
            </div>
            
            <div className="flex space-x-1">
              <button
                onClick={() => setTimeframe('week')}
                className={`px-3 py-1.5 text-sm rounded-lg ${
                  timeframe === 'week' 
                    ? 'bg-cyan-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setTimeframe('month')}
                className={`px-3 py-1.5 text-sm rounded-lg ${
                  timeframe === 'month' 
                    ? 'bg-cyan-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setTimeframe('year')}
                className={`px-3 py-1.5 text-sm rounded-lg ${
                  timeframe === 'year' 
                    ? 'bg-cyan-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Year
              </button>
            </div>
          </div>
          
          {/* Weight chart */}
          <div className="h-64 mb-6">
            {timeframeEntries.length > 1 ? (
              <div className="relative h-full">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 w-10">
                  <span>{Math.ceil(parseFloat(weightStats.max) + 0.5)} kg</span>
                  <span>{weightStats.avg} kg</span>
                  <span>{Math.floor(parseFloat(weightStats.min) - 0.5)} kg</span>
                </div>
                
                {/* Chart drawing area */}
                <div className="absolute left-10 right-0 top-0 bottom-0 border-l border-b border-gray-200">
                  {/* Data points and line */}
                  <svg width="100%" height="100%" className="overflow-visible">
                    {/* Define gradient for the line */}
                    <defs>
                      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(6, 182, 212, 0.5)" />
                        <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
                      </linearGradient>
                    </defs>
                    
                    {/* Create the area under the chart */}
                    <path
                      d={`
                        M0,${timeframeEntries.length - 1 > 0 ? "100%" : "0%"}
                        ${timeframeEntries.map((entry, index, arr) => {
                          const x = (index / (arr.length - 1)) * 100;
                          const min = parseFloat(weightStats.min) - 0.5;
                          const max = parseFloat(weightStats.max) + 0.5;
                          const range = max - min;
                          const normalizedValue = ((entry.weight - min) / range) * 100;
                          const y = 100 - normalizedValue;
                          
                          return `L${x}%,${y}%`;
                        }).join(" ")}
                        L100%,100%
                        Z
                      `}
                      fill="url(#lineGradient)"
                      opacity="0.5"
                    />
                    
                    {/* Create the line */}
                    <path
                      d={`
                        M0,${timeframeEntries.length - 1 > 0 ? "100%" : "0%"}
                        ${timeframeEntries.map((entry, index, arr) => {
                          const x = (index / (arr.length - 1)) * 100;
                          const min = parseFloat(weightStats.min) - 0.5;
                          const max = parseFloat(weightStats.max) + 0.5;
                          const range = max - min;
                          const normalizedValue = ((entry.weight - min) / range) * 100;
                          const y = 100 - normalizedValue;
                          
                          return `L${x}%,${y}%`;
                        }).join(" ")}
                      `}
                      stroke="#06b6d4"
                      strokeWidth="2"
                      fill="none"
                      style={{ transition: "all 0.5s ease" }}
                    />
                    
                    {/* Data points */}
                    {timeframeEntries.map((entry, index, arr) => {
                      const x = (index / (arr.length - 1)) * 100;
                      const min = parseFloat(weightStats.min) - 0.5;
                      const max = parseFloat(weightStats.max) + 0.5;
                      const range = max - min;
                      const normalizedValue = ((entry.weight - min) / range) * 100;
                      const y = 100 - normalizedValue;
                      
                      return (
                        <circle
                          key={entry.id}
                          cx={`${x}%`}
                          cy={`${y}%`}
                          r="4"
                          fill="white"
                          stroke="#06b6d4"
                          strokeWidth="2"
                          className="transition-all duration-500"
                        />
                      );
                    })}
                  </svg>
                  
                  {/* X-axis labels */}
                  <div className="absolute left-0 right-0 bottom-0 translate-y-6 flex justify-between text-xs text-gray-500">
                    {timeframeEntries.map((entry, index, arr) => {
                      // Only show first, last, and some in between for clarity
                      if (index === 0 || index === arr.length - 1 || (arr.length > 6 && index % Math.floor(arr.length / 5) === 0)) {
                        return (
                          <span key={entry.id} className="text-center" style={{ width: '60px', marginLeft: '-30px' }}>
                            {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Not enough data to display a chart
              </div>
            )}
          </div>
          
          {/* Weight stats */}
          <div className="grid grid-cols-3 gap-4 mb-2">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-500 mb-1">Min</p>
              <p className="text-lg font-bold text-gray-900">{weightStats.min} kg</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-500 mb-1">Average</p>
              <p className="text-lg font-bold text-gray-900">{weightStats.avg} kg</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-500 mb-1">Max</p>
              <p className="text-lg font-bold text-gray-900">{weightStats.max} kg</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Weight History */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h2 className="text-lg font-medium mb-4">Weight History</h2>
        
        {sortedEntries.length > 0 ? (
          <div className="space-y-3">
            {sortedEntries.map((entry, index) => {
              const prevEntry = sortedEntries[index + 1];
              const weightDiff = prevEntry ? (entry.weight - prevEntry.weight).toFixed(1) : '0.0';
              const isGain = parseFloat(weightDiff) > 0;
              
              return (
                <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 mr-3">
                      <Weight size={18} />
                    </div>
                    <div>
                      <p className="font-medium">{entry.weight} kg</p>
                      <p className="text-xs text-gray-500">
                        {new Date(entry.date).toLocaleDateString(undefined, { 
                          weekday: 'short', 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  
                  {parseFloat(weightDiff) !== 0 && (
                    <div className={`flex items-center ${isGain ? 'text-red-500' : 'text-green-500'}`}>
                      {isGain ? (
                        <TrendingUp size={16} className="mr-1" />
                      ) : (
                        <TrendingDown size={16} className="mr-1" />
                      )}
                      <span>{Math.abs(parseFloat(weightDiff))} kg</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500">No weight entries recorded yet.</p>
        )}
      </div>
    </div>
  );
};