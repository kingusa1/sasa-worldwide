/**
 * NextAuth Edge-compatible configuration
 *
 * This file contains the auth config WITHOUT the Credentials provider
 * (which requires bcryptjs, a Node.js-only module).
 *
 * Used by middleware.ts (runs in Edge Runtime) to read JWT session
 * without importing bcryptjs.
 *
 * The full auth config with providers is in auth.ts
 */

import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.status = (user as any).status;
        token.emailVerified = !!(user as any).emailVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).status = token.status;
        (session.user as any).emailVerified = token.emailVerified;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [], // Providers added in auth.ts (not needed for middleware)
} satisfies NextAuthConfig;
