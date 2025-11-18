'use server';

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export type Role = 'admin' | 'client' | 'user';
export type User = {
  id: string;
  firstName: string;
  lastName:string
  email: string;
  role: Role;
};

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set in environment variables');
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access')?.value;
    if (!token) {
      return null;
    }

    // Only change: removed `as User` and added safe cast after typeof check
    const payload = jwt.verify(token, JWT_SECRET, {
      ignoreExpiration: false,
    });

    if (typeof payload === 'string') return null;

    // This is the only line needed to satisfy TypeScript/ESLint
    return payload as User;
  } catch (error: unknown) {  // ← fixed: any → unknown
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      try {
        const cookieStore = await cookies();
        cookieStore.delete('access');
      } catch {}
      return null;
    }
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return null;
    }
    return null;
  }
}