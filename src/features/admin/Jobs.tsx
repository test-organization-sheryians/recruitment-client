'use client';

import { useEffect, useState } from 'react';
import { useGetJobs } from '@/features/auth/hooks/useJobApi';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateJob from './CreateJob';
import DeleteJob from './DeleteJob';
import UpdateJob from './UpdateJob';
import { useRouter } from 'next/navigation'; 
import { PlusIcon } from 'lucide-react';


interface Job {
  _id: string;
  title: string;
  description: string;
  education: string;
  requiredExperience?: string;
  skills?: Array<{ _id: string; name: string }>;
  expiry?: string;
  category?: { _id: string; name: string } | Array<{ _id: string; name: string }>;
  client?: {
    _id: string;
    email?: string;
  };
}

  export default function Jobs({
    onJobCreated = () => {},
    onJobUpdated = () => {},
    onJobDeleted = () => {}
  }: {
    onJobCreated?: () => void;
    onJobUpdated?: () => void;
    onJobDeleted?: () => void;
  }) {

  const { data, isLoading, error: queryError, refetch } = useGetJobs();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    if (data) {
      if (data.success && data.data) {
        setJobs(Array.isArray(data.data) ? data.data : [data.data]);
      } else {
        setJobs([]);
        setError('No jobs found');
      }
    }
    if (queryError) {
      console.error('Error fetching jobs:', queryError);
      setError('Failed to load jobs. Please try again later.');
    }
  }, [data, queryError]);

  const handleJobCreated = () => {
    const dialogs = document.querySelectorAll('[role="dialog"]');
    dialogs.forEach(dialog => {
      dialog.removeAttribute('open');
      dialog.setAttribute('aria-hidden', 'true');
    });
    
    onJobCreated();
    
    // Refresh the job list
    refetch().then(({ data }) => {
      if (data?.success && data.data) {
        setJobs(Array.isArray(data.data) ? data.data : [data.data]);
      }
    }).catch((err: Error) => {
      console.error('Error refreshing jobs:', err);
    });
    router.refresh();
    
  };

  const handleJobUpdated = () => {
     const dialogs = document.querySelectorAll('[role="dialog"]');
    dialogs.forEach(dialog => {
      dialog.removeAttribute('open');
      dialog.setAttribute('aria-hidden', 'true');
    });
    
    // Call the onJobDeleted callback
    onJobUpdated();
    
    // Refresh the job list
    refetch().then(({ data }) => {
      if (data?.success && data.data) {
        setJobs(Array.isArray(data.data) ? data.data : [data.data]);
      }
    }).catch((err: Error) => {
      console.error('Error refreshing jobs:', err);
    });
    router.refresh();
  };

  const handleJobDeleted = () => {
    // Close any open dialogs
    const dialogs = document.querySelectorAll('[role="dialog"]');
    dialogs.forEach(dialog => {
      dialog.removeAttribute('open');
      dialog.setAttribute('aria-hidden', 'true');
    });
    
    // Call the onJobDeleted callback
    onJobDeleted();
    
    // Refresh the job list
    refetch().then(({ data }) => {
      if (data?.success && data.data) {
        setJobs(Array.isArray(data.data) ? data.data : [data.data]);
      }
    }).catch((err: Error) => {
      console.error('Error refreshing jobs:', err);
    });
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        <span className="ml-2 text-gray-600">Loading jobs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
        {error}
      </div>
    );
  }

  return (
    
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Job Listings</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} found
            </span>
            <div>
              <Dialog>
                <DialogTrigger className="px-2 py-2  text-black rounded-md hover:bg-blue-600 text-sm">
                  <PlusIcon className="w-7 h-7" />
                </DialogTrigger>
                <DialogContent className="w-full h-[96vh] mt-2 p-6">
                  <DialogHeader>
                    <DialogTitle>Create a Job</DialogTitle>
                    <CreateJob onJobCreated={handleJobCreated} />
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {jobs.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {jobs.map((job) => (
            <div key={job._id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                    {job.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                    {job.education && (
                      <span className="flex items-center">
                        🎓 {job.education}
                      </span>
                    )}
                    {job.requiredExperience && (
                      <span className="flex items-center">
                        💼 {job.requiredExperience}
                      </span>
                    )}
                    {job.skills && job.skills.length > 0 && (
                      <span className="flex items-center">
                        🛠️ {job.skills.map((skill) => skill.name).join(', ')}
                      </span>
                    )}
                    {job.category && (
                      <span className="flex items-center">
                        📁 {Array.isArray(job.category) 
                          ? job.category.map((category) => category.name).join(', ')
                          : job.category.name}
                      </span>
                    )}
                  </div>
                  {job.expiry && (
                    <div className="mt-2 text-xs text-gray-400">
                      Expires: {new Date(job.expiry).toLocaleDateString()}
                    </div>
                  )}
                  {job.client?.email && (
                    <div className="mt-1 text-xs text-gray-400">
                      Client: {job.client.email}
                    </div>
                  )}
                </div>
                <div className="flex space-x-2 ml-4">
                  {/* Edit Job Dialog */}
                  <Dialog>
                    <DialogTrigger className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm">
                      Edit Job
                    </DialogTrigger>
                    <DialogContent className="w-full h-[96vh] mt-2 p-6">
                      <DialogHeader>
                        <DialogTitle>Edit Job: {job.title}</DialogTitle>
                        <UpdateJob 
                          jobId={job._id}
                          onJobUpdated={handleJobUpdated}
                        />
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>

                  {/* Delete Job Dialog */}
                  <Dialog>
                    <DialogTrigger className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm">
                      Delete Job
                    </DialogTrigger>
                    <DialogContent className="w-full max-w-md">
                      <DialogHeader>
                        <DialogTitle>Delete Job</DialogTitle>
                        <DeleteJob 
                          jobId={job._id} 
                          jobTitle={job.title}
                          onJobDeleted={handleJobDeleted}
                        />
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-gray-500">No jobs found.</p>
          <p className="text-sm text-gray-400 mt-1">
            There are currently no job listings available.
          </p>
          <div className="mt-4">
            <Dialog>
              <DialogTrigger className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                + Create Your First Job
              </DialogTrigger>
              <DialogContent className="w-full h-[96vh] mt-2 p-6">
                <DialogHeader>
                  <DialogTitle>Create a Job</DialogTitle>
                  <CreateJob onJobCreated={handleJobCreated} />
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
    </div>
  );
}