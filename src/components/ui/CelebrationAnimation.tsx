"use client";

import { useEffect, useMemo } from "react";

interface CelebrationAnimationProps {
  onComplete: () => void;
}

const CONFETTI_COLORS = [
  "#ef4444", // Red
  "#f59e0b", // Amber
  "#eab308", // Yellow
  "#22c55e", // Green
  "#3b82f6", // Blue
  "#a855f7", // Purple
  "#ec4899", // Pink
  "#06b6d4", // Cyan
];

// Define varied shapes with fixed dimensions
const SHAPES = [
  { width: 8, height: 8, radius: 2 }, // Small square
  { width: 12, height: 12, radius: 2 }, // Medium square
  { width: 10, height: 5, radius: 1 }, // Horizontal rectangle
  { width: 5, height: 10, radius: 1 }, // Vertical rectangle
  { width: 15, height: 6, radius: 2 }, // Wide strip
];

export default function CelebrationAnimation({
  onComplete,
}: CelebrationAnimationProps) {
  // Generate confetti once before render to avoid the "cut"
  const confettiPieces = useMemo(() => {
    return Array.from({ length: 150 }, (_, i) => {
      // Random property selection
      const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      const color =
        CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];

      return {
        id: i,
        left: Math.random() * 100, // Horizontal position %
        delay: Math.random() * 1.5, // Initial delay
        fallDuration: 2.5 + Math.random() * 2, // Fall (2.5s - 4.5s)
        swayDuration: 2 + Math.random() * 2, // Sway (2s - 4s)
        swayDelay: Math.random() * -4, // Random offset for sway
        rotateDuration: 1 + Math.random() * 2, // Rotation (1s - 3s)
        // Shape styles
        style: {
          width: `${shape.width}px`,
          height: `${shape.height}px`,
          backgroundColor: color,
          borderRadius: `${shape.radius}px`,
        },
      };
    });
  }, []);

  useEffect(() => {
    // Timer to close the animation
    const timer = setTimeout(onComplete, 4500); // A bit more time to ensure they all fall
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    // z-[60] ensures it's above everything and blocks clicks
    <div className="fixed inset-0 z-[60] pointer-events-auto cursor-default bg-transparent overflow-hidden">
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute -top-4 animate-confettiFall will-change-transform"
          style={{
            left: `${piece.left}%`,
            animationDuration: `${piece.fallDuration}s`,
            animationDelay: `${piece.delay}s`,
          }}
        >
          {/* Container for the sway */}
          <div
            className="animate-confettiSway will-change-transform"
            style={{
              animationDuration: `${piece.swayDuration}s`,
              animationDelay: `${piece.swayDelay}s`,
            }}
          >
            {/* Container for the rotation */}
            <div
              className="animate-confettiRotate will-change-transform"
              style={{
                ...piece.style,
                animationDuration: `${piece.rotateDuration}s`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
