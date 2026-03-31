import api from "@/config/axios"

export const fetchProduct = async() => {
    let res = await api.get("/api/products")
    return res.data
}




