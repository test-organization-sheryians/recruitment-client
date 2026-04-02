import api from "@/config/axios";

export const getAllProducts=async () => {
    const response = await api.get("/api/products/getAllProducts");
    console.log("your data coming from backend is-->",response.data)
    return response.data;
  }