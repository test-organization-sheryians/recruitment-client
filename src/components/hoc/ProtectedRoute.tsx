"use client";

import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/"); 
    }
  }, [user, loading, router]);

  if (loading) return <p>Checking authentication...</p>;

  if (!user) return null;

  return <>{children}</>;
}