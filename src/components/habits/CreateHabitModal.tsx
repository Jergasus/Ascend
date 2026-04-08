"use client";

import { useState, useEffect } from "react";
import { Ban } from "lucide-react";
import HabitFormModal from "./HabitFormModal";
import { useToast } from "@/contexts/ToastContext";
import { useHabits } from "@/contexts/HabitsContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { createHabit } from "@/lib/actions";
import { scheduleHabitNotification, requestNotificationPermissions } from "@/lib/notifications";
import type { Frequency } from "@/types";

interface CreateHabitModalProps {
  onClose: () => void;
  isClosing: boolean;
}

export default function CreateHabitModal({
  onClose,
  isClosing,
}: CreateHabitModalProps) {
  const { showToast } = useToast();
  const { addHabit, habits } = useHabits();
  const { t } = useLanguage();

  // Error de duplicado
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [isClosingError, setIsClosingError] = useState(false);

  useEffect(() => {
    if (duplicateError) {
      const timer = setTimeout(() => {
        setIsClosingError(true);
        setTimeout(() => {
          setDuplicateError(null);
          setIsClosingError(false);
        }, 300); // Wait for animation
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [duplicateError]);

  const handleSubmit = async (data: {
    name: string;
    color: string;
    category: string;
    frequency: Frequency;
    customDays: string | null;
    notificationTime: string | null;
    dailyGoal: number;
  }) => {
    // Reset error
    setDuplicateError(null);

    try {
      if (data.frequency === "CUSTOM" && !data.customDays) {
        showToast(
          t.selectAtLeastOneDay,
          "error"
        );
        throw new Error("No days selected");
      }

      const result = await createHabit({
        name: data.name,
        color: data.color,
        category: data.category,
        frequency: data.frequency,
        customDays: data.customDays,
        notificationTime: data.notificationTime,
        dailyGoal: data.dailyGoal,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      // Schedule notification if needed
      if (result.data.notificationTime) {
        const hasPermission = await requestNotificationPermissions();
        if (hasPermission) {
          await scheduleHabitNotification(result.data, t);
        }
      }

      addHabit(result.data);
      showToast(`"${data.name}" ${t.habitCreatedSuccess}`, "success");
      onClose();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      // Check if it's a duplicate name error
      if (
        errorMessage === "Habit name already exists" ||
        errorMessage.includes("already exists")
      ) {
        setDuplicateError(t.habitNameExists);
      } else {
        showToast(t.errorCreatingHabit, "error");
      }
      // Re-throw error to prevent HabitFormModal from closing
      throw error;
    }
  };

  return (
    <>
      <HabitFormModal
        key="form"
        mode="create"
        onClose={onClose}
        isClosing={isClosing}
        onSubmit={handleSubmit}
        existingCategories={Array.from(
          new Set(habits.map((h) => h.category))
        ).filter(Boolean)}
        mobileFullScreen={true}
      />

      {/* Duplicate Error Overlay (Mobile) */}
      {duplicateError && (
        <div
          key="error-overlay"
          className="fixed inset-0 z-[70] flex items-center justify-center pointer-events-none px-4"
        >
          <div
            className={`bg-black/80 backdrop-blur-md border-2 border-red-500/30 text-white px-6 py-6 rounded-2xl shadow-2xl flex flex-col items-center gap-3 ${
              isClosingError ? "animate-bounceOut" : "animate-bounceIn"
            }`}
          >
            <div className="bg-red-500/20 p-3 rounded-full">
              <Ban size={32} className="text-red-500" />
            </div>
            <span className="text-lg font-semibold text-center">
              {duplicateError}
            </span>
          </div>
        </div>
      )}

    </>
  );
}
