
"use client";

import React from "react";
import AuthLayout from "../AuthLayout";

const layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full">
      {/* Hidden image on mobile */}
      <div className="hidden md:block">
        <AuthLayout imageUrl="/images/verify_email.webp">
          {children}
        </AuthLayout>
      </div>

      {/* Mobile view → only form */}
      <div className="md:hidden p-4">
        {children}
      </div>
    </div>
  );
};

export default layout;