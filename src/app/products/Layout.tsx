"use client";

import queryClient from "@/config/tanstack";
import { QueryClientProvider } from "@tanstack/react-query";

export default function RootLayout({ children }: any) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}