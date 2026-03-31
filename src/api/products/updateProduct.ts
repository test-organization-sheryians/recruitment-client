import api from "@/config/axios"
import { updateData } from "@/features/product/components/UpdateProductForm";

export const updateProduct = async ({ id, data }: updateData) => {
    const response = await api.patch(`/api/product/update/${id}`, data);
    return response.data
}