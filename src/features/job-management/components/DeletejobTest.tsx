'use client';

import { useRouter } from 'next/navigation';
import { deleteJob } from '@/api/index';
import ConfirmDeleteDialog from '../ui/ConfirmDeleteDialog';

export default function DeleteJob({
  jobId,
  jobTitle,
  onJobDeleted,
}: {
  jobId: string;
  jobTitle?: string;
  onJobDeleted?: () => void;
}) {
  const router = useRouter();

  return (
    <ConfirmDeleteDialog
      title={`Delete ${jobTitle || 'Job'}?`}
      consequences={[
        'All applicant records',
        'All screening questions',
      ]}
      onDelete={async () => {
        const res = await deleteJob(jobId);
        return !!res; // ✅ MUST RETURN BOOLEAN
      }}
      onDeleted={onJobDeleted}
      redirectAfterDelete={() => {
        router.push('/admin/jobs');
        router.refresh();
      }}
    />
  );
}
