import React, { useState, useEffect } from 'react';
import { useHealth } from '../context/HealthContext';
import { Play, Pause, SkipForward, RotateCw, Clock, ArrowRight, Check, Edit } from 'lucide-react';

export const StretchRoutine: React.FC = () => {
  const { stretchRoutines, activeStretchRoutine, setActiveStretchRoutine } = useHealth();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Reset when active routine changes
  useEffect(() => {
    setCurrentExerciseIndex(0);
    setTimer(0);
    setIsRunning(false);
  }, [activeStretchRoutine]);
  
  // Timer logic
  useEffect(() => {
    let interval: number | null = null;
    
    if (isRunning && activeStretchRoutine) {
      const currentExercise = activeStretchRoutine.exercises[currentExerciseIndex];
      const exerciseDuration = currentExercise?.duration || 0;
      
      if (timer < exerciseDuration) {
        interval = window.setInterval(() => {
          setTimer(prevTimer => prevTimer + 1);
        }, 1000);
      } else {
        // Move to next exercise
        if (currentExerciseIndex < activeStretchRoutine.exercises.length - 1) {
          setCurrentExerciseIndex(prevIndex => prevIndex + 1);
          setTimer(0);
        } else {
          // Routine completed
          setIsRunning(false);
        }
      }
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timer, currentExerciseIndex, activeStretchRoutine]);
  
  // Start the routine
  const startRoutine = () => {
    setIsRunning(true);
  };
  
  // Pause the routine
  const pauseRoutine = () => {
    setIsRunning(false);
  };
  
  // Skip to next exercise
  const skipToNext = () => {
    if (activeStretchRoutine && currentExerciseIndex < activeStretchRoutine.exercises.length - 1) {
      setCurrentExerciseIndex(prevIndex => prevIndex + 1);
      setTimer(0);
    }
  };
  
  // Reset the routine
  const resetRoutine = () => {
    setCurrentExerciseIndex(0);
    setTimer(0);
    setIsRunning(false);
  };
  
  // Format time remaining
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress percentage
  const calculateProgress = () => {
    if (!activeStretchRoutine) return 0;
    
    const currentExercise = activeStretchRoutine.exercises[currentExerciseIndex];
    if (!currentExercise) return 0;
    
    return (timer / currentExercise.duration) * 100;
  };
  
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Stretch Routines</h1>
      
      {activeStretchRoutine ? (
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">{activeStretchRoutine.name}</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveStretchRoutine(null)}
                className="p-2 bg-gray-100 text-gray-700 rounded-lg"
              >
                Back to All Routines
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 bg-blue-100 text-blue-700 rounded-lg"
              >
                <Edit size={18} />
              </button>
            </div>
          </div>
          
          {/* Current Exercise */}
          <div className="bg-blue-50 rounded-lg p-5 mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-md font-medium text-blue-800">
                {currentExerciseIndex + 1} of {activeStretchRoutine.exercises.length}: {activeStretchRoutine.exercises[currentExerciseIndex]?.name}
              </h3>
              <div className="text-sm text-blue-600">
                <Clock size={16} className="inline mr-1" />
                {activeStretchRoutine.exercises[currentExerciseIndex]?.duration}s
              </div>
            </div>
            
            <p className="text-sm text-blue-700 mb-3">
              {activeStretchRoutine.exercises[currentExerciseIndex]?.description}
            </p>
            
            {/* Progress bar */}
            <div className="w-full h-2 bg-blue-200 rounded-full mb-4">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-2xl font-mono font-bold text-blue-800">
                {formatTime(activeStretchRoutine.exercises[currentExerciseIndex]?.duration - timer)}
              </div>
              
              <div className="flex space-x-2">
                {isRunning ? (
                  <button
                    onClick={pauseRoutine}
                    className="p-3 bg-yellow-500 text-white rounded-full"
                  >
                    <Pause size={20} />
                  </button>
                ) : (
                  <button
                    onClick={startRoutine}
                    className="p-3 bg-green-500 text-white rounded-full"
                  >
                    <Play size={20} />
                  </button>
                )}
                
                <button
                  onClick={skipToNext}
                  className="p-3 bg-blue-500 text-white rounded-full"
                  disabled={currentExerciseIndex === activeStretchRoutine.exercises.length - 1}
                >
                  <SkipForward size={20} />
                </button>
                
                <button
                  onClick={resetRoutine}
                  className="p-3 bg-gray-500 text-white rounded-full"
                >
                  <RotateCw size={20} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Remaining exercises */}
          <div>
            <h3 className="text-md font-medium mb-3">Upcoming Exercises</h3>
            <div className="space-y-2">
              {activeStretchRoutine.exercises.map((exercise, index) => {
                if (index <= currentExerciseIndex) return null;
                return (
                  <div key={exercise.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-3">
                        {index + 1}
                      </div>
                      <span>{exercise.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">{exercise.duration}s</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 mb-6">
          <h2 className="text-lg font-medium mb-4">Available Routines</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stretchRoutines.map(routine => (
              <div key={routine.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <h3 className="font-medium mb-2">{routine.name}</h3>
                <p className="text-sm text-gray-500 mb-3">
                  {routine.exercises.length} exercises · {routine.exercises.reduce((sum, ex) => sum + ex.duration, 0)} seconds
                </p>
                <div className="flex space-x-2">
                  {routine.exercises.slice(0, 3).map(exercise => (
                    <span key={exercise.id} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {exercise.name}
                    </span>
                  ))}
                  {routine.exercises.length > 3 && (
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      +{routine.exercises.length - 3} more
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setActiveStretchRoutine(routine)}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg w-full flex items-center justify-center"
                >
                  Start Routine
                  <ArrowRight size={16} className="ml-1" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Stretch Benefits */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h2 className="text-lg font-medium mb-4">Benefits of Regular Stretching</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-medium mb-2 text-green-800">Improved Flexibility</h3>
            <p className="text-sm text-green-700">
              Regular stretching helps improve flexibility and range of motion in your joints.
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium mb-2 text-blue-800">Reduced Injury Risk</h3>
            <p className="text-sm text-blue-700">
              Stretching before and after workouts can help reduce the risk of muscle strain and injuries.
            </p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-medium mb-2 text-purple-800">Better Posture</h3>
            <p className="text-sm text-purple-700">
              Regular stretching helps maintain proper alignment and can improve posture over time.
            </p>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
          <h3 className="font-medium mb-2 text-yellow-800">Pro Tips</h3>
          <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
            <li>Hold each stretch for at least 30 seconds for maximum benefit</li>
            <li>Breathe deeply and steadily throughout each stretch</li>
            <li>Never bounce while stretching - hold steady positions</li>
            <li>Stretch at least 3 times per week for noticeable improvements</li>
          </ul>
        </div>
      </div>
    </div>
  );
};