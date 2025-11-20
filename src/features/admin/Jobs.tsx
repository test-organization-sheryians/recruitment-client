'use client';

import { useEffect, useState } from 'react';
import { getJobs } from '@/api/jobs';
import { useRouter } from 'next/navigation';
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

interface Job {
  _id: string;
  title: string;
  description: string;
  education: string;
  requiredExperience?: string;
  skills?: string[];
  expiry?: string;
  category?: {
    _id: string;
    name: string;
  };
  client?: {
    _id: string;
    email?: string;
  };
}

interface ApiResponse {
  success: boolean;
  data: Job | Job[];
}

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const response: ApiResponse = await getJobs();
        console.log("API Response:", response);
        
        if (response.success && response.data) {
          if (Array.isArray(response.data)) {
            setJobs(response.data);
          } else {
            setJobs([response.data]);
          }
        } else {
          setJobs([]);
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  const handleJobCreated = () => {
    // Refresh the jobs list after creating a new job
    const loadJobs = async () => {
      try {
        const response: ApiResponse = await getJobs();
        if (response.success && response.data) {
          if (Array.isArray(response.data)) {
            setJobs(response.data);
          } else {
            setJobs([response.data]);
          }
        }
      } catch (err) {
        console.error('Error refreshing jobs:', err);
      }
    };
    loadJobs();
  };

  const handleJobUpdated = () => {
    // Refresh the jobs list after updating a job
    const loadJobs = async () => {
      try {
        const response: ApiResponse = await getJobs();
        if (response.success && response.data) {
          if (Array.isArray(response.data)) {
            setJobs(response.data);
          } else {
            setJobs([response.data]);
          }
        }
      } catch (err) {
        console.error('Error refreshing jobs:', err);
      }
    };
    loadJobs();
  };

  const handleJobDeleted = () => {
    // Refresh the jobs list after deleting a job
    const loadJobs = async () => {
      try {
        const response: ApiResponse = await getJobs();
        if (response.success && response.data) {
          if (Array.isArray(response.data)) {
            setJobs(response.data);
          } else {
            setJobs([response.data]);
          }
        }
      } catch (err) {
        console.error('Error refreshing jobs:', err);
      }
    };
    loadJobs();
  };

  if (loading) {
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
                <DialogTrigger className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm">
                  Create job
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
                        🛠️ {job.skills.join(', ')}
                      </span>
                    )}
                    {job.category && (
                      <span className="flex items-center">
                        📁 {job.category.name}
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