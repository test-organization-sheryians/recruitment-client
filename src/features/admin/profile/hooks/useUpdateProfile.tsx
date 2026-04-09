import { updateProfile } from "@/api/adminProfile/updateProfile";
import { useMutation } from "@tanstack/react-query";

export const useUpdateProfile = () => {
  return useMutation({
    mutationKey: ["updateAdminProfile"],
    mutationFn: updateProfile,
  });
};
