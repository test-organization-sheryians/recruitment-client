import api from "@/config/axios"

interface ShareCandidatePayload {
  candidateId: string;
}

interface ShareCandidate {
  _id: string;
  candidateId: string;
  email?: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}

 interface BackendResponse<T> {
  success: boolean;
  message?: string;
  data: T[];
}

export const createShareCandidate = async (
  data: ShareCandidatePayload[]
) => {
  const response = await api.post(
    "/api/share-candidate",
    data
  )
console.log("check the response ")
  return response.data
}


export const getShareCandidate = async  (): Promise<
  BackendResponse<ShareCandidate>
> => {
    const response = await api.get("/api/share-candidate")

    console.log("check the response of ALL share candidate ===>",response)
    return response.data
}