'use client';

import { setUser } from '@/features/auth/slice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { startSessionWatcher } from "@/lib/utils";
import Cookies from 'js-cookie';



export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        console.log(data , "this is from the authProvider")
        dispatch(setUser(data.user || null));
      })
      .catch(() => {
        dispatch(setUser(null));
      });
  }, [dispatch]);

  useEffect(() => {
  const token = Cookies.get("accessToken");
  if (token) startSessionWatcher(3600);
}, []);


  return <>{children}</>;
}