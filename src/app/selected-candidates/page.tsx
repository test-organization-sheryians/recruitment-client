import { Suspense } from 'react';
import SelectedCandidatesPage from './SelectedCandidatesPage';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <SelectedCandidatesPage />
    </Suspense>
  );
}
