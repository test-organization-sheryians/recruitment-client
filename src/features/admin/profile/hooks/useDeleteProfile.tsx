import { deleteProfile } from "@/api/adminProfile/deleteProfile";
import { useMutation } from "@tanstack/react-query";

export const useDeleteProfile = () => {
  return useMutation({
    mutationKey: ["deleteAdminProfile"],
    mutationFn: deleteProfile,
  });
};
