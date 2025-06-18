import { Habit, HabitCompletion } from "../types/habit";

export const calculateStreak = (completions: HabitCompletion[]): number => {
  if (completions.length === 0) return 0;

  const sortedCompletions = completions
    .filter((c) => c.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (sortedCompletions.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sortedCompletions.length; i++) {
    const completionDate = new Date(sortedCompletions[i].date);
    completionDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);

    if (completionDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

export const isHabitDueToday = (habit: Habit): boolean => {
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.

  if (habit.frequency === "daily") {
    return true;
  }

  if (habit.frequency === "weekly" && habit.weekDays) {
    return habit.weekDays.includes(today);
  }

  return false;
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export const getDateString = (daysAgo: number = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return formatDate(date);
};

export const getDayName = (date: string): string => {
  const d = new Date(date);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[d.getDay()];
};

export const getWeekDayNames = (weekDays: number[]): string => {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  if (weekDays.length === 7) return "Daily";
  if (weekDays.length === 0) return "Never";

  return weekDays.map((day) => dayNames[day]).join(", ");
};

export const getHabitColors = () => [
  "#3B82F6", // Blue
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Violet
  "#06B6D4", // Cyan
  "#84CC16", // Lime
  "#F97316", // Orange
];

export const getHabitIcons = () => [
  "💪",
  "📚",
  "🏃",
  "💧",
  "🧘",
  "🎯",
  "✍️",
  "🥗",
  "💤",
  "🎵",
  "🌱",
  "🔥",
  "⭐",
  "🎨",
  "🏠",
  "💡",
];

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};
