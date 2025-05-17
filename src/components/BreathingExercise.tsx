import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Settings, Clock, RotateCw } from 'lucide-react';

export const BreathingExercise: React.FC = () => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [timer, setTimer] = useState(0);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  
  // Settings
  const [inhaleTime, setInhaleTime] = useState(4);
  const [holdTime, setHoldTime] = useState(4);
  const [exhaleTime, setExhaleTime] = useState(6);
  const [restTime, setRestTime] = useState(2);
  const [targetCycles, setTargetCycles] = useState(7);
  
  const breathingInterval = useRef<number | null>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  
  // Total duration of one cycle
  const cycleDuration = inhaleTime + holdTime + exhaleTime + restTime;
  
  // Breathing techniques
  const techniques = [
    { 
      name: '4-7-8 Technique', 
      description: 'Relaxation breath: inhale for 4, hold for 7, exhale for 8',
      inhale: 4, hold: 7, exhale: 8, rest: 0
    },
    { 
      name: 'Box Breathing', 
      description: 'Equal duration for all phases, ideal for concentration',
      inhale: 4, hold: 4, exhale: 4, rest: 4
    },
    { 
      name: '5-2-5 Technique', 
      description: 'Simple technique good for beginners',
      inhale: 5, hold: 2, exhale: 5, rest: 2
    },
  ];
  
  // Select technique
  const selectTechnique = (technique: typeof techniques[0]) => {
    setInhaleTime(technique.inhale);
    setHoldTime(technique.hold);
    setExhaleTime(technique.exhale);
    setRestTime(technique.rest);
  };
  
  // Handle breathing cycle
  useEffect(() => {
    if (isBreathing) {
      setTimer(0);
      
      breathingInterval.current = window.setInterval(() => {
        setTimer(prevTimer => {
          const newTimer = prevTimer + 0.1;
          
          // Calculate phase times
          if (newTimer < inhaleTime) {
            setCurrentPhase('inhale');
          } else if (newTimer < inhaleTime + holdTime) {
            setCurrentPhase('hold');
          } else if (newTimer < inhaleTime + holdTime + exhaleTime) {
            setCurrentPhase('exhale');
          } else if (newTimer < cycleDuration) {
            setCurrentPhase('rest');
          } else {
            // Cycle completed
            setCompletedCycles(prev => prev + 1);
            return 0; // Reset timer for next cycle
          }
          
          return newTimer;
        });
      }, 100);
      
      // Cleanup interval
      return () => {
        if (breathingInterval.current !== null) {
          clearInterval(breathingInterval.current);
        }
      };
    } else {
      if (breathingInterval.current !== null) {
        clearInterval(breathingInterval.current);
      }
    }
  }, [isBreathing, inhaleTime, holdTime, exhaleTime, restTime, cycleDuration]);
  
  // Check if target cycles reached
  useEffect(() => {
    if (completedCycles >= targetCycles && isBreathing) {
      setIsBreathing(false);
    }
  }, [completedCycles, targetCycles, isBreathing]);
  
  // Animation for the breathing circle
  useEffect(() => {
    if (!circleRef.current) return;
    
    const getScale = () => {
      switch (currentPhase) {
        case 'inhale':
          return 1 + (timer / inhaleTime) * 0.5;
        case 'hold':
          return 1.5;
        case 'exhale':
          return 1.5 - ((timer - inhaleTime - holdTime) / exhaleTime) * 0.5;
        case 'rest':
          return 1;
        default:
          return 1;
      }
    };
    
    const scale = getScale();
    circleRef.current.style.transform = `scale(${scale})`;
  }, [timer, currentPhase, inhaleTime, holdTime, exhaleTime]);
  
  // Get text for current phase
  const getPhaseText = () => {
    switch (currentPhase) {
      case 'inhale': return 'Inhale';
      case 'hold': return 'Hold';
      case 'exhale': return 'Exhale';
      case 'rest': return 'Rest';
    }
  };
  
  // Get phase color
  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'inhale': return 'text-blue-600 border-blue-400';
      case 'hold': return 'text-purple-600 border-purple-400';
      case 'exhale': return 'text-green-600 border-green-400';
      case 'rest': return 'text-gray-500 border-gray-300';
    }
  };
  
  // Format time remaining for current phase
  const getTimeRemaining = () => {
    let phaseEndTime;
    switch (currentPhase) {
      case 'inhale':
        phaseEndTime = inhaleTime;
        break;
      case 'hold':
        phaseEndTime = inhaleTime + holdTime;
        break;
      case 'exhale':
        phaseEndTime = inhaleTime + holdTime + exhaleTime;
        break;
      case 'rest':
        phaseEndTime = cycleDuration;
        break;
      default:
        phaseEndTime = 0;
    }
    
    const remaining = Math.max(0, (phaseEndTime - timer).toFixed(1));
    return remaining;
  };
  
  // Reset exercise
  const resetExercise = () => {
    setIsBreathing(false);
    setCurrentPhase('inhale');
    setTimer(0);
    setCompletedCycles(0);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Breathing Exercise</h1>
      
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">Guided Breathing</h2>
          <button 
            onClick={() => setShowSettings(!showSettings)} 
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Settings size={18} />
          </button>
        </div>
        
        {showSettings ? (
          <div className="mb-6">
            <h3 className="text-md font-medium mb-3">Breathing Techniques</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              {techniques.map((technique, index) => (
                <button
                  key={index}
                  onClick={() => selectTechnique(technique)}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                >
                  <p className="font-medium">{technique.name}</p>
                  <p className="text-xs text-gray-500">{technique.description}</p>
                  <p className="text-xs text-gray-700 mt-1">
                    {technique.inhale}-{technique.hold}-{technique.exhale}
                    {technique.rest > 0 ? `-${technique.rest}` : ''}
                  </p>
                </button>
              ))}
            </div>
            
            <h3 className="text-md font-medium mb-3">Custom Settings</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Inhale (sec)</label>
                <input
                  type="number"
                  value={inhaleTime}
                  onChange={(e) => setInhaleTime(Number(e.target.value))}
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Hold (sec)</label>
                <input
                  type="number"
                  value={holdTime}
                  onChange={(e) => setHoldTime(Number(e.target.value))}
                  min="0"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Exhale (sec)</label>
                <input
                  type="number"
                  value={exhaleTime}
                  onChange={(e) => setExhaleTime(Number(e.target.value))}
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Rest (sec)</label>
                <input
                  type="number"
                  value={restTime}
                  onChange={(e) => setRestTime(Number(e.target.value))}
                  min="0"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs text-gray-500 mb-1">Number of Cycles</label>
              <input
                type="number"
                value={targetCycles}
                onChange={(e) => setTargetCycles(Number(e.target.value))}
                min="1"
                max="20"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mb-6">
            {/* Breathing visualization */}
            <div 
              ref={circleRef}
              className={`w-48 h-48 rounded-full flex items-center justify-center border-8 transition-transform duration-700 ease-in-out ${getPhaseColor()}`}
            >
              <div className="text-center">
                <p className="text-2xl font-medium">{getPhaseText()}</p>
                <p className="text-3xl font-bold">{getTimeRemaining()}</p>
                <p className="text-sm text-gray-500">
                  Cycle {completedCycles + 1}/{targetCycles}
                </p>
              </div>
            </div>
            
            <div className="flex justify-center mt-6 space-x-3">
              <button
                onClick={() => setIsBreathing(!isBreathing)}
                className={`px-5 py-2 rounded-lg flex items-center ${
                  isBreathing 
                    ? 'bg-yellow-50 text-yellow-700'
                    : 'bg-blue-50 text-blue-700'
                }`}
              >
                {isBreathing ? (
                  <>
                    <Pause size={18} className="mr-1" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play size={18} className="mr-1" />
                    Start
                  </>
                )}
              </button>
              
              <button
                onClick={resetExercise}
                className="px-5 py-2 bg-gray-50 text-gray-700 rounded-lg flex items-center"
              >
                <RotateCw size={18} className="mr-1" />
                Reset
              </button>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between bg-blue-50 rounded-lg p-3 text-blue-800">
          <div className="flex items-center">
            <Clock size={18} className="mr-2" />
            <div>
              <p className="font-medium">Session Time</p>
              <p className="text-sm">{(cycleDuration * targetCycles).toFixed(0)} seconds</p>
            </div>
          </div>
          
          <div>
            <p className="font-medium">Pattern</p>
            <p className="text-sm">
              {inhaleTime}-{holdTime}-{exhaleTime}
              {restTime > 0 ? `-${restTime}` : ''}
            </p>
          </div>
        </div>
      </div>
      
      {/* Benefits Section */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h2 className="text-lg font-medium mb-4">Benefits of Breathing Exercises</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium mb-2 text-blue-800">Stress Reduction</h3>
            <p className="text-sm text-blue-700">
              Deep breathing activates the parasympathetic nervous system, reducing stress hormones and promoting a sense of calm.
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-medium mb-2 text-green-800">Improved Focus</h3>
            <p className="text-sm text-green-700">
              Controlled breathing techniques increase oxygen to the brain, enhancing mental clarity and concentration.
            </p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-medium mb-2 text-purple-800">Better Sleep</h3>
            <p className="text-sm text-purple-700">
              Regular breathing exercises can help calm the mind before bed, leading to improved sleep quality.
            </p>
          </div>
          
          <div className="p-4 bg-orange-50 rounded-lg">
            <h3 className="font-medium mb-2 text-orange-800">Lowered Blood Pressure</h3>
            <p className="text-sm text-orange-700">
              Deep breathing can temporarily reduce blood pressure and promote cardiovascular health.
            </p>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          <p>For best results, practice breathing exercises daily in a quiet, comfortable environment.</p>
        </div>
      </div>
    </div>
  );
};