// app/api/completions/route.ts

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// --- GET function (to READ all completions) ---
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // Find all completions belonging to habits
    // that in turn belong to the logged-in user.
    const completions = await db.completion.findMany({
      where: {
        habit: {
          userId: session.user.id,
        },
      },
    });

    return NextResponse.json(completions);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// --- POST function (to CREATE or DELETE - "Toggle") ---
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // 1. Get the data from the frontend
    const body = await request.json();
    const { habitId, date }: { habitId: number; date: string } = body;

    // Convert the date (string) to a Date object
    const completionDate = new Date(date);

    // 2. Verify the habit belongs to the user (Security)
    const habit = await db.habit.findUnique({
      where: { id: habitId },
    });

    if (!habit || habit.userId !== session.user.id) {
      return new NextResponse("Habit not found or unauthorized", {
        status: 404,
      });
    }

    // 3. Check if a completion already exists for that day
    const existingCompletion = await db.completion.findFirst({
      where: {
        habitId: habitId,
        date: completionDate,
      },
    });

    // 4. Toggle logic
    if (existingCompletion) {
      // --- If it exists, DELETE it ---
      await db.completion.delete({
        where: { id: existingCompletion.id },
      });
      return NextResponse.json(
        { message: "Completion deleted" },
        { status: 200 }
      );
    } else {
      // --- If it doesn't exist, CREATE it ---
      const newCompletion = await db.completion.create({
        data: {
          habitId: habitId,
          date: completionDate,
        },
      });
      return NextResponse.json(newCompletion, { status: 201 });
    }
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
