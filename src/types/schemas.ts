import { z } from 'zod';

export const ScheduleItemSchema = z.object({
  id: z.number(),
  dateISO: z.string(),
  startTime: z.string(),
  durationMin: z.number().positive(),
  title: z.string(),
  type: z.string(),
  color: z.object({
    bg: z.string(),
    border: z.string(),
  }),
  delayed: z.boolean().optional(),
  completed: z.boolean().optional(),
  current: z.boolean().optional(),
  unplanned: z.boolean().optional(),
});

export const TaskSchema = z.object({
  id: z.number(),
  title: z.string(),
  dueDate: z.string(),
  priority: z.enum(['high', 'medium', 'low']),
  completed: z.boolean(),
  folderId: z.string(),
});
