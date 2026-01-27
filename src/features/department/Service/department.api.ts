import axios from "@/config/axios";
import { Department, CreateDepartmentPayload } from "../Types/department.types";

export const departmentApi = {
  getDepartments: async (): Promise<Department[]> => {
    const res = await axios.get("/api/department/get");
    console.log(res)
    return res.data.data;
  },

  createDepartment: async (payload: CreateDepartmentPayload) => {
    const res = await axios.post("/api/department/create", payload);
    console.log(res)
    return res.data.data;
  },

  updateDepartment: async (id: string, payload: CreateDepartmentPayload) => {
    const res = await axios.put(`/api/department/update/${id}`, payload);
    return res.data.data;
  },

  deleteDepartment: async (id: string) => {
    await axios.delete(`/api/department/delete/${id}`);
  },
};