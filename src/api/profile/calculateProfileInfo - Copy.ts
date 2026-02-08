import api from "@/config/axios"

export const getProfileComInfo = async()=>{
    const response = await api.get("/api/candidate-profile/calculate-profileInfo");
    // Some backends return the payload under `data.data`, others under `data`.
    // Return whichever is available so the frontend is resilient to either shape.
    return response.data
}