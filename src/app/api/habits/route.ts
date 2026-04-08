// app/api/habits/route.ts

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Import your auth options
import { db } from "@/lib/db"; // Import your Prisma client
import { NextResponse } from "next/server";
import { calculateSmartStartDate } from "@/lib/habitFrequency";

// --- POST function (to CREATE a new habit) ---
export async function POST(request: Request) {
  try {
    // 1. Get the session SERVER-SIDE
    const session = await getServerSession(authOptions);

    // 2. If there's no session (no one logged in), return 401 error
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 3. Get the habit name from the frontend
    const body = await request.json();
    const { name, color, category, frequency, customDays } = body;

    // Get the current maximum order for this user
    const maxOrderHabit = await db.habit.findFirst({
      where: { userId: session.user.id },
      orderBy: { order: "desc" },
    });

    const nextOrder = maxOrderHabit ? maxOrderHabit.order + 1 : 0;

    // Calculate the smart start date
    const smartStartDate = calculateSmartStartDate(
      frequency || "DAILY",
      customDays
    );

    // 4. Create the habit IN THE DATABASE
    const newHabit = await db.habit.create({
      data: {
        name: name,
        color: color || "#ffffff",
        category: category || "General",
        order: nextOrder,
        frequency: frequency || "DAILY",
        customDays: customDays || null,
        createdAt: smartStartDate,
        userId: session.user.id, // This connects it to the user
      },
    });

    // 5. Return the newly created habit
    return NextResponse.json(newHabit, { status: 201 });
  } catch (error: any) {
    console.error("Error creating habit:", error);

    // Check if it's a duplicate name error
    if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
      return NextResponse.json(
        { error: "Habit name already exists" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Error creating habit" },
      { status: 500 }
    );
  }
}

// --- GET function (to READ the user's habits) ---
export async function GET() {
  try {
    // 1. Get the session SERVER-SIDE
    const session = await getServerSession(authOptions);

    // 2. If no user, unauthorized
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 3. QUERY THE DB!
    // Find ALL habits where the 'userId'
    // matches the session user's ID
    const habits = await db.habit.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        order: "asc", // Sort by the order field
      },
    });

    // 4. Return the list of habits
    return NextResponse.json(habits);
  } catch (error) {
    console.error("Error fetching habits:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// --- PUT function (to EDIT a habit) ---
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { id, name, color, category, frequency, customDays } = body;

    // Verify the habit belongs to the user
    const habit = await db.habit.findUnique({
      where: { id },
    });

    if (!habit || habit.userId !== session.user.id) {
      return new NextResponse("Habit not found or unauthorized", {
        status: 404,
      });
    }

    // Update the habit
    // If the frequency or custom days changed, recalculate the start date
    let newCreatedAt = habit.createdAt;
    if (
      (frequency && frequency !== habit.frequency) ||
      (customDays !== undefined && customDays !== habit.customDays)
    ) {
      newCreatedAt = calculateSmartStartDate(
        frequency || habit.frequency,
        customDays !== undefined ? customDays : habit.customDays
      );
    }

    const updatedHabit = await db.habit.update({
      where: { id },
      data: {
        name: name || habit.name,
        color: color || habit.color,
        category: category || habit.category,
        frequency: frequency || habit.frequency,
        customDays: customDays !== undefined ? customDays : habit.customDays,
        createdAt: newCreatedAt,
      },
    });

    return NextResponse.json(updatedHabit, { status: 200 });
  } catch (error) {
    console.error("Error editing habit:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// --- DELETE function (to DELETE a habit) ---
export async function DELETE(request: Request) {
  try {
    // 1. Get the session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 2. Get the ID of the habit to delete
    const body = await request.json();
    const { id } = body;

    // 3. Verify the habit belongs to the user
    const habit = await db.habit.findUnique({
      where: { id },
    });

    if (!habit || habit.userId !== session.user.id) {
      return new NextResponse("Habit not found or unauthorized", {
        status: 404,
      });
    }

    // 4. Delete the habit (completions are automatically deleted via onDelete: Cascade)
    await db.habit.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Habit deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting habit:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
