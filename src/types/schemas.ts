import { z } from 'zod';

export const ScheduleItemSchema = z.object({
  id: z.number(),
  dateISO: z.date().nullable(),
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
  dueDate: z.date().nullable(),
  priority: z.enum(['high', 'medium', 'low']),
  completed: z.boolean(),
  folderId: z.string(),
});

export type ScheduleItem = z.infer<typeof ScheduleItemSchema>;
export type Task = z.infer<typeof TaskSchema>;
export type Priority = z.infer<typeof TaskSchema.shape.priority>;
