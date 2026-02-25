'use client';

import { useRouter } from 'next/navigation';
import { useDeleteJob } from '@/features/admin/jobs/hooks/useJobApi';
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

  const { mutate: deleteJob, isPending, error } = useDeleteJob();

  const handleDelete = async () => {
    deleteJob(jobId, {
      onSuccess: () => {
        onJobDeleted?.();
      },
    });
  };

  return (
    <ConfirmDeleteDialog
      title={`Delete ${jobTitle || 'Job'}?`}
      consequences={[
        'All applicant records',
        'All screening questions',
      ]}
      onDelete={handleDelete}
      onDeleted={onJobDeleted}
      redirectAfterDelete={() => {
        router.push('/admin/jobs');
        router.refresh();
      }}
    />
  );
}
