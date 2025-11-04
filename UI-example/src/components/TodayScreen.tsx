import { Clock, Target, TrendingUp, Calendar } from 'lucide-react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

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

export default function TodayScreen() {
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  const plannedSchedule: ScheduleItem[] = [
    { time: '6:00', title: 'Morning Routine', duration: '1h', type: 'habit', color: 'bg-purple-50 border-purple-200' },
    { time: '7:00', title: 'Breakfast', duration: '30m', type: 'meal', color: 'bg-emerald-50 border-emerald-200' },
    { time: '8:00', title: 'Math Class', duration: '2h', type: 'class', color: 'bg-sky-50 border-sky-200' },
    { time: '10:00', title: 'Break', duration: '15m', type: 'break', color: 'bg-slate-50 border-slate-200' },
    { time: '10:15', title: 'Science Class', duration: '1h 45m', type: 'class', color: 'bg-sky-50 border-sky-200' },
    { time: '12:00', title: 'Lunch', duration: '1h', type: 'meal', color: 'bg-emerald-50 border-emerald-200' },
    { time: '13:00', title: 'Study Session', duration: '2h', type: 'study', color: 'bg-indigo-50 border-indigo-200' },
    { time: '15:00', title: 'Gym Workout', duration: '1h', type: 'exercise', color: 'bg-rose-50 border-rose-200' },
    { time: '17:00', title: 'Project Work', duration: '2h', type: 'work', color: 'bg-amber-50 border-amber-200' },
    { time: '19:00', title: 'Dinner', duration: '1h', type: 'meal', color: 'bg-emerald-50 border-emerald-200' },
    { time: '20:00', title: 'Free Time', duration: '2h', type: 'leisure', color: 'bg-cyan-50 border-cyan-200' },
    { time: '22:00', title: 'Sleep', duration: '8h', type: 'sleep', color: 'bg-violet-50 border-violet-200' },
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
    { time: '15:30', title: 'Gym Workout', duration: '45m', type: 'exercise', color: 'bg-rose-50 border-rose-200', current: true },
  ];

  // タイムラインの時間範囲（6:00 - 23:00）
  const timelineHours = Array.from({ length: 18 }, (_, i) => i + 6);

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
    const topPosition = ((itemMinutes - startMinutes) / 60) * 80; // 1時間 = 80px
    const height = (duration / 60) * 80;
    return { top: topPosition, height };
  };

  const ComparisonTimeline = () => (
    <div className="relative">
      {/* ヘッダー：理想と実際のラベル */}
      <div className="flex mb-3">
        <div className="w-12 flex-shrink-0" /> {/* 時間ラベル用のスペース */}
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
            <div key={hour} className="relative h-20">
              {/* 時間ラベル */}
              <div className="absolute left-0 top-0 -translate-y-2">
                <span className="text-xs text-slate-400 w-12 inline-block">{hour}:00</span>
              </div>
              {/* 水平線 */}
              <div className="absolute left-12 right-0 top-0 border-t border-slate-200" />
            </div>
          ))}
        </div>

        {/* スケジュールタイル - 2列 */}
        <div className="absolute top-0 left-12 right-0" style={{ height: `${timelineHours.length * 80}px` }}>
          <div className="grid grid-cols-2 gap-2 h-full px-1">
            {/* 左列：理想のスケジュール */}
            <div className="relative">
              {plannedSchedule.map((item, index) => {
                const { top, height } = calculatePosition(item);
                return (
                  <Card
                    key={index}
                    className={`absolute left-0 right-0 px-2.5 py-2 rounded-lg shadow-sm border ${item.color}`}
                    style={{ top: `${top}px`, height: `${height}px`, minHeight: '40px' }}
                  >
                    <div className="space-y-0.5 h-full overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">{item.time}</span>
                        <span className="text-xs text-slate-400">{item.duration}</span>
                      </div>
                      <p className="text-sm leading-tight text-slate-800 truncate">
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
                    className={`absolute left-0 right-0 px-2.5 py-2 rounded-lg shadow-sm border ${item.color} ${
                      item.current ? 'ring-2 ring-blue-400' : ''
                    }`}
                    style={{ top: `${top}px`, height: `${height}px`, minHeight: '40px' }}
                  >
                    <div className="space-y-0.5 h-full overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs ${item.delayed ? 'text-orange-600' : 'text-slate-500'}`}>
                          {item.time}
                          {item.delayed && ' ⚠️'}
                        </span>
                        <span className="text-xs text-slate-400">{item.duration}</span>
                      </div>
                      <p className={`text-sm leading-tight truncate ${item.unplanned ? 'text-orange-700' : 'text-slate-800'}`}>
                        {item.title}
                        {item.completed && ' ✓'}
                        {item.current && ' 📍'}
                      </p>
                      {item.unplanned && height >= 60 && (
                        <span className="text-xs text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded inline-block">
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
    </div>
  );

  const SingleTimeline = () => (
    <div className="relative">
      {/* ヘッダー */}
      <div className="flex mb-3">
        <div className="w-12 flex-shrink-0" />
        <div className="flex items-center gap-2 px-1">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-600">実際</span>
        </div>
      </div>

      {/* タイムライン */}
      <div className="relative">
        {/* 時間ラベルと水平線 */}
        <div className="relative">
          {timelineHours.map((hour) => (
            <div key={hour} className="relative h-20">
              <div className="absolute left-0 top-0 -translate-y-2">
                <span className="text-xs text-slate-400 w-12 inline-block">{hour}:00</span>
              </div>
              <div className="absolute left-12 right-0 top-0 border-t border-slate-200" />
            </div>
          ))}
        </div>

        {/* スケジュールタイル */}
        <div className="absolute top-0 left-12 right-0 px-1" style={{ height: `${timelineHours.length * 80}px` }}>
          <div className="relative h-full">
            {actualSchedule.map((item, index) => {
              const { top, height } = calculatePosition(item);
              return (
                <Card
                  key={index}
                  className={`absolute left-0 right-0 px-3 py-2 rounded-lg shadow-sm border ${item.color} ${
                    item.current ? 'ring-2 ring-blue-400' : ''
                  }`}
                  style={{ top: `${top}px`, height: `${height}px`, minHeight: '40px' }}
                >
                  <div className="space-y-0.5 h-full overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${item.delayed ? 'text-orange-600' : 'text-slate-500'}`}>
                        {item.time}
                        {item.delayed && ' ⚠️'}
                      </span>
                      <span className="text-xs text-slate-400">{item.duration}</span>
                    </div>
                    <p className={`text-sm leading-tight ${item.unplanned ? 'text-orange-700' : 'text-slate-800'}`}>
                      {item.title}
                      {item.completed && ' ✓'}
                      {item.current && ' 📍'}
                    </p>
                    {item.unplanned && height >= 60 && (
                      <span className="text-xs text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded inline-block">
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
  );

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-slate-900">Chronograma</h1>
        <p className="text-slate-600">{dateString}</p>
      </div>

      {/* Daily Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3 bg-white rounded-2xl shadow-sm border-slate-200">
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-2">
              <Target className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-slate-500 text-xs">Tasks</p>
            <p className="text-slate-900">8/12</p>
          </div>
        </Card>
        <Card className="p-3 bg-white rounded-2xl shadow-sm border-slate-200">
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-slate-500 text-xs">Habits</p>
            <p className="text-slate-900">5/7</p>
          </div>
        </Card>
        <Card className="p-3 bg-white rounded-2xl shadow-sm border-slate-200">
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-slate-500 text-xs">Focus</p>
            <p className="text-slate-900">6.5h</p>
          </div>
        </Card>
      </div>

      {/* Progress Summary */}
      <Card className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-sm border-slate-200">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-slate-700">Today's Progress</p>
            <p className="text-blue-600">67%</p>
          </div>
          <Progress value={67} className="h-2" />
          <p className="text-xs text-slate-600">
            順調です！今日はあと4つのタスクが残っています。
          </p>
        </div>
      </Card>

      {/* Comparison View Toggle */}
      <Tabs defaultValue="comparison" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="comparison" className="rounded-lg data-[state=active]:bg-white">
            比較表示
          </TabsTrigger>
          <TabsTrigger value="single" className="rounded-lg data-[state=active]:bg-white">
            実際のみ
          </TabsTrigger>
        </TabsList>

        {/* Comparison View */}
        <TabsContent value="comparison" className="mt-4">
          <ComparisonTimeline />

          {/* Legend */}
          <Card className="p-3 bg-slate-50 rounded-xl border-slate-200 mt-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs flex-wrap">
                <span className="text-green-600">✓</span>
                <span className="text-slate-600">完了</span>
                <span className="mx-1">•</span>
                <span className="text-blue-600">📍</span>
                <span className="text-slate-600">進行中</span>
                <span className="mx-1">•</span>
                <span className="text-orange-600">⚠️</span>
                <span className="text-slate-600">遅延</span>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Single View */}
        <TabsContent value="single" className="mt-4">
          <SingleTimeline />
          
          {/* Legend */}
          <Card className="p-3 bg-slate-50 rounded-xl border-slate-200 mt-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs flex-wrap">
                <span className="text-green-600">✓</span>
                <span className="text-slate-600">完了</span>
                <span className="mx-1">•</span>
                <span className="text-blue-600">📍</span>
                <span className="text-slate-600">進行中</span>
                <span className="mx-1">•</span>
                <span className="text-orange-600">⚠️</span>
                <span className="text-slate-600">遅延</span>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
