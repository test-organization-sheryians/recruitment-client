import TestDetailsPage from '@/features/admin/test/components/TestDetails';
import React from 'react';
import { notFound } from 'next/navigation';

export default function Page({ params }: { params: { id: string } }) {
  // Validate params.id exists
  if (!params?.id) {
    notFound(); // or return a loading state
  }

  return (
    <div>
      <TestDetailsPage params={{ id: params.id }} />
    </div>
  );
}