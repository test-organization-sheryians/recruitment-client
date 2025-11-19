'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { updateJob, getJobs } from '@/api/jobs';

interface UpdateJobProps {
  jobId: string;
  onJobUpdated?: () => void;
}

export default function UpdateJobPage({ jobId, onJobUpdated }: UpdateJobProps) {
  const data = useParams();
  console.log("aao data",data);
  const params = useParams<{ _id: string }>();
  console.log("params.id",params._id);
  const router = useRouter();
  // Get the job ID from params
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    education: '',
    requiredExperience: '',
    skills: '',
    expiry: '',
    category: '',
    clientId: ''
  });

  // Fetch job data on component mount
  useEffect(() => {
    if (jobId) {
      fetchJobData();
    }
  }, [jobId]);

  const fetchJobData = async () => {
    setFetching(true);
    setError('');
    try {
      const response = await getJobs(jobId);
      console.log("Job data:", response);
      
      if (response.success && response.data) {
        const job = response.data;
        setFormData({
          title: job.title || '',
          description: job.description || '',
          education: job.education || '',
          requiredExperience: job.requiredExperience || '',
          skills: Array.isArray(job.skills) ? job.skills.join(', ') : job.skills || '',
          expiry: job.expiry ? new Date(job.expiry).toISOString().split('T')[0] : '',
          category: job.category || '',
          clientId: job.clientId || ''
        });
      } else {
        setError('Failed to load job data');
      }
    } catch (err) {
      console.error('Error fetching job:', err);
      setError('Failed to load job data. Please try again.');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.education || 
          !formData.requiredExperience || !formData.expiry) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Prepare data for API - convert skills string to array
      const jobData = {
        title: formData.title,
        description: formData.description,
        education: formData.education,
        requiredExperience: formData.requiredExperience,
        skills: formData.skills ? formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill) : [],
        expiry: new Date(formData.expiry).toISOString(),
        category: formData.category,
        clientId: formData.clientId
      };

      console.log("Updating job with data:", jobData);

      const response = await updateJob(jobId, jobData);
      console.log("Update response:", response);
      
      if (response.success) {
        router.push('/admin/jobs');
        router.refresh();
      } else {
        setError(response.message || 'Failed to update job');
      }
    } catch (err) {
      console.error('Error updating job:', err);
      setError('Failed to update job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate minimum date for expiry (today)
  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        <span className="ml-2 text-gray-600">Loading job data...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Update Job</h1>
              <p className="text-gray-600 mt-1">Edit the job details</p>
            </div>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
              Back to Jobs
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 border-b border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Job Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Job Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Senior Backend Developer"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Job Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={5}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the job responsibilities and requirements..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Education */}
            <div>
              <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
                Education Requirements *
              </label>
              <input
                type="text"
                id="education"
                name="education"
                required
                value={formData.education}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Bachelor of Computer Science"
              />
            </div>

            {/* Required Experience */}
            <div>
              <label htmlFor="requiredExperience" className="block text-sm font-medium text-gray-700 mb-1">
                Required Experience *
              </label>
              <input
                type="text"
                id="requiredExperience"
                name="requiredExperience"
                required
                value={formData.requiredExperience}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 3+ years in backend development"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skills */}
            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                Required Skills
              </label>
              <input
                type="text"
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., JavaScript, React, Node.js"
              />
              <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
            </div>

            {/* Expiry Date */}
            <div>
              <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                Application Deadline *
              </label>
              <input
                type="date"
                id="expiry"
                name="expiry"
                required
                value={formData.expiry}
                onChange={handleChange}
                min={getMinDate()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Job category"
              />
            </div>

            {/* Client ID */}
            <div>
              <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 mb-1">
                Client ID
              </label>
              <input
                type="text"
                id="clientId"
                name="clientId"
                value={formData.clientId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Client identifier"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={loading}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Updating Job...
                </div>
              ) : (
                'Update Job'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}