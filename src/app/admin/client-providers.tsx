"use client"; 

import { ReactNode } from "react";
import Providers from "../providers";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return <Providers>{children}</Providers>;
}
