interface LoginRequest {
  email: string;
  password: string;
}

import api from "@/config/axios";
import { isAxiosError } from "axios";

export const login = async (data: LoginRequest): Promise<unknown> => {
  try {
    const response = await api.post("/api/v1/auth/login", data);
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
