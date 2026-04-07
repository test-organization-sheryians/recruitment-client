import api from "@/config/axios";

export const getGithub = async ({ user }: { user: string }) => {
  const response = await api.get(
    `https://api.github.com/users/${user}`,
    {
      withCredentials: false, // ✅ FIX
    }
  );
  return response.data;
};