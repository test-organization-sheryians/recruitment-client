"use client";

import { Suspense } from "react";
import JobDetails from "@/features/candidate/jobs/components/JobDetails";

export default function JobDetailsPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <JobDetails />
    </Suspense>
  );
}
