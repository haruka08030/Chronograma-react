import { Sunrise, BookOpen, Dumbbell, Utensils, Moon, Code, Coffee } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface Habit {
  id: number;
  name: string;
  icon: any;
  time: string;
  color: string;
  completion: boolean[];
}

export default function HabitsScreen() {
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const habits: Habit[] = [
    {
      id: 1,
      name: 'Morning Routine',
      icon: Sunrise,
      time: '6:00 AM',
      color: 'bg-purple-100 text-purple-600',
      completion: [true, true, true, false, true, true, false],
    },
    {
      id: 2,
      name: 'Study Session',
      icon: BookOpen,
      time: '8:00 AM',
      color: 'bg-blue-100 text-blue-600',
      completion: [true, true, false, true, true, false, false],
    },
    {
      id: 3,
      name: 'Workout',
      icon: Dumbbell,
      time: '3:00 PM',
      color: 'bg-rose-100 text-rose-600',
      completion: [true, false, true, true, true, false, false],
    },
    {
      id: 4,
      name: 'Healthy Meal',
      icon: Utensils,
      time: '12:00 PM',
      color: 'bg-emerald-50 text-emerald-600',
      completion: [true, true, true, true, true, true, false],
    },
    {
      id: 5,
      name: 'Project Work',
      icon: Code,
      time: '5:00 PM',
      color: 'bg-amber-100 text-amber-600',
      completion: [true, true, true, false, false, false, false],
    },
    {
      id: 6,
      name: 'Reading',
      icon: Coffee,
      time: '8:00 PM',
      color: 'bg-cyan-100 text-cyan-600',
      completion: [false, true, false, true, true, false, false],
    },
    {
      id: 7,
      name: 'Sleep Schedule',
      icon: Moon,
      time: '10:00 PM',
      color: 'bg-indigo-100 text-indigo-600',
      completion: [true, true, false, true, true, false, false],
    },
  ];

  const calculateStreak = (completion: boolean[]) => {
    let streak = 0;
    for (let i = completion.length - 1; i >= 0; i--) {
      if (completion[i]) streak++;
      else break;
    }
    return streak;
  };

  const calculateCompletion = (completion: boolean[]) => {
    const completed = completion.filter(Boolean).length;
    return Math.round((completed / completion.length) * 100);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-slate-900">Habits</h1>
        <p className="text-slate-600">Build consistency, track progress</p>
      </div>

      {/* Weekly Overview */}
      <Card className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-sm border-blue-200">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-slate-900">This Week</p>
            <Badge className="bg-blue-600 hover:bg-blue-700 rounded-lg">
              76% Complete
            </Badge>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day, index) => {
              const isToday = index === 3; // Thursday is today
              return (
                <div
                  key={day}
                  className={`text-center py-2 rounded-lg ${
                    isToday ? 'bg-blue-600 text-white' : 'bg-white text-slate-600'
                  }`}
                >
                  <p className="text-xs">{day}</p>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Habits List */}
      <div className="space-y-2">
        <h2 className="text-slate-900">Your Habits</h2>
        <div className="space-y-3">
          {habits.map((habit) => {
            const Icon = habit.icon;
            const streak = calculateStreak(habit.completion);
            const completion = calculateCompletion(habit.completion);

            return (
              <Card
                key={habit.id}
                className="p-4 bg-white rounded-xl shadow-sm border-slate-200 transition-all hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl ${habit.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-900">{habit.name}</p>
                      <p className="text-xs text-slate-600 mt-1">{habit.time}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs rounded-md bg-orange-50 text-orange-600 border-orange-200">
                          🔥 {streak} day streak
                        </Badge>
                        <span className="text-xs text-slate-500">{completion}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Weekly Progress */}
                  <div className="grid grid-cols-7 gap-1.5">
                    {habit.completion.map((completed, index) => (
                      <div
                        key={index}
                        className={`aspect-square rounded-lg ${
                          completed
                            ? 'bg-emerald-300'
                            : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Stats Card */}
      <Card className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl shadow-sm border-slate-200">
        <div className="flex items-center justify-around">
          <div className="text-center">
            <p className="text-slate-900">7</p>
            <p className="text-xs text-slate-600">Active Habits</p>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="text-center">
            <p className="text-slate-900">76%</p>
            <p className="text-xs text-slate-600">Weekly Rate</p>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="text-center">
            <p className="text-slate-900">12</p>
            <p className="text-xs text-slate-600">Best Streak</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
