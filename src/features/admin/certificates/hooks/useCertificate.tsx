"use client";

import { useState, useMemo } from "react";
import { Certificate } from "@/types/Certificate"; // Ensure this path is correct based on your project structure

export function useCertificate() {
  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      _id: "1", // id -> _id (MongoDB style)
      name: "React Internship Certificate",
      type: "Internship", // category -> type
      file: "https://example.com/cert1.pdf", // Required field as per model
      createdAt: "2026-02-10T10:00:00Z", // Date string format
      issuedBy: "Sheryians Coding School",
      description: "Standardized proof of training completion for frontend development."
    },
    {
      _id: "2",
      name: "Full Stack Certificate",
      type: "Completion", // Enum value: Completion
      file: "https://example.com/cert2.pdf",
      createdAt: "2026-02-08T12:00:00Z",
      issuedBy: "Sheryians Coding School",
      description: "Comprehensive certification for MERN stack proficiency."
    },
    {
      _id: "3",
      name: "NDA Template",
      type: "Other", // Enum value: Other
      file: "https://example.com/nda.pdf",
      createdAt: "2026-01-15T09:30:00Z",
      issuedBy: "Legal Dept",
      description: "Standard non-disclosure agreement for project kickoff."
    },
     {
      _id: "4",
      name: "NDA Template",
      type: "Other", // Enum value: Other
      file: "https://example.com/nda.pdf",
      createdAt: "2026-01-15T09:30:00Z",
      issuedBy: "Legal Dept",
      description: "Standard non-disclosure agreement for project kickoff."
    }
  ]);

  const [activeFilter, setActiveFilter] = useState("All Templates");
  const [searchQuery, setSearchQuery] = useState(""); // Search logic add kiya

  // Filter logic jo backend 'type' field use karta hai
  const filteredCertificates = useMemo(() => {
    return certificates.filter((cert) => {
      const matchesFilter = activeFilter === "All Templates" || cert.type === activeFilter;
      const matchesSearch = cert.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery, certificates]);

  return {
    certificates: filteredCertificates,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    totalCount: certificates.length
  };
}