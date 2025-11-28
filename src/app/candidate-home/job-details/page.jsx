"use client";

import { Suspense } from "react";
import JobDetails from "@/components/Candidate/JobDetails";

export default function JobDetailsPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <JobDetails />
    </Suspense>
  );
}
