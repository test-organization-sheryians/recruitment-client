'use client';

import React from 'react';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { clsx } from 'clsx';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const confirmed = window.confirm('Are you sure you want to log out?');
    if (!confirmed) return;

    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', 
      });

      router.push('/login');
      router.refresh(); 
    } catch (error) {
      console.error('Logout failed:', error);
      router.push('/login');
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