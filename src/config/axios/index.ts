import axios from "axios";
import Cookies from "js-cookie";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

const publicRoutes = ["/login", "/register", "/"] as const;

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,

  validateStatus: (status) => status >= 200 && status < 300,
});

// Optional: Add auth token if you use accessToken in headers (not cookies)
// api.interceptors.request.use((config) => {
//   const token = Cookies.get("accessToken");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

api.interceptors.response.use(
  (response) => response,

  (error) => {

    const status = error.response?.status;
    const responseData = error.response?.data;
    const currentPath = typeof window !== "undefined" ? window.location.pathname : "";

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

const isPublicRoute = publicRoutes.includes(currentPath as typeof publicRoutes[number]);
    if (
      !isPublicRoute &&
      (status === 401 ||
        status === 403 ||
        (message && (
          message.toLowerCase().includes("unauthorized") ||
          message.toLowerCase().includes("token expired") ||
          message.toLowerCase().includes("unauthenticated") ||
          message.toLowerCase().includes("invalid token")
        )))
    ) {
      Cookies.remove("refreshToken");
      Cookies.remove("accessToken");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return Promise.reject(new Error("Session expired. Redirecting to login..."));
    }

    if (error.response) {
      error.message = message; 
    }

    return Promise.reject(error);
  }
);

export default api;