import NextAuth, { User, Session } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { supabaseAdmin } from '@/lib/supabase/server';
import bcrypt from 'bcryptjs';
import { JWT } from 'next-auth/jwt';
import { authConfig } from './auth.config';

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
  ...authConfig,
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

        // Log the login attempt (optional, skip if audit_logs has issues)
        try {
          await supabaseAdmin.from('audit_logs').insert({
            user_id: user.id,
            action: 'login',
            metadata: { email: user.email },
          });
        } catch (auditError) {
          // Log error but don't fail login
          console.error('Audit log error:', auditError);
        }

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
  secret: process.env.NEXTAUTH_SECRET,
});
