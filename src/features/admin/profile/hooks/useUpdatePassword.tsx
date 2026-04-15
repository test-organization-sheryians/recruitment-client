import { updatePassword } from "@/api/password/updatePassword";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface UpdatePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export const useUpdatePassword = () => {
  return useMutation({
    mutationKey: ["updateAdminPassword"],
    mutationFn: updatePassword,
  });
};
