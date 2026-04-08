"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ColorPickerModalProps {
  onClose: () => void;
  isClosing: boolean;
  onColorSelect: (color: string) => void;
  currentColor: string;
}

export default function ColorPickerModal({
  onClose,
  isClosing,
  onColorSelect,
  currentColor,
}: ColorPickerModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useLanguage();
  const [selectedHex, setSelectedHex] = useState(currentColor);

  const [markerPosition, setMarkerPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Draw color wheel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw color wheel
    for (let angle = 0; angle < 360; angle++) {
      const startAngle = (angle - 2) * (Math.PI / 180);
      const endAngle = (angle + 2) * (Math.PI / 180);

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        radius
      );
      gradient.addColorStop(0, "white");
      gradient.addColorStop(1, `hsl(${angle}, 100%, 50%)`);

      ctx.fillStyle = gradient;
      ctx.fill();
    }

    // Calculate initial marker position from currentColor
    if (currentColor) {
      // 1. Try to get cached position from localStorage
      try {
        const cached = localStorage.getItem(`cp_pos_${currentColor}`);
        if (cached) {
          const { x, y } = JSON.parse(cached);
          setMarkerPosition({ x, y });
          return;
        }
      } catch {
        // Ignore localStorage errors
      }

      // 2. Fallback: Calculate from Hex (HSV Saturation)
      const hex = currentColor.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0;

      // HSV Saturation
      const s = max === 0 ? 0 : (max - min) / max;

      if (max !== min) {
        const d = max - min;
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }
        h /= 6;
      }

      // Map Hue to Angle
      const angle = h * 360;

      // Map Saturation to Radius
      // The gradient is White (S=0) to Color (S=1)
      const dist = s * radius;

      const rads = (angle * Math.PI) / 180;

      const x = centerX + dist * Math.cos(rads);
      const y = centerY + dist * Math.sin(rads);

      setMarkerPosition({ x, y });
    }
  }, [currentColor]);

  const isDragging = useRef(false);

  const updateColorFromCoordinates = (
    clientX: number,
    clientY: number,
    shouldCommit = false
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    let x = clientX - rect.left;
    let y = clientY - rect.top;

    // Constrain to circle bounds
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2;
    // Add buffer to avoid reading anti-aliased edge pixels that may be black/transparent
    const maxRadius = radius - 3;

    // Calculate distance from center
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // If outside the safe radius, clamp to the edge (with buffer)
    if (distance > maxRadius) {
      const angle = Math.atan2(dy, dx);
      x = centerX + maxRadius * Math.cos(angle);
      y = centerY + maxRadius * Math.sin(angle);
    }

    // Update marker position
    setMarkerPosition({ x, y });

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pixel = ctx.getImageData(Math.round(x), Math.round(y), 1, 1).data;
    const hex =
      "#" +
      [pixel[0], pixel[1], pixel[2]]
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("");

    setSelectedHex(hex);

    // Only commit to parent if requested (e.g. on mouse up)
    if (shouldCommit) {
      // Cache the position for this color
      try {
        localStorage.setItem(`cp_pos_${hex}`, JSON.stringify({ x, y }));
      } catch {
        // Ignore localStorage errors
      }
      onColorSelect(hex);
      onClose();
    }
  };

  const handleStart = (clientX: number, clientY: number) => {
    isDragging.current = true;
    updateColorFromCoordinates(clientX, clientY, false);
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (isDragging.current) {
      updateColorFromCoordinates(clientX, clientY, false);
    }
  };

  const handleEnd = (clientX: number, clientY: number) => {
    if (isDragging.current) {
      isDragging.current = false;
      updateColorFromCoordinates(clientX, clientY, true);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[75] flex items-center justify-center">
        {/* Backdrop for Content */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-md ${
            isClosing ? "animate-fadeOut" : "animate-fadeIn"
          }`}
          onClick={onClose}
        />

        {/* Modal Card */}
        <div
          className={`relative z-10 flex flex-col w-full h-full sm:h-auto sm:w-full sm:max-w-sm sm:bg-[#0f0f0f] sm:border-2 sm:border-white/20 sm:rounded-3xl shadow-2xl items-center justify-center p-6 overflow-hidden ${
            isClosing ? "animate-scaleOut" : "animate-scaleIn"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="w-full flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">{t.customColor}</h2>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Color Wheel */}
          <div className="relative mb-6 group">
            <canvas
              ref={canvasRef}
              width={250}
              height={250}
              className="rounded-full cursor-pointer shadow-xl touch-none"
              onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
              onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
              onMouseUp={(e) => handleEnd(e.clientX, e.clientY)}
              onMouseLeave={() => (isDragging.current = false)}
              onTouchStart={(e) => {
                const touch = e.touches[0];
                handleStart(touch.clientX, touch.clientY);
              }}
              onTouchMove={(e) => {
                const touch = e.touches[0];
                handleMove(touch.clientX, touch.clientY);
              }}
              onTouchEnd={(e) => {
                const touch = e.changedTouches[0];
                handleEnd(touch.clientX, touch.clientY);
              }}
            />
            {/* Selection Marker */}
            {markerPosition && (
              <div
                className="absolute w-6 h-6 rounded-full border-2 border-white shadow-md pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: markerPosition.x,
                  top: markerPosition.y,
                  backgroundColor: selectedHex,
                }}
              />
            )}
          </div>

          {/* Selected Color Preview */}
          <div className="flex items-center gap-4 w-full bg-white/5 p-4 rounded-2xl border border-white/10">
            <div
              className="w-12 h-12 rounded-full border-2 border-white/20 shadow-inner"
              style={{ backgroundColor: selectedHex }}
            />
            <div className="flex-1">
              <p className="text-white/60 text-sm">Selected Hex</p>
              <p className="text-white font-mono text-lg font-bold">
                {selectedHex.toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
