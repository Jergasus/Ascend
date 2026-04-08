import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ color: "#ffffff" });
  }
  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: { themeColor: true },
  });
  return NextResponse.json({ color: user?.themeColor || "#ffffff" });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const { color } = await req.json();
  await db.user.update({
    where: { email: session.user.email },
    data: { themeColor: color },
  });
  return NextResponse.json({ success: true });
}
