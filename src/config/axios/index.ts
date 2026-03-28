import axios from "axios";
import Cookies from "js-cookie";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// 1. Request Interceptor: Attach the token to EVERY request
api.interceptors.request.use((config) => {
  const token = Cookies.get("access");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Variables to handle multiple failing requests
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Guard: If it's not a 401 or it's a retry, or it's already the login/refresh path
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // If a refresh is already happening, wait for it to finish
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Use the base axios or a separate instance to avoid interceptor loops
      const res = await axios.post(
        `${baseURL}/auth/refresh-token`,
        {},
        { withCredentials: true }
      );

      const newAccessToken = res.data.token;
      Cookies.set("access", newAccessToken);

      processQueue(null, newAccessToken);
      
      // Update header for current request and retry
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      
      // Clear storage and redirect
      Cookies.remove("access");
      Cookies.remove("role");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;