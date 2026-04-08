"use client";

import { useHabits } from "@/contexts/HabitsContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { X, ChevronRight, ChevronLeft } from "lucide-react";
import { shouldShowHabit } from "@/lib/habitFrequency";
import { useState, useMemo, useRef } from "react";
import { useGesture } from "@use-gesture/react";

interface StatisticsProps {
  onClose: () => void;
  isClosing: boolean;
}

export default function Statistics({ onClose, isClosing }: StatisticsProps) {
  const { habits, completions } = useHabits();
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<"circle" | "graph">("circle");
  const containerRef = useRef<HTMLDivElement>(null);

  // All habits sorted by order
  const filteredHabits = useMemo(() => {
    return [...habits].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [habits]);

  // --- SVG CONFIGURATION (Dimensions) ---
  // Define this first for use in math limits
  const width = 256;
  const height = 256;
  const paddingX = 20;
  const paddingBottom = 40;
  const paddingTop = 40;
  const chartHeight = height - paddingBottom - paddingTop;

  // Lower math limit (where 0% is)
  const zeroLineY = height - paddingBottom;

  // Get the current week
  const getCurrentWeek = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);

    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      week.push(day.toISOString().split("T")[0]);
    }
    return week;
  };

  const currentWeek = getCurrentWeek();

  // --- GENERAL CALCULATIONS ---
  const habitStats = filteredHabits.map((habit) => {
    let completionsCount = 0;
    let possibleDays = 0;

    currentWeek.forEach((dateStr) => {
      const date = new Date(dateStr + "T00:00:00");
      if (shouldShowHabit(habit, date)) {
        possibleDays++;
        const key = `${habit.id}-${dateStr}`;
        const value = completions.get(key) || 0;
        const dailyGoal = habit.dailyGoal || 1;
        if (value >= dailyGoal) {
          completionsCount++;
        }
      }
    });
    return { habit, completionsCount, possibleDays };
  });

  const activeHabits = habitStats.filter((stat) => stat.possibleDays > 0);
  const n = activeHabits.length;
  let sumOfProportions = 0;
  activeHabits.forEach((stat) => {
    sumOfProportions += stat.completionsCount / stat.possibleDays;
  });
  const percentage = n > 0 ? (sumOfProportions / n) * 100 : 0;

  const bestHabit =
    habitStats.length > 0
      ? habitStats.reduce((best, current) => {
          const bestRate =
            best.possibleDays > 0
              ? best.completionsCount / best.possibleDays
              : 0;
          const currentRate =
            current.possibleDays > 0
              ? current.completionsCount / current.possibleDays
              : 0;
          if (currentRate > bestRate) return current;
          if (currentRate === bestRate) {
            return current.completionsCount > best.completionsCount
              ? current
              : best;
          }
          return best;
        })
      : null;

  // --- CALCULATIONS FOR THE DAILY GRAPH ---
  const dailyData = useMemo(() => {
    return currentWeek.map((dateStr) => {
      const date = new Date(dateStr + "T00:00:00");
      let possibleToday = 0;
      let completedToday = 0;

      filteredHabits.forEach((habit) => {
        if (shouldShowHabit(habit, date)) {
          possibleToday++;
          const key = `${habit.id}-${dateStr}`;
          const value = completions.get(key) || 0;
          const dailyGoal = habit.dailyGoal || 1;
          if (value >= dailyGoal) {
            completedToday++;
          }
        }
      });

      const percent =
        possibleToday > 0 ? (completedToday / possibleToday) * 100 : null;

      return {
        day: date.toLocaleDateString("en-US", { weekday: "short" }).charAt(0),
        percent,
      };
    });
  }, [filteredHabits, completions, currentWeek]);

  // --- FUNCTION FOR SMOOTH CURVES WITH CLAMPING (Limits) ---
  const getSmoothPath = (points: number[][]) => {
    if (points.length === 0) return "";
    if (points.length === 1) return "";

    const controlPoint = (
      current: number[],
      previous: number[],
      next: number[],
      reverse?: boolean
    ) => {
      const p = previous || current;
      const n = next || current;
      const smoothing = 0.2;
      const o = line(p, n);
      const angle = o.angle + (reverse ? Math.PI : 0);
      const length = o.length * smoothing;
      const x = current[0] + Math.cos(angle) * length;
      let y = current[1] + Math.sin(angle) * length;

      // --- MATH FIX (Clamping) ---
      // This prevents the curve from drifting below 0 or above 100
      if (y > zeroLineY) y = zeroLineY; // Don't go below the floor
      if (y < paddingTop) y = paddingTop; // Don't go above the ceiling

      return [x, y];
    };

    const line = (pointA: number[], pointB: number[]) => {
      const lengthX = pointB[0] - pointA[0];
      const lengthY = pointB[1] - pointA[1];
      return {
        length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
        angle: Math.atan2(lengthY, lengthX),
      };
    };

    const d = points.reduce((acc, point, i, a) => {
      if (i === 0) return `M ${point[0]},${point[1]}`;
      const [cpsX, cpsY] = controlPoint(a[i - 1], a[i - 2], point);
      const [cpeX, cpeY] = controlPoint(point, a[i - 1], a[i + 1], true);
      return `${acc} C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point[0]},${point[1]}`;
    }, "");

    return d;
  };

  // Map points
  const allPoints = dailyData.map((data, index) => {
    const x =
      paddingX + (index / (dailyData.length - 1)) * (width - paddingX * 2);
    const y =
      data.percent !== null
        ? height - paddingBottom - (data.percent / 100) * chartHeight
        : null;
    return { x, y, percent: data.percent, day: data.day };
  });

  const validPointsForLine = allPoints
    .filter((p) => p.y !== null)
    .map((p) => [p.x, p.y as number]);

  const pathD = getSmoothPath(validPointsForLine);

  let fillD = "";
  if (validPointsForLine.length >= 2) {
    const firstPoint = validPointsForLine[0];
    const lastPoint = validPointsForLine[validPointsForLine.length - 1];
    fillD = `${pathD} L ${lastPoint[0]},${height - paddingBottom} L ${
      firstPoint[0]
    },${height - paddingBottom} Z`;
  }

  // Swipe gesture configuration
  const bind = useGesture(
    {
      onDrag: ({ direction: [dx], movement: [mx], cancel }) => {
        // Swipe detection with threshold
        if (Math.abs(mx) > 50 && Math.abs(dx) > 0.5) {
          if (mx > 0) {
            // Swipe right -> go to circle
            setViewMode("circle");
            cancel();
          } else {
            // Swipe left -> go to graph
            setViewMode("graph");
            cancel();
          }
        }
      },
    },
    {
      drag: {
        axis: "x",
        filterTaps: true,
      },
    }
  );

  return (
    <>
      <div
        key="content"
        className={`fixed inset-0 z-[60] flex items-center justify-center sm:p-4 bg-black/40 backdrop-blur-md sm:bg-black/70 sm:backdrop-blur-sm pt-10 sm:pt-0 ${
          isClosing ? "animate-fadeOut" : "animate-fadeIn"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <div
          className={`w-full h-full sm:h-auto sm:bg-[#0f0f0f] sm:border-2 sm:border-white/30 sm:rounded-3xl p-6 sm:p-8 max-w-lg sm:shadow-2xl flex flex-col justify-center ${
            isClosing ? "animate-scaleOut" : "animate-scaleIn"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">{t.weeklyStatistics}</h2>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-all hover:rotate-90 duration-300"
            >
              <X size={28} />
            </button>
          </div>

          {/* Visual Area */}
          <div className="text-center mb-8 relative">
            {/* MAIN CONTAINER (256x256px) */}
            <div ref={containerRef} {...bind()} className="touch-none">
              <div className="relative w-64 h-64 mx-auto mb-6 flex items-center justify-center">
                {/* Left Button (MORE SEPARATED) */}
                {viewMode === "graph" && (
                  <button
                    onClick={() => setViewMode("circle")}
                    // CHANGE: -left-20 instead of -left-12
                    className="absolute -left-14 sm:-left-20 top-1/2 -translate-y-1/2 z-10 p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all"
                  >
                    <ChevronLeft size={32} />
                  </button>
                )}

                {/* CIRCLE VIEW */}
                <div
                  className={`absolute inset-0 transition-all duration-500 transform ${
                    viewMode === "circle"
                      ? "opacity-100 scale-100 rotate-0"
                      : "opacity-0 scale-90 -rotate-90 pointer-events-none"
                  }`}
                >
                  <div className="relative w-full h-full">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="128"
                        cy="128"
                        r="112"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="16"
                        fill="none"
                      />
                      <circle
                        cx="128"
                        cy="128"
                        r="112"
                        stroke="white"
                        strokeWidth="16"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 112}`}
                        strokeDashoffset={`${
                          2 * Math.PI * 112 * (1 - percentage / 100)
                        }`}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-white">
                          {percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* GRAPH VIEW */}
                <div
                  className={`absolute inset-0 w-full h-full transition-all duration-500 transform ${
                    viewMode === "graph"
                      ? "opacity-100 scale-100 rotate-0"
                      : "opacity-0 scale-90 rotate-90 pointer-events-none"
                  }`}
                >
                  {/* SVG Square 256x256 */}
                  <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="w-full h-full overflow-visible"
                  >
                    <defs>
                      <linearGradient
                        id="gradientFill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="white" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="white" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Grid Lines */}
                    <line
                      x1={paddingX}
                      y1={paddingTop}
                      x2={width - paddingX}
                      y2={paddingTop}
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    <line
                      x1={paddingX}
                      y1={height / 2}
                      x2={width - paddingX}
                      y2={height / 2}
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    <line
                      x1={paddingX}
                      y1={height - paddingBottom}
                      x2={width - paddingX}
                      y2={height - paddingBottom}
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="1"
                    />

                    {/* Graph */}
                    {validPointsForLine.length >= 2 && (
                      <>
                        <path d={fillD} fill="url(#gradientFill)" />
                        <path
                          d={pathD}
                          fill="none"
                          stroke="white"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                        />
                      </>
                    )}

                    {/* Points */}
                    {allPoints.map((point, i) => {
                      if (point.y === null) {
                        return (
                          <g key={i}>
                            <circle
                              cx={point.x}
                              cy={height - paddingBottom}
                              r="2"
                              fill="rgba(255,255,255,0.2)"
                            />
                            <text
                              x={point.x}
                              y={height - 10}
                              textAnchor="middle"
                              fill="rgba(255,255,255,0.3)"
                              fontSize="12"
                              fontWeight="500"
                            >
                              {point.day}
                            </text>
                          </g>
                        );
                      }

                      return (
                        <g key={i}>
                          <circle
                            cx={point.x}
                            cy={point.y}
                            r="4"
                            fill="#0f0f0f"
                            stroke="white"
                            strokeWidth="2"
                            className="hover:r-6 transition-all duration-300 cursor-crosshair"
                          />
                          <text
                            x={point.x}
                            y={height - 10}
                            textAnchor="middle"
                            fill="rgba(255,255,255,0.6)"
                            fontSize="12"
                            fontWeight="bold"
                          >
                            {point.day}
                          </text>
                          <title>{`${point.day}: ${point.percent?.toFixed(
                            0
                          )}%`}</title>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Right Button (MORE SEPARATED) */}
                {viewMode === "circle" && (
                  <button
                    onClick={() => setViewMode("graph")}
                    // CHANGE: -right-20 instead of -right-12
                    className="absolute -right-15 sm:-right-20 top-1/2 -translate-y-1/2 z-10 p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all"
                  >
                    <ChevronRight size={32} />
                  </button>
                )}
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">
              {viewMode === "circle"
                ? t.completedThisWeek
                : t.dailyPerformance}
            </h3>
          </div>

          {/* Details */}
          <div className="bg-white/5 border border-white/20 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white/80">{t.activeHabits}:</span>
              <span className="text-white font-bold text-xl">{n}</span>
            </div>
            {bestHabit && bestHabit.completionsCount > 0 && (
              <div className="flex justify-between items-center gap-3">
                <span className="text-white/80 flex-shrink-0">{t.bestHabit}:</span>
                <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: bestHabit.habit.color }}
                  />
                  <span
                    className="text-white font-bold text-lg truncate"
                    title={bestHabit.habit.name}
                  >
                    {bestHabit.habit.name}
                  </span>
                  <span className="text-white/60 text-sm flex-shrink-0">
                    ({bestHabit.completionsCount}/{bestHabit.possibleDays})
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </>
  );
}
