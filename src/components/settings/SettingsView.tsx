"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Palette, LogOut, Languages, Coffee } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SettingsViewProps {
  themeColor: string;
  onColorChange: (color: string) => void;
  onOpenColorPicker: () => void;
  onOpenLanguagePicker: () => void;
}

const COLORS = [
  { name: "White", value: "#ffffff" },
  { name: "Red", value: "#ef4444" },
  { name: "Orange", value: "#f97316" },
  { name: "Yellow", value: "#eab308" },
  { name: "Green", value: "#22c55e" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Purple", value: "#a855f7" },
];

export default function SettingsView({
  themeColor,
  onColorChange,
  onOpenColorPicker,
  onOpenLanguagePicker,
}: SettingsViewProps) {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const [showLogout, setShowLogout] = useState(false);
  const [isClosingLogout, setIsClosingLogout] = useState(false);

  const handleToggleLogout = () => {
    if (showLogout) {
      setIsClosingLogout(true);
      setTimeout(() => {
        setShowLogout(false);
        setIsClosingLogout(false);
      }, 200);
    } else {
      setShowLogout(true);
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex flex-col items-center min-h-full justify-center px-6">
        {/* Content Container */}
        <div className="flex flex-col items-center w-full max-w-xs gap-10">
          {/* Profile Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <button
                onClick={handleToggleLogout}
                className="relative w-24 h-24 rounded-full ring-4 ring-white/20 shadow-2xl transition-all duration-500 active:scale-95"
              >
                {session?.user?.image ? (
                  <img
                    src={session.user.image.replace("=s96-c", "=s100-c")}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                    referrerPolicy="no-referrer"
                    loading="eager"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">
                      {session?.user?.name?.[0] || "?"}
                    </span>
                  </div>
                )}
              </button>

              {/* Logout Thought Bubble */}
              {showLogout && (
                <div
                  className={`absolute -top-20 left-1/2 -translate-x-1/2 z-20 w-max max-w-none ${
                    isClosingLogout ? "animate-popOut" : "animate-smoothPopIn"
                  }`}
                >
                  <button
                    onClick={() => signOut()}
                    className="relative group flex items-center"
                  >
                    {/* Main Bubble */}
                    <div
                      className="bg-white text-black px-4 py-4 rounded-[2rem] shadow-2xl flex flex-row items-center gap-2 transform rotate-6 translate-x-10 hover:scale-105 transition-transform duration-200 border-2 border-black/5 -mt-1"
                      style={{ whiteSpace: "nowrap", width: "max-content" }}
                    >
                      <LogOut size={20} className="text-red-500 shrink-0" />
                      <span className="font-bold text-lg shrink-0">
                        {t.logOut}
                      </span>
                    </div>

                    {/* Thought Bubbles (Tail) */}
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-sm"></div>
                  </button>
                </div>
              )}
            </div>

            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold text-white">
                {t.hello}, {session?.user?.name?.split(" ")[0]}
              </h1>
            </div>
          </div>

          {/* Theme Color Section */}
          <div className="w-full space-y-4">
            <div className="flex items-center justify-center gap-2 text-white/80 pb-2">
              <Palette size={20} />
              <span className="font-medium text-md">{t.chooseYourVibe}</span>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => onColorChange(color.value)}
                  className={`aspect-square rounded-2xl transition-all duration-300 transform ${
                    themeColor === color.value
                      ? "scale-110 ring-2 ring-white shadow-[0_0_20px_-5px_var(--color)]"
                      : "scale-100 hover:scale-105 opacity-70 hover:opacity-100"
                  }`}
                  style={
                    {
                      backgroundColor: color.value,
                      "--color": color.value,
                    } as React.CSSProperties
                  }
                  title={color.name}
                />
              ))}

              {/* Rainbow Spiral Button (Custom Color Picker) */}
              <button
                onClick={onOpenColorPicker}
                className="aspect-square rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 relative overflow-hidden group"
                title={t.customColor}
              >
                <div className="absolute inset-0 bg-[conic-gradient(from_0deg,#ff0000,#ffff00,#00ff00,#00ffff,#0000ff,#ff00ff,#ff0000)]" />
                <div className="absolute inset-0 bg-[conic-gradient(from_0deg,red,orange,yellow,green,blue,indigo,violet,red)] opacity-80 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>

          {/* Language & Donate Grid */}
          <div className="w-full grid grid-cols-2 gap-8 pb-10">
            {/* Language Section (Left) */}
            <div className="flex flex-col items-center">
              <button
                onClick={onOpenLanguagePicker}
                className="w-20 h-20 flex items-center justify-center transition-transform duration-300 hover:scale-110 active:scale-95"
              >
                <Languages size={48} className="text-white" />
              </button>
              <span className="text-sm font-medium text-white/60">
                {t.language}
              </span>
            </div>

            {/* Buy Me A Coffee Section (Right) */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => {
                  window.open("https://buymeacoffee.com/jergasus", "_blank");
                }}
                className="w-20 h-20 flex items-center justify-center transition-transform duration-300 hover:scale-110 active:scale-95"
              >
                <Coffee
                  size={48}
                  className="text-amber-700"
                />
              </button>
              <span className="text-sm font-medium text-amber-700">
                Buy me a coffee
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
