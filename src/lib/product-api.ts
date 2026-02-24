import axios from "axios";

//  using axios 
// for product API

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000/api",
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const req = error?.config ?? {};
    const status = error?.response?.status;
    const data = error?.response?.data ?? error?.message;

    if (!error?.response) {
      console.error("Network Error:", error?.message ?? error);
    } else {
      console.error("API error", {
        method: req.method,
        url: req.url,
        status,
        data,
      });
    }

    return Promise.reject(error);
    
  }
);