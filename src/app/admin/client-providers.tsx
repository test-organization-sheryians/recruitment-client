// src/app/admin/client-providers.tsx
"use client"; // this is client component

import { ReactNode } from "react";
import Providers from "../providers";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return <Providers>{children}</Providers>;
}
