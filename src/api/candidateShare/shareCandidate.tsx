import api from "@/config/axios"

interface ShareCandidatePayload {
  userId: string;
}
interface Skill {
  _id?: string;
  name?: string;
}

interface Experience {
  _id?: string;
  company?: string;
  role?: string;
}
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}


interface ShareCandidate {
  _id: string;
  userId: string;
  availability: "looking" | "not_looking";
  resumeFile?: string;
  createdAt: string;
  updatedAt: string;

  user: User;
  skills: Skill[];
  experiences: Experience[];
}

 interface BackendResponse<T> {
  success: boolean;
  message?: string;
  data: T[];
}
 interface CreateShareCandidateResponse {
  message: string;
  shareLink: string;
}
export const createShareCandidate = async (
  data: ShareCandidatePayload[]
): Promise<CreateShareCandidateResponse> => {
  const response = await api.post(
    "/api/share-candidate",
    data
  )
console.log("check the response ===>",response)
  return response.data
}


export const getShareCandidate = async  (): Promise<
  BackendResponse<ShareCandidate>
> => {
    const response = await api.get("/api/share-candidate")

    console.log("check the response of ALL share candidate ===>",response)
    return response.data
}