"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Loader2, Plus, Edit2, ChevronDown } from "lucide-react";
import { customDaysToString, stringToCustomDays } from "@/lib/habitFrequency";
import ColorPickerModal from "../settings/ColorPickerModal";
import { useLanguage } from "@/contexts/LanguageContext";

interface HabitFormModalProps {
  mode: "create" | "edit";
  onClose: () => void;
  isClosing: boolean;
  onSubmit: (data: HabitFormData) => Promise<void>;
  initialData?: {
    name: string;
    color: string;
    category: string;
    frequency: "DAILY" | "EVERY_TWO_DAYS" | "WEEKENDS" | "CUSTOM";
    customDays?: string | null;
    notificationTime?: string | null;
    dailyGoal?: number;
  };
  existingCategories: string[];
  mobileFullScreen?: boolean;
}

export interface HabitFormData {
  name: string;
  color: string;
  category: string;
  frequency: "DAILY" | "EVERY_TWO_DAYS" | "WEEKENDS" | "CUSTOM";
  customDays: string | null;
  notificationTime: string | null;
  dailyGoal: number;
}

const COLORS = [
  { name: "White", value: "#ffffff" },
  { name: "Red", value: "#ef4444" },
  { name: "Orange", value: "#f97316" },
  { name: "Yellow", value: "#eab308" },
  { name: "Green", value: "#22c55e" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Purple", value: "#a855f7" },
  // Pink removed, replaced by Custom
];

const DAYS = [
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
  { label: "Sun", value: 0 },
];

export default function HabitFormModal({
  mode,
  onClose,
  isClosing,
  onSubmit,
  initialData,
  existingCategories,
  mobileFullScreen = false,
}: HabitFormModalProps) {
  const { t } = useLanguage();
  const timeInputRef = useRef<HTMLInputElement>(null);
  const [habitName, setHabitName] = useState(initialData?.name || "");
  const [selectedColor, setSelectedColor] = useState(
    initialData?.color || "#ffffff"
  );
  const [categoryInput, setCategoryInput] = useState(
    initialData?.category || ""
  );
  const [showCategoryList, setShowCategoryList] = useState(false);
  const [isClosingList, setIsClosingList] = useState(false);
  const [frequency, setFrequency] = useState<
    "DAILY" | "EVERY_TWO_DAYS" | "WEEKENDS" | "CUSTOM"
  >(initialData?.frequency || "DAILY");
  const [selectedDays, setSelectedDays] = useState<number[]>(
    stringToCustomDays(initialData?.customDays)
  );
  const [dailyGoal, setDailyGoal] = useState<number>(
    initialData?.dailyGoal || 1
  );
  
  const [notificationTimes, setNotificationTimes] = useState<string[]>(() => {
    const times = initialData?.notificationTime ? initialData.notificationTime.split(",") : [];
    return times.length > 0 ? times : [""];
  });

  const handleDailyGoalChange = (newGoal: number) => {
    setDailyGoal(newGoal);
  };

  const handleAddReminder = () => {
    setNotificationTimes((prev) => [...prev, ""]);
  };

  const handleRemoveReminder = (index: number) => {
    setNotificationTimes((prev) => {
      if (prev.length === 1) {
        return [""];
      }
      const newTimes = [...prev];
      newTimes.splice(index, 1);
      return newTimes;
    });
  };

  const handleTimeChange = (index: number, value: string) => {
    setNotificationTimes((prev) => {
      const newTimes = [...prev];
      newTimes[index] = value;
      return newTimes;
    });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Color Picker State
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isClosingColorPicker, setIsClosingColorPicker] = useState(false);

  const handleDayToggle = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!habitName.trim()) return;

    const finalCategory = categoryInput.trim() || "General";
    const customDays =
      frequency === "CUSTOM" ? customDaysToString(selectedDays) : null;

    const finalNotificationTime = notificationTimes.filter((t) => t).join(",");

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: habitName.trim(),
        color: selectedColor,
        category: finalCategory,
        frequency,
        customDays,
        notificationTime: finalNotificationTime || null,
        dailyGoal: dailyGoal,
      });
      onClose();
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseColorPicker = () => {
    setIsClosingColorPicker(true);
    setTimeout(() => {
      setShowColorPicker(false);
      setIsClosingColorPicker(false);
    }, 200);
  };


  return (
    <div
      className={
        mobileFullScreen
          ? "fixed inset-0 z-[70] flex flex-col bg-black/40 backdrop-blur-md pt-10"
          : `fixed inset-0 z-[70] flex items-start pt-14 sm:items-center sm:pt-0 justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm ${
              isClosing ? "animate-fadeOut" : "animate-fadeIn"
            }`
      }
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className={
          mobileFullScreen
            ? `flex flex-col w-full h-full justify-start pt-7 sm:bg-[#0f0f0f] sm:border-2 sm:border-white/30 sm:rounded-3xl sm:p-8 sm:max-w-md sm:shadow-2xl sm:h-auto ${
                isClosing ? "animate-scaleOut" : "animate-fadeIn"
              }`
            : `bg-[#0f0f0f] border-2 border-white/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col max-h-[85vh] ${
                isClosing ? "animate-scaleOut" : "animate-scaleIn"
              }`
        }
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between mb-4 sm:mb-6 ${
            mobileFullScreen ? "px-6 pb-6 pt-0 sm:p-0" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            {mode === "create" ? (
              <Plus className="text-white" size={mobileFullScreen ? 32 : 28} />
            ) : (
              <Edit2 className="text-white" size={mobileFullScreen ? 32 : 28} />
            )}
            <h2
              className={`${
                mobileFullScreen ? "text-3xl" : "text-2xl"
              } font-bold text-white`}
            >
              {mode === "create" ? t.createHabit : t.editHabit}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-all hover:rotate-90 duration-300"
          >
            <X size={28} />
          </button>
        </div>

        {/* Formulario - Scrollable on mobile */}
        <div
          className={`overflow-y-auto ${
            mobileFullScreen
              ? "px-6 pb-6 sm:p-0 flex flex-col justify-start min-h-0"
              : "flex-1"
          }`}
        >
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-white/80 mb-2 font-medium">
                {t.habitName}
              </label>
              <input
                type="text"
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
                placeholder={t.habitPlaceholder}
                className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/50 transition-all"
                autoFocus
                required
              />
            </div>

            <div className="relative">
              <label className="block text-white/80 mb-2 font-medium">
                {t.category}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={categoryInput}
                  onChange={(e) => {
                    setCategoryInput(e.target.value);
                    setShowCategoryList(false);
                  }}
                  onFocus={() => setShowCategoryList(false)}
                  placeholder={t.categoryPlaceholder}
                  className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/50 transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (showCategoryList) {
                      setIsClosingList(true);
                      setTimeout(() => {
                        setShowCategoryList(false);
                        setIsClosingList(false);
                      }, 400);
                    } else {
                      setShowCategoryList(true);
                      setIsClosingList(false);
                    }
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white transition-colors"
                >
                  <ChevronDown
                    size={20}
                    className={`transition-transform duration-200 ${
                      showCategoryList ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown List */}
                {showCategoryList && existingCategories.length > 0 && (
                  <div
                    className={`absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/20 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto ${
                      isClosingList ? "animate-bounceOut" : "animate-bounceIn"
                    }`}
                  >
                    {existingCategories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => {
                          setCategoryInput(category);
                          setIsClosingList(true);
                          setTimeout(() => {
                            setShowCategoryList(false);
                            setIsClosingList(false);
                          }, 400);
                        }}
                        className="w-full text-left px-4 py-3 text-white/80 hover:bg-white/10 hover:text-white transition-colors border-b border-white/5 last:border-0"
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-white/40 text-xs mt-1">{t.categoryDefault}</p>
            </div>

            <div>
              <label className="block text-white/80 mb-3 font-medium">
                {t.frequency}
              </label>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setFrequency("DAILY")}
                  className={`py-3 px-4 rounded-xl font-medium transition-all ${
                    frequency === "DAILY"
                      ? "bg-white text-black"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {t.everyDay}
                </button>
                <button
                  type="button"
                  onClick={() => setFrequency("EVERY_TWO_DAYS")}
                  className={`py-3 px-4 rounded-xl font-medium transition-all ${
                    frequency === "EVERY_TWO_DAYS"
                      ? "bg-white text-black"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {t.everyTwoDays}
                </button>
                <button
                  type="button"
                  onClick={() => setFrequency("WEEKENDS")}
                  className={`py-3 px-4 rounded-xl font-medium transition-all ${
                    frequency === "WEEKENDS"
                      ? "bg-white text-black"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {t.weekends}
                </button>
                <button
                  type="button"
                  onClick={() => setFrequency("CUSTOM")}
                  className={`py-3 px-4 rounded-xl font-medium transition-all ${
                    frequency === "CUSTOM"
                      ? "bg-white text-black"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {t.custom}
                </button>
              </div>

              {frequency === "CUSTOM" && (
                <div className="grid grid-cols-7 gap-2">
                  {DAYS.map((day) => (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => handleDayToggle(day.value)}
                      className={`py-2 px-1 rounded-lg text-xs font-semibold transition-all ${
                        selectedDays.includes(day.value)
                          ? "bg-white text-black"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-white/80 mb-2 font-medium">
                  {t.dailyGoal || "Repetitions"}
                </label>
                <div className="relative w-full bg-white/10 border border-white/30 rounded-xl focus-within:border-white/50 transition-all">
                  <div className="px-4 py-3">
                    <select
                      value={dailyGoal}
                      onChange={(e) => handleDailyGoalChange(parseInt(e.target.value))}
                      className="w-full bg-transparent focus:outline-none text-white appearance-none"
                      required
                    >
                      {Array.from({ length: 10 }, (_, i) => i + 1).map(
                        (num) => (
                          <option
                            key={num}
                            value={num}
                            className="bg-[#0f0f0f] text-white"
                          >
                            {num}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/60">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-white/80 font-medium">
                    {t.time || "Reminders"}
                  </label>
                  <button
                    type="button"
                    onClick={handleAddReminder}
                    className="p-1 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                    title="Add reminder"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {notificationTimes.map((time, index) => (
                    <div
                      key={index}
                      className="relative w-full bg-white/10 border border-white/30 rounded-xl focus-within:border-white/50 transition-all"
                    >
                      <div className="px-4 py-3">
                        <input
                          type="text"
                          value={time}
                          readOnly
                          placeholder="--:--"
                          className="w-full bg-transparent focus:outline-none placeholder-gray-400 text-white pointer-events-none pr-8"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveReminder(index);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-white/60 hover:text-white transition-colors z-20"
                      >
                        <X size={16} />
                      </button>
                      <input
                        type="time"
                        value={time}
                        onChange={(e) =>
                          handleTimeChange(index, e.target.value)
                        }
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        style={{ zIndex: 10 }}
                        onClick={(e) =>
                          (e.target as HTMLInputElement).showPicker?.()
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-white/80 mb-3 font-medium">
                {t.habitColor}
              </label>
              <div className="grid grid-cols-4 gap-3">
                {COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setSelectedColor(color.value)}
                    className={`relative h-12 rounded-xl transition-all duration-200 transform active:scale-95 ${
                      selectedColor === color.value
                        ? "ring-2 ring-white scale-105"
                        : "ring-1 ring-white/10 hover:ring-white/30"
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  >
                    {selectedColor === color.value && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className="text-2xl font-bold"
                          style={{
                            color:
                              color.value === "#ffffff" ? "#000000" : "#ffffff",
                          }}
                        >
                          ✓
                        </div>
                      </div>
                    )}
                  </button>
                ))}

                {/* Custom Color Button (Rainbow) */}
                <button
                  type="button"
                  onClick={() => setShowColorPicker(true)}
                  className={`relative h-12 rounded-xl transition-all duration-200 transform active:scale-95 overflow-hidden ${
                    !COLORS.some((c) => c.value === selectedColor)
                      ? "ring-2 ring-white scale-105"
                      : "ring-1 ring-white/10 hover:ring-white/30"
                  }`}
                  style={{
                    background:
                      "conic-gradient(from 0deg, red, orange, yellow, green, blue, indigo, violet, red)",
                  }}
                  title="Custom Color"
                >
                  {!COLORS.some((c) => c.value === selectedColor) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="text-2xl font-bold text-white">✓</div>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {mode === "create" ? (
              <button
                type="submit"
                disabled={isSubmitting || !habitName.trim()}
                className="w-full bg-white hover:bg-gray-200 disabled:bg-gray-600 text-black font-bold py-4 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed text-lg flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 size={20} className="animate-spin" />}
                {isSubmitting ? t.creatingHabit : t.createHabit}
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !habitName.trim()}
                  className="flex-1 bg-white hover:bg-gray-200 disabled:bg-gray-600 text-black font-bold py-4 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting && (
                    <Loader2 size={20} className="animate-spin" />
                  )}
                  {isSubmitting ? t.savingHabit : t.save}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Color Picker Modal */}
      {showColorPicker &&
        createPortal(
          <ColorPickerModal
            onClose={handleCloseColorPicker}
            isClosing={isClosingColorPicker}
            onColorSelect={(color) => {
              setSelectedColor(color);
              // Don't close immediately, let user see selection?
              // Or close? User didn't specify. Usually color pickers stay open or have "Done".
              // But our ColorPickerModal has a close button.
              // Let's keep it open until they close it.
            }}
            currentColor={selectedColor}
          />,
          document.body
        )}
    </div>
  );
}
