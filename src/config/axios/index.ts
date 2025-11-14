
import axios from "axios";
import Cookies from "js-cookie";

const baseURL = 'http://localhost:3001'
const publicRoutes = ["/login", "/register", "/"];

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// axiosInstance.interceptors.request.use(
//   async (config) => {
//     const token = Cookies.get("refreshToken"); 
//     if (!token) {
//       window.location.href = "/login";
//       throw new axios.Cancel("No authentication cookie found");
//     }
//     return config;
//   },
//   async (error) => Promise.reject(error)
// );

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message?.toLowerCase() || "";
      const currentPath = window.location.pathname;

      if (
        !publicRoutes.includes(currentPath) &&
        (status === 401 ||
          message.includes("unauthorized") ||
          message.includes("token expired") ||
          message.includes("unauthenticated"))
      ) {
        Cookies.remove("refreshToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;