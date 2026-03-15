import { useQuery } from "@tanstack/react-query";
import { getCertificateById } from "@/api/certificate/getCertificate";

export const useCertificateById = (id: string) => {
  return useQuery({
    queryKey: ["certificate", id],
    queryFn: () => getCertificateById(id),
    enabled: !!id,
  });
};