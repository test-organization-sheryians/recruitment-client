'use server';

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export type Role = 'admin' | 'client' | 'user';
export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: Role;
  isVerified: boolean;
};

const JWT_SECRET = process.env.JWT_SECRET!;
console.log(JWT_SECRET)
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set in environment variables');
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access")?.value;
    if (!token) {
      console.log("No token found");
      return null;
    }
    const payload = jwt.verify(token, JWT_SECRET, {
      ignoreExpiration: false,
    }) as User;
    console.log("payload :" , payload);
    
    return payload;
  } catch (error: unknown) {
    const err = error as { name?: string; expiredAt?: Date };
    if (err?.name === "TokenExpiredError") {
      console.log("Token expired at:", err?.expiredAt);
      try {
        const cookieStore = await cookies();
        cookieStore.delete("access");
      } catch {}
      return null;
    }
    if (err?.name === "JsonWebTokenError") {
      console.log("Invalid token");
      return null;
    }
    console.error("Unexpected error in getCurrentUser:", error);
    return null;
  }
}

export async function updateCurrentUser(updates: Partial<Pick<User, 'firstName' | 'lastName' | 'email' | 'phoneNumber'>>): Promise<User | null> {
  // This is a placeholder. In real implementation, update the database and return updated user.
  // For now, get current user and merge updates.
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;

  const updatedUser = { ...currentUser, ...updates };
  console.log("Updated user:", updatedUser);
  // In real app, save to DB and possibly reissue JWT if needed.

  return updatedUser;
}