import api from "@/config/axios";
import { isAxiosError } from "axios";

export const logout = async () => {
  try {
    const response = await api.post("/api/auth/logout");
    return response.data;
  } catch (error) {
    console.error("Logout failed:", error);
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Logout failed. Please try again."
      );
    }
    throw new Error("An unexpected error occurred during logout.");
  }
};
