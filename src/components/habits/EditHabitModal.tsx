"use client";

import HabitFormModal, { HabitFormData } from "./HabitFormModal";
import { useToast } from "@/contexts/ToastContext";
import type { Frequency } from "@/types";

interface EditHabitModalProps {
  habit: {
    id: number;
    name: string;
    color: string;
    category: string;
    frequency: Frequency;
    customDays?: string | null;
    notificationTime?: string | null;
    dailyGoal?: number;
  };
  allHabits: Array<{ category: string }>;
  onClose: () => void;
  onSave: (
    id: number,
    name: string,
    color: string,
    category: string,
    frequency: Frequency,
    customDays?: string | null,
    notificationTime?: string | null,
    dailyGoal?: number
  ) => void;
  isClosing: boolean;
}

export default function EditHabitModal({
  habit,
  allHabits,
  onClose,
  onSave,
  isClosing,
}: EditHabitModalProps) {
  const { showToast } = useToast();

  // Get unique categories from existing habits
  const existingCategories = Array.from(
    new Set(allHabits.map((h) => h.category))
  ).filter(Boolean);

  // Prepare initial data for the form
  const initialData: HabitFormData = {
    name: habit.name,
    category: habit.category,
    frequency: habit.frequency,
    customDays: habit.customDays ?? null,
    notificationTime: habit.notificationTime ?? null,
    color: habit.color,
    dailyGoal: habit.dailyGoal || 1,
  };

  const handleSubmit = async (data: HabitFormData) => {
    // Validate that if CUSTOM, at least one day is selected
    if (data.frequency === "CUSTOM" && !data.customDays) {
      showToast("Please select at least one day for custom frequency", "error");
      throw new Error("No days selected");
    }

    await onSave(
      habit.id,
      data.name,
      data.color,
      data.category,
      data.frequency,
      data.customDays || null,
      data.notificationTime || null,
      data.dailyGoal
    );
  };

  return (
    <HabitFormModal
      mode="edit"
      onClose={onClose}
      isClosing={isClosing}
      onSubmit={handleSubmit}
      initialData={initialData}
      existingCategories={existingCategories}
      mobileFullScreen={true}
    />
  );
}
