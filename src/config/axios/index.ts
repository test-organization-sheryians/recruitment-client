// config/axios.ts
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

const publicRoutes = ["/", "/login", "/register"];

const isPublicRoute = (path: string) => {
  if (!path) return false;

  return (
    publicRoutes.includes(path as typeof publicRoutes[number]) ||
    path.includes("/user-verification/") ||
    publicRoutes.includes(path) ||
    path.includes("/user-verification")
  );
};

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  validateStatus: (status) => status >= 200 && status < 300,
});

api.interceptors.response.use(
  (response) => response,

  (error) => {
    // const status = error.response?.status;
    const responseData = error.response?.data;
    const currentPath =
      typeof window !== "undefined" ? window.location.pathname : "";
    const status = error?.response?.status;
    const data = error?.response?.data;

    const path =
      typeof window !== "undefined" ? window.location.pathname : "/";

    let message = "Something went wrong";

    if (data) {
      message =
        typeof data === "string"
          ? data.slice(0, 200)
          : data.message || data.error || message;
    }

    // ✅ Keep the GOOD version
    const publicRoute = isPublicRoute(currentPath);
    console.log(publicRoute, currentPath);
    const isPublic = isPublicRoute(path);

   
    if (status === 403 && message.toLowerCase().includes("not enrolled")) {
      toast.error("❌ You are not enrolled for this test.", {
        position: "top-right",
        autoClose: 3000,
      });

      return Promise.reject(new Error("You are not enrolled for this test."));
    }


    if (
      !isPublic &&
      status === 401 &&
      ["unauthorized", "token expired", "invalid token", "unauthenticated"]
        .some((key) => message.toLowerCase().includes(key))
    ) {
      Cookies.remove("accessToken");

      if (typeof window !== "undefined") {
        // window.location.href = "/login";
      }
      Cookies.remove("refreshToken");

      toast.error("🔒 Session expired. Please login again.", {
        position: "top-right",
        autoClose: 2000,
      });

      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);

      return Promise.reject(
        new Error("Session expired. Redirecting to login...")
      );
    }

   
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
    });

    error.message = message;
    return Promise.reject(error);
  }
);

export default api;
