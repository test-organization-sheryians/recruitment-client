"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setUser, setLoading } from "@/redux/slices/authSlice";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    
    const fetchUser = async () => {
      try {
        dispatch(setLoading(true));

        const res = await fetch("http://localhost:9000/api/auth/me", {
          credentials: "include", 
        });

        if (!res.ok) {
          throw new Error("Not authenticated");
        }

        const data = await res.json();

        dispatch(setUser(data.user)); 
      } catch (error) {
        dispatch(setUser(null)); 
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchUser();
  }, [dispatch]);

  return <>{children}</>;
}