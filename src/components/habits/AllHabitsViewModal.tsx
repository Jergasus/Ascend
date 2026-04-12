"use client";

import { useState } from "react";
import { X, Edit2, Trash2, Loader2 } from "lucide-react";
import { useHabits } from "@/contexts/HabitsContext";
import { useToast } from "@/contexts/ToastContext";
import { useLanguage } from "@/contexts/LanguageContext";
import EditHabitModal from "./EditHabitModal";
import { updateHabit as updateHabitAction, deleteHabit as deleteHabitAction } from "@/lib/actions";
import { scheduleHabitNotification, cancelHabitNotification, requestNotificationPermissions } from "@/lib/notifications";
import type { Frequency } from "@/types";

interface AllHabitsViewModalProps {
  onClose: () => void;
  isClosing: boolean;
}

const getFrequencyLabel = (
  frequency: Frequency,
  customDays?: string | null,
  t?: any
) => {
  if (frequency === "DAILY") return t?.everyDay || "Every Day";
  if (frequency === "EVERY_TWO_DAYS") return t?.everyTwoDays || "Every 2 Days";
  if (frequency === "WEEKENDS") return t?.weekendsSatSun || "Weekends (Sat & Sun)";
  if (frequency === "CUSTOM" && customDays) {
    const days = customDays.split(",").map(Number);
    // Sort days so Monday (1) comes first and Sunday (0) comes last
    days.sort((a, b) => (a === 0 ? 7 : a) - (b === 0 ? 7 : b));
    const dayNames = [t?.sun || "Sun", t?.mon || "Mon", t?.tue || "Tue", t?.wed || "Wed", t?.thu || "Thu", t?.fri || "Fri", t?.sat || "Sat"];
    return days.map((d) => dayNames[d]).join(", ");
  }
  return t?.custom || "Custom";
};

export default function AllHabitsViewModal({
  onClose,
  isClosing,
}: AllHabitsViewModalProps) {
  const {
    habits,
    removeHabit,
    updateHabitLocal,
    isDeleting,
    isUpdating,
    setIsDeleting,
    setIsUpdating,
  } = useHabits();
  const { showToast } = useToast();
  const { t } = useLanguage();
  const [editingHabit, setEditingHabit] = useState<{
    id: number;
    name: string;
    color: string;
    category: string;
    frequency: Frequency;
    customDays?: string | null;
    notificationTime?: string | null;
  } | null>(null);
  const [isClosingEdit, setIsClosingEdit] = useState(false);

  const sortedAllHabits = [...habits].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );

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
          await scheduleHabitNotification(result.data, t);
        }
      } else {
        // If notificationTime is null, cancel existing notifications
        await cancelHabitNotification(id);
      }

      updateHabitLocal(id, name, color, category, frequency, customDays, notificationTime, dailyGoal);
      showToast(`"${name}" ${t.habitEditedSuccess}`, "success");
      handleCloseEditModal();
    } catch (error) {
      showToast(t.errorEditingHabit, "error");
    } finally {
      setIsUpdating(null);
    }
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

  const handleCloseEditModal = () => {
    setIsClosingEdit(true);
    setTimeout(() => {
      setEditingHabit(null);
      setIsClosingEdit(false);
    }, 200);
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] flex items-center justify-center sm:p-4 bg-black/40 backdrop-blur-md sm:bg-black/70 sm:backdrop-blur-sm pt-9 sm:pt-0 ${
          isClosing ? "animate-fadeOut" : "animate-fadeIn"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <div
          className={`w-full h-full sm:h-auto sm:bg-[#0f0f0f] sm:border-2 sm:border-white/30 sm:rounded-2xl sm:rounded-3xl p-4 pt-9 sm:p-8 max-w-2xl sm:shadow-2xl sm:max-h-[85vh] flex flex-col ${
            isClosing ? "animate-scaleOut" : "animate-scaleIn"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-3xl font-bold text-white">{t.allHabits}</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-all hover:rotate-90 duration-300"
          >
            <X size={28} />
          </button>
        </div>

        {/* Habits List */}
        <div className="overflow-y-auto flex-1 space-y-3 scrollbar-hide pb-0">
          {habits.length === 0 ? (
            <div className="text-center py-12 text-white/60">
              {t.noHabits}
            </div>
          ) : (
            sortedAllHabits.map((habit) => (
                <div
                  key={habit.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 transition-all relative"
                  style={{
                    borderLeftWidth: "4px",
                    borderLeftColor: habit.color,
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 min-w-0">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: habit.color }}
                        />
                        <h3
                          className="text-white font-semibold text-lg truncate"
                          title={habit.name}
                        >
                          {habit.name}
                        </h3>
                      </div>
                      <p className="text-white/60 text-sm mb-2">
                        {habit.category}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-white/80 text-sm font-medium">
                          {getFrequencyLabel(
                            habit.frequency,
                            habit.customDays,
                            t
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
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
                          })
                        }
                        disabled={
                          isUpdating === habit.id ||
                          isDeleting === habit.id
                        }
                        className="text-blue-400 hover:text-blue-300 transition-all duration-200 p-2 hover:scale-125 active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        title="Edit habit"
                      >
                        {isUpdating === habit.id ? (
                          <Loader2 size={20} className="animate-spin" />
                        ) : (
                          <Edit2 size={20} />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteHabit(habit.id, habit.name)}
                        disabled={
                          isDeleting === habit.id ||
                          isUpdating === habit.id
                        }
                        className="text-red-400 hover:text-red-300 transition-all duration-200 p-2 hover:scale-125 active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        title="Delete habit"
                      >
                        {isDeleting === habit.id ? (
                          <Loader2 size={20} className="animate-spin" />
                        ) : (
                          <Trash2 size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))

          )}
        </div>
      </div>
    </div>

      {/* Edit modal - rendered outside to have its own backdrop */}
      {editingHabit && (
        <EditHabitModal
          habit={editingHabit}
          allHabits={habits}
          onClose={handleCloseEditModal}
          onSave={handleEditHabit}
          isClosing={isClosingEdit}
        />
      )}

    </>
  );
}
