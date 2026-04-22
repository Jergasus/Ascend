"use client";

import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import "@/app/driver-theme.css";
import { completeTutorial } from "@/lib/actions";
import { useLanguage } from "@/contexts/LanguageContext";

interface TutorialProps {
  hasSeenTutorial: boolean;
}

export default function Tutorial({ hasSeenTutorial }: TutorialProps) {
  const { t, language, isInitialized } = useLanguage();

  useEffect(() => {
    if (!hasSeenTutorial && isInitialized) {
      const driverObj = driver({
        showProgress: true,
        allowClose: false,
        stagePadding: 8,
        stageRadius: 50, // Make it fully round
        popoverClass: "driverjs-theme",
        nextBtnText: t.tutorialNext,
        prevBtnText: t.tutorialPrevious,
        doneBtnText: t.tutorialDone,
        steps: [
          {
            element: "#create-habit-btn",
            popover: {
              title: t.tutorialCreateTitle,
              description: t.tutorialCreateDesc,
              side: "top",
              align: "center",
            },
          },
          {
            element: "#check-habits-tab",
            popover: {
              title: t.tutorialCheckTitle,
              description: t.tutorialCheckDesc,
              side: "top",
              align: "center",
            },
          },
          {
            element: "#settings-tab",
            popover: {
              title: t.tutorialSettingsTitle,
              description: t.tutorialSettingsDesc,
              side: "top",
              align: "center",
            },
          },
        ],
        onDestroyStarted: () => {
          if (!driverObj.hasNextStep() || confirm(t.tutorialExitConfirm)) {
            driverObj.destroy();
            completeTutorial();
          }
        },
      });

      // Small delay to ensure elements are mounted
      setTimeout(() => {
        driverObj.drive();
      }, 1000);
    }
  }, [hasSeenTutorial, language, t, isInitialized]);

  return null;
}
