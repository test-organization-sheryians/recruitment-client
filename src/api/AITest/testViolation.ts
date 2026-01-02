import axios from "axios";

export interface ViolationPayload{
    attemptId: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9000';

export const reportViolationAPI = async (payload: ViolationPayload) =>{
    const response = await axios.post(`${BASE_URL}/api/ai/ViolationReport`, payload, {withCredentials: true});
    return response.data;
};
