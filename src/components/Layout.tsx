import React, { ReactNode } from 'react';
import { Heart, Droplets, Wind, UtensilsCrossed, Moon, Dumbbell, 
         StretchHorizontal, Brain, Weight, LayoutDashboard, Settings } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'mood', name: 'Mood', icon: <Heart size={20} /> },
    { id: 'water', name: 'Water', icon: <Droplets size={20} /> },
    { id: 'breathing', name: 'Breathing', icon: <Wind size={20} /> },
    { id: 'meals', name: 'Meals', icon: <UtensilsCrossed size={20} /> },
    { id: 'sleep', name: 'Sleep', icon: <Moon size={20} /> },
    { id: 'fitness', name: 'Fitness', icon: <Dumbbell size={20} /> },
    { id: 'stretch', name: 'Stretch', icon: <StretchHorizontal size={20} /> },
    { id: 'mental', name: 'Journal', icon: <Brain size={20} /> },
    { id: 'weight', name: 'Weight', icon: <Weight size={20} /> },
  ];

  const getFormattedDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-blue-600">HealthTrack</h1>
          <p className="text-sm text-gray-500">{getFormattedDate()}</p>
        </div>
        <nav className="flex-grow overflow-y-auto">
          <ul className="py-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center w-full px-6 py-3 text-left transition-colors duration-200 ${
                    activeTab === item.id
                      ? 'text-blue-600 bg-blue-50 border-r-4 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex items-center text-gray-600 hover:text-gray-900 w-full ${
              activeTab === 'settings' ? 'text-blue-600' : ''
            }`}
          >
            <Settings size={18} className="mr-2" />
            <span>Settings</span>
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex md:hidden z-10">
        <nav className="flex justify-around w-full">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`p-3 flex flex-col items-center ${
                activeTab === item.id ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.name}</span>
            </button>
          ))}
          <button
            onClick={() => setActiveTab('settings')}
            className={`p-3 flex flex-col items-center ${
              activeTab === 'settings' ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <Settings size={20} />
            <span className="text-xs mt-1">Settings</span>
          </button>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto pb-16 md:pb-0">
        <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between md:hidden">
          <h1 className="text-xl font-semibold text-blue-600">HealthTrack</h1>
          <span className="text-sm text-gray-500">{getFormattedDate()}</span>
        </header>
        <main className="p-4 md:p-6 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};