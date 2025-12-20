import React from "react";
// Import the component we just created
import TestDetailWrapper from "@/features/candidate/tests/components/TestDetailWrapper";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TestDetailPage({ params }: PageProps) {
  // Await the params to get the ID (Server Side)
  const { id } = await params;

  // Pass the ID to the client component
  return <TestDetailWrapper testId={id} />;
}