"use client";

import { useState, useEffect, useRef, useMemo, TouchEvent } from "react";
import { X, ChevronLeft } from "lucide-react";
import { useHabits } from "@/contexts/HabitsContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { shouldShowHabit } from "@/lib/habitFrequency";

interface CalendarViewModalProps {
  onClose: () => void;
  isClosing: boolean;
  embedded?: boolean;
}

interface DayHabit {
  id: number;
  name: string;
  color: string;
  completed: boolean;
  frequency: "DAILY" | "EVERY_TWO_DAYS" | "WEEKENDS" | "CUSTOM";
  customDays?: string | null;
}

const getFrequencyLabel = (
  frequency: "DAILY" | "EVERY_TWO_DAYS" | "WEEKENDS" | "CUSTOM",
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

export default function CalendarViewModal({
  onClose,
  isClosing,
  embedded = false,
}: CalendarViewModalProps) {
  const { habits, completions } = useHabits();
  const { t, language } = useLanguage();
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<"calendar" | "day">("calendar");
  const [visibleMonth, setVisibleMonth] = useState(new Date());
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Generate a range of months (e.g., 2 months back, 2 months forward)
  const months = useMemo(() => {
    const today = new Date();
    const result = [];
    for (let i = -2; i <= 2; i++) {
      result.push(new Date(today.getFullYear(), today.getMonth() + i, 1));
    }
    return result;
  }, []);

  // Scroll to current month on mount
  useEffect(() => {
    if (viewMode === "calendar" && scrollContainerRef.current) {
      const today = new Date();

      // Use setTimeout to ensure layout is ready
      setTimeout(() => {
        const element = document.getElementById(
          `month-${today.getFullYear()}-${today.getMonth()}`
        );
        if (element && scrollContainerRef.current) {
          // Calculate offset to show header
          // Header height is approx 10.5rem ~ 168px.
          // We want the month to start BELOW the header.
          const headerHeight = 220;
          // Add a small buffer (+1px) to ensure we are definitely "in" the month
          // and not at the boundary where the previous month might be detected.
          const scrollPosition = element.offsetTop - headerHeight + 1;

          scrollContainerRef.current.scrollTo({
            top: scrollPosition,
            behavior: "instant",
          });
        }
      }, 50);
    }
  }, [viewMode, months]);

  // Handle scroll to update visible month header
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const monthElements = Array.from(container.children) as HTMLElement[];
    const containerRect = container.getBoundingClientRect();
    const headerOffset = 250; // Increased to trigger month change earlier

    // Find the first month whose bottom is below the header area
    for (const el of monthElements) {
      const rect = el.getBoundingClientRect();

      // Check if the month is still visible at the top
      if (rect.bottom > containerRect.top + headerOffset) {
        const dateStr = el.getAttribute("data-date");
        if (dateStr) {
          setVisibleMonth(new Date(dateStr));
          break;
        }
      }
    }
  };

  // Get habits for a specific day
  const getHabitsForDay = (day: Date): DayHabit[] => {
    const dayHabits: DayHabit[] = [];

    habits.forEach((habit) => {
      if (shouldShowHabit(habit, day)) {
        const year = day.getFullYear();
        const month = String(day.getMonth() + 1).padStart(2, "0");
        const dayStr = String(day.getDate()).padStart(2, "0");
        const dateStr = `${year}-${month}-${dayStr}`;
        const key = `${habit.id}-${dateStr}`;
        const value = completions.get(key) || 0;
        const dailyGoal = habit.dailyGoal || 1;

        dayHabits.push({
          id: habit.id,
          name: habit.name,
          color: habit.color,
          completed: value >= dailyGoal,
          frequency: habit.frequency,
          customDays: habit.customDays,
        });
      }
    });

    return dayHabits;
  };

  const monthNames = [
    t.january,
    t.february,
    t.march,
    t.april,
    t.may,
    t.june,
    t.july,
    t.august,
    t.september,
    t.october,
    t.november,
    t.december,
  ];

  const selectedDayHabits = selectedDay ? getHabitsForDay(selectedDay) : [];

  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
    setViewMode("day");
  };

  const handleBackToCalendar = () => {
    setViewMode("calendar");
  };

  // Swipe handlers
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isRightSwipe) {
      handleBackToCalendar();
    }
  };

  // Helper to render a single month grid
  const renderMonth = (monthDate: Date) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday
    const offset = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

    const days: (Date | null)[] = [];
    for (let i = 0; i < offset; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));

    return (
      <div
        key={`${year}-${month}`}
        id={`month-${year}-${month}`}
        data-date={monthDate.toISOString()}
        className="mb-0 min-h-[75vh] flex flex-col snap-start" // Snap start for better alignment if needed
      >
        <h3 className="text-white text-xl font-bold px-4 mb-4 sr-only">
          {monthNames[month]} {year}
        </h3>
        <div className="grid grid-cols-7 gap-y-0 px-2 flex-1 content-start">
          {days.map((day, idx) => {
            if (!day)
              return <div key={`empty-${idx}`} className="min-h-[12vh]" />;

            const dayHabits = getHabitsForDay(day);
            const isToday = day.toDateString() === new Date().toDateString();
            const completedCount = dayHabits.filter((h) => h.completed).length;
            const totalCount = dayHabits.length;
            const hasHabits = totalCount > 0;

            return (
              <button
                key={idx}
                onClick={() => handleDayClick(day)}
                className="flex flex-col items-center justify-start min-h-[12vh] relative cursor-pointer group border-t border-white/5 pt-2"
              >
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-lg font-medium transition-all mb-1 ${
                    isToday
                      ? "bg-red-500 text-white font-bold"
                      : "text-white group-hover:bg-white/10"
                  }`}
                >
                  {day.getDate()}
                </div>

                {/* Dots indicator */}
                {hasHabits && (
                  <div className="flex gap-1 mt-1 justify-center w-full px-1 flex-wrap max-w-[90%]">
                    {dayHabits.slice(0, 5).map((habit) => (
                      <div
                        key={habit.id}
                        className={`w-1.5 h-1.5 rounded-full ${
                          habit.completed ? "" : "opacity-30"
                        }`}
                        style={{ backgroundColor: habit.color }}
                      />
                    ))}
                    {dayHabits.length > 5 && (
                      <div className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                    )}
                  </div>
                )}

                {/* Count Indicator */}
                {hasHabits && (
                  <div className="text-[0.6rem] font-medium mt-1 text-white/40">
                    {completedCount}/{totalCount}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        key="content"
        className={
          embedded
            ? "w-full h-full flex flex-col bg-black/40 backdrop-blur-md"
            : `fixed inset-0 z-50 flex items-center justify-center sm:p-4 bg-black/40 backdrop-blur-md sm:bg-black/70 sm:backdrop-blur-sm ${
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
              ? "flex flex-col w-full h-full relative overflow-hidden" // Transparent inner
              : `w-full h-full sm:h-auto sm:bg-[#0f0f0f] sm:border-2 sm:border-white/30 sm:rounded-3xl max-w-md sm:shadow-2xl flex flex-col relative overflow-hidden ${
                  isClosing ? "animate-scaleOut" : "animate-scaleIn"
                }`
          }
          onClick={(e) => e.stopPropagation()}
        >
          {/* CALENDAR VIEW */}
          <div
            className={`absolute inset-0 flex flex-col transition-transform duration-300 ease-in-out ${
              viewMode === "calendar" ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Header Sticky */}
            <div className="flex items-center justify-between px-4 pt-18 pb-4 flex-shrink-0 bg-[#0f0f0f] backdrop-blur-xl z-20 absolute top-0 left-0 right-0 h-[7.5rem]">
              <h2 className="text-3xl font-bold text-white pl-2">
                {monthNames[visibleMonth.getMonth()]}{" "}
                {visibleMonth.getFullYear()}
              </h2>
              {!embedded && (
                <button
                  onClick={onClose}
                  className="text-white/60 hover:text-white transition-all hover:rotate-90 duration-300"
                >
                  <X size={24} />
                </button>
              )}
            </div>

            {/* Days of the week (Fixed below header) */}
            <div className="grid grid-cols-7 gap-1 px-2 py-2 pt-5 flex-shrink-0 z-10 bg-[#0f0f0f] backdrop-blur-xl absolute top-[7.5rem] left-0 right-0 border-b border-white/30">
              {[t.mon, t.tue, t.wed, t.thu, t.fri, t.sat, t.sun].map((day, i) => (
                <div
                  key={i}
                  className="text-white/90 text-xs font-semibold text-center uppercase"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Month List (Scrollable) */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto custom-scrollbar px-0 pb-0"
            >
              {months.map(renderMonth)}
            </div>
          </div>

          {/* DAY DETAIL VIEW */}
          <div
            className={`absolute inset-0 flex flex-col bg-black/40 backdrop-blur-md transition-transform duration-300 ease-in-out ${
              viewMode === "day" ? "translate-x-0" : "translate-x-full"
            }`}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Detail Header */}
            <div className="flex items-center justify-between px-4 pt-18 pb-4 border-b border-white/10 flex-shrink-0 bg-black/20 backdrop-blur-xl z-10">
              <button
                onClick={handleBackToCalendar}
                className="flex items-center gap-1 text-red-500 hover:text-red-400 transition-colors"
              >
                <ChevronLeft size={24} />
                <span className="text-lg font-medium">
                  {monthNames[visibleMonth.getMonth()]}
                </span>
              </button>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white transition-all hover:rotate-90 duration-300"
              >
                <X size={28} />
              </button>
            </div>

            {/* Habit List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar pb-32">
              <h3 className="text-3xl font-bold text-white mb-6 px-2">
                {selectedDay.toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </h3>
              {selectedDayHabits.length > 0 ? (
                selectedDayHabits.map((habit) => (
                  <div
                    key={habit.id}
                    className="flex items-center gap-4 bg-white/10 rounded-xl p-4 relative overflow-hidden backdrop-blur-sm"
                  >
                    <div
                      className="w-1 h-8 rounded-full"
                      style={{ backgroundColor: habit.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <span
                        className="text-white text-lg font-medium block truncate"
                        title={habit.name}
                      >
                        {habit.name}
                      </span>
                      <span className="text-white/40 text-sm">
                        {getFrequencyLabel(habit.frequency, habit.customDays, t)}
                      </span>
                    </div>
                    {habit.completed && (
                      <span className="text-green-400 bg-green-400/10 p-2 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-white/40">
                  <p className="text-lg">{t.noHabitsScheduled}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
