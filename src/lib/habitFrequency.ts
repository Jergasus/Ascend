// Utilities for handling habit frequency

import type { Habit, Frequency } from "@/types";

/**
 * Helper to get date in YYYY-MM-DD format using LOCAL time
 * Avoids timezone issues that occur with toISOString()
 */
function getLocalYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Determines if a habit should be shown TODAY (for CheckHabitsModal)
 */
export function shouldShowHabitToday(habit: Habit): boolean {
  const today = new Date();
  return shouldShowHabit(habit, today);
}

/**
 * Determines if a habit should be shown on a specific date
 */
export function shouldShowHabit(habit: Habit, date: Date): boolean {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  
  // Don't show habits before their creation date
  if (habit.createdAt) {
    const createdDate = new Date(habit.createdAt);
    const checkDate = new Date(date);
    
    // USE LOCAL DATE for comparison
    const createdDateStr = getLocalYYYYMMDD(createdDate);
    const checkDateStr = getLocalYYYYMMDD(checkDate);
    
    if (checkDateStr < createdDateStr) {
      return false;
    }
  }

  switch (habit.frequency) {
    case "DAILY":
      return true;

    case "WEEKENDS":
      // Show only Saturdays (6) and Sundays (0)
      return dayOfWeek === 0 || dayOfWeek === 6;

    case "EVERY_TWO_DAYS":
      if (!habit.createdAt) return true;
      
      // Calculate days passed ensuring LOCAL midnight
      const createdDate = new Date(habit.createdAt);
      createdDate.setHours(0, 0, 0, 0);
      
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);
      
      const daysSinceCreation = Math.floor(
        (checkDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      return daysSinceCreation % 2 === 0;

    case "CUSTOM":
      if (!habit.customDays) return true;
      
      const customDaysArray = habit.customDays.split(",").map(d => parseInt(d.trim()));
      
      // Special logic: if today is creation day, force display if it's in the list
      if (habit.createdAt) {
        const createdDateCustom = new Date(habit.createdAt);
        const checkDateCustom = new Date(date);
        
        const createdDateStr = getLocalYYYYMMDD(createdDateCustom);
        const checkDateStr = getLocalYYYYMMDD(checkDateCustom);

        if (checkDateStr === createdDateStr && customDaysArray.includes(checkDateCustom.getDay())) {
          return true;
        }
      }
      return customDaysArray.includes(dayOfWeek);

    default:
      return true;
  }
}

/**
 * Determines if a specific day should be enabled for marking
 */
export function shouldEnableDay(
  habit: Habit,
  date: Date
): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);

  // Only allow editing today
  if (checkDate.getTime() !== today.getTime()) {
    return false;
  }

  // Verify that the habit should be shown today according to its frequency
  return shouldShowHabit(habit, date);
}

/**
 * Gets the descriptive text for the frequency
 */
export function getFrequencyLabel(frequency: Frequency, customDays?: string | null): string {
  switch (frequency) {
    case "DAILY":
      return "Every day";
    case "EVERY_TWO_DAYS":
      return "Every 2 days";
    case "WEEKENDS":
      return "Weekends";
    case "CUSTOM":
      if (!customDays) return "Custom";
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const selectedDays = customDays.split(",").map(d => days[parseInt(d.trim())]);
      return selectedDays.join(", ");
    default:
      return "Daily";
  }
}

export function customDaysToString(days: number[]): string {
  return days.sort((a, b) => a - b).join(",");
}

export function stringToCustomDays(str: string | null | undefined): number[] {
  if (!str) return [];
  return str.split(",").map(d => parseInt(d.trim()));
}

export function calculateSmartStartDate(
  frequency: Frequency,
  customDays?: string | null
): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentDayOfWeek = today.getDay(); 

  switch (frequency) {
    case "DAILY":
      return today;

    case "EVERY_TWO_DAYS":
      return today;

    case "WEEKENDS":
      if (currentDayOfWeek === 0 || currentDayOfWeek === 6) {
        return today;
      }
      const daysUntilSaturday = 6 - currentDayOfWeek;
      const nextSaturday = new Date(today);
      nextSaturday.setDate(today.getDate() + daysUntilSaturday);
      return nextSaturday;

    case "CUSTOM":
      if (!customDays) return today;
      
      const customDaysArray = customDays.split(",").map(d => parseInt(d.trim())).sort((a, b) => a - b);
      
      if (customDaysArray.includes(currentDayOfWeek)) {
        return today;
      }
      
      let daysToAdd = 0;
      for (let i = 1; i <= 7; i++) {
        const nextDay = (currentDayOfWeek + i) % 7;
        if (customDaysArray.includes(nextDay)) {
          daysToAdd = i;
          break;
        }
      }
      
      const nextValidDay = new Date(today);
      nextValidDay.setDate(today.getDate() + daysToAdd);
      return nextValidDay;

    default:
      return today;
  }
}