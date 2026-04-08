"use client";

import { Settings, Plus, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface MobileBottomNavProps {
  activeTab: "settings" | "check";
  onTabChange: (tab: "settings" | "check") => void;
  onCreateClick: () => void;
}

export default function MobileBottomNav({
  activeTab,
  onTabChange,
  onCreateClick,
}: MobileBottomNavProps) {
  const { t } = useLanguage();
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0f0f0f] pb-3">
      <div className="grid grid-cols-3 items-center h-16 px-4">
        {/* Check Tab - Left */}
        <div className="flex justify-start pl-4">
          <button
            id="check-habits-tab"
            onClick={() => onTabChange("check")}
            className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors duration-200 ${
              activeTab === "check"
                ? "text-white"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            <Check size={24} strokeWidth={activeTab === "check" ? 3 : 2} />
            <span className="text-[10px] font-medium">{t.check}</span>
          </button>
        </div>

        {/* Create Button (Floating) - Center */}
        <div className="flex justify-center relative -top-6">
          <button
            id="create-habit-btn"
            onClick={onCreateClick}
            className="flex items-center justify-center w-16 h-16 rounded-full bg-white text-black hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <Plus size={32} strokeWidth={2.5} />
          </button>
        </div>

        {/* Settings Tab - Right */}
        <div className="flex justify-end pr-4">
          <button
            id="settings-tab"
            onClick={() => onTabChange("settings")}
            className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors duration-200 ${
              activeTab === "settings"
                ? "text-white"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            <Settings size={24} strokeWidth={activeTab === "settings" ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{t.settings}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
