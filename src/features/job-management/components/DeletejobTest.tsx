'use client';

import { useRouter } from 'next/navigation';
import { useDeleteJob } from '../hooks/useJobApi';
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

  const { mutateAsync: deleteJobAsync, isPending, error } = useDeleteJob();

  const handleDelete = async (): Promise<boolean> => {
    await deleteJobAsync(jobId);
    onJobDeleted?.();
    return true;
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
