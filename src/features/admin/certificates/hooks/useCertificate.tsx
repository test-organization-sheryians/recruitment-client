

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Certificate } from "@/types/Certificate";
import { createCertificate } from "@/api/certificate/createCertificate";
import { getAllCertificates } from "@/api/certificate/getAllCertificate";
import { deleteCertificate } from "@/api/certificate/deleteCertificate";

export const useCertificate = () => {
  const queryClient = useQueryClient();

  const [activeFilter, setActiveFilter] = useState("All Templates");
  const [searchQuery, setSearchQuery] = useState("");

  // 1️⃣ Fetch all certificates
  const { data: allCertificates = [], isLoading } = useQuery({
    queryKey: ["certificates"],
    queryFn: getAllCertificates,
    retry: 0,
  });

  // 2️⃣ Create certificate
  const createCertMutation = useMutation({
    mutationFn: (payload: Omit<Certificate, "_id" | "createdAt" | "updatedAt">) =>
      createCertificate(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["certificates"] }),
    retry: 0,
  });

  // 3️⃣ Delete certificate
  const deleteCertMutation = useMutation({
    mutationFn: (id: string) => deleteCertificate(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["certificates"] }),
    retry: 0,
  });

  // 4️⃣ Filter + Search
  const certificates = useMemo(() => {
    return allCertificates.filter((cert) => {
      const matchesFilter = activeFilter === "All Templates" || cert.type === activeFilter;
      const matchesSearch = cert.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
      return matchesFilter && matchesSearch;
    });
  }, [allCertificates, activeFilter, searchQuery]);

  return {
    certificates,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    isLoading,
    addCertificate: createCertMutation.mutateAsync,
    deleteCertificate: deleteCertMutation.mutateAsync,
    totalCount: allCertificates.length,
  };
};
