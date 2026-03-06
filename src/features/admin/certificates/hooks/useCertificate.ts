

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Certificate } from "@/types/Certificate";
import { 
  createCertificate, 
  getAllCertificates, 
  deleteCertificate 
} from "@/api/index";

export const useCertificate = () => {
  const queryClient = useQueryClient();

  const [activeFilter, setActiveFilter] = useState("All Templates");
  const [searchQuery, setSearchQuery] = useState("");

  // 1️⃣ Fetch all certificates
  const { data: allCertificates = [], isLoading } = useQuery({
    queryKey: ["certificates"],
    queryFn: getAllCertificates,
    retry:0,
  });

  // 2️⃣ Create certificate
  const createCertMutation = useMutation({
    mutationFn: (payload: Omit<Certificate, "_id" | "createdAt" | "updatedAt">) =>
      createCertificate(payload),
   onSuccess: () => {
      // ✅ Refresh list after creation
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
    },
  
  });

  // 3️⃣ Delete certificate
  const deleteCertMutation = useMutation({
    mutationFn: (id: string) => deleteCertificate(id),
    onSuccess: () => {
      // ✅ Refresh list after creation
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
    },
   
  });

  // 4️⃣ Filter + Search
  const filteredCertificates = useMemo(() => {
    const data = Array.isArray(allCertificates) ? allCertificates : [];
    
    return data.filter((cert) => {
      const matchesFilter = 
        activeFilter === "All Templates" || 
        cert.type === activeFilter;

      const matchesSearch = 
        cert.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;

      return matchesFilter && matchesSearch;
    });
  }, [allCertificates, activeFilter, searchQuery]);
  return {
    certificates:filteredCertificates,
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
