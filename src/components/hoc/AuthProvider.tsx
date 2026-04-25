"use client";

import { setUser, setAuthLoading } from "@/features/auth/slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import api from "@/config/axios";
import {
  hasRefreshToken,
  hasAccessToken,
  clearAuthTokens,
} from "@/lib/tokenUtils";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      dispatch(setAuthLoading(true));

      // 🚨 EARLY EXIT: No tokens = not authenticated
      // Don't make any API calls if we don't have tokens
      if (!hasAccessToken() && !hasRefreshToken()) {
        console.log("🔒 No tokens found - skipping auth initialization");
        dispatch(setUser(null));
        dispatch(setAuthLoading(false));
        return;
      }

      try {
        let res;

        try {
          res = await api.get("/api/users/me");
        } catch (error: any) {
          const status = error?.response?.status;

          // Only try refresh if we have a refresh token
          if ((status === 401 || status === 403) && hasRefreshToken()) {
            try {
              await api.post("/api/auth/refresh");
              res = await api.get("/api/users/me");
            } catch (refreshError) {
              // Refresh failed - clear tokens and give up
              clearAuthTokens();
              throw refreshError;
            }
          } else {
            // No refresh token or other error - just clear auth
            if (status === 401 || status === 403) {
              clearAuthTokens();
            }
            throw error;
          }
        }

        if (isMounted) {
          dispatch(setUser(res.data.data ?? null));
        }
      } catch (error) {
        if (isMounted) {
          dispatch(setUser(null));
        }
      } finally {
        if (isMounted) {
          dispatch(setAuthLoading(false));
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  return <>{children}</>;
}
