'use client';

import React from 'react';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { logout as logoutAction } from '@/features/auth/slice';

export default function LogoutButton() {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = async () => {

    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      try {
        Cookies.remove('access');
      } catch {}
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch {}
      try {
        dispatch(logoutAction());
      } catch {}

      router.replace('/login');
      setTimeout(() => {
        try {
          window.open('', '_self');
          window.close();
        } catch {}
        // Fallback: force navigation
        window.location.href = '/login';
      }, 50);
    } catch (error) {
      console.error('Logout failed:', error);
      router.replace('/login');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={clsx(
        'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium',
        'text-red-600 hover:bg-red-50 transition-all duration-200',
        'border border-red-200 cursor-pointer'
      )}
    >
      <LogOut className="w-5 h-5" />
      <span>Logout</span>
    </button>
  );
}