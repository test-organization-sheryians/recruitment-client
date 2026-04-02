import api from "@/config/axios"

export const fetchPrpoduct = async() => {
    let res = await api.get("https://fakestoreapi.com/products")
    return res.data
}