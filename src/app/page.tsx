import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import HomeWrapper from "@/components/HomeWrapper";
import type { Habit } from "@/types";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  let initialColor = "#ffffff";
  let initialHabits: Habit[] = [];
  let initialCompletions: string[] = [];
  let hasSeenTutorial = false;

  if (session?.user?.email) {
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: {
        themeColor: true,
        hasSeenTutorial: true,
        habits: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (user) {
      if (user.themeColor) initialColor = user.themeColor;
      if (user.hasSeenTutorial) hasSeenTutorial = user.hasSeenTutorial;
      if (user.habits) initialHabits = user.habits as Habit[];

      // Fetch completions for these habits
      const habitIds = user.habits.map((h) => h.id);
      if (habitIds.length > 0) {
        const completions = await db.completion.findMany({
          where: {
            habitId: { in: habitIds },
          },
        });

        initialCompletions = completions.map(
          (c) => `${c.habitId}-${c.date.toISOString().split("T")[0]}-${c.value}`
        );
      }
    }
  }

  return (
    <HomeWrapper
      initialColor={initialColor}
      initialHabits={initialHabits}
      initialCompletions={initialCompletions}
      hasSeenTutorial={hasSeenTutorial}
    />
  );
}
