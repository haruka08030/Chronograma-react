import { useState } from 'react';
import { CalendarDays, CheckSquare, Settings, TrendingUp, Home } from 'lucide-react';
import TodayScreen from './components/TodayScreen';
import CalendarScreen from './components/CalendarScreen';
import ToDoScreen from './components/ToDoScreen';
import HabitsScreen from './components/HabitsScreen';
import SettingsScreen from './components/SettingsScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState('today');

  const tabs = [
    { id: 'today', label: 'Today', icon: Home },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'todo', label: 'To-Do', icon: CheckSquare },
    { id: 'habits', label: 'Habits', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderScreen = () => {
    switch (activeTab) {
      case 'today':
        return <TodayScreen />;
      case 'calendar':
        return <CalendarScreen />;
      case 'todo':
        return <ToDoScreen />;
      case 'habits':
        return <HabitsScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <TodayScreen />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 max-w-md mx-auto">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {renderScreen()}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200 shadow-lg">
        <div className="flex justify-around items-center px-2 py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                <span className="text-xs mt-1">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
