'use server';

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export type Role = 'admin' | 'client' | 'user';
export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

const JWT_SECRET = process.env.JWT_SECRET!;
console.log(JWT_SECRET)
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set in environment variables');
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access')?.value;
    if (!token) {
      console.log('No token found');
      return null;
    }
    const payload = jwt.verify(token, JWT_SECRET, {
      ignoreExpiration: false,
    }) as User;
    return payload;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      console.log('Token expired at:', error.expiredAt);
      try {
        const cookieStore = await cookies();
        cookieStore.delete('access');
      } catch {}
      return null;
    }
    if (error.name === 'JsonWebTokenError') {
      console.log('Invalid token');
      return null;
    }
    console.error('Unexpected error in getCurrentUser:', error);
    return null;
  }
}