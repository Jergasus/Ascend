"use client";

import { useState, useEffect } from "react";
import { useHabits } from "@/contexts/HabitsContext";
import { useToast } from "@/contexts/ToastContext";
import { shouldShowHabitToday } from "@/lib/habitFrequency";
import {
  X,
  BarChart3,
  Filter,
  Eye,
  Calendar,
  Check,
} from "lucide-react";
import EditHabitModal from "./EditHabitModal";
import Statistics from "../stats/Statistics";
import FilterModal from "./FilterModal";
import AllHabitsViewModal from "./AllHabitsViewModal";
import CalendarViewModal from "../stats/CalendarViewModal";
import CelebrationAnimation from "../ui/CelebrationAnimation";
import SortableHabitItem from "./SortableHabitItem";
import SkeletonHabitCard from "./SkeletonHabitCard";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  toggleCompletion as toggleCompletionAction,
  updateHabit as updateHabitAction,
  deleteHabit as deleteHabitAction,
  reorderHabits as reorderHabitsAction,
} from "@/lib/actions";
import { scheduleHabitNotification, cancelHabitNotification, cancelNotificationForDate, requestNotificationPermissions } from "@/lib/notifications";
import type { Frequency } from "@/types";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface CheckHabitsModalProps {
  onClose: () => void;
  isClosing: boolean;
  embedded?: boolean;
  resetSignal?: number;
}

