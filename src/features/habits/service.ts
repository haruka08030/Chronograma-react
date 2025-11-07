import { Habit } from './schema';

export const calculateStreak = (history: boolean[]): number => {
  let streak = 0;
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i]) streak++;
    else break;
  }
  return streak;
};

export const calculateLongestStreak = (history: boolean[]): number => {
  let longestStreak = 0;
  let currentStreak = 0;
  for (let i = 0; i < history.length; i++) {
    if (history[i]) {
      currentStreak++;
    } else {
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
      currentStreak = 0;
    }
  }
  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
  }
  return longestStreak;
};

export const calculateCompletion = (completion: boolean[]): number => {
  if (completion.length === 0) return 0;
  const completed = completion.filter(Boolean).length;
  return Math.round((completed / completion.length) * 100);
};

export const calculateWeeklyRate = (habits: Habit[]): number => {
  if (habits.length === 0) return 0;
  const totalSlots = habits.length * 7;
  const completedSlots = habits.reduce((sum, habit) =>
    sum + habit.completion.filter(Boolean).length, 0
  );
  return Math.round((completedSlots / totalSlots) * 100);
};

export const getOverallLongestStreak = (habits: Habit[]): number => {
  if (habits.length === 0) return 0;
  return Math.max(...habits.map(h => calculateLongestStreak(h.history)));
}
