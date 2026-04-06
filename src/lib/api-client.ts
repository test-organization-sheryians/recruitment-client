import axios from "axios";

const rawBaseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9000";
const API_BASE_URL = rawBaseURL.replace(/\/$/, "").replace(/\/api$/, "");

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
    // Authentication via cookie "token" (withCredentials: true) is now the single source of truth.
    return config;
  },
  (error) => Promise.reject(error)
);


apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized – please login again");
    }
    return Promise.reject(error);
  }
);

export default apiClient;