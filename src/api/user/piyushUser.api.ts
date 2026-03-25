import api from "@/config/axios";
import { PiyushCreateUserInput } from "@/types/piyushUser";


export const piyushGetUsers = async () => {
  const res = await api.get("/api/userspiyush");
  return res.data.data;
};

export const piyushCreateUser = async (data: PiyushCreateUserInput) => {
  const res = await api.post("/api/userspiyush", data);
  return res.data.data;
};

export const piyushDeleteUser = async (userId: string) => {
  const res = await api.delete(`/api/userspiyush/${userId}`);
  return res.data;
};

export const piyushUpdateUser = async (
  userId: string,
  data: Partial<PiyushCreateUserInput>
) => {
  const res = await api.put(`/api/userspiyush/${userId}`, data);
  return res.data.data;
};