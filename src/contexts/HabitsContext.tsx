"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { Habit, Frequency } from "@/types";

type HabitsContextType = {
  habits: Habit[];
  completions: Map<string, number>;
  isLoading: boolean;
  isCreating: boolean;
  isDeleting: number | null;
  isUpdating: number | null;
  refreshData: () => void;
  addHabit: (habit: Habit) => void;
  removeHabit: (id: number) => void;
  updateHabitLocal: (
    id: number,
    name: string,
    color: string,
    category: string,
    frequency: Frequency,
    customDays?: string | null,
    notificationTime?: string | null,
    dailyGoal?: number
  ) => void;
  reorderHabitsLocal: (reorderedHabits: Habit[]) => void;
  toggleCompletionLocal: (habitId: number, date: string, dailyGoal: number) => void;
  setIsCreating: (value: boolean) => void;
  setIsDeleting: (id: number | null) => void;
  setIsUpdating: (id: number | null) => void;
};

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

export function HabitsProvider({
  children,
  initialHabits = [],
  initialCompletions = [],
}: {
  children: ReactNode;
  initialHabits?: Habit[];
  initialCompletions?: string[];
}) {
  const { status } = useSession();
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>(initialHabits);

  // Initialize completions map from the array of strings passed from server
  // Format: "habitId-date-value"
  const [completions, setCompletions] = useState<Map<string, number>>(() => {
    const map = new Map<string, number>();
    initialCompletions.forEach((str) => {
      const parts = str.split("-");
      if (parts.length >= 4) {
        // habitId-YYYY-MM-DD-value
        const value = parseInt(parts.pop() || "1");
        const key = parts.join("-");
        map.set(key, value);
      } else {
        // Legacy format: habitId-YYYY-MM-DD (value assumed 1)
        map.set(str, 1);
      }
    });
    return map;
  });

  const [isLoading, setIsLoading] = useState(
    initialHabits.length === 0 && status === "loading"
  );
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState<number | null>(null);

  // Use router.refresh() to re-fetch server data when needed
  const refreshData = useCallback(() => {
    router.refresh();
  }, [router]);

  // Handle auth state changes
  useEffect(() => {
    if (status === "authenticated") {
      setIsLoading(false);
    } else if (status === "unauthenticated") {
      setIsLoading(false);
      setHabits([]);
      setCompletions(new Map());
    }
  }, [status]);

  // Sync with server data when initialHabits/initialCompletions change (after router.refresh)
  useEffect(() => {
    setHabits(initialHabits);
  }, [initialHabits]);

  useEffect(() => {
    const map = new Map<string, number>();
    initialCompletions.forEach((str) => {
      const parts = str.split("-");
      if (parts.length >= 4) {
        const value = parseInt(parts.pop() || "1");
        const key = parts.join("-");
        map.set(key, value);
      } else {
        map.set(str, 1);
      }
    });
    setCompletions(map);
  }, [initialCompletions]);

  // Optimistic update functions (for immediate UI feedback)
  const addHabit = useCallback((habit: Habit) => {
    setHabits((prev) => [...prev, habit]);
  }, []);

  const removeHabit = useCallback((id: number) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));

    // Remove associated completions from Map
    setCompletions((prev) => {
      const newCompletions = new Map(prev);
      for (const key of prev.keys()) {
        if (key.startsWith(`${id}-`)) {
          newCompletions.delete(key);
        }
      }
      return newCompletions;
    });
  }, []);

  const updateHabitLocal = useCallback(
    (
      id: number,
      name: string,
      color: string,
      category: string,
      frequency: Frequency,
      customDays?: string | null,
      notificationTime?: string | null,
      dailyGoal?: number
    ) => {
      setHabits((prev) =>
        prev.map((h) =>
          h.id === id
            ? {
                ...h,
                name,
                color,
                category,
                frequency,
                customDays: customDays ?? null,
                notificationTime: notificationTime ?? null,
                dailyGoal: dailyGoal ?? 1,
              }
            : h
        )
      );
    },
    []
  );

  const reorderHabitsLocal = useCallback((reorderedHabits: Habit[]) => {
    setHabits(reorderedHabits);
  }, []);

  const toggleCompletionLocal = useCallback(
    (habitId: number, date: string, dailyGoal: number) => {
      const key = `${habitId}-${date}`;
      setCompletions((prev) => {
        const newCompletions = new Map(prev);
        const currentValue = newCompletions.get(key) || 0;

        if (currentValue < dailyGoal) {
          newCompletions.set(key, currentValue + 1);
        } else {
          newCompletions.delete(key);
        }
        return newCompletions;
      });
    },
    []
  );

  return (
    <HabitsContext.Provider
      value={{
        habits,
        completions,
        isLoading,
        isCreating,
        isDeleting,
        isUpdating,
        refreshData,
        addHabit,
        removeHabit,
        updateHabitLocal,
        reorderHabitsLocal,
        toggleCompletionLocal,
        setIsCreating,
        setIsDeleting,
        setIsUpdating,
      }}
    >
      {children}
    </HabitsContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitsContext);
  if (context === undefined) {
    throw new Error("useHabits must be used within a HabitsProvider");
  }
  return context;
}
