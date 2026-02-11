import NextAuth, { User, Session } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { supabaseAdmin } from '@/lib/supabase/server';
import bcrypt from 'bcryptjs';
import { JWT } from 'next-auth/jwt';

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: 'staff' | 'affiliate' | 'admin';
      status: 'pending' | 'active' | 'suspended' | 'rejected';
      emailVerified: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: 'staff' | 'affiliate' | 'admin';
    status: 'pending' | 'active' | 'suspended' | 'rejected';
    emailVerified: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'staff' | 'affiliate' | 'admin';
    status: 'pending' | 'active' | 'suspended' | 'rejected';
    emailVerified: boolean;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Query user from Supabase
        const { data: user, error } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('email', email.toLowerCase())
          .single();

        if (error || !user) {
          throw new Error('Invalid email or password');
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
          throw new Error('Invalid email or password');
        }

        // Check if user is active
        if (user.status === 'suspended') {
          throw new Error('Your account has been suspended. Please contact support.');
        }

        if (user.status === 'rejected') {
          throw new Error('Your account application was rejected. Please contact support.');
        }

        if (user.status === 'pending') {
          throw new Error('Your account is pending approval. Please wait for admin approval.');
        }

        // Log the login attempt
        await supabaseAdmin.from('audit_logs').insert({
          user_id: user.id,
          action: 'login',
          details: { email: user.email },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
          emailVerified: user.email_verified,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }): Promise<JWT> {
      // Add user data to token on sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.status = user.status;
        token.emailVerified = !!user.emailVerified;
      }
      return token;
    },
    async session({ session, token }): Promise<Session> {
      // Add token data to session
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role as 'staff' | 'affiliate' | 'admin';
        session.user.status = token.status as 'pending' | 'active' | 'suspended' | 'rejected';
        session.user.emailVerified = token.emailVerified as any;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
});
