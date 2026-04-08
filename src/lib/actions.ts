"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { calculateSmartStartDate } from "@/lib/habitFrequency";
import type {
  Habit,
  Completion,
  CreateHabitInput,
  UpdateHabitInput,
  ReorderHabitsInput,
  ActionResult,
} from "@/types";

// ============================================================================
// AUTHENTICATION HELPER
// ============================================================================

async function getAuthenticatedUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session?.user?.email) {
    return null;
  }
  return { id: session.user.id, email: session.user.email };
}

// ============================================================================
// HABIT ACTIONS
// ============================================================================

export async function createHabit(
  input: CreateHabitInput
): Promise<ActionResult<Habit>> {
  const user = await getAuthenticatedUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Validate custom days for CUSTOM frequency
    if (input.frequency === "CUSTOM" && !input.customDays) {
      return {
        success: false,
        error: "Please select at least one day for custom frequency",
      };
    }

    // Get the max order for this user
    const maxOrderHabit = await db.habit.findFirst({
      where: { userId: user.id },
      orderBy: { order: "desc" },
    });

    const nextOrder = maxOrderHabit ? maxOrderHabit.order + 1 : 0;

    // Calculate smart start date
    const smartStartDate = calculateSmartStartDate(
      input.frequency || "DAILY",
      input.customDays
    );

    // Create the habit
    const newHabit = await db.habit.create({
      data: {
        name: input.name,
        color: input.color || "#ffffff",
        category: input.category || "General",
        order: nextOrder,
        frequency: input.frequency || "DAILY",
        customDays: input.customDays || null,
        notificationTime: input.notificationTime || null,
        dailyGoal: input.dailyGoal || 1,
        createdAt: smartStartDate,
        userId: user.id,
      },
    });

    revalidatePath("/");
    return { success: true, data: newHabit as Habit };
  } catch (error: unknown) {
    console.error("Error creating habit:", error);

    // Check for duplicate name error
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return { success: false, error: "Habit name already exists" };
    }

    return { success: false, error: "Error creating habit" };
  }
}

export async function updateHabit(
  input: UpdateHabitInput
): Promise<ActionResult<Habit>> {
  const user = await getAuthenticatedUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Verify the habit belongs to the user
    const habit = await db.habit.findUnique({
      where: { id: input.id },
    });

    if (!habit || habit.userId !== user.id) {
      return { success: false, error: "Habit not found or not authorized" };
    }

    // If frequency or custom days changed, recalculate start date
    let newCreatedAt = habit.createdAt;
    if (
      (input.frequency && input.frequency !== habit.frequency) ||
      (input.customDays !== undefined && input.customDays !== habit.customDays)
    ) {
      newCreatedAt = calculateSmartStartDate(
        input.frequency || habit.frequency,
        input.customDays !== undefined ? input.customDays : habit.customDays
      );
    }

    const updatedHabit = await db.habit.update({
      where: { id: input.id },
      data: {
        name: input.name ?? habit.name,
        color: input.color ?? habit.color,
        category: input.category ?? habit.category,
        frequency: input.frequency ?? habit.frequency,
        customDays:
          input.customDays !== undefined
            ? input.customDays
            : habit.customDays,
        notificationTime:
          input.notificationTime !== undefined
            ? input.notificationTime
            : habit.notificationTime,
        dailyGoal: input.dailyGoal ?? habit.dailyGoal,
        createdAt: newCreatedAt,
      },
    });

    revalidatePath("/");
    return { success: true, data: updatedHabit as Habit };
  } catch (error) {
    console.error("Error updating habit:", error);
    return { success: false, error: "Error updating habit" };
  }
}

export async function deleteHabit(id: number): Promise<ActionResult> {
  const user = await getAuthenticatedUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Verify the habit belongs to the user
    const habit = await db.habit.findUnique({
      where: { id },
    });

    if (!habit || habit.userId !== user.id) {
      return { success: false, error: "Habit not found or not authorized" };
    }

    // Delete the habit (completions cascade automatically)
    await db.habit.delete({
      where: { id },
    });

    revalidatePath("/");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Error deleting habit:", error);
    return { success: false, error: "Error deleting habit" };
  }
}

export async function reorderHabits(
  input: ReorderHabitsInput
): Promise<ActionResult> {
  const user = await getAuthenticatedUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Update the order of each habit
    await Promise.all(
      input.map((item) =>
        db.habit.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    revalidatePath("/");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Error reordering habits:", error);
    return { success: false, error: "Error reordering habits" };
  }
}

// ============================================================================
// COMPLETION ACTIONS
// ============================================================================

export async function toggleCompletion(
  habitId: number,
  date: string
): Promise<ActionResult<{ completed: boolean; value: number }>> {
  const user = await getAuthenticatedUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const completionDate = new Date(date);

    // Verify the habit belongs to the user
    const habit = await db.habit.findUnique({
      where: { id: habitId },
    });

    if (!habit || habit.userId !== user.id) {
      return { success: false, error: "Habit not found or not authorized" };
    }

    // Check if completion already exists
    const existingCompletion = await db.completion.findFirst({
      where: {
        habitId: habitId,
        date: completionDate,
      },
    });

    if (existingCompletion) {
      // If current value is less than goal, increment
      if (existingCompletion.value < habit.dailyGoal) {
        const updatedCompletion = await db.completion.update({
          where: { id: existingCompletion.id },
          data: { value: existingCompletion.value + 1 },
        });
        revalidatePath("/");
        return {
          success: true,
          data: {
            completed: updatedCompletion.value >= habit.dailyGoal,
            value: updatedCompletion.value,
          },
        };
      } else {
        // If already at goal (or more), reset (delete)
        await db.completion.delete({
          where: { id: existingCompletion.id },
        });
        revalidatePath("/");
        return { success: true, data: { completed: false, value: 0 } };
      }
    } else {
      // Create the completion with value 1
      const newCompletion = await db.completion.create({
        data: {
          habitId: habitId,
          date: completionDate,
          value: 1,
        },
      });
      revalidatePath("/");
      return {
        success: true,
        data: {
          completed: newCompletion.value >= habit.dailyGoal,
          value: newCompletion.value,
        },
      };
    }
  } catch (error) {
    console.error("Error toggling completion:", error);
    return { success: false, error: "Error toggling completion" };
  }
}

// ============================================================================
// USER PREFERENCE ACTIONS
// ============================================================================

export async function updateThemeColor(
  color: string
): Promise<ActionResult> {
  const user = await getAuthenticatedUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await db.user.update({
      where: { email: user.email },
      data: { themeColor: color },
    });

    revalidatePath("/");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Error updating theme color:", error);
    return { success: false, error: "Error updating theme color" };
  }
}

export async function completeTutorial(): Promise<ActionResult> {
  const user = await getAuthenticatedUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await db.user.update({
      where: { email: user.email },
      data: { hasSeenTutorial: true },
    });

    revalidatePath("/");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Error completing tutorial:", error);
    return { success: false, error: "Error completing tutorial" };
  }
}

