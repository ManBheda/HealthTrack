import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { Moon, Clock, CalendarDays, BarChart, Star, Plus } from 'lucide-react';

export const SleepTracker: React.FC = () => {
  const { sleepEntries, addSleepEntry } = useHealth();
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form state
  const [date, setDate] = useState('');
  const [bedTime, setBedTime] = useState('');
  const [wakeTime, setWakeTime] = useState('');
  const [quality, setQuality] = useState<'poor' | 'fair' | 'good' | 'excellent'>('good');
  const [notes, setNotes] = useState('');
  
  // Initialize form with today's date
  useState(() => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  });
  
  // Calculate hours slept between bed and wake time
  const calculateHoursSlept = (bedTime: string, wakeTime: string): number => {
    if (!bedTime || !wakeTime) return 0;
    
    const [bedHours, bedMinutes] = bedTime.split(':').map(Number);
    const [wakeHours, wakeMinutes] = wakeTime.split(':').map(Number);
    
    let hours = wakeHours - bedHours;
    let minutes = wakeMinutes - bedMinutes;
    
    // Handle next day wake-up
    if (hours < 0) hours += 24;
    if (minutes < 0) {
      minutes += 60;
      hours -= 1;
    }
    
    return parseFloat((hours + minutes / 60).toFixed(1));
  };
  
  // Add sleep entry
  const handleAddSleep = () => {
    if (!date || !bedTime || !wakeTime) return;
    
    const hoursSlept = calculateHoursSlept(bedTime, wakeTime);
    
    addSleepEntry({
      id: Date.now().toString(),
      date,
      hoursSlept,
      quality,
      bedTime,
      wakeTime,
      notes,
    });
    
    // Reset form
    setBedTime('');
    setWakeTime('');
    setQuality('good');
    setNotes('');
    setShowAddForm(false);
  };
  
  // Sort sleep entries by date (newest first)
  const sortedEntries = [...sleepEntries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Get sleep quality color
  const getQualityColor = (quality: string) => {
    switch(quality) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'fair': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  // Get sleep quality stars
  const getQualityStars = (quality: string) => {
    switch(quality) {
      case 'excellent': return 5;
      case 'good': return 4;
      case 'fair': return 3;
      case 'poor': return 2;
      default: return 1;
    }
  };
  
  // Calculate average sleep hours for the past week
  const calculateWeeklyAverage = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weekEntries = sleepEntries.filter(entry => 
      new Date(entry.date) >= oneWeekAgo
    );
    
    if (weekEntries.length === 0) return 0;
    
    const totalHours = weekEntries.reduce((sum, entry) => sum + entry.hoursSlept, 0);
    return (totalHours / weekEntries.length).toFixed(1);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Sleep Tracker</h1>
      
      {/* Sleep Summary */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 mb-6">
        <h2 className="text-lg font-medium mb-4">Sleep Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Moon className="text-indigo-600 mr-2" size={18} />
              <h3 className="font-medium text-indigo-800">Latest Sleep</h3>
            </div>
            {sortedEntries.length > 0 ? (
              <div>
                <p className="text-3xl font-bold text-indigo-700">{sortedEntries[0].hoursSlept}h</p>
                <p className="text-sm text-indigo-600">
                  {new Date(sortedEntries[0].date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </p>
              </div>
            ) : (
              <p className="text-indigo-600">No data yet</p>
            )}
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <BarChart className="text-blue-600 mr-2" size={18} />
              <h3 className="font-medium text-blue-800">Weekly Average</h3>
            </div>
            <p className="text-3xl font-bold text-blue-700">{calculateWeeklyAverage()}h</p>
            <p className="text-sm text-blue-600">Past 7 days</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <CalendarDays className="text-purple-600 mr-2" size={18} />
              <h3 className="font-medium text-purple-800">Sleep Consistency</h3>
            </div>
            <p className="text-3xl font-bold text-purple-700">
              {sleepEntries.length > 3 ? '75%' : '0%'}
            </p>
            <p className="text-sm text-purple-600">Consistent bedtime</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center"
        >
          <Plus size={18} className="mr-1" />
          Log Sleep
        </button>
      </div>
      
      {/* Add Sleep Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 mb-6">
          <h2 className="text-lg font-medium mb-4">Log Sleep</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="bedTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Bed Time
                </label>
                <input
                  type="time"
                  id="bedTime"
                  value={bedTime}
                  onChange={(e) => setBedTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="wakeTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Wake Time
                </label>
                <input
                  type="time"
                  id="wakeTime"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sleep Quality
            </label>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => setQuality('poor')}
                className={`p-2 rounded-lg text-center ${
                  quality === 'poor' ? 'bg-red-100 text-red-700 font-medium' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Poor
              </button>
              <button
                onClick={() => setQuality('fair')}
                className={`p-2 rounded-lg text-center ${
                  quality === 'fair' ? 'bg-yellow-100 text-yellow-700 font-medium' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Fair
              </button>
              <button
                onClick={() => setQuality('good')}
                className={`p-2 rounded-lg text-center ${
                  quality === 'good' ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Good
              </button>
              <button
                onClick={() => setQuality('excellent')}
                className={`p-2 rounded-lg text-center ${
                  quality === 'excellent' ? 'bg-green-100 text-green-700 font-medium' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Excellent
              </button>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="How did you feel when waking up? Any dreams?"
            ></textarea>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleAddSleep}
              className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Save Sleep Data
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
      
      {/* Sleep History */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 mb-6">
        <h2 className="text-lg font-medium mb-4">Sleep History</h2>
        
        {sortedEntries.length > 0 ? (
          <div className="space-y-3">
            {sortedEntries.map(entry => (
              <div key={entry.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2 md:mb-0">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mr-3">
                    <Moon size={18} />
                  </div>
                  <div>
                    <p className="font-medium">{new Date(entry.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Clock size={12} className="mr-1" />
                      {entry.bedTime} - {entry.wakeTime}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="text-lg font-bold">{entry.hoursSlept}h</p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i < getQualityStars(entry.quality) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <span className={`inline-block w-3 h-3 rounded-full ${getQualityColor(entry.quality)} mr-2`}></span>
                    <span className="text-sm capitalize">{entry.quality}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No sleep data recorded yet.</p>
        )}
      </div>
      
      {/* Sleep Insights */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h2 className="text-lg font-medium mb-4">Sleep Insights</h2>
        
        <div className="mb-6">
          <h3 className="text-md font-medium mb-2">Weekly Hours</h3>
          <div className="h-40 flex items-end space-x-2">
            {sleepEntries.length > 0 ? (
              Array.from({ length: 7 }).map((_, index) => {
                const date = new Date();
                date.setDate(date.getDate() - 6 + index);
                const dateStr = date.toISOString().split('T')[0];
                
                const dayEntry = sleepEntries.find(entry => entry.date === dateStr);
                const hours = dayEntry ? dayEntry.hoursSlept : 0;
                
                // Scale bar height (assuming max sleep is 10 hours)
                const heightPercentage = (hours / 10) * 100;
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full h-32 bg-gray-100 rounded-t-lg relative">
                      {hours > 0 && (
                        <>
                          <div
                            className="absolute bottom-0 w-full bg-indigo-400 rounded-t-lg"
                            style={{ height: `${heightPercentage}%` }}
                          ></div>
                          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs font-medium">
                            {hours}h
                          </div>
                        </>
                      )}
                    </div>
                    <span className="text-xs mt-2 text-gray-500">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()]}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500">Add sleep data to see your weekly chart</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-medium mb-2 text-green-800">Sleep Recommendations</h3>
            <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
              <li>Aim for 7-9 hours of sleep each night</li>
              <li>Keep a consistent sleep schedule</li>
              <li>Avoid screens 1 hour before bedtime</li>
              <li>Keep your bedroom cool and dark</li>
            </ul>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium mb-2 text-blue-800">Your Sleep Patterns</h3>
            <p className="text-sm text-blue-700 mb-2">
              {sleepEntries.length >= 3
                ? "You're averaging " + calculateWeeklyAverage() + " hours per night"
                : "Add more sleep data to see your patterns"}
            </p>
            {sleepEntries.length >= 3 && (
              <p className="text-sm text-blue-700">
                {Number(calculateWeeklyAverage()) >= 7
                  ? "You're getting enough sleep! Keep it up."
                  : "Try to increase your sleep time for better health."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};