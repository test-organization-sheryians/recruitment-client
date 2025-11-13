import api from "@/config/axios";
import { isAxiosError } from "axios";

export const register = async (data: any) => {
  try {
    const response = await api.post("/api/v1/auth/register", data);
    return response.data;
    console.log("getting registered")
  } catch (error) {
    console.error("register failed:", error);
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "register failed. Please try again."
      );
    }
    throw new Error("An unexpected error occurred");
  }
} 