import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';

export const MoodTracker: React.FC = () => {
  const { moodEntries, addMoodEntry } = useHealth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const moods = [
    { value: 'happy', emoji: '😊', label: 'Happy', color: 'bg-yellow-400' },
    { value: 'sad', emoji: '😢', label: 'Sad', color: 'bg-blue-400' },
    { value: 'neutral', emoji: '😐', label: 'Neutral', color: 'bg-gray-400' },
    { value: 'excited', emoji: '😃', label: 'Excited', color: 'bg-orange-400' },
    { value: 'tired', emoji: '😴', label: 'Tired', color: 'bg-gray-400' },
    { value: 'stressed', emoji: '😰', label: 'Stressed', color: 'bg-red-400' },
    { value: 'calm', emoji: '😌', label: 'Calm', color: 'bg-green-400' },
    { value: 'energetic', emoji: '⚡', label: 'Energetic', color: 'bg-purple-400' },
  ];

  // Calendar navigation
  const goToPreviousMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };

  // Calendar calculations
  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();
  
  // Format date as YYYY-MM-DD
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Check if a date has a mood entry
  const getMoodForDate = (date: string) => {
    const entry = moodEntries.find(entry => entry.date === date);
    return entry ? entry.mood : null;
  };

  // Get mood color
  const getMoodColor = (mood: string | null) => {
    if (!mood) return 'bg-gray-100';
    const moodObj = moods.find(m => m.value === mood);
    return moodObj ? moodObj.color : 'bg-gray-100';
  };

  // Save mood
  const saveMood = () => {
    if (selectedMood) {
      const dateStr = formatDate(selectedDate);
      addMoodEntry({
        id: Date.now().toString(),
        date: dateStr,
        mood: selectedMood as any,
        note: note
      });
      
      // Reset form
      setNote('');
      // Don't reset selectedMood to allow for quick consecutive entries
    }
  };

  // Generate calendar days
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-10 md:h-12"></div>);
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
    const dateStr = formatDate(date);
    const mood = getMoodForDate(dateStr);
    const isToday = dateStr === formatDate(new Date());
    
    calendarDays.push(
      <div 
        key={day} 
        className={`h-10 md:h-12 flex items-center justify-center relative cursor-pointer transition-transform hover:scale-105 ${
          isToday ? 'font-bold' : ''
        }`}
        onClick={() => setSelectedDate(date)}
      >
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${getMoodColor(mood)}`}>
          {day}
        </div>
        {isToday && (
          <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-blue-600"></div>
        )}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Mood Tracker</h1>
      
      {/* Calendar */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">
            {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex space-x-2">
            <button 
              onClick={goToPreviousMonth}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={goToNextMonth}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-xs text-center font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {calendarDays}
        </div>
        
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {moods.map(mood => (
            <div key={mood.value} className="flex items-center">
              <div className={`w-6 h-6 rounded-full ${mood.color} flex items-center justify-center mr-1`}>
                {mood.emoji}
              </div>
              <span className="text-xs">{mood.label}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Mood Input */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h2 className="text-lg font-medium mb-4">
          How are you feeling on {selectedDate.toLocaleDateString()}?
        </h2>
        
        <div className="grid grid-cols-4 gap-3 mb-6">
          {moods.map(mood => (
            <button
              key={mood.value}
              className={`p-3 flex flex-col items-center justify-center rounded-lg border transition-all ${
                selectedMood === mood.value 
                  ? `${mood.color} border-gray-300` 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedMood(mood.value)}
            >
              <span className="text-2xl mb-1">{mood.emoji}</span>
              <span className="text-sm">{mood.label}</span>
            </button>
          ))}
        </div>
        
        <div className="mb-4">
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
            Add a note (optional)
          </label>
          <textarea
            id="note"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="What made you feel this way?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          ></textarea>
        </div>
        
        <button
          className={`px-4 py-2 rounded-lg flex items-center justify-center font-medium ${
            selectedMood
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
          onClick={saveMood}
          disabled={!selectedMood}
        >
          <Check size={18} className="mr-1" />
          Save Mood
        </button>
      </div>
      
      {/* Mood History */}
      <div className="mt-6 bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h2 className="text-lg font-medium mb-4">Recent Mood History</h2>
        {moodEntries.length > 0 ? (
          <div className="space-y-3">
            {moodEntries.slice(0, 5).map(entry => {
              const moodInfo = moods.find(m => m.value === entry.mood);
              return (
                <div key={entry.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${getMoodColor(entry.mood)}`}>
                    {moodInfo?.emoji}
                  </div>
                  <div>
                    <div className="flex items-center">
                      <p className="font-medium capitalize">{entry.mood}</p>
                      <p className="text-xs text-gray-500 ml-2">
                        {new Date(entry.date).toLocaleDateString()}
                      </p>
                    </div>
                    {entry.note && <p className="text-sm text-gray-600">{entry.note}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500">No mood entries recorded yet.</p>
        )}
      </div>
    </div>
  );
};