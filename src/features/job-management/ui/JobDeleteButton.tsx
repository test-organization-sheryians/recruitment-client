'use client';

import { useRouter } from 'next/navigation';
import { deleteJob } from '@/api/index';
import ConfirmDeleteDialog from '../ui/ConfirmDeleteDialog';

export default function JobDeleteButton({
  jobId,
  jobTitle,
  onDeleted,
}: {
  jobId: string;
  jobTitle?: string;
  onDeleted?: () => void;
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
      onDeleted={onDeleted}
      redirectAfterDelete={() => {
        router.push('/admin');
        router.refresh();
      }}
    />
  );
}
