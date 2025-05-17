import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { MoodTracker } from './components/MoodTracker';
import { WaterTracker } from './components/WaterTracker';
import { BreathingExercise } from './components/BreathingExercise';
import { MealTracker } from './components/MealTracker';
import { SleepTracker } from './components/SleepTracker';
import { FitnessTracker } from './components/FitnessTracker';
import { StretchRoutine } from './components/StretchRoutine';
import { MentalHealthJournal } from './components/MentalHealthJournal';
import { WeightTracker } from './components/WeightTracker';
import { Settings } from './components/Settings';
import { HealthProvider } from './context/HealthContext';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'mood':
        return <MoodTracker />;
      case 'water':
        return <WaterTracker />;
      case 'breathing':
        return <BreathingExercise />;
      case 'meals':
        return <MealTracker />;
      case 'sleep':
        return <SleepTracker />;
      case 'fitness':
        return <FitnessTracker />;
      case 'stretch':
        return <StretchRoutine />;
      case 'mental':
        return <MentalHealthJournal />;
      case 'weight':
        return <WeightTracker />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <HealthProvider>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderContent()}
      </Layout>
    </HealthProvider>
  );
}

export default App