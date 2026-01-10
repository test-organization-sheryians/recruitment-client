import { createShareCandidate, getShareCandidate } from "@/api/candidateShare/shareCandidate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// interface ShareCandidatePayload {
//   candidateId: string;
// }

interface BackendResponse<T> {
  success: boolean;
  message?: string;
  data: T[];
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
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


export interface ShareCandidate {
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
 interface CreateShareCandidateResponse {
  message: string;
  shareLink: string;
}
 interface ShareCandidatePayload {
  userId: string;
}

export const useCreateShareCandidate = () => {
  const queryClient = useQueryClient();

  return useMutation <
    CreateShareCandidateResponse, 
    Error,                        
    ShareCandidatePayload[]       
  >({
    mutationFn: (payload: ShareCandidatePayload[]) =>createShareCandidate(payload),
   onSuccess: (data) => {
      console.log("Share link:", data.shareLink);

      queryClient.invalidateQueries({
        queryKey: ["share-candidates"],
      });
    },
  });
};


export const useShareCandidates = () => {
  return useQuery<BackendResponse<ShareCandidate>>({
    queryKey: ["share-candidates"],
    queryFn: getShareCandidate,
  });
};
