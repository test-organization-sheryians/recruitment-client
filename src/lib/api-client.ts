import axios from "axios";
const API_BASE_URL = "http://localhost:9000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});


apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
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
     
    }
    return Promise.reject(error);
  }
);

export default apiClient;
