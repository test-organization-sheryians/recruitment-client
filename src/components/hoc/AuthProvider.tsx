'use client';

import { setUser } from '@/features/auth/slice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Provider } from 'react-redux';
import { store } from '@/store/store';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    fetch('/api/auth/me', {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        console.log("AuthProvider user data:", data);
        dispatch(setUser(data.user || null));
      })
      .catch(err => {
        console.error("Failed to fetch user:", err);
        dispatch(setUser(null));
      });
  }, [dispatch]);

  return <>{children}</>;
}


export function ReduxAuthProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}><AuthProvider>{children}</AuthProvider></Provider>;
}
