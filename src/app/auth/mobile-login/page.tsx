"use client";

import { signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function MobileLoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/auth/mobile-callback";
  const [status, setStatus] = useState("Connecting...");
  const [error, setError] = useState<string | null>(null);

  const performLogin = async () => {
    try {
      setStatus("Connecting...");
      await signOut({ redirect: false });

      setStatus("Redirecting...");
      await signIn("google", {
        callbackUrl: callbackUrl,
        redirect: true,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setStatus("Something went wrong");
    }
  };

  useEffect(() => {
    performLogin();
  }, [callbackUrl]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center">
      <div className="w-12 h-12 animate-spin rounded-full border-4 border-white border-t-transparent mb-4"></div>
      <p className="text-white text-lg mb-2">{status}</p>

      {error && (
        <div className="bg-red-900/50 p-4 rounded-lg mb-4">
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {error && (
        <button
          onClick={performLogin}
          className="bg-white text-black px-6 py-2 rounded-full font-bold mt-4"
        >
          Retry
        </button>
      )}
    </div>
  );
}
