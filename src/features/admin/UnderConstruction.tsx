'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Construction, Wrench, Sparkles } from 'lucide-react';
import Button from '@/components/Button';

interface UnderConstructionProps {
  title?: string;
  description?: string;
  showBackButton?: boolean;
}

export default function UnderConstruction({
  title = "This page is under construction",
  description = "We're working hard to bring you this feature. Check back soon!",
  showBackButton = true,
}: UnderConstructionProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 p-10 text-center">
          {/* Animated Icons */}
          <div className="relative inline-block mb-10">
            <div className="animate-bounce delay-100">
              <Construction className="w-24 h-24 text-blue-600 mx-auto drop-shadow-lg" />
            </div>
            <Wrench className="absolute top-0 -right-6 w-12 h-12 text-amber-500 rotate-12 animate-pulse" />
            <Sparkles className="absolute bottom-2 -left-8 w-10 h-10 text-purple-500 animate-ping" />
            <Sparkles className="absolute top-4 left-6 w-6 h-6 text-pink-400 animate-ping delay-300" />
          </div>

          {/* Content */}
          <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
            {title}
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-sm mx-auto">
            {description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {showBackButton && (
              <Button
                // onClick={router.back()}
                className="border-blue-600 text-blue-600 hover:bg-blue-50 font-medium px-6 py-3"
              >
                ← Go Back
              </Button>
            )}

            <Button
              
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 shadow-lg hover:shadow-xl transition-all"
            >
              <Link href="/admin/dashboard">
                Back to Dashboard
              </Link>
            </Button>
          </div>

          {/* Fun Footer */}
          <div className="mt-12 text-sm text-gray-500 flex items-center justify-center gap-2">
            <span>Stay tuned — something awesome is coming</span>
            <span className="inline-block animate-pulse">✨</span>
          </div>
        </div>
      </div>
    </div>
  );
}