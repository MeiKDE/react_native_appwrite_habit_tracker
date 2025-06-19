export interface Habit {
  $id: string;
  name: string;
  description?: string;
  frequency: "daily" | "weekly";
  weekDays?: number[]; // 0-6, Sunday-Saturday
  reminderTime?: string; // HH:MM format
  reminderMessage?: string;
  color: string;
  icon: string;
  isActive: boolean;
  createdAt: string;
  userId: string;
}

export interface HabitCompletion {
  $id: string;
  habitId: string;
  userId: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
  skipped?: boolean;
  note?: string;
  completedAt?: string;
}

export interface User {
  $id: string;
  name: string;
  email: string;
  prefs?: {
    notifications: boolean;
  };
}
