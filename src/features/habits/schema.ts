import { z } from 'zod';

export const HabitSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  time: z.string(),
  color: z.object({
    bg: z.string(),
    text: z.string(),
  }),
  completion: z.array(z.boolean()),
  history: z.array(z.boolean()),
});

export type Habit = z.infer<typeof HabitSchema>;
