// Shared types for the application
// Aligned with Prisma schema

export type Frequency = "DAILY" | "EVERY_TWO_DAYS" | "WEEKENDS" | "CUSTOM";

export type Habit = {
  id: number;
  name: string;
  userId: string;
  color: string;
  category: string;
  order: number;
  frequency: Frequency;
  customDays: string | null;
  notificationTime: string | null;
  dailyGoal: number;
  createdAt: Date | string | null;
};

export type Completion = {
  id: number;
  date: Date | string;
  habitId: number;
  value: number;
};

// Input types for Server Actions
export type CreateHabitInput = {
  name: string;
  color: string;
  category: string;
  frequency: Frequency;
  customDays: string | null;
  notificationTime: string | null;
  dailyGoal: number;
};

export type UpdateHabitInput = {
  id: number;
  name?: string;
  color?: string;
  category?: string;
  frequency?: Frequency;
  customDays?: string | null;
  notificationTime?: string | null;
  dailyGoal?: number;
};

export type ReorderHabitsInput = {
  id: number;
  order: number;
}[];

// Result types
export type ActionResult<T = void> = 
  | { success: true; data: T }
  | { success: false; error: string };
