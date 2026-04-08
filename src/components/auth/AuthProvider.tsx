// components/AuthProvider.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { HabitsProvider } from "@/contexts/HabitsContext";
import React from "react";
import { Session } from "next-auth";

type Props = {
  children?: React.ReactNode;
  session?: Session | null;
};

export default function AuthProvider({ children, session }: Props) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
