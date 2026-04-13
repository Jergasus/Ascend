// components/AuthButtons.tsx
"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { GoogleAuth } from "@southdevs/capacitor-google-auth";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

export default function AuthButtons() {
  const { data: session, status, update } = useSession();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isNativePlatform, setIsNativePlatform] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    const checkNative = async () => {
      try {
        const { Capacitor } = await import('@capacitor/core');
        const isNative = Capacitor.isNativePlatform();
        setIsNativePlatform(isNative);

        if (isNative) {
          const platform = Capacitor.getPlatform();
          const clientId =
            platform === 'ios'
              ? process.env.NEXT_PUBLIC_GOOGLE_IOS_CLIENT_ID!
              : process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;

          GoogleAuth.initialize({
            clientId,
            scopes: ['profile', 'email'],
            grantOfflineAccess: true,
          });
        }
      } catch (e) {
        setIsNativePlatform(false);
      }
    };
    checkNative();
  }, []);

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);

    try {
      if (isNativePlatform) {
        const googleUser = await GoogleAuth.signIn({
          scopes: ['profile', 'email'],
          serverClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        });
        // Send ID token to NextAuth
        const result = await signIn("google-mobile", {
          idToken: googleUser.authentication.idToken,
          redirect: false,
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        // Force session update and reload page to fetch user data from server
        await update();
        window.location.reload();
      } else {
        // On web: Use standard NextAuth signIn
        await signIn("google");
      }
    } catch (error) {
      alert('Login failed: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="h-6 w-6 animate-spin rounded-full border-3 border-white border-t-transparent"></div>
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <div className="flex items-center gap-4 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 px-6 py-3 shadow-lg">
        {session.user?.image && (
          <img
            src={session.user.image}
            alt="Avatar"
            className="w-10 h-10 rounded-full ring-2 ring-white/50"
          />
        )}
        <div className="flex-1">
          <p className="text-white font-semibold">{session.user?.name}</p>
          <p className="text-gray-400 text-sm">{session.user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-xl font-medium transition-all border border-red-500/30"
        >
          <LogOut size={18} />
          {t.logOut}
        </button>
      </div>
    );
  }

  return (
    <div className="text-center bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8 shadow-lg">
      <h3 className="text-white text-xl font-bold mb-4">
        {t.welcome}
      </h3>
      <p className="text-gray-300 mb-6">
        {t.signInToStart}
      </p>
      <button
        onClick={handleLogin}
        disabled={isLoggingIn}
        className="flex items-center justify-center gap-3 mx-auto bg-white hover:bg-gray-100 text-gray-900 px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden min-w-[220px]"
      >
        {isLoggingIn ? (
          <>
            <div className="w-5 h-5 animate-spin rounded-full border-2 border-gray-400 border-t-gray-900"></div>
            <span>{t.connecting}</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {t.signInWithGoogle}
          </>
        )}
      </button>
    </div>
  );
}
