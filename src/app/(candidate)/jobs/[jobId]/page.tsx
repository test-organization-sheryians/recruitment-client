"use client";

import JobDetails from "@/features/candidate/jobs/components/JobDetails";
import { Suspense } from "react";


export default function JobDetailsPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <JobDetails />
    </Suspense>
  );
}
