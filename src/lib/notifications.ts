import { LocalNotifications, LocalNotificationSchema } from '@capacitor/local-notifications';
import { Habit } from '@/types';
import { Translations } from './translations';

// Constants for ID generation
const ID_MULTIPLIER = 100000;
const MAX_REMINDERS = 10;

// Helper to parse "HH:MM" string
const parseTime = (timeStr: string) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return { hours, minutes };
};

// Helper to get day of year (1-366).
// Both anchor and target are normalized to noon local time so DST hour shifts
// (transitions happen at 2-3 AM) can't push the result across a day boundary —
// otherwise schedule (computed at 00:00) and cancel (computed at click time)
// would derive different IDs and the cancel would silently miss.
const getDayOfYear = (date: Date) => {
  const start = new Date(date.getFullYear(), 0, 1, 12, 0, 0, 0);
  const normalized = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    12, 0, 0, 0
  );
  const diff = normalized.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.round(diff / oneDay) + 1;
};

export const requestNotificationPermissions = async () => {
  const { display } = await LocalNotifications.checkPermissions();
  if (display !== 'granted') {
    const { display: newDisplay } = await LocalNotifications.requestPermissions();
    return newDisplay === 'granted';
  }
  return true;
};

export const scheduleHabitNotification = async (
  habit: Habit,
  t: Translations,
  completions?: Map<string, number>
) => {
  if (!habit.notificationTime) return;

  // Cancel existing notifications for this habit first to avoid duplicates
  await cancelHabitNotification(habit.id);

  const times = habit.notificationTime.split(',').filter(Boolean);
  if (times.length === 0) return;

  const title = t.notificationTitle;
  const body = t.notificationBody.replace('{habitName}', habit.name);

  const notifications: LocalNotificationSchema[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dailyGoal = habit.dailyGoal || 1;

  // Schedule for the next 14 days
  // This "rolling window" approach allows us to cancel specific dates (e.g. if completed)
  // and ensures we don't exceed iOS notification limits (64) too quickly if we keep it short.
  for (let i = 0; i < 14; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() + i);

    let shouldSchedule = false;

    if (habit.frequency === 'DAILY') {
      shouldSchedule = true;
    } else if (habit.frequency === 'WEEKENDS') {
      const day = checkDate.getDay();
      if (day === 0 || day === 6) shouldSchedule = true; // 0=Sun, 6=Sat
    } else if (habit.frequency === 'CUSTOM' && habit.customDays) {
      const days = habit.customDays.split(',').map(Number);
      if (days.includes(checkDate.getDay())) shouldSchedule = true;
    } else if (habit.frequency === 'EVERY_TWO_DAYS' && habit.createdAt) {
      const createdDate = new Date(habit.createdAt);
      createdDate.setHours(0, 0, 0, 0);
      const diffTime = checkDate.getTime() - createdDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays % 2 === 0) shouldSchedule = true;
    }

    // Skip dates already completed at/above daily goal
    if (shouldSchedule && completions) {
      const dateKey = `${habit.id}-${checkDate.getFullYear()}-${String(
        checkDate.getMonth() + 1
      ).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
      if ((completions.get(dateKey) || 0) >= dailyGoal) {
        shouldSchedule = false;
      }
    }

    if (shouldSchedule) {
      const dayOfYear = getDayOfYear(checkDate);

      times.forEach((timeStr, index) => {
        if (index >= MAX_REMINDERS) return;
        
        const { hours, minutes } = parseTime(timeStr);
        const scheduledDate = new Date(checkDate);
        scheduledDate.setHours(hours, minutes, 0, 0);

        // Only schedule if it's in the future
        if (scheduledDate > new Date()) {
          notifications.push({
            id: habit.id * ID_MULTIPLIER + dayOfYear * MAX_REMINDERS + index,
            title,
            body,
            schedule: {
              at: scheduledDate,
              allowWhileIdle: true,
            },
          });
        }
      });
    }
  }

  if (notifications.length > 0) {
    try {
      await LocalNotifications.schedule({ notifications });
    } catch (error) {
      console.error('Error scheduling notifications:', error);
    }
  }
};

export const cancelHabitNotification = async (habitId: number) => {
  // Cancel all potential IDs for this habit
  const ids = [];
  
  // New scheme: habitId * 100000 + dayOfYear * 10 + index
  for (let d = 1; d <= 366; d++) {
    for (let i = 0; i < MAX_REMINDERS; i++) {
      ids.push({ id: habitId * ID_MULTIPLIER + d * MAX_REMINDERS + i });
    }
  }

  // Also cancel old scheme (habitId * 1000 + dayOfYear)
  for (let d = 1; d <= 366; d++) {
    ids.push({ id: habitId * 1000 + d });
  }
  
  try {
    // Split into chunks to avoid overwhelming the plugin
    const chunkSize = 100;
    for (let i = 0; i < ids.length; i += chunkSize) {
        const chunk = ids.slice(i, i + chunkSize);
        await LocalNotifications.cancel({ notifications: chunk });
    }
  } catch (error) {
    console.error('Error cancelling notifications:', error);
  }
};

export const cancelNotificationForDate = async (habitId: number, date: Date) => {
  const dayOfYear = getDayOfYear(date);
  const ids = [];
  
  // Cancel all reminders for this day
  for (let i = 0; i < MAX_REMINDERS; i++) {
    ids.push({ id: habitId * ID_MULTIPLIER + dayOfYear * MAX_REMINDERS + i });
  }
  
  // Also cancel old scheme just in case
  ids.push({ id: habitId * 1000 + dayOfYear });
  
  try {
    await LocalNotifications.cancel({ notifications: ids });
  } catch (error) {
    console.error('Error cancelling notification for date:', error);
  }
};

export const rescheduleAllNotifications = async (
  habits: Habit[],
  t: Translations,
  completions?: Map<string, number>
) => {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return;

  for (const habit of habits) {
    if (habit.notificationTime) {
      await scheduleHabitNotification(habit, t, completions);
    }
  }
};

