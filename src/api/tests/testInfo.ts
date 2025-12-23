import api from "@/config/axios";

/* ================= TYPES ================= */

export interface TestInfo {
  title: string;
  summary: string;
  category: string;
  duration: number;
  passingScore: number;
  showResults: boolean;
  createdBy: {
    name: string;
  };
  createdAt: string;
  prompt: string;
}

/* ================= API ================= */

export const getTestInfoApi = async (testId: string) => {
  const res = await api.get(`/api/tests/${testId}`, {
    withCredentials: true,
  });

  // 🔍 DEBUG (keep for now)
  console.log("getTestInfoApi response:", res.data);

  return res.data; // { success, data }
};
