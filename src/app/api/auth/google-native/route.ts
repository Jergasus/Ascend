// app/api/auth/google-native/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { randomUUID } from "crypto";

// Function to verify the Google idToken with the Google API
async function verifyGoogleIdToken(idToken: string) {
  const response = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
  );

  if (!response.ok) {
    const errorData = await response.text();
    console.error("Google token verification failed:", errorData);
    throw new Error("Invalid Google ID token");
  }

  const payload = await response.json();

  // Verify the token is for our app
  // We accept the Web Client ID and the iOS/Android Client IDs
  const validClientIds = [
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_IOS_CLIENT_ID,
    process.env.GOOGLE_ANDROID_CLIENT_ID,
  ].filter(Boolean);

  if (!validClientIds.includes(payload.aud)) {
    console.error("Invalid audience:", payload.aud);
    console.error("Expected one of:", validClientIds);
    throw new Error("Token not intended for this app");
  }

  return {
    email: payload.email,
    name: payload.name,
    image: payload.picture,
    googleId: payload.sub,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken } = body;

    if (!idToken) {
      return NextResponse.json(
        { error: "idToken is required" },
        { status: 400 }
      );
    }

    // Verify the token with Google
    const googleUser = await verifyGoogleIdToken(idToken);

    // Find or create user in the database
    let user = await db.user.findUnique({
      where: { email: googleUser.email },
    });

    if (!user) {
      // Create new user
      user = await db.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
          image: googleUser.image,
        },
      });

      // Create linked account (to maintain consistency with OAuth)
      await db.account.create({
        data: {
          userId: user.id,
          type: "oauth",
          provider: "google",
          providerAccountId: googleUser.googleId,
        },
      });
    } else {
      // Update image and name if they changed
      user = await db.user.update({
        where: { id: user.id },
        data: {
          name: googleUser.name,
          image: googleUser.image,
        },
      });

      // Check if a linked Google account exists, if not, create it
      const existingAccount = await db.account.findFirst({
        where: {
          userId: user.id,
          provider: "google",
        },
      });

      if (!existingAccount) {
        await db.account.create({
          data: {
            userId: user.id,
            type: "oauth",
            provider: "google",
            providerAccountId: googleUser.googleId,
          },
        });
      }
    }

    // Create a session in the database
    const sessionToken = randomUUID();
    const sessionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await db.session.create({
      data: {
        sessionToken,
        userId: user.id,
        expires: sessionExpiry,
      },
    });

    // Create the response with the session cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      },
    });

    // Configure the NextAuth session cookie
    // The cookie name depends on whether we're in production or development
    const isProduction = process.env.NODE_ENV === "production";
    const cookieName = isProduction
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token";

    response.cookies.set(cookieName, sessionToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      expires: sessionExpiry,
      path: "/",
    });

    // Also set the cookie without the __Secure- prefix for compatibility
    if (isProduction) {
      response.cookies.set("next-auth.session-token", sessionToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        expires: sessionExpiry,
        path: "/",
      });
    }

    return response;
  } catch (error) {
    console.error("Google native auth error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Authentication failed" },
      { status: 401 }
    );
  }
}
