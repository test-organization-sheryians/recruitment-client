// hooks/useJobs.ts
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useGetJobs } from "@/features/admin/jobs/hooks/useJobApi";
import { useRouter } from "next/navigation";

export interface Skill {
  _id: string;
  name: string;
}

export interface Category {
  _id: string;
  name: string;
}

export interface Job {
  _id: string;
  title: string;
  description: string;
  education: string;
  requiredExperience?: string;
  skills?: Skill[];
  expiry?: string;
  category?: Category | Category[];
  client?: { _id: string; email?: string };
}

export const useJobs = () => {
  const router = useRouter();
  const { data, isLoading, error: fetchError, refetch } = useGetJobs();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);

  useEffect(() => {
    if (!data) return;

    if (Array.isArray(data)) {
      setJobs(data);
      setError(null);
    } else {
      setJobs([]);
      setError("No jobs found");
    }

    if (fetchError) {
      setError("Failed to load jobs");
    }
  }, [data, fetchError]);

  const handleRefresh = useCallback(async () => {
    const response = await refetch();
    if (response.data?.success && Array.isArray(response.data.data)) {
      setJobs(response.data.data);
      setError(null);
    }
    router.refresh();
    setIsCreateDialogOpen(false);
    setIsUpdateDialogOpen(false);
    setEditingJobId(null);
  }, [refetch, router]);

  const renderedJobs = useMemo(() => jobs, [jobs]);

  return {
    jobs: renderedJobs,
    isLoading,
    error,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isUpdateDialogOpen,
    setIsUpdateDialogOpen,
    editingJobId,
    setEditingJobId,
    handleRefresh,
  };
};
