'use client';

import React from 'react';
import { Construction, Wrench, Sparkles } from 'lucide-react';
import Button from '@/components/Button';

export default function UnderConstruction({
  title = "This page is under construction",
  description = "We're working hard to bring you this feature. Check back soon!",
  showBackButton = true,
}: {
  title?: string;
  description?: string;
  showBackButton?: boolean;
}) {
  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-6 font-[satoshi]">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-10 text-center">
          {/* Animated Icon */}
          <div className="relative inline-block mb-8">
            <div className="animate-bounce">
              <Construction className="w-20 h-20 text-[#1270B0] mx-auto" />
            </div>
            <Wrench className="absolute -top-2 -right-4 w-10 h-10 text-yellow-500 rotate-12 animate-pulse" />
            <Sparkles className="absolute -bottom-3 -left-6 w-8 h-8 text-purple-500 animate-ping" />
          </div>

          {/* Text */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {title}
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            {description}
          </p>

          {/* Optional Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {showBackButton && (
              <Button
                onClick={() => window.history.back()}
                variant="outline"
                className="border-[#1270B0] text-[#1270B0] hover:bg-[#E9EFF7]"
              >
                Go Back
              </Button>
            )}
            <Button
              onClick={() => window.location.href = '/admin/dashboard'}
              className="bg-[#1270B0] hover:bg-[#0f5a8c]"
            >
              Back to Dashboard
            </Button>
          </div>

          {/* Fun footer */}
          <div className="mt-10 text-sm text-gray-500">
            <span className="inline-flex items-center gap-2">
              <span>Stay tuned</span>
              <span className="animate-pulse">Coming soon!</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}