'use client';

import { setUser } from '@/features/auth/slice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import api from '@/config/axios';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
  try {
    let res;

    try {
      // 🔥 force protected API
      res = await api.get('/api/users/me');
    } catch {
      // 401 → refresh
      await api.post('/api/auth/refresh');

      // retry
      res = await api.get('/api/users/me');
    }

    dispatch(setUser(res.data.data ?? null));

  } catch {
    dispatch(setUser(null));
  }
};

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  return <>{children}</>;
}