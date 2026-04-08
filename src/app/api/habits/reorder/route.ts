import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { habitIds } = await req.json();

    if (!Array.isArray(habitIds)) {
      return NextResponse.json(
        { error: "habitIds must be an array" },
        { status: 400 }
      );
    }

    // Update the order of each habit, only if it belongs to this user
    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await Promise.all(
      habitIds.map((id, index) =>
        db.habit.update({
          where: { id, userId: user.id },
          data: { order: index },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering habits:", error);
    return NextResponse.json(
      { error: "Error reordering habits" },
      { status: 500 }
    );
  }
}
