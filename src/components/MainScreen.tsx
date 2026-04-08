"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import AuthButtons from "./auth/AuthButtons";
import CreateHabitModal from "./habits/CreateHabitModal";
import CheckHabitsModal from "./habits/CheckHabitsModal";
import MobileBottomNav from "./ui/MobileBottomNav";
import SettingsView from "./settings/SettingsView";
import ColorPickerModal from "./settings/ColorPickerModal";
import LanguagePickerModal from "./settings/LanguagePickerModal";
import { updateThemeColor } from "@/lib/actions";
import { useHabits } from "@/contexts/HabitsContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { rescheduleAllNotifications } from "@/lib/notifications";
import Tutorial from "./ui/Tutorial";

// --- MAIN COMPONENT ---

interface MainScreenProps {
  onColorChange?: (color: string) => void;
  currentColor?: string;
  initialColor?: string;
  hasSeenTutorial: boolean;
}

export default function MainScreen({
  onColorChange,
  currentColor = "#ffffff",
  initialColor = "#ffffff",
  hasSeenTutorial,
}: MainScreenProps) {
  const { data: session } = useSession();
  const { habits, isLoading } = useHabits();
  const { t, language } = useLanguage();

  useEffect(() => {
    if (!isLoading && habits.length > 0) {
      rescheduleAllNotifications(habits, t);
    }
  }, [isLoading, language]);

  // State for theme color
  const [themeColor, setThemeColor] = useState<string>(initialColor);

  // Save theme color to database when it changes
  const handleColorChange = (color: string) => {
    // 1. Optimistic update: Update local state and parent immediately
    setThemeColor(color);
    if (onColorChange) onColorChange(color);

    // 2. Background update: Persist to DB via server action without blocking UI
    if (session?.user) {
      updateThemeColor(color).catch(() => {});
    }
  };

  // Existing modal states
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Existing animation states
  const [isClosingCreate, setIsClosingCreate] = useState(false);

  // --- STATE FOR MOBILE VIEW ---
  const [activeMobileTab, setActiveMobileTab] = useState<"settings" | "check">(
    "check"
  );
  const [resetCheckViewSignal, setResetCheckViewSignal] = useState(0);

  // --- STATE FOR CONTROLLING BOTTOM NAV VISIBILITY ---
  const [isMobileOverlayOpen, setIsMobileOverlayOpen] = useState(false);

  // --- STATE FOR COLOR PICKER (LIFTED) ---
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isClosingColorPicker, setIsClosingColorPicker] = useState(false);

  const handleOpenColorPicker = () => {
    setShowColorPicker(true);
  };

  const handleCloseColorPicker = () => {
    setIsClosingColorPicker(true);
    setTimeout(() => {
      setShowColorPicker(false);
      setIsClosingColorPicker(false);
    }, 400);
  };

  // --- STATE FOR LANGUAGE PICKER (LIFTED) ---
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [isClosingLanguagePicker, setIsClosingLanguagePicker] = useState(false);

  const handleOpenLanguagePicker = () => {
    setShowLanguagePicker(true);
  };

  const handleCloseLanguagePicker = () => {
    setIsClosingLanguagePicker(true);
    setTimeout(() => {
      setShowLanguagePicker(false);
      setIsClosingLanguagePicker(false);
    }, 400);
  };

  // Close handlers
  const handleCloseCreateModal = () => {
    setIsClosingCreate(true);
    setTimeout(() => {
      setShowCreateModal(false);
      setIsClosingCreate(false);
    }, 400);
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <AuthButtons />
      </div>
    );
  }

  return (
    <>
      <Tutorial hasSeenTutorial={hasSeenTutorial} />
      {/* --- MOBILE VIEW (App-like) --- */}
      <div className="block sm:hidden fixed inset-0 z-0 flex flex-col pt-safe-top">
        {/* Mobile View */}
        <div
          className="sm:hidden h-full"
          style={{ position: "relative", zIndex: 2 }}
        >
          <div className="h-full">
            <div
              className={`h-full transition-opacity duration-300 ease-in-out ${
                showCreateModal ? "opacity-0" : "opacity-100"
              }`}
            >
              {activeMobileTab === "check" ? (
                <CheckHabitsModal
                  onClose={() => setActiveMobileTab("settings")}
                  isClosing={false}
                  embedded={true}
                  resetSignal={resetCheckViewSignal}
                />
              ) : (
                <SettingsView
                  themeColor={themeColor}
                  onColorChange={handleColorChange}
                  onOpenColorPicker={handleOpenColorPicker}
                  onOpenLanguagePicker={handleOpenLanguagePicker}
                />
              )}
            </div>
          </div>{" "}
          {/* Bottom Navigation */}
          {!isMobileOverlayOpen && (
            <MobileBottomNav
              activeTab={activeMobileTab}
              onTabChange={(tab) => {
                if (tab === activeMobileTab && tab === "check") {
                  setResetCheckViewSignal((prev) => prev + 1);
                }
                setActiveMobileTab(tab);
              }}
              onCreateClick={() => setShowCreateModal(true)}
            />
          )}
        </div>
      </div>

      {/* Modals (Shared) */}
      {showCreateModal && (
        <CreateHabitModal
          onClose={handleCloseCreateModal}
          isClosing={isClosingCreate}
        />
      )}
      {/* Color Picker Modal (Lifted) */}
      {showColorPicker && (
        <ColorPickerModal
          onClose={handleCloseColorPicker}
          isClosing={isClosingColorPicker}
          onColorSelect={(color) => {
            handleColorChange(color);
            handleCloseColorPicker();
          }}
          currentColor={themeColor}
        />
      )}

      {/* Language Picker Modal (Lifted) */}
      {showLanguagePicker && (
        <LanguagePickerModal
          onClose={handleCloseLanguagePicker}
          isClosing={isClosingLanguagePicker}
        />
      )}
    </>
  );
}
