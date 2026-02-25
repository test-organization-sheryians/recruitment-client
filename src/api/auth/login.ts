import api from "@/config/axios";

export const login = async (data: FormData) => {
    const response = await api.post("/api/auth/login", data);
    // Server returns { success, expiresIn, data: result }
    // Normalize so callers receive the actual result (token, user, etc.)
    const payload = response?.data?.data ?? response?.data;
    console.log("login response payload", payload);
    return payload;
};
