import api from "@/config/axios";

export const extractResume = async (parsedText: string) => {
    const response = await api.post("/api/ai/extract-resume", {
      resumeText: parsedText
    });
    return response.data;
  
};