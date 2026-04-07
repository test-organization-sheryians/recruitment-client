"use client";

import { getProfile } from "@/api/adminProfile/getProfile";
import { useQuery } from "@tanstack/react-query";

export const useGetProfile = () => {
  return useQuery({
    queryKey: ["adminProfile"],
    queryFn: getProfile,
  });
};
