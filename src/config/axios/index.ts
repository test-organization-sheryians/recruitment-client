// config/axios.ts
import axios from "axios";
import Cookies from "js-cookie";
import { hasRefreshToken, clearAuthTokens } from "@/lib/tokenUtils";

const rawBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const baseURL = rawBaseURL.replace(/\/$/, "").replace(/\/api$/, "");

const publicRoutes = ["/login", "/register"] as const;

// Updated: Check if path starts with these instead of exact match
const isPublicRoute = (path: string) => {
  if (!path) return false;

  return (
    publicRoutes.some((route) => path.startsWith(route)) ||
    path.includes("/user-verification")
  );
};

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  // validateStatus: (status) => status >= 200 && status < 300,
});

api.interceptors.response.use(
  (response) => {
    console.log("✅ Response success:", response.config.url);
    return response;
  },
  async (error) => {
    const status = error.response?.status;
    const responseData = error.response?.data;
    const originalRequest = error.config;

    const currentPath =
      typeof window !== "undefined" ? window.location.pathname : "";

    console.log("❌ Error intercepted");
    console.log("➡️ URL:", originalRequest?.url);
    console.log("➡️ Status:", status);

    let message = "Something went wrong";

    if (responseData) {
      if (typeof responseData === "string") {
        message = responseData.slice(0, 200);
      } else if (responseData.message) {
        message = responseData.message;
      } else if (responseData.error) {
        message = responseData.error;
      }
    }

    const publicRoute = isPublicRoute(currentPath);

    console.log("➡️ Public Route:", publicRoute);

    // 🔥 STEP 1: TRY REFRESH (only if we have a refresh token)
    if (
      !publicRoute &&
      status === 401 &&
      !originalRequest._retry &&
      hasRefreshToken() // ✅ NEW: Check if refresh token exists
    ) {
      console.log("🔄 401 detected & refresh token exists → trying refresh...");
      originalRequest._retry = true;

      try {
        console.log("📡 Calling /api/auth/refresh...");

        const refreshResponse = await api.post("/api/auth/refresh");

        console.log("✅ Refresh success:", refreshResponse.data);

        console.log("🔁 Retrying original request:", originalRequest.url);

        return api(originalRequest);
      } catch (refreshError) {
        console.log("❌ Refresh failed:", refreshError);
        // Refresh failed - clear tokens
        clearAuthTokens();
      }
    }

    // 🔥 STEP 2: LOGOUT
    if (
      !publicRoute &&
      (status === 401 ||
        status === 403 ||
        (message &&
          (message.toLowerCase().includes("unauthorized") ||
            message.toLowerCase().includes("token expired") ||
            message.toLowerCase().includes("unauthenticated") ||
            message.toLowerCase().includes("invalid token"))))
    ) {
      console.log("🚪 Logging out user");

      clearAuthTokens();

      return Promise.reject(
        new Error("Session expired. Redirecting to login..."),
      );
    }

    if (error.response) {
      error.message = message;
    }

    return Promise.reject(error);
  },
);

export default api;
