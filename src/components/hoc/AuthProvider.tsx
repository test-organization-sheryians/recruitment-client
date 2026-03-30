'use client';

import { setUser, setAuthLoading } from '@/features/auth/slice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import api from '@/config/axios';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      dispatch(setAuthLoading(true));

      try {
        let res;

        try {
          res = await api.get('/api/users/me');
        } catch (error: any) {
          const status = error?.response?.status;
          if (status === 401 || status === 403) {
            await api.post('/api/auth/refresh');
            res = await api.get('/api/users/me');
          } else {
            throw error;
          }
        }

        dispatch(setUser(res.data.data ?? null));
      } catch {
        dispatch(setUser(null));
      } finally {
        dispatch(setAuthLoading(false));
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  return <>{children}</>;
}
