"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function MobileCallbackPage() {
  const { data: session, status } = useSession();
  const [redirecting, setRedirecting] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // Once authenticated, redirect to the app
    if (status === "authenticated" && !redirecting) {
      setRedirecting(true);
      
      // Small delay to ensure session is fully established
      setTimeout(() => {
        // Redirect to the app via custom URL scheme
        window.location.href = "ascendapp://auth/success";
      }, 500);
    }
  }, [status, redirecting]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="text-center">
        {status === "loading" && (
          <>
            <div className="w-12 h-12 mx-auto mb-4 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
            <p className="text-white text-lg">{t.verifyingSession}</p>
          </>
        )}
        
        {status === "authenticated" && (
          <>
            <div className="w-12 h-12 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-white text-lg mb-2">{t.sessionStarted}</p>
            <p className="text-gray-400">{t.returningToApp}</p>
          </>
        )}

        {status === "unauthenticated" && (
          <>
            <div className="w-12 h-12 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-white text-lg mb-2">{t.authError}</p>
            <p className="text-gray-400 mb-4">{t.couldNotLogin}</p>
            <a 
              href="ascendapp://auth/error"
              className="inline-block bg-white text-black px-6 py-2 rounded-lg font-medium"
            >
              {t.returnToApp}
            </a>
          </>
        )}
      </div>
    </div>
  );
}
