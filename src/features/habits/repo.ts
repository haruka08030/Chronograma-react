import AsyncStorage from '@react-native-async-storage/async-storage';
import { z } from 'zod';
import { Habit, HabitSchema } from './schema';

const HABITS_STORAGE_KEY = 'habits';

const migrateHabits = (data: any[]): Habit[] => {
  return data.map(habit => ({
    ...habit,
    id: String(habit.id),
  }));
};

export const getHabits = async (): Promise<Habit[] | null> => {
  try {
    const saved = await AsyncStorage.getItem(HABITS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const migrated = migrateHabits(parsed);
      const validated = z.array(HabitSchema).safeParse(migrated);
      if (validated.success) {
        return validated.data;
      } else {
        console.error('Invalid habit data after migration:', validated.error);
        return null;
      }
    }
    return []; // Return empty array if no habits are saved
  } catch (error) {
    console.error('Failed to load habits.', error);
    return null;
  }
};

export const setHabits = async (habits: Habit[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
  } catch (error) {
    console.error('Failed to save habits.', error);
  }
};
