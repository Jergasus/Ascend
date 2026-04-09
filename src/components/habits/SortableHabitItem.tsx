"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import {
  Edit2,
  Trash2,
  GripVertical,
  Flame,
  Loader2,
  Snowflake,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { shouldEnableDay, shouldShowHabit } from "@/lib/habitFrequency";
import type { Habit, Frequency } from "@/types";

interface SortableHabitItemProps {
  habit: Habit;
  currentWeek: Date[];
  makeKey: (habitId: number, date: Date) => string;
  completions: Map<string, number>;
  handleToggle: (habitId: number, date: Date) => void;
  setEditingHabit: (habit: {
    id: number;
    name: string;
    color: string;
    category: string;
    frequency: Frequency;
    customDays?: string | null;
    notificationTime?: string | null;
    dailyGoal?: number;
  }) => void;
  handleDeleteHabit: (id: number, name: string) => void;
  isDeleting?: number | null;
  isUpdating?: number | null;
  isLocked?: boolean;
}

// --- STREAK LOGIC WITH RECOVERY AND SMART BEST STREAK ---
const calculateStreaks = (habit: Habit, completions: Map<string, number>) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let checkDate = new Date(today);
  const relevantDays: { dateStr: string; isCompleted: boolean }[] = [];

  // 1. Build the history of RELEVANT days (where the habit was scheduled)
  // Iterate 365 days back
  for (let i = 0; i < 365; i++) {
    if (shouldShowHabit(habit, checkDate)) {
      const year = checkDate.getFullYear();
      const month = String(checkDate.getMonth() + 1).padStart(2, "0");
      const day = String(checkDate.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;
      const key = `${habit.id}-${dateStr}`;
      const value = completions.get(key) || 0;
      const dailyGoal = habit.dailyGoal || 1;

      relevantDays.push({
        dateStr,
        isCompleted: value >= dailyGoal,
      });
    }
    checkDate.setDate(checkDate.getDate() - 1);
  }

  // 2. Determine state and count of CURRENT streak
  let currentStreak = 0;
  let isFrozen = false;

  if (relevantDays.length > 0) {
    const todayStatus = relevantDays[0]; // Today
    const lastStatus = relevantDays[1]; // Yesterday
    const preLastStatus = relevantDays[2]; // Day before yesterday

    // SCENARIO A: TODAY IS ALREADY COMPLETED
    if (todayStatus.isCompleted) {
      currentStreak = 1;
      isFrozen = false;

      // Count backwards
      for (let i = 1; i < relevantDays.length; i++) {
        const day = relevantDays[i];
        if (day.isCompleted) {
          currentStreak++;
        } else {
          // Bridge check (Freeze used successfully)
          const prevDay = relevantDays[i + 1];
          if (prevDay && prevDay.isCompleted) {
            continue; // Skip the gap without breaking, but without adding
          } else {
            break; // Streak broken
          }
        }
      }
    }
    // SCENARIO B: TODAY IS NOT COMPLETED
    else {
      if (lastStatus && lastStatus.isCompleted) {
        // Yesterday was completed -> Normal fire
        isFrozen = false;
        for (let i = 1; i < relevantDays.length; i++) {
          if (relevantDays[i].isCompleted) {
            currentStreak++;
          } else {
            const prevDay = relevantDays[i + 1];
            if (prevDay && prevDay.isCompleted) continue;
            else break;
          }
        }
      } else if (
        lastStatus &&
        !lastStatus.isCompleted &&
        preLastStatus &&
        preLastStatus.isCompleted
      ) {
        // Yesterday missed, day before completed -> FROZEN
        isFrozen = true;
        for (let i = 2; i < relevantDays.length; i++) {
          if (relevantDays[i].isCompleted) {
            currentStreak++;
          } else {
            const prevDay = relevantDays[i + 1];
            if (prevDay && prevDay.isCompleted) continue;
            else break;
          }
        }
      }
    }
  }

  // 3. CALCULATE HISTORICAL BEST STREAK (FIXED)
  // We use the 'relevantDays' array but traverse it from end (past) to start (present)
  // to simulate chronology and apply the "1-day forgiveness" logic.

  let bestStreak = 0;
  let runningStreak = 0;
  let freezeUsed = false; // Flag to know if we already used the wildcard in the current streak

  // Iterate from the past (end of array) towards today (index 0)
  for (let i = relevantDays.length - 1; i >= 0; i--) {
    const day = relevantDays[i];

    if (day.isCompleted) {
      runningStreak++;
      freezeUsed = false; // On completion, we regain the ability to use a future freeze (reset the "danger" state)
    } else {
      // Missed day
      if (runningStreak > 0 && !freezeUsed) {
        // If we have a streak and have NOT used the freeze recently,
        // allow this gap. The streak does NOT increase, but does NOT reset.
        freezeUsed = true;
      } else {
        // If we already had a freeze (2 consecutive misses) or no streak, reset to zero.
        runningStreak = 0;
        freezeUsed = false;
      }
    }
    // Update the record at each step
    bestStreak = Math.max(bestStreak, runningStreak);
  }

  return { currentStreak, bestStreak, isFrozen };
};

