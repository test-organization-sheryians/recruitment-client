'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteJob } from '@/api/jobs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


interface DeleteJobProps {
  jobId: string;
  jobTitle?: string;
  onJobDeleted?: () => void;
}

export default function DeleteJob({jobId,jobTitle,onJobDeleted}:DeleteJobProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);


  const handleDelete = async () => {
    if (!jobId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await deleteJob(jobId);
      if (response) {
        setIsOpen(false); // Close the dialog
        onJobDeleted?.(); // Notify parent if needed
        router.push('/admin/jobs');
        router.refresh();
      } else {
        setError(response?.message || 'Failed to delete job');
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          onClick={() => router.push('/admin/jobs')}
          className="px-4 py-2 text-red-600 bg-red-50 rounded-full hover:text-white hover:bg-red-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Job</DialogTitle>
        </DialogHeader>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete {jobTitle} Job? This action cannot be undone.
        </p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setIsOpen(false)}
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
            {loading ? 'Deleting...': 'Delete Job'}
          </button>
        </div>
        
      </DialogContent>
    </Dialog>
  );
}