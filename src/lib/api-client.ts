import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9000";

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`, 
  withCredentials: true,
  timeout: 10000,
});

/**
 * REQUEST INTERCEPTOR
 */
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);


apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized – please login again");
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default apiClient;