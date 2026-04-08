"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info, Ban } from "lucide-react";
import { isMobile } from "@/lib/utils";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  onClose: (id: string) => void;
  duration?: number;
}

export default function Toast({
  id,
  message,
  type,
  onClose,
  duration = 1000,
}: ToastProps) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosing(true);
      setTimeout(() => onClose(id), 300); // Wait for the animation to finish
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(id), 300);
  };

  const icons = {
    success: <CheckCircle size={20} className="text-green-400 flex-shrink-0" />,
    error: <AlertCircle size={20} className="text-red-400 flex-shrink-0" />,
    info: <Info size={20} className="text-blue-400 flex-shrink-0" />,
  };

  const bgColors = {
    success: "from-green-900/90 to-green-800/90 border-green-400/30",
    error: "from-red-900/90 to-red-800/90 border-red-400/30",
    info: "from-blue-900/90 to-blue-800/90 border-blue-400/30",
  };

  const isMobileView = typeof window !== "undefined" && isMobile();

  if (isMobileView) {
    const mobileIcons = {
      success: <CheckCircle size={32} className="text-green-500" />,
      error: <Ban size={32} className="text-red-500" />,
      info: <Info size={32} className="text-blue-500" />,
    };

    const mobileBorders = {
      success: "border-green-500/30",
      error: "border-red-500/30",
      info: "border-blue-500/30",
    };

    const mobileBg = {
      success: "bg-green-500/20",
      error: "bg-red-500/20",
      info: "bg-blue-500/20",
    };

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none px-4">
        <div
          className={`bg-black/80 backdrop-blur-md border-2 ${
            mobileBorders[type]
          } text-white px-6 py-6 rounded-2xl shadow-2xl flex flex-col items-center gap-3 max-w-[85vw] ${
            isClosing ? "animate-bounceOut" : "animate-bounceIn"
          }`}
        >
          <div className={`${mobileBg[type]} p-3 rounded-full flex-shrink-0`}>
            {mobileIcons[type]}
          </div>
          <span className="text-lg font-semibold text-center break-words w-full">
            {message}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border-2 bg-gradient-to-r ${
        bgColors[type]
      } backdrop-blur-sm shadow-2xl min-w-[300px] max-w-md ${
        isClosing ? "animate-slideOutRight" : "animate-slideInRight"
      }`}
    >
      {icons[type]}
      <p className="text-white text-sm flex-1 leading-relaxed break-words min-w-0">
        {message}
      </p>
      <button
        onClick={handleClose}
        className="text-white/60 hover:text-white transition-colors flex-shrink-0"
      >
        <X size={18} />
      </button>
    </div>
  );
}
