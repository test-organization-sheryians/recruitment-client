'use client';

import { setUser } from '@/features/auth/slice';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Only fetch auth data on client side after mount
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Not authenticated');
      })
      .then(data => {
        if (data.user) {
          dispatch(setUser(data.user));
        }
      })
      .catch(() => {
        // User is not authenticated, set to null
        dispatch(setUser(null));
      });
  }, [dispatch]);

  // Return children only after hydration is complete
  if (!mounted) {
    return <>{children}</>;
  }

  return <>{children}</>;
}