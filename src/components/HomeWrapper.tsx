"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import MainScreen from "@/components/MainScreen";
import { HabitsProvider } from "@/contexts/HabitsContext";

const Beams = dynamic(() => import("@/components/ui/BackgroundBeams"), {
  ssr: false,
});
import type { Habit } from "@/types";

interface HomeWrapperProps {
  initialColor: string;
  initialHabits: Habit[];
  initialCompletions: string[];
  hasSeenTutorial: boolean;
}

export default function HomeWrapper({
  initialColor,
  initialHabits,
  initialCompletions,
  hasSeenTutorial,
}: HomeWrapperProps) {
  // State for color, initialized with value from server
  const [selectedColor, setSelectedColor] = useState(initialColor);

  return (
    <HabitsProvider
      initialHabits={initialHabits}
      initialCompletions={initialCompletions}
    >
      <div className="fixed inset-0 -z-10 w-full h-full">
        <Beams
          beamWidth={3}
          beamHeight={25}
          beamNumber={20}
          lightColor={selectedColor}
          speed={2}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={30}
        />
      </div>

      <main className="relative min-h-screen flex flex-col items-center justify-center p-8">
        <MainScreen
          onColorChange={setSelectedColor}
          currentColor={selectedColor}
          initialColor={initialColor}
          hasSeenTutorial={hasSeenTutorial}
        />
      </main>
    </HabitsProvider>
  );
}
