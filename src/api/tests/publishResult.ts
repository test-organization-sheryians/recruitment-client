import api from "@/config/axios"

export const publishResult=async(testId:string)=>{
    const {data}= await api.patch(`/api/test-attempts/result/${testId}`)
    return data;

}