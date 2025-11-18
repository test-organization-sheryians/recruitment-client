'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { deleteJob } from '@/api/jobs';

export default function DeleteJob() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get('id');
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // You might want to fetch the job details here if you want to show them in the confirmation
    // For now, we'll just use the jobId from the URL
  }, [jobId]);

  const handleDelete = async () => {
    if (!jobId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await deleteJob(jobId);
      if (response.success) {
        router.push('/admin/jobs');
        router.refresh();
      } else {
        setError(response.message || 'Failed to delete job');
      }
    } catch (err) {
      console.error('Error deleting job:', err);
      setError('An error occurred while deleting the job');
    } finally {
      setLoading(false);
    }
  };

  if (!jobId) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">No job ID provided for deletion</p>
        <button
          onClick={() => router.push('/admin/jobs')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Delete Job</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this job? This action cannot be undone.
        </p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => router.push('/admin/jobs')}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete Job'}
          </button>
        </div>
      </div>
    </div>
  );
}