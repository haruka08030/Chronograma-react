import { useState } from 'react';
import { ChevronLeft, ChevronRight, Download, Calendar, Clock } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface ScheduleItem {
  time: string;
  title: string;
  duration: string;
  type: string;
  color: string;
  delayed?: boolean;
  completed?: boolean;
  current?: boolean;
  unplanned?: boolean;
}

export default function CalendarScreen() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 10)); // November 2025
  const [selectedDay, setSelectedDay] = useState(2);

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Mock activity data
  const activityDays = [2, 5, 8, 9, 12, 15, 16, 19, 22, 23, 26, 29];
  const today = 2;

  // スケジュールデータ（選択された日付に基づいて表示）
  const plannedSchedule: ScheduleItem[] = [
    { time: '6:00', title: 'Morning Routine', duration: '1h', type: 'habit', color: 'bg-purple-50 border-purple-200' },
    { time: '7:00', title: 'Breakfast', duration: '30m', type: 'meal', color: 'bg-emerald-50 border-emerald-200' },
    { time: '8:00', title: 'Math Class', duration: '2h', type: 'class', color: 'bg-sky-50 border-sky-200' },
    { time: '10:00', title: 'Break', duration: '15m', type: 'break', color: 'bg-slate-50 border-slate-200' },
    { time: '10:15', title: 'Science Class', duration: '1h 45m', type: 'class', color: 'bg-sky-50 border-sky-200' },
    { time: '12:00', title: 'Lunch', duration: '1h', type: 'meal', color: 'bg-emerald-50 border-emerald-200' },
    { time: '13:00', title: 'Study Session', duration: '2h', type: 'study', color: 'bg-indigo-50 border-indigo-200' },
    { time: '15:00', title: 'Gym Workout', duration: '1h', type: 'exercise', color: 'bg-rose-50 border-rose-200' },
  ];

  const actualSchedule: ScheduleItem[] = [
    { time: '6:30', title: 'Morning Routine', duration: '45m', type: 'habit', color: 'bg-purple-50 border-purple-200', delayed: true },
    { time: '7:15', title: 'Breakfast', duration: '25m', type: 'meal', color: 'bg-emerald-50 border-emerald-200', completed: true },
    { time: '8:00', title: 'Math Class', duration: '2h', type: 'class', color: 'bg-sky-50 border-sky-200', completed: true },
    { time: '10:00', title: 'Break', duration: '20m', type: 'break', color: 'bg-slate-50 border-slate-200', completed: true },
    { time: '10:20', title: 'Science Class', duration: '1h 40m', type: 'class', color: 'bg-sky-50 border-sky-200', completed: true },
    { time: '12:00', title: 'Lunch', duration: '1h 15m', type: 'meal', color: 'bg-emerald-50 border-emerald-200', completed: true },
    { time: '13:15', title: 'Study Session', duration: '1h 30m', type: 'study', color: 'bg-indigo-50 border-indigo-200', completed: true },
    { time: '15:00', title: 'Social Media', duration: '30m', type: 'leisure', color: 'bg-orange-50 border-orange-200', unplanned: true, completed: true },
  ];

  // タイムラインの時間範囲（6:00 - 17:00）- コンパクト版
  const timelineHours = Array.from({ length: 12 }, (_, i) => i + 6);

  // 時間を分に変換
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // 期間を分に変換
  const durationToMinutes = (duration: string): number => {
    const hourMatch = duration.match(/(\d+)h/);
    const minuteMatch = duration.match(/(\d+)m/);
    const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
    const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0;
    return hours * 60 + minutes;
  };

  // タイムラインの開始時刻（6:00 = 360分）
  const startMinutes = 6 * 60;

  // タイルの位置とサイズを計算
  const calculatePosition = (item: ScheduleItem) => {
    const itemMinutes = timeToMinutes(item.time);
    const duration = durationToMinutes(item.duration);
    const topPosition = ((itemMinutes - startMinutes) / 60) * 60; // 1時間 = 60px (コンパクト)
    const height = (duration / 60) * 60;
    return { top: topPosition, height };
  };

  const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), selectedDay);
  const selectedDateString = selectedDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-slate-900">Calendar</h1>
        <p className="text-slate-600">Track your schedule and progress</p>
      </div>

      {/* Import Calendar Button */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-sm border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-900">Sync Calendar</p>
            <p className="text-xs text-slate-600 mt-1">Import from Google or Apple</p>
          </div>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 rounded-lg">
            <Download className="w-4 h-4 mr-2" />
            Import
          </Button>
        </div>
      </Card>

      {/* Calendar Navigation */}
      <Card className="p-4 bg-white rounded-2xl shadow-sm border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={previousMonth}
            className="rounded-full hover:bg-slate-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-slate-900">{monthName}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextMonth}
            className="rounded-full hover:bg-slate-100"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {days.map((day) => (
            <div key={day} className="text-center text-xs text-slate-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: startingDayOfWeek }).map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const isToday = day === today;
            const isSelected = day === selectedDay;
            const hasActivity = activityDays.includes(day);

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all relative ${
                  isToday
                    ? 'bg-blue-600 text-white shadow-md'
                    : isSelected
                    ? 'bg-purple-600 text-white shadow-md'
                    : hasActivity
                    ? 'bg-blue-50 text-slate-900 hover:bg-blue-100'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="text-sm">{day}</span>
                {hasActivity && !isToday && !isSelected && (
                  <div className="w-1 h-1 rounded-full bg-blue-600 mt-1" />
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Selected Day Schedule */}
      <div className="space-y-2">
        <h2 className="text-slate-900">{selectedDateString}</h2>
        
        <div className="relative">
          {/* ヘッダー：理想と実際のラベル */}
          <div className="flex mb-3">
            <div className="w-12 flex-shrink-0" />
            <div className="flex-1 grid grid-cols-2 gap-2 px-1">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-600">理想</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-600">実際</span>
              </div>
            </div>
          </div>

          {/* タイムライン */}
          <div className="relative">
            {/* 時間ラベルと水平線 */}
            <div className="relative">
              {timelineHours.map((hour) => (
                <div key={hour} className="relative h-[60px]">
                  <div className="absolute left-0 top-0 -translate-y-2">
                    <span className="text-xs text-slate-400 w-12 inline-block">{hour}:00</span>
                  </div>
                  <div className="absolute left-12 right-0 top-0 border-t border-slate-200" />
                </div>
              ))}
            </div>

            {/* スケジュールタイル - 2列 */}
            <div className="absolute top-0 left-12 right-0" style={{ height: `${timelineHours.length * 60}px` }}>
              <div className="grid grid-cols-2 gap-2 h-full px-1">
                {/* 左列：理想のスケジュール */}
                <div className="relative">
                  {plannedSchedule.map((item, index) => {
                    const { top, height } = calculatePosition(item);
                    return (
                      <Card
                        key={index}
                        className={`absolute left-0 right-0 px-2 py-1.5 rounded-lg shadow-sm border ${item.color}`}
                        style={{ top: `${top}px`, height: `${height}px`, minHeight: '36px' }}
                      >
                        <div className="space-y-0.5 h-full overflow-hidden">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-500">{item.time}</span>
                            <span className="text-xs text-slate-400">{item.duration}</span>
                          </div>
                          <p className="text-xs leading-tight text-slate-800 truncate">
                            {item.title}
                          </p>
                        </div>
                      </Card>
                    );
                  })}
                </div>

                {/* 右列：実際のスケジュール */}
                <div className="relative">
                  {actualSchedule.map((item, index) => {
                    const { top, height } = calculatePosition(item);
                    return (
                      <Card
                        key={index}
                        className={`absolute left-0 right-0 px-2 py-1.5 rounded-lg shadow-sm border ${item.color}`}
                        style={{ top: `${top}px`, height: `${height}px`, minHeight: '36px' }}
                      >
                        <div className="space-y-0.5 h-full overflow-hidden">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs ${item.delayed ? 'text-orange-600' : 'text-slate-500'}`}>
                              {item.time}
                              {item.delayed && ' ⚠️'}
                            </span>
                            <span className="text-xs text-slate-400">{item.duration}</span>
                          </div>
                          <p className={`text-xs leading-tight truncate ${item.unplanned ? 'text-orange-700' : 'text-slate-800'}`}>
                            {item.title}
                            {item.completed && ' ✓'}
                          </p>
                          {item.unplanned && height >= 50 && (
                            <span className="text-xs text-orange-600 bg-orange-100 px-1 py-0.5 rounded inline-block">
                              予定外
                            </span>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <Card className="p-3 bg-slate-50 rounded-xl border-slate-200 mt-4">
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="text-green-600">✓</span>
              <span className="text-slate-600">完了</span>
              <span className="mx-1">•</span>
              <span className="text-orange-600">⚠️</span>
              <span className="text-slate-600">遅延</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
