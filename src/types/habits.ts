export interface Habit {
  id: string;
  name: string;
  icon: string;
  time: string;
  color: { bg: string; text: string };
  completion: boolean[];
  history: boolean[];
}