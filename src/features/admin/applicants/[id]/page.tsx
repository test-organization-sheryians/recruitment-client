"use client";

import { useParams } from "next/navigation";

export default function ApplicantsPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div style={{ padding: 20 }}>
      <h1>Applicants Page</h1>
      <p>Job ID: {id}</p>
    </div>
  );
}
