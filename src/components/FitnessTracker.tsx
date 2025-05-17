import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { 
  Dumbbell, Clock, CheckCircle, Play, Pause, RotateCw, 
  Trash2, Edit, Calendar, Filter, Plus, X
} from 'lucide-react';

export const FitnessTracker: React.FC = () => {
  const { exerciseEntries, addExerciseEntry } = useHealth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // Form state
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseType, setExerciseType] = useState<'cardio' | 'strength' | 'flexibility' | 'balance'>('cardio');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  
  // Timer functions
  React.useEffect(() => {
    let interval: number | null = null;
    
    if (timerRunning && activeTimer) {
      interval = window.setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else if (!timerRunning && interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, activeTimer]);
  
  const startTimer = (id: string) => {
    setActiveTimer(id);
    setTimerRunning(true);
    setElapsedTime(0);
  };
  
  const pauseTimer = () => {
    setTimerRunning(false);
  };
  
  const resetTimer = () => {
    setTimerRunning(false);
    setElapsedTime(0);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Get today's date
  const today = new Date().toISOString().split('T')[0];
  
  // Filter exercises based on selected filter
  const filteredExercises = filter 
    ? exerciseEntries.filter(exercise => exercise.type === filter)
    : exerciseEntries;
  
  // Group by date, most recent first
  const groupedExercises = filteredExercises.reduce((groups, exercise) => {
    if (!groups[exercise.date]) {
      groups[exercise.date] = [];
    }
    groups[exercise.date].push(exercise);
    return groups;
  }, {} as Record<string, typeof exerciseEntries>);
  
  // Sort dates in descending order
  const sortedDates = Object.keys(groupedExercises).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );
  
  // Add new exercise
  const handleAddExercise = () => {
    if (!exerciseName || !duration) return;
    
    addExerciseEntry({
      id: Date.now().toString(),
      date: today,
      type: exerciseType,
      name: exerciseName,
      duration: Number(duration),
      calories: calories ? Number(calories) : undefined,
      sets: sets ? Number(sets) : undefined,
      reps: reps ? Number(reps) : undefined,
      completed: false
    });
    
    // Reset form
    setExerciseName('');
    setExerciseType('cardio');
    setDuration('');
    setCalories('');
    setSets('');
    setReps('');
    setShowAddForm(false);
  };
  
  // Toggle exercise completion
  const toggleExerciseCompletion = (id: string) => {
    const updatedEntries = exerciseEntries.map(exercise => {
      if (exercise.id === id) {
        return { ...exercise, completed: !exercise.completed };
      }
      return exercise;
    });
    
    // Update state in the context
    // This could be improved with a proper update function in the context
  };
  
  // Get exercise type icon
  const getExerciseTypeIcon = (type: string) => {
    switch(type) {
      case 'cardio': return <span className="bg-red-100 text-red-700 text-xs py-0.5 px-1.5 rounded">Cardio</span>;
      case 'strength': return <span className="bg-blue-100 text-blue-700 text-xs py-0.5 px-1.5 rounded">Strength</span>;
      case 'flexibility': return <span className="bg-green-100 text-green-700 text-xs py-0.5 px-1.5 rounded">Flexibility</span>;
      case 'balance': return <span className="bg-purple-100 text-purple-700 text-xs py-0.5 px-1.5 rounded">Balance</span>;
      default: return null;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Fitness Tracker</h1>
      
      {/* Quick Stats */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Today's Workout</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-2 bg-green-600 text-white rounded-lg flex items-center"
          >
            <Plus size={18} className="mr-1" />
            Add Exercise
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-sm text-green-700 mb-1">Exercises Today</p>
            <p className="text-2xl font-bold text-green-800">
              {exerciseEntries.filter(e => e.date === today).length}
            </p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-sm text-blue-700 mb-1">Completed</p>
            <p className="text-2xl font-bold text-blue-800">
              {exerciseEntries.filter(e => e.date === today && e.completed).length}
            </p>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-3">
            <p className="text-sm text-orange-700 mb-1">Total Minutes</p>
            <p className="text-2xl font-bold text-orange-800">
              {exerciseEntries
                .filter(e => e.date === today)
                .reduce((sum, e) => sum + e.duration, 0)}
            </p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-3">
            <p className="text-sm text-purple-700 mb-1">Est. Calories</p>
            <p className="text-2xl font-bold text-purple-800">
              {exerciseEntries
                .filter(e => e.date === today && e.calories)
                .reduce((sum, e) => sum + (e.calories || 0), 0)}
            </p>
          </div>
        </div>
        
        {/* Today's exercises */}
        {groupedExercises[today] && groupedExercises[today].length > 0 ? (
          <div className="space-y-3">
            {groupedExercises[today].map(exercise => (
              <div key={exercise.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-3 md:mb-0">
                  <button
                    onClick={() => toggleExerciseCompletion(exercise.id)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      exercise.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {exercise.completed ? <CheckCircle size={18} /> : <Dumbbell size={18} />}
                  </button>
                  <div>
                    <div className="flex items-center">
                      <p className="font-medium mr-2">{exercise.name}</p>
                      {getExerciseTypeIcon(exercise.type)}
                    </div>
                    <div className="flex text-xs text-gray-500 mt-1">
                      <span className="flex items-center mr-3">
                        <Clock size={12} className="mr-1" />
                        {exercise.duration} min
                      </span>
                      {exercise.sets && (
                        <span className="mr-3">{exercise.sets} sets</span>
                      )}
                      {exercise.reps && (
                        <span className="mr-3">{exercise.reps} reps</span>
                      )}
                      {exercise.calories && (
                        <span>{exercise.calories} cal</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {activeTimer === exercise.id ? (
                    <>
                      <span className="text-lg font-mono">{formatTime(elapsedTime)}</span>
                      {timerRunning ? (
                        <button
                          onClick={pauseTimer}
                          className="p-2 bg-yellow-100 text-yellow-700 rounded-full"
                        >
                          <Pause size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => setTimerRunning(true)}
                          className="p-2 bg-green-100 text-green-700 rounded-full"
                        >
                          <Play size={16} />
                        </button>
                      )}
                      <button
                        onClick={resetTimer}
                        className="p-2 bg-gray-100 text-gray-700 rounded-full"
                      >
                        <RotateCw size={16} />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startTimer(exercise.id)}
                      className="p-2 bg-gray-100 text-gray-700 rounded-full"
                    >
                      <Play size={16} />
                    </button>
                  )}
                  
                  <button className="p-2 bg-blue-100 text-blue-700 rounded-full">
                    <Edit size={16} />
                  </button>
                  
                  <button className="p-2 bg-red-100 text-red-700 rounded-full">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <Dumbbell size={40} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-600 mb-2">No exercises for today</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg inline-flex items-center"
            >
              <Plus size={16} className="mr-1" />
              Add Your First Exercise
            </button>
          </div>
        )}
      </div>
      
      {/* Add Exercise Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Add Exercise</h2>
            <button
              onClick={() => setShowAddForm(false)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="exerciseName" className="block text-sm font-medium text-gray-700 mb-1">
                Exercise Name
              </label>
              <input
                type="text"
                id="exerciseName"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g. Running, Push-ups, Yoga"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exercise Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <button
                  onClick={() => setExerciseType('cardio')}
                  className={`p-2 rounded-lg text-center text-sm ${
                    exerciseType === 'cardio' ? 'bg-red-100 text-red-700 font-medium' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Cardio
                </button>
                <button
                  onClick={() => setExerciseType('strength')}
                  className={`p-2 rounded-lg text-center text-sm ${
                    exerciseType === 'strength' ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Strength
                </button>
                <button
                  onClick={() => setExerciseType('flexibility')}
                  className={`p-2 rounded-lg text-center text-sm ${
                    exerciseType === 'flexibility' ? 'bg-green-100 text-green-700 font-medium' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Flexibility
                </button>
                <button
                  onClick={() => setExerciseType('balance')}
                  className={`p-2 rounded-lg text-center text-sm ${
                    exerciseType === 'balance' ? 'bg-purple-100 text-purple-700 font-medium' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Balance
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                min="1"
              />
            </div>
            
            <div>
              <label htmlFor="calories" className="block text-sm font-medium text-gray-700 mb-1">
                Calories (optional)
              </label>
              <input
                type="number"
                id="calories"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                min="0"
              />
            </div>
            
            {exerciseType === 'strength' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="sets" className="block text-sm font-medium text-gray-700 mb-1">
                    Sets
                  </label>
                  <input
                    type="number"
                    id="sets"
                    value={sets}
                    onChange={(e) => setSets(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    min="1"
                  />
                </div>
                <div>
                  <label htmlFor="reps" className="block text-sm font-medium text-gray-700 mb-1">
                    Reps
                  </label>
                  <input
                    type="number"
                    id="reps"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    min="1"
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleAddExercise}
              className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Add Exercise
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
      
      {/* Exercise History */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Exercise History</h2>
          <div className="flex items-center">
            <Filter size={16} className="text-gray-500 mr-2" />
            <div className="flex space-x-1">
              <button
                onClick={() => setFilter(null)}
                className={`px-3 py-1 rounded-lg text-xs ${
                  filter === null ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('cardio')}
                className={`px-3 py-1 rounded-lg text-xs ${
                  filter === 'cardio' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Cardio
              </button>
              <button
                onClick={() => setFilter('strength')}
                className={`px-3 py-1 rounded-lg text-xs ${
                  filter === 'strength' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Strength
              </button>
              <button
                onClick={() => setFilter('flexibility')}
                className={`px-3 py-1 rounded-lg text-xs ${
                  filter === 'flexibility' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Flexibility
              </button>
            </div>
          </div>
        </div>
        
        {sortedDates.length > 0 ? (
          <div className="space-y-6">
            {sortedDates.map(date => (
              <div key={date}>
                <div className="flex items-center mb-2">
                  <Calendar size={16} className="text-gray-500 mr-2" />
                  <h3 className="text-sm font-medium">
                    {new Date(date).toLocaleDateString(undefined, { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                </div>
                
                <div className="space-y-2">
                  {groupedExercises[date].map(exercise => (
                    <div 
                      key={exercise.id} 
                      className={`flex justify-between items-center p-3 rounded-lg ${
                        exercise.completed ? 'bg-green-50' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-2 ${
                          exercise.type === 'cardio' ? 'bg-red-500' :
                          exercise.type === 'strength' ? 'bg-blue-500' :
                          exercise.type === 'flexibility' ? 'bg-green-500' :
                          'bg-purple-500'
                        }`}></span>
                        <span className="font-medium">{exercise.name}</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <span className="mr-3">{exercise.duration} min</span>
                        {exercise.calories && (
                          <span className="mr-3">{exercise.calories} cal</span>
                        )}
                        {exercise.completed ? (
                          <CheckCircle size={16} className="text-green-600" />
                        ) : (
                          <Clock size={16} className="text-gray-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No exercise history yet.</p>
        )}
      </div>
    </div>
  );
};