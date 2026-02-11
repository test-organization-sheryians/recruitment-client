import api from "@/config/axios";

export const getAllUsers = async (query?: string) => {
  const res = await api.get("/api/users/get-users", {
    params: {
      query, // 👈 this is the key change
    },
  });

  return res.data.data;
};
