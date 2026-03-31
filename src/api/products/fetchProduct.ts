import api from "@/config/axios"

export const fetchPrpoduct = async() => {
    let res = await api.get("/api/products")
    return res.data
}