export default function CheckHabitsModal({
  onClose,
  isClosing,
  embedded = false,
  resetSignal,
}: CheckHabitsModalProps) {
  const {
    habits,
    completions,
    toggleCompletionLocal,
    removeHabit,
    updateHabitLocal,
    isLoading,
    isDeleting,
    isUpdating,
    setIsDeleting,
    setIsUpdating,
    refreshData,
    reorderHabitsLocal,
  } = useHabits();
  const { showToast } = useToast();
  const [editingHabit, setEditingHabit] = useState<{
    id: number;
    name: string;
    color: string;
    category: string;
    frequency: "DAILY" | "EVERY_TWO_DAYS" | "WEEKENDS" | "CUSTOM";
    customDays?: string | null;
    notificationTime?: string | null;
  } | null>(null);
  const [isClosingEdit, setIsClosingEdit] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [isClosingStats, setIsClosingStats] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [isClosingFilter, setIsClosingFilter] = useState(false);
  const [showAllHabits, setShowAllHabits] = useState(false);
  const [isClosingAllHabits, setIsClosingAllHabits] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isClosingCalendar, setIsClosingCalendar] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set()
  );
  const [showCelebration, setShowCelebration] = useState(false);
  const { t } = useLanguage();

  const [previousProgress, setPreviousProgress] = useState<number | null>(null);

  // Reset view when resetSignal changes
  useEffect(() => {
    if (resetSignal) {
      setShowStats(false);
      setShowFilter(false);
      setShowAllHabits(false);
      setShowCalendar(false);
      // Reset closing states
      setIsClosingStats(false);
      setIsClosingFilter(false);
      setIsClosingAllHabits(false);
      setIsClosingCalendar(false);
    }
  }, [resetSignal]);

  // Get the current week (Monday to Sunday)
  const getCurrentWeek = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Adjust so the week starts on Monday
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;

    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);

    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      week.push(day);
    }

    return week;
  };

  const currentWeek = getCurrentWeek();

  // --- FIX: Calculate progress using LOCAL date ---
  const todayDate = new Date();
  const todayYear = todayDate.getFullYear();
  const todayMonth = String(todayDate.getMonth() + 1).padStart(2, "0");
  const todayDay = String(todayDate.getDate()).padStart(2, "0");
  const todayStr = `${todayYear}-${todayMonth}-${todayDay}`;

  // Get unique categories
  const allCategories = Array.from(new Set(habits.map((h) => h.category)))
    .filter(Boolean)
    .sort();

  // Filter habits by selected categories, today's frequency, and sort
  const filteredHabits = (
    selectedCategories.size === 0
      ? habits
      : habits.filter((h) => selectedCategories.has(h.category))
  )
    .filter((h) => shouldShowHabitToday(h))
    .sort((a, b) => {
      // Check completion status
      const keyA = `${a.id}-${todayStr}`;
      const valA = completions.get(keyA) || 0;
      const isACompleted = valA >= (a.dailyGoal || 1);

      const keyB = `${b.id}-${todayStr}`;
      const valB = completions.get(keyB) || 0;
      const isBCompleted = valB >= (b.dailyGoal || 1);

      // 1. Sort by completion (uncompleted first)
      if (isACompleted !== isBCompleted) {
        return isACompleted ? 1 : -1;
      }

      // 2. Sort by manual order
      return (a.order || 0) - (b.order || 0);
    });

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = habits.findIndex((h) => h.id === active.id);
      const newIndex = habits.findIndex((h) => h.id === over.id);

      // Update order locally immediately (optimistic update)
      const reordered = arrayMove(habits, oldIndex, newIndex).map(
        (h, index) => ({
          ...h,
          order: index,
        })
      );

      reorderHabitsLocal(reordered);

      // Update order in background via server action
      const result = await reorderHabitsAction(
        reordered.map((h, index) => ({ id: h.id, order: index }))
      );
      
      if (!result.success) {
        // If it fails, refresh from server
        refreshData();
      }
    }
  };

  const handleToggleCategory = (category: string) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(category)) {
      newSelected.delete(category);
    } else {
      newSelected.add(category);
    }
    setSelectedCategories(newSelected);
  };

  const handleClearFilters = () => {
    setSelectedCategories(new Set());
  };

  const handleCloseFilterModal = () => {
    setIsClosingFilter(true);
    setTimeout(() => {
      setShowFilter(false);
      setIsClosingFilter(false);
    }, 200);
  };

  const visibleHabits = habits;

  const allHabitsToday = visibleHabits.filter((h) =>
    shouldShowHabitToday(h)
  );
  const totalHabitsToday = allHabitsToday.length;

  const completedHabitsToday = allHabitsToday.filter((habit) => {
    const key = `${habit.id}-${todayStr}`;
    const value = completions.get(key) || 0;
    return value >= (habit.dailyGoal || 1);
  }).length;

  const progressPercentage =
    totalHabitsToday > 0 ? (completedHabitsToday / totalHabitsToday) * 100 : 0;
  const formattedPercentage = progressPercentage.toFixed(1);

  // Detect when all of today's habits are completed
  useEffect(() => {
    // If it's the first time calculating progress, just save it without showing celebration
    if (previousProgress === null) {
      setPreviousProgress(progressPercentage);
      return;
    }

    // Only show celebration if we went from <100 to 100
    if (
      progressPercentage === 100 &&
      previousProgress < 100 &&
      totalHabitsToday > 0
    ) {
      setShowCelebration(true);
    }

    setPreviousProgress(progressPercentage);
  }, [progressPercentage, totalHabitsToday]);

  const handleToggle = async (habitId: number, date: Date) => {
    // Generate dateStr using local date (not UTC)
    const dateStr = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    const habit = habits.find((h) => h.id === habitId);
    const dailyGoal = habit?.dailyGoal || 1;

    // Optimistic UI update
    toggleCompletionLocal(habitId, dateStr, dailyGoal);

    // Call server action
    const result = await toggleCompletionAction(habitId, dateStr);
    
    if (!result.success) {
      // Revert the change if it fails
      // Note: Reverting logic is complex with increments, might need a better strategy or just refresh
      refreshData();
      showToast(t.couldNotUpdate, "error");
    } else {
      // Handle notification cancellation/rescheduling
      if (habit && habit.notificationTime) {
        if (result.data.completed) {
          // If completed, cancel notification for this date
          await cancelNotificationForDate(habitId, date);
        } else {
          // If not completed (e.g. untoggled), ensure notifications are scheduled
          // This will reschedule all future notifications including today if applicable
          await scheduleHabitNotification(habit, t, completions);
        }
      }
    }
  };

  const handleEditHabit = async (
    id: number,
    name: string,
    color: string,
    category: string,
    frequency: Frequency,
    customDays?: string | null,
    notificationTime?: string | null,
    dailyGoal?: number
  ) => {
    setIsUpdating(id);
    try {
      const result = await updateHabitAction({
        id,
        name,
        color,
        category,
        frequency,
        customDays,
        notificationTime,
        dailyGoal,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      // Handle notifications
      if (result.data.notificationTime) {
        const hasPermission = await requestNotificationPermissions();
        if (hasPermission) {
          await scheduleHabitNotification(result.data, t, completions);

          // Check if completed today to avoid rescheduling notification for today
          const today = new Date();
          const year = today.getFullYear();
          const month = String(today.getMonth() + 1).padStart(2, "0");
          const day = String(today.getDate()).padStart(2, "0");
          const key = `${id}-${year}-${month}-${day}`;
          
          const currentVal = completions.get(key) || 0;
          const goal = result.data.dailyGoal || 1;
          
          if (currentVal >= goal) {
             await cancelNotificationForDate(id, today);
          }
        }
      } else {
        await cancelHabitNotification(id);
      }

      updateHabitLocal(id, name, color, category, frequency, customDays, notificationTime, dailyGoal);
      showToast(`"${name}" ${t.habitEditedSuccess}`, "success");
    } catch (error) {
      showToast(t.errorEditingHabit, "error");
    } finally {
      setIsUpdating(null);
    }
  };

  const handleCloseEditModal = () => {
    setIsClosingEdit(true);
    setTimeout(() => {
      setEditingHabit(null);
      setIsClosingEdit(false);
    }, 200);
  };

  const handleCloseStatsModal = () => {
    setIsClosingStats(true);
    setTimeout(() => {
      setShowStats(false);
      setIsClosingStats(false);
    }, 400);
  };

  const handleCloseAllHabitsModal = () => {
    setIsClosingAllHabits(true);
    setTimeout(() => {
      setShowAllHabits(false);
      setIsClosingAllHabits(false);
    }, 200);
  };

  const handleCloseCalendarModal = () => {
    setIsClosingCalendar(true);
    setTimeout(() => {
      setShowCalendar(false);
      setIsClosingCalendar(false);
    }, 400);
  };

  const handleDeleteHabit = async (habitId: number, habitName: string) => {
    if (
      !confirm(
        `${t.confirmDeleteHabit} "${habitName}"?`
      )
    ) {
      return;
    }

    setIsDeleting(habitId);
    try {
      const result = await deleteHabitAction(habitId);

      if (!result.success) {
        throw new Error(result.error);
      }

      await cancelHabitNotification(habitId);
      removeHabit(habitId);
      showToast(`"${habitName}" ${t.habitDeletedSuccess}`, "success");
    } catch (error) {
      showToast(t.errorDeletingHabit, "error");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <>
      <div
        className={
          embedded
            ? "w-full h-full flex flex-col relative pt-3"
            : `fixed inset-0 z-50 flex items-center justify-center sm:p-4 bg-black/70 backdrop-blur-sm pt-10 sm:pt-0 ${
                isClosing ? "animate-fadeOut" : "animate-fadeIn"
              }`
        }
        onClick={(e) => {
          if (!embedded) {
            e.stopPropagation();
            onClose();
          }
        }}
      >
        <div
          className={
            embedded
              ? "flex flex-col w-full h-full" // Full screen, no borders
              : `bg-[#0f0f0f] border-2 border-white/20 rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[85vh] pt-10 sm:pt-0 ${
                  isClosing ? "animate-scaleOut" : "animate-scaleIn"
                }`
          }
          onClick={(e) => e.stopPropagation()}
        >
          {/* Main content with fade transition */}
          <div
            className={`flex flex-col h-full transition-opacity duration-300 ease-in-out ${
              showStats || showCalendar || showFilter || showAllHabits
                ? "opacity-0 pointer-events-none"
                : "opacity-100"
            }`}
          >
            {/* Header */}
            <div
              className={`flex flex-col sm:flex-row items-center justify-between px-6 pb-6 pt-0 ${
                embedded ? "pt-0 pb-4" : "border-b border-white/10"
              } gap-4 sm:gap-0`}
            >
              <div className="flex items-center justify-between w-full sm:w-auto">
                <div className="flex items-center gap-3">
                  <Check className="text-white" size={embedded ? 32 : 28} />
                  <h2
                    className={`${
                      embedded ? "text-3xl" : "text-2xl"
                    } font-bold text-white`}
                  >
                    {t.todaysHabits}
                  </h2>
                </div>
                {!embedded && (
                  <button
                    onClick={onClose}
                    className="text-white/60 hover:text-white transition-all hover:rotate-90 duration-300 p-1 sm:hidden"
                  >
                    <X size={28} />
                  </button>
                )}
              </div>

              {/* Controls & Progress */}
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
                {/* Daily Progress Indicator */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-white/80 font-semibold min-w-[2.5rem] text-right">
                    {completedHabitsToday}/{totalHabitsToday}
                  </span>
                  <div className="w-12 sm:w-24 h-2 bg-white/10 rounded-full overflow-hidden flex-shrink-0">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <span className="text-white/60 font-semibold min-w-[2.75rem] text-right">
                    {formattedPercentage}%
                  </span>
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={() => setShowCalendar(true)}
                    className="text-purple-400 hover:text-purple-300 transition-all duration-200 hover:scale-125 active:scale-90 p-2"
                    title={t.calendarView}
                  >
                    <Calendar size={20} />
                  </button>
                  <button
                    onClick={() => setShowAllHabits(true)}
                    className="text-blue-400 hover:text-blue-300 transition-all duration-200 hover:scale-125 active:scale-90 p-2"
                    title={t.viewAllHabits}
                  >
                    <Eye size={20} />
                  </button>
                  <button
                    onClick={() => setShowFilter(true)}
                    className={`transition-all duration-200 hover:scale-125 active:scale-90 p-2 relative ${
                      selectedCategories.size > 0
                        ? "text-yellow-400 hover:text-yellow-300"
                        : "text-white/60 hover:text-white"
                    }`}
                    title={t.filterByCategories}
                  >
                    <Filter size={20} />
                    {selectedCategories.size > 0 && (
                      <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold animate-popIn leading-none">
                        {selectedCategories.size}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setShowStats(true)}
                    className="text-green-400 hover:text-green-300 transition-all duration-200 hover:scale-125 active:scale-90 p-2"
                    title={t.viewStatistics}
                  >
                    <BarChart3 size={20} />
                  </button>
                  {!embedded && (
                    <button
                      onClick={onClose}
                      className="text-white/60 hover:text-white transition-all duration-200 hover:rotate-90 active:scale-90 hidden sm:block"
                    >
                      <X size={28} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="overflow-y-auto px-4 sm:px-8 py-4 pb-30 sm:py-6 flex-1 scrollbar-hide">
              {isLoading ? (
                <div className="space-y-4">
                  <SkeletonHabitCard />
                  <SkeletonHabitCard />
                  <SkeletonHabitCard />
                </div>
              ) : habits.length === 0 ? (
                <div className="text-white/60 text-center py-8">
                  {t.noHabits}
                </div>
              ) : filteredHabits.length === 0 ? (
                <div className="text-white/60 text-center py-8">
                  {t.noHabitsInCategory}
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={filteredHabits.map((h) => h.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-4">
                      {filteredHabits.map((habit) => (
                          <SortableHabitItem
                            key={habit.id}
                            habit={habit}
                            currentWeek={currentWeek}
                            completions={completions}
                            handleToggle={handleToggle}
                            setEditingHabit={setEditingHabit}
                            handleDeleteHabit={handleDeleteHabit}
                            isDeleting={isDeleting}
                            isUpdating={isUpdating}
                          />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </div>
        </div>

        {/* Edit modal */}
        {editingHabit && (
          <EditHabitModal
            habit={editingHabit}
            allHabits={habits}
            onClose={handleCloseEditModal}
            onSave={handleEditHabit}
            isClosing={isClosingEdit}
          />
        )}

        {/* Statistics modal */}
        {showStats && (
          <Statistics
            onClose={handleCloseStatsModal}
            isClosing={isClosingStats}
          />
        )}

        {/* All habits modal */}
        {showAllHabits && (
          <AllHabitsViewModal
            onClose={handleCloseAllHabitsModal}
            isClosing={isClosingAllHabits}
          />
        )}

        {/* Calendar modal */}
        {showCalendar && (
          <CalendarViewModal
            onClose={handleCloseCalendarModal}
            isClosing={isClosingCalendar}
          />
        )}

        {/* Filter modal */}
        {showFilter && (
          <FilterModal
            categories={allCategories}
            selectedCategories={selectedCategories}
            onToggleCategory={handleToggleCategory}
            onClearFilters={handleClearFilters}
            onClose={handleCloseFilterModal}
            isClosing={isClosingFilter}
          />
        )}

        {/* Celebration animation */}
        {showCelebration && (
          <CelebrationAnimation onComplete={() => setShowCelebration(false)} />
        )}
      </div>
    </>
  );
}