export default function SortableHabitItem({
  habit,
  currentWeek,
  makeKey,
  completions,
  handleToggle,
  setEditingHabit,
  handleDeleteHabit,
  isDeleting,
  isUpdating,
  isLocked = false,
}: SortableHabitItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: habit.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    pointerEvents: isLocked ? "none" : ("auto" as any),
  };

  // Remove aria-describedby from attributes to prevent hydration mismatch
  // dnd-kit generates IDs that might differ between server and client
  const { "aria-describedby": ariaDescribedBy, ...otherAttributes } = attributes;

  const { currentStreak, bestStreak, isFrozen } = useMemo(
    () => calculateStreaks(habit, completions),
    [habit, completions]
  );
  const [animate, setAnimate] = useState(false);
  const [prevStreak, setPrevStreak] = useState(currentStreak);
  const [animatingDay, setAnimatingDay] = useState<string | null>(null);

  useEffect(() => {
    // Only animate if the streak goes up AND we're not frozen
    if (currentStreak > prevStreak && !isFrozen) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 500);
      return () => clearTimeout(timer);
    }
    setPrevStreak(currentStreak);
  }, [currentStreak, prevStreak, isFrozen]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group mb-3 relative"
      {...otherAttributes}
    >
      <motion.div
        layout={!isDragging}
        initial={false}
        className="bg-white/5 backdrop-blur-md rounded-3xl relative overflow-hidden"
        style={{
          borderWidth: "2px",
          borderStyle: "solid",
          borderColor: habit.color,
        }}
        animate={{
          scale: isDragging ? 1.02 : 1,
          boxShadow: isDragging
            ? "0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)"
            : "none",
          backgroundColor: isDragging
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(255, 255, 255, 0.05)",
        }}
        transition={{
          layout: {
            type: "spring",
            stiffness: 150,
            damping: 25,
          },
          scale: { duration: 0.2 },
          boxShadow: { duration: 0.2 },
          backgroundColor: { duration: 0.2 },
        }}
      >
        <div className={`px-2 pt-4 pb-4 sm:p-6 ${isLocked ? "opacity-50" : ""}`}>
        <div className="flex items-center gap-3 sm:gap-4 mb-4 px-2">
          <button
            {...listeners}
            className="text-white/40 hover:text-white/80 transition-colors cursor-grab active:cursor-grabbing touch-none"
            title="Arrastrar para reordenar"
          >
            <GripVertical size={20} className="sm:w-6 sm:h-6" />
          </button>
          <div
            className="h-full w-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: habit.color }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3
                className="text-white font-bold text-xl sm:text-2xl truncate"
                title={habit.name}
              >
                {habit.name}
              </h3>

              {/* STREAK VISUAL LOGIC */}
              {(currentStreak >= 2 || (isFrozen && currentStreak >= 1)) && (
                <div
                  className={`flex items-center justify-center gap-1 transition-colors duration-300`}
                >
                  {isFrozen ? (
                    <Snowflake
                      size={18}
                      className="sm:w-5 sm:h-5 text-blue-400 animate-pulse"
                    />
                  ) : (
                    <Flame
                      size={18}
                      className={`sm:w-5 sm:h-5 text-orange-400 ${
                        animate ? "animate-streakPulse" : ""
                      }`}
                    />
                  )}

                  <span
                    className={`font-bold text-sm sm:text-base transition-colors duration-300 ${
                      isFrozen ? "text-blue-400" : "text-orange-400"
                    }`}
                  >
                    {currentStreak}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm sm:text-base mt-1">
              <p className="text-white/50 truncate">{habit.category}</p>
              {bestStreak > 0 && (
                <>
                  <span className="text-white/50">•</span>
                  <span className="text-white/50">Best: {bestStreak}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setEditingHabit({
                  id: habit.id,
                  name: habit.name,
                  color: habit.color,
                  category: habit.category,
                  frequency: habit.frequency,
                  customDays: habit.customDays,
                  notificationTime: habit.notificationTime,
                  dailyGoal: habit.dailyGoal,
                })
              }
              disabled={isUpdating === habit.id || isDeleting === habit.id}
              className="text-blue-400 hover:text-blue-300 transition-all duration-200 p-2 hover:scale-125 active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              title="Edit habit"
            >
              {isUpdating === habit.id ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <Edit2 size={24} />
              )}
            </button>
            <button
              onClick={() => handleDeleteHabit(habit.id, habit.name)}
              disabled={isDeleting === habit.id || isUpdating === habit.id}
              className="text-red-400 hover:text-red-300 transition-all duration-200 p-2 hover:scale-125 active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              title="Delete habit"
            >
              {isDeleting === habit.id ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <Trash2 size={24} />
              )}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 sm:gap-3">
          {currentWeek.map((day, idx) => {
            const dateStr = `${day.getFullYear()}-${String(
              day.getMonth() + 1
            ).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
            const key = `${habit.id}-${dateStr}`;
            const shouldShow = shouldShowHabit(habit, day);
            const value = completions.get(key) || 0;
            const dailyGoal = habit.dailyGoal || 1;
            const isCompleted = shouldShow && value >= dailyGoal;
            const isToday = day.toDateString() === new Date().toDateString();
            const isFutureDay = day > new Date();
            const isEnabled = shouldEnableDay(habit, day);
            const isDisabled = isFutureDay || !isEnabled;
            const shouldAnimate = animatingDay === key;

            const isPastCompletedDay = isCompleted && isDisabled && !isFutureDay;

            // Calculate fill percentage for partial completion
            const fillPercentage = Math.min((value / dailyGoal) * 100, 100);

            return (
              <button
                key={idx}
                onClick={() => {
                  if (!isDisabled) {
                    setAnimatingDay(key);
                    setTimeout(() => setAnimatingDay(null), 600);
                    handleToggle(habit.id, day);
                  }
                }}
                disabled={isDisabled}
                className={`aspect-[4/4] rounded-lg flex flex-col items-center justify-center transition-all duration-300 ease-out transform relative overflow-hidden ${
                  !isDisabled ? "hover:scale-110 active:scale-95" : ""
                } ${
                  isCompleted
                    ? shouldAnimate
                      ? "animate-smoothCheck"
                      : ""
                    : "bg-white/10 text-white/40 hover:bg-white/20"
                } ${isToday && !isCompleted ? "ring-2 ring-white/60" : ""} ${
                  isDisabled && !isPastCompletedDay
                    ? "opacity-30 cursor-not-allowed"
                    : ""
                } ${isPastCompletedDay ? "opacity-60 cursor-not-allowed" : ""}`}
                style={
                  isCompleted
                    ? {
                        backgroundColor: habit.color,
                        color:
                          habit.color === "#ffffff" || habit.color === "#eab308"
                            ? "#000000"
                            : "#ffffff",
                        boxShadow: `0 4px 14px 0 ${habit.color}80`,
                      }
                    : {}
                }
              >
                {/* Background Fill for Partial Completion */}
                {!isCompleted && (
                  <div
                    className="absolute bottom-0 left-0 right-0 transition-all duration-500 ease-out"
                    style={{
                      height: `${fillPercentage}%`,
                      backgroundColor: habit.color,
                      opacity: 0.5,
                    }}
                  />
                )}

                <div className="text-[0.75rem] sm:text-sm font-bold mt-1 z-10">
                  {day
                    .toLocaleDateString("en", { weekday: "short" })
                    .toUpperCase()}
                </div>
                <div className="text-xl sm:text-2xl font-bold z-10">
                  {day.getDate()}
                </div>
              </button>
            );
          })}
        </div>
        </div>
      </motion.div>
    </div>
  );
}
