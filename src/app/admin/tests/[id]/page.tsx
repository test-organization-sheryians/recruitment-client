import TestDetailsPage from '@/features/admin/test/components/TestDetails';
import React from 'react';

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div>
      <TestDetailsPage params={{ id: params.id }} />
    </div>
  );
}
