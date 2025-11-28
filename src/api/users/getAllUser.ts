import api from "@/config/axios";

interface User{
    name:string,
    email:string,
    phoneNumber:string,
}


export const getAllUsers  = async () => {
  const {data} = await api.get(`api/users/allUser`);
  return data.data;
};
