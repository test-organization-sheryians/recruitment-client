import api from "@/config/axios";
import { isAxiosError } from "axios";

export const login = async (data: any) => {
  try {
    const response = await api.post("/api/auth/login", data);
    return response.data;
  } catch (error) {
    console.error("login failed:", error);
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "login failed. Please try again."
      );
    }
    throw new Error("An unexpected error occurred");
  }
} 