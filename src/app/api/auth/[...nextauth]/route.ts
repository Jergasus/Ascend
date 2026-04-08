// app/api/auth/[...nextauth]/route.ts

import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db) as any,
  session: {
    strategy: "jwt", // Changed to JWT to support CredentialsProvider
  },
  providers: [
    // Native provider for mobile (receives ID Token)
    CredentialsProvider({
      id: "google-mobile",
      name: "Google Mobile",
      credentials: {
        idToken: { label: "ID Token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.idToken) throw new Error("No ID token provided");

        try {
          // 1. Verify the token with Google
          const ticket = await googleClient.verifyIdToken({
            idToken: credentials.idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
          });
          
          const payload = ticket.getPayload();
          if (!payload || !payload.email) throw new Error("Invalid token payload");

          // 2. Find or create user in DB
          // Note: PrismaAdapter normally does this, but with Credentials we have to do it manually
          let user = await db.user.findUnique({
            where: { email: payload.email },
          });

          if (!user) {
            user = await db.user.create({
              data: {
                email: payload.email,
                name: payload.name,
                image: payload.picture,
                emailVerified: new Date(),
              },
            });
          } else {
            // Update info if necessary
            if (!user.image && payload.picture) {
              await db.user.update({
                where: { id: user.id },
                data: { image: payload.picture, name: payload.name || user.name },
              });
            }
          }

          // 3. Link account if it doesn't exist
          const existingAccount = await db.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: "google",
                providerAccountId: payload.sub,
              },
            },
          });

          if (!existingAccount) {
            await db.account.create({
              data: {
                userId: user.id,
                type: "oauth",
                provider: "google",
                providerAccountId: payload.sub,
                id_token: credentials.idToken,
              },
            });
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          };
        } catch (error) {
          console.error("Mobile Auth Error:", error);
          return null;
        }
      },
    }),
    // Standard web provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Required: allows the same Google email to link via both web OAuth and native mobile token
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Pass user data to the JWT token
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Pass token data to the session
      if (session.user && token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  debug: false,
};

// Create the handler that Next.js will use
const handler = NextAuth(authOptions);

// Export the handler for GET and POST methods
export { handler as GET, handler as POST };
